// Imports
import execa from 'execa';
import Listr from 'listr';
import path from 'path';
import { HandledError, yarnErrorCatcher } from '../utils/errors';
import getConfig from '../utils/get-config';
import getPackageFile from '../utils/get-package-file';
import printHeader from '../utils/print-header';

/** Installs dependencies into the root project and test projects */
export default async function installDependencies(testProjectPaths: string[]) {
	// Print section header
	printHeader('Installing dependencies');

	// Get the package file
	const packageFile = getPackageFile();

	// Get config
	const config = await getConfig();

	// Set up the tasks
	const tasks = new Listr(
		[
			{
				title: packageFile.name,
				task: () =>
					execa('yarn', [`--mutex`, `file:${config.yarnMutexFilePath}`, `install`, `--prefer-offline`]).catch(
						yarnErrorCatcher
					),
			},
			...testProjectPaths.map((testProjectPath) => ({
				title: `Project: ${path.basename(testProjectPath)}`,
				task: () =>
					execa('yarn', [`--mutex`, `file:${config.yarnMutexFilePath}`, `install`, `--prefer-offline`], {
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
	await tasks.run().catch(() => {
		throw new HandledError();
	});
}
