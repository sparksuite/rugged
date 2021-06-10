// Imports
import execa from 'execa';
import Listr from 'listr';
import path from 'path';
import { HandledError } from '../utils/errors';
import getContext from '../utils/get-context';
import lockfileManager from '../utils/lockfile-manager';
import packageManager from '../utils/package-manager';
import printHeader from '../utils/print-header';

/** Installs dependencies into the root project and test projects */
export default async function installDependencies(testProjectPaths: string[]): Promise<void> {
	// Print section header
	printHeader('Installing dependencies');

	// Get the package file
	const { packageFile } = await getContext();

	// Set up the tasks
	const tasks = new Listr(
		[
			{
				title: packageFile.name,
				task: async (): Promise<void> => {
					// Determine what to give execa
					const execaInput = await packageManager.installDependencies(process.cwd());

					// Run execa command
					await execa(execaInput.tool, execaInput.args).catch(packageManager.errorCatcher);
				},
			},
			...testProjectPaths.map((testProjectPath) => ({
				title: `Project: ${path.basename(testProjectPath)}`,
				task: async (): Promise<void> => {
					// Store the package-json and lockfile for later restoration
					lockfileManager.storeLockfile(testProjectPath);

					// Determine what to give execa
					const execaInput = await packageManager.installDependencies(testProjectPath);

					// Run execa command
					await execa(execaInput.tool, execaInput.args, {
						cwd: testProjectPath,
					}).catch(packageManager.errorCatcher);
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
