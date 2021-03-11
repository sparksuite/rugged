// Imports
import execa from 'execa';
import Listr from 'listr';
import path from 'path';
import { HandledError, yarnErrorCatcher } from '../utils/errors';
import printHeader from '../utils/print-header';
import tmp from 'tmp';
import getConfig from '../utils/get-config';
import getContext from '../utils/get-context';

/** Installs dependencies into the root project and test projects */
export default async function injectRootPackage(testProjectPaths: string[]) {
	// Get the package file
	const { packageFile } = await getContext();

	// Print section header
	printHeader(`Injecting ${packageFile.name}`);

	// Get config
	const config = await getConfig();

	// Set up the tasks
	const tasks = new Listr([
		{
			title: `Compiling`,
			skip: () => !Object.keys(packageFile.scripts ?? {}).includes(config.compileScriptName),
			task: () => execa('yarn', [config.compileScriptName]).catch(yarnErrorCatcher),
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
							await execa('yarn', [`--mutex`, `file:${config.yarnMutexFilePath}`, `remove`, packageFile.name], {
								cwd: testProjectPath,
							}).catch((error) => {
								if (error.toString().includes(`This module isn't specified in a package.json file`)) {
									return;
								}

								return yarnErrorCatcher(error);
							});

							await execa('yarn', [`--mutex`, `file:${config.yarnMutexFilePath}`, `unlink`, packageFile.name], {
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
							execa(
								'yarn',
								[
									`--mutex`,
									`file:${config.yarnMutexFilePath}`,
									`add`,
									config.injectAsDevDependency ? `--dev` : '',
									`file:${ctx.packagePath}`,
								].filter((arg) => !!arg),
								{
									cwd: testProjectPath,
								}
							).catch(yarnErrorCatcher),
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
