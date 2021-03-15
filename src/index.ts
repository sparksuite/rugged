#!/usr/bin/env node

// Imports
import path from 'path';
import chalk from './utils/chalk';
import glob from 'glob';
import Listr from 'listr';
import execa from 'execa';
import { HandledError, PrintableError } from './utils/errors';
import getConfig, { Config } from './utils/get-config';
import verify from './utils/verify';
import printHeader from './utils/print-header';
import installDependencies from './steps/install-dependencies';
import injectRootPackage from './steps/inject-root-package';
import testProjects from './steps/test-projects';
import getContext from './utils/get-context';
import packageManager from './utils/package-manager';

// Export a type used for TypeScript config files
type PartialConfig = Partial<Config>;
export type { PartialConfig as Config };

// Initialize finish function
let finishUp = (): Promise<void> => Promise.resolve();

// Initialize object to store the final result
export interface FinalResult {
	errorEncountered: boolean;
	failedTests: {
		project: string;
		output: string;
	}[];
	successfulTests: {
		project: string;
		output: string;
	}[];
}

const finalResult: FinalResult = {
	errorEncountered: false,
	failedTests: [],
	successfulTests: [],
};

// Wrap everything in a self-executing async function
(async (): Promise<void> => {
	// Get the config/context
	const config = await getConfig();
	const context = await getContext();

	// Verification
	const absolutePath = verify.testProjects(config);

	// Determine test project paths
	const testProjectPaths = glob.sync(`${absolutePath}/*/`);

	// Define the actual finish function
	finishUp = async (): Promise<void> => {
		// Print section header
		printHeader('Resetting projects');

		// Remove packaged version and add linked version
		const tasks = new Listr(
			testProjectPaths.map((testProjectPath) => ({
				title: path.basename(testProjectPath),
				task: async (): Promise<void> => {
					// Determine what to give execa
					const execaInputRemove = await packageManager.remove(testProjectPath, context.packageFile.name);

					// Run execa command
					await execa(execaInputRemove.tool, execaInputRemove.args, {
						cwd: testProjectPath,
					}).catch((error) => {
						if (error.toString().includes(`This module isn't specified in a package.json file`)) {
							return;
						}

						return packageManager.errorCatcher(error);
					});

					// Determine what to give execa
					const execaInputAdd = await packageManager.add(testProjectPath, `link:../..`);

					// Run execa command
					await execa(execaInputAdd.tool, execaInputAdd.args, {
						cwd: testProjectPath,
					}).catch((e) => packageManager.errorCatcher(e));
				},
			})),
			{
				concurrent: true,
				exitOnError: false,
			}
		);

		try {
			await tasks.run();
		} catch (error) {
			// Ignore errors; last line is automatically printed by Listr under task
		}

		// Loop over each successful test
		for (const successfulTest of finalResult.successfulTests) {
			// Print section header
			console.log(`\n${chalk.inverse(chalk.green(chalk.bold(` Output from: ${successfulTest.project} `)))}\n`);

			// Print output
			console.log(successfulTest.output.trim());
		}

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
	await installDependencies(testProjectPaths);
	await injectRootPackage(testProjectPaths);
	await testProjects(testProjectPaths, finalResult);
})()
	.catch((error) => {
		// Remember that we encountered an error
		finalResult.errorEncountered = true;

		// Catch already-handled errors
		if (error instanceof HandledError) {
			return;
		}

		// Catch printable errors
		if (error instanceof PrintableError) {
			console.error(chalk.red(`\n${error.message}\n`));
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
