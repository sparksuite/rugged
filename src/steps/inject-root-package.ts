// Imports
import execa from 'execa';
import Listr from 'listr';
import path from 'path';
import { HandledError, yarnErrorCatcher } from '../utils/errors';
import printHeader from '../utils/print-header';
import { PackageFile } from '../utils/verify';
import tmp from 'tmp';

/** Installs dependencies into the root project and test projects */
export default async function injectRootPackage(packageFile: PackageFile, testProjectPaths: string[]) {
	// Print section header
	printHeader(`Injecting ${packageFile.name}`);

	// Set up the tasks
	const tasks = new Listr([
		{
			title: `Compiling`,
			task: () => execa('yarn', ['compile']).catch(yarnErrorCatcher),
		},
		{
			title: `Packaging`,
			task: (ctx) => {
				ctx.tmpDir = tmp.dirSync({
					unsafeCleanup: true,
				});

				return execa('yarn', [`pack`, `--filename`, path.join(ctx.tmpDir.name, 'package.tgz')]).catch(yarnErrorCatcher);
			},
		},
		{
			title: 'Removing linked version',
			task: () =>
				new Listr(
					testProjectPaths.map((testProjectPath) => ({
						title: path.basename(testProjectPath),
						task: () =>
							execa('yarn', [`remove`, packageFile.name], {
								cwd: testProjectPath,
							}).catch((error) => {
								if (error.toString().includes(`This module isn't specified in a package.json file`)) {
									return;
								}
								
								return yarnErrorCatcher(error);
							}),
					})),
					{
						concurrent: true,
						exitOnError: false,
					}
				),
		},
		{
			title: 'Injecting packaged version',
			task: (ctx) =>
				new Listr(
					testProjectPaths.map((testProjectPath) => ({
						title: path.basename(testProjectPath),
						task: () =>
							execa('yarn', [`add`, `file:${path.join(ctx.tmpDir.name, 'package.tgz')}`], {
								cwd: testProjectPath,
							}).catch(yarnErrorCatcher),
					})),
					{
						concurrent: true,
						exitOnError: false,
					}
				),
		},
	]);

	// Run the tasks, catching any errors
	await tasks.run().catch(() => {
		console.log();
		throw new HandledError();
	});
}
