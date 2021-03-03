#!/usr/bin/env node

// Imports
import path from 'path';
import chalk from './utils/chalk';
import glob from 'glob';
import Listr from 'listr';
import execa from 'execa';
import { HandledError, yarnErrorCatcher } from './utils/errors';
import configure from './utils/configure';
import verify from './utils/verify';
import printHeader from './utils/print-header';
import installDependencies from './steps/install-dependencies';
import injectRootPackage from './steps/inject-root-package';
import testProjects from './steps/test-projects';

// Initialize finish function
let finishUp = () => Promise.resolve();

// Initialize object to store the final result
export interface FinalResult {
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
	// Get the configuration
	const configuration = await configure();

	// Verification
	const packageFile = verify.packageFile();
	const absolutePath = verify.testProjects(configuration);

	// Determine test project paths
	const testProjectPaths = glob.sync(`${absolutePath}/*/`);

	// Define the actual finish function
	finishUp = async () => {
		// Print section header
		printHeader('Resetting projects');

		// Remove packaged version and add linked version
		const tasks = new Listr(
			testProjectPaths.map((testProjectPath) => ({
				title: path.basename(testProjectPath),
				task: async () => {
					await execa('yarn', [`--mutex`, `file:${configuration.yarnMutexFilePath}`, `remove`, packageFile.name], {
						cwd: testProjectPath,
					}).catch((error) => {
						if (error.toString().includes(`This module isn't specified in a package.json file`)) {
							return;
						}

						return yarnErrorCatcher(error);
					});

					await execa('yarn', [`add`, configuration.injectAsDevDependency ? `--dev` : '', `link:../..`], {
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
			// Print section header
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

	// Trigger each step
	await installDependencies(configuration, packageFile, testProjectPaths);
	await injectRootPackage(configuration, packageFile, testProjectPaths);
	await testProjects(testProjectPaths, finalResult);
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
	.finally(() => finishUp());
