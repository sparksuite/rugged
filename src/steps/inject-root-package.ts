// Imports
import execa from 'execa';
import Listr from 'listr';
import path from 'path';
import { HandledError, yarnErrorCatcher } from '../utils/errors';
import printHeader from '../utils/print-header';
import { PackageFile } from '../utils/verify';
import tmp from 'tmp';
import { Configuration } from '../utils/configure';

/** Installs dependencies into the root project and test projects */
export default async function injectRootPackage(
	configuration: Configuration,
	packageFile: PackageFile,
	testProjectPaths: string[]
) {
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
				const tmpDir = tmp.dirSync({
					unsafeCleanup: true,
				});

				ctx.packagePath = path.join(tmpDir.name, `package-${Math.random().toString(36).substring(7)}.tgz`);

				return execa('yarn', [`pack`, `--filename`, ctx.packagePath]).catch(yarnErrorCatcher);
			},
		},
		{
			title: 'Removing linked version',
			task: () =>
				new Listr(
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

							await execa('yarn', [`--mutex`, `file:${configuration.yarnMutexFilePath}`, `unlink`, packageFile.name], {
								cwd: testProjectPath,
							}).catch((error) => {
								if (error.toString().includes(`No registered package found called`)) {
									return;
								}

								return yarnErrorCatcher(error);
							});
						},
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
							execa('yarn', [`--mutex`, `file:${configuration.yarnMutexFilePath}`, `add`, configuration.injectAsDevDependency ? `--dev` : '', `file:${ctx.packagePath}`], {
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
		throw new HandledError();
	});
}
