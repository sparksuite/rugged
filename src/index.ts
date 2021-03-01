#!/usr/bin/env node

// Imports
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import glob from 'glob';
import Listr from 'listr';
import execa from 'execa';
import tmp from 'tmp';

// This error indicates it was expected and already handled
export class HandledError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = 'HandledError';
	}
}

// Yarn error catcher for Listr
const yarnErrorCatcher = (error: execa.ExecaError<string>) => {
	throw new Error(
		error.stderr
			.split('\n')
			.map((line) => line.replace(/^error /, ''))
			.join('\n')
	);
};

// Initialize cleanup function
let cleanup = () => {};

// Initialize object to store the final result
interface FinalResult {
	errorEncountered: boolean;
	failedTests: {
		project: string;
		output: string;
	}[];
}

const finalResult: FinalResult = {
	errorEncountered: false,
	failedTests: [],
};

// Wrap everything in a self-executing async function
(async () => {
	// Build the configuration
	const configuration = {
		testProjectsDirectory: 'test-projects',
	};

	// Add an initial blank line for aesthetics
	console.log();

	// Make sure package file exists
	const packageFilePath = path.join(process.cwd(), 'package.json');

	if (!fs.existsSync(packageFilePath)) {
		console.log(chalk.red(`Couldn’t find ${chalk.bold('package.json')} in this directory (${process.cwd()})\n`));
	}

	// Parse the package file
	const packageFile = require(packageFilePath);

	// Make sure the test projects directory exists
	const absolutePath = path.join(process.cwd(), configuration.testProjectsDirectory);

	if (!fs.existsSync(absolutePath)) {
		console.log(
			chalk.red(
				`Couldn’t find ${chalk.bold(
					`./${configuration.testProjectsDirectory}/`
				)} in this directory (${process.cwd()})\n`
			)
		);
	}

	// Determine test project paths
	const testProjectPaths = glob.sync(`${absolutePath}/*/`);

	// Update cleanup function
	cleanup = async () => {
		// Section header
		console.log(`\n${chalk.inverse(chalk.bold(` Resetting test projects `))}\n`);

		// Remove packaged version and add linked version
		const tasks = new Listr(
			testProjectPaths.map((testProjectPath) => ({
				title: path.basename(testProjectPath),
				task: async () => {
					await execa('yarn', [`remove`, packageFile.name], {
						cwd: testProjectPath,
					}).catch(yarnErrorCatcher);

					await execa('yarn', [`add`, `link:../..`], {
						cwd: testProjectPath,
					}).catch(yarnErrorCatcher);
				},
			})),
			{
				concurrent: true,
				exitOnError: false,
			}
		);

		await tasks.run();

		// Loop over each failed test
		for (const failedTest of finalResult.failedTests) {
			// Section header
			console.log(`\n${chalk.inverse(chalk.red(chalk.bold(` Output from: ${failedTest.project} `)))}\n`);

			// Print output
			console.log(failedTest.output.trim());
		}

		// Final newline
		console.log();

		// Exit accordingly
		if (finalResult.errorEncountered || finalResult.failedTests.length) {
			process.exit(1);
		}
	};

	// Section header
	console.log(`${chalk.inverse(chalk.bold(` Installing dependencies `))}\n`);

	// Set up the tasks
	const dependenciesTasks = new Listr(
		[
			{
				title: packageFile.name,
				task: () => execa('yarn', [`install`, `--frozen-lockfile`, `--prefer-offline`]).catch(yarnErrorCatcher),
			},
			...testProjectPaths.map((testProjectPath) => ({
				title: `Project: ${path.basename(testProjectPath)}`,
				task: () =>
					execa('yarn', [`install`, `--frozen-lockfile`, `--prefer-offline`], {
						cwd: testProjectPath,
					}).catch(yarnErrorCatcher),
			})),
		],
		{
			concurrent: true,
			exitOnError: false,
		}
	);

	// Run the tasks, catching any errors
	await dependenciesTasks.run().catch(() => {
		console.log();
		throw new HandledError();
	});

	// Section header
	console.log(`\n${chalk.inverse(chalk.bold(` Injecting package `))}\n`);

	// Set up the tasks
	const injectingTasks = new Listr([
		{
			title: `Compiling ${packageFile.name}`,
			task: () => execa('yarn', ['compile']).catch(yarnErrorCatcher),
		},
		{
			title: `Packaging ${packageFile.name}`,
			task: (ctx) => {
				ctx.tmpDir = tmp.dirSync({
					unsafeCleanup: true,
				});

				return execa('yarn', [`pack`, `--filename`, path.join(ctx.tmpDir.name, 'package.tgz')]).catch(yarnErrorCatcher);
			},
		},
		{
			title: 'Injecting into projects',
			task: (ctx) =>
				new Listr(
					testProjectPaths.map((testProjectPath) => ({
						title: path.basename(testProjectPath),
						task: () =>
							execa('yarn', [`add`, `file:${path.join(ctx.tmpDir.name, 'package.tgz')}`], {
								cwd: testProjectPath,
							}).catch(yarnErrorCatcher),
					})),
					{
						concurrent: true,
					}
				),
		},
	]);

	// Run the tasks, catching any errors
	await injectingTasks.run().catch((error) => {
		console.log();
		throw new HandledError();
	});

	// Section header
	console.log(`\n${chalk.inverse(chalk.bold(` Testing projects `))}\n`);

	// Set up the tasks
	const testingTasks = new Listr(
		testProjectPaths.map((testProjectPath) => ({
			title: path.basename(testProjectPath),
			task: () =>
				execa('yarn', [`test`], {
					cwd: testProjectPath,
					all: true,
				}).catch((error) => {
					// Add to final result
					finalResult.failedTests.push({
						project: path.basename(testProjectPath),
						output: error.all ?? 'No output...',
					});


					// Throw error that Listr will pick up
					throw new Error('Output will be printed below');
				}),
		})),
		{
			concurrent: true,
			exitOnError: false,
		}
	);

	// Run the tasks, catching any errors
	await testingTasks.run().catch((error) => {
		throw new HandledError();
	});
})()
	.catch((error) => {
		// Remember that we encountered an error
		finalResult.errorEncountered = true;

		// Catch already-handled errors
		if (error instanceof HandledError) {
			return;
		}

		// Handle unexpected errors
		console.error(chalk.italic(chalk.red('\nRugged encountered an unexpected error (see below):\n')));
		console.error(chalk.red(error.stack?.trim() || error.toString()?.trim()));
		console.error(
			chalk.italic(
				chalk.red(
					`\nYou may want to report this: ${chalk.underline(`https://github.com/sparksuite/rugged/issues/new`)}\n`
				)
			)
		);
	})
	.finally(cleanup);
