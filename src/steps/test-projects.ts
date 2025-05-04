// Imports
import execa from 'execa';
import Listr from 'listr';
import path from 'path';
import { FinalResult } from '..';
import { HandledError } from '../utils/errors';
import getConfig from '../utils/get-config';
import packageManager from '../utils/package-manager';
import printHeader from '../utils/print-header';

/** Installs dependencies into the root project and test projects */
export default async function testProjects(testProjectPaths: string[], finalResult: FinalResult): Promise<void> {
	// Get the configuration for testing in parallel
	const { testInParallel, printSuccessfulOutput, timeouts } = await getConfig();

	// Print section header
	printHeader('Testing projects');

	// Set up the tasks
	const tasks = new Listr(
		testProjectPaths.map((testProjectPath) => ({
			title: path.basename(testProjectPath),
			task: async (): Promise<void> => {
				// Determine what to give execa
				const execaInput = await packageManager.runScript(testProjectPath, 'test');

				// Run execa command
				const result = await execa(execaInput.tool, execaInput.args, {
					cwd: testProjectPath,
					all: true,
					reject: false,
					timeout: timeouts.test,
				});

				// Check for failure
				if (result.failed) {
					// Add to final result
					finalResult.failedTests.push({
						project: path.basename(testProjectPath),
						output: result.all ?? 'No output...',
					});

					// Throw error that Listr will pick up
					throw new Error('Output will be printed below');
				}

				// Handle success
				if (printSuccessfulOutput) {
					// Add to final result
					finalResult.successfulTests.push({
						project: path.basename(testProjectPath),
						output: result.all ?? 'No output...',
					});
				}
			},
		})),
		{
			concurrent: testInParallel,
			exitOnError: false,
		}
	);

	// Run the tasks, catching any errors
	await tasks.run().catch(() => {
		throw new HandledError();
	});
}
