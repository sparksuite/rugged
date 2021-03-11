// Imports
import execa from 'execa';
import Listr from 'listr';
import path from 'path';
import { HandledError, yarnErrorCatcher } from '../utils/errors';
import getContext from '../utils/get-context';
import packageManager from '../utils/package-manager';
import printHeader from '../utils/print-header';

/** Installs dependencies into the root project and test projects */
export default async function installDependencies(testProjectPaths: string[]) {
	// Print section header
	printHeader('Installing dependencies');

	// Get the package file
	const { packageFile } = await getContext();

	// Set up the tasks
	const tasks = new Listr(
		[
			{
				title: packageFile.name,
				task: async () => {
					// Determine what to give execa
					const execaInput = await packageManager.installDependencies(process.cwd());

					// Run execa command
					await execa(execaInput.tool, execaInput.args).catch(yarnErrorCatcher);
				},
			},
			...testProjectPaths.map((testProjectPath) => ({
				title: `Project: ${path.basename(testProjectPath)}`,
				task: async () => {
					// Determine what to give execa
					const execaInput = await packageManager.installDependencies(testProjectPath);

					// Run execa command
					await execa(execaInput.tool, execaInput.args, {
						cwd: testProjectPath,
					}).catch(yarnErrorCatcher);
				},
			})),
		],
		{
			concurrent: true,
			exitOnError: false,
		}
	);

	// Run the tasks, catching any errors
	await tasks.run().catch(() => {
		throw new HandledError();
	});
}
