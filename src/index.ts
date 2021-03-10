#!/usr/bin/env node

// Imports
import path from 'path';
import chalk from './utils/chalk';
import glob from 'glob';
import Listr from 'listr';
import execa from 'execa';
import { HandledError, PrintableError, yarnErrorCatcher } from './utils/errors';
import getConfig, { Config } from './utils/get-config';
import verify from './utils/verify';
import printHeader from './utils/print-header';
import installDependencies from './steps/install-dependencies';
import injectRootPackage from './steps/inject-root-package';
import testProjects from './steps/test-projects';

// Export a type used for TypeScript config files
type PartialConfig = Partial<Config>;
export type { PartialConfig as Config };

// Initialize finish function
let finishUp = () => Promise.resolve();

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
(async () => {
	// Get the config
	const config = await getConfig();

	// Verification
	const packageFile = verify.packageFile();
	const absolutePath = verify.testProjects(config);

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
					await execa('yarn', [`--mutex`, `file:${config.yarnMutexFilePath}`, `remove`, packageFile.name], {
						cwd: testProjectPath,
					}).catch((error) => {
						if (error.toString().includes(`This module isn't specified in a package.json file`)) {
							return;
						}

						return yarnErrorCatcher(error);
					});

					await execa(
						'yarn',
						[`add`, config.injectAsDevDependency ? `--dev` : '', `link:../..`].filter((arg) => !!arg),
						{
							cwd: testProjectPath,
						}
					).catch(yarnErrorCatcher);
				},
			})),
			{
				concurrent: true,
				exitOnError: false,
			}
		);

		await tasks.run();

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
	await installDependencies(packageFile, testProjectPaths);
	await injectRootPackage(packageFile, testProjectPaths);
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
