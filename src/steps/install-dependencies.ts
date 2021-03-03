// Imports
import execa from 'execa';
import Listr from 'listr';
import path from 'path';
import { Configuration } from '../utils/configure';
import { HandledError, yarnErrorCatcher } from '../utils/errors';
import printHeader from '../utils/print-header';
import { PackageFile } from '../utils/verify';

/** Installs dependencies into the root project and test projects */
export default async function installDependencies(
	configuration: Configuration,
	packageFile: PackageFile,
	testProjectPaths: string[]
) {
	// Print section header
	printHeader('Installing dependencies');

	// Set up the tasks
	const tasks = new Listr(
		[
			{
				title: packageFile.name,
				task: () =>
					execa('yarn', [`--mutex`, `file:${configuration.yarnMutexFilePath}`, `install`, `--prefer-offline`]).catch(
						yarnErrorCatcher
					),
			},
			...testProjectPaths.map((testProjectPath) => ({
				title: `Project: ${path.basename(testProjectPath)}`,
				task: () =>
					execa('yarn', [`--mutex`, `file:${configuration.yarnMutexFilePath}`, `install`, `--prefer-offline`], {
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
