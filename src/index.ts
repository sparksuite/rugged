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

		// Remove packaged copies
		const removeTasks = new Listr(
			testProjectPaths.map((testProjectPath) => ({
				title: `Removing packaged copy from project: ${path.basename(testProjectPath)}`,
				task: () =>
					execa('yarn', [`remove`, packageFile.name], {
						cwd: testProjectPath,
					}).catch(yarnErrorCatcher),
			})),
			{
				concurrent: true,
				exitOnError: false,
			}
		);

		await removeTasks.run();

		// Remove packaged copies
		const addTasks = new Listr(
			testProjectPaths.map((testProjectPath) => ({
				title: `Adding linked copy to project: ${path.basename(testProjectPath)}`,
				task: () =>
					execa('yarn', [`add`, `link:../..`], {
						cwd: testProjectPath,
					}).catch(yarnErrorCatcher),
			})),
			{
				concurrent: true,
				exitOnError: false,
			}
		);

		await addTasks.run();

		// Final newline
		console.log();
	};

	// Section header
	console.log(`\n${chalk.inverse(chalk.bold(` Installing dependencies `))}\n`);

	// Set up the tasks
	const dependenciesTasks = new Listr(
		[
			{
				title: `Root project`,
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
			title: 'Compiling root project',
			task: () => execa('yarn', ['compile']).catch(yarnErrorCatcher),
		},
		{
			title: 'Creating temporary directory',
			task: (ctx) => {
				ctx.tmpDir = tmp.dirSync({
					unsafeCleanup: true,
				});
			},
		},
		{
			title: 'Packaging root project',
			task: (ctx) =>
				execa('yarn', [`pack`, `--filename`, path.join(ctx.tmpDir.name, 'package.tgz')]).catch(yarnErrorCatcher),
		},
		{
			title: 'Injecting into projects',
			task: (ctx) =>
				new Listr(
					testProjectPaths.map((testProjectPath) => ({
						title: `Project: ${path.basename(testProjectPath)}`,
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
		{
			title: 'Removing the temporary directory',
			task: (ctx) => ctx.tmpDir.removeCallback(),
		},
	]);

	// Run the tasks, catching any errors
	await injectingTasks.run().catch((error) => {
		if (error.context?.tmpDir) {
			error.context.tmpDir.removeCallback();
		}

		console.log();
		throw new HandledError();
	});
})()
	.catch((error) => {
		// Catch already-handled errors
		if (error instanceof HandledError) {
			process.exit(1);
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
