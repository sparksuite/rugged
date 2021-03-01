// Imports
import execa from 'execa';
import Listr from 'listr';
import path from 'path';
import { HandledError, yarnErrorCatcher } from '../utils/errors';
import printHeader from '../utils/print-header';
import { PackageFile } from '../utils/verify';

/** Installs dependencies into the root project and test projects */
export default async function installDependencies(packageFile: PackageFile, testProjectPaths: string[]) {
	// Print section header
	printHeader('Installing dependencies');

	// Set up the tasks
	const tasks = new Listr(
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
	await tasks.run().catch(() => {
		console.log();
		throw new HandledError();
	});
}
