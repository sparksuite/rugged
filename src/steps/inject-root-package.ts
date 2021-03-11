// Imports
import execa from 'execa';
import Listr from 'listr';
import path from 'path';
import { HandledError, yarnErrorCatcher } from '../utils/errors';
import printHeader from '../utils/print-header';
import tmp from 'tmp';
import getConfig from '../utils/get-config';
import getContext from '../utils/get-context';
import packageManager from '../utils/package-manager';

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
			task: async () => {
				// Determine what to give execa
				const execaInput = await packageManager.runScript(process.cwd(), config.compileScriptName);

				// Run execa command
				await execa(execaInput.tool, execaInput.args).catch(yarnErrorCatcher);
			},
		},
		{
			title: `Packaging`,
			task: async (ctx) => {
				// Create temporary directory
				const tmpDir = tmp.dirSync({
					unsafeCleanup: true,
				});

				// Store package path
				ctx.packagePath = path.join(tmpDir.name, `package-${Math.random().toString(36).substring(7)}.tgz`);

				// Determine what to give execa
				const execaInput = await packageManager.packagePackage(process.cwd(), ctx.packagePath);

				// Package up the package
				await execa(execaInput.tool, execaInput.args).catch(yarnErrorCatcher);

				// Extra handling for npm
				if ((await packageManager.choosePackageManager(process.cwd())) === 'npm') {
					throw new Error('TODO');
				}
			},
		},
		{
			title: 'Removing linked version',
			task: () =>
				new Listr(
					testProjectPaths.map((testProjectPath) => ({
						title: path.basename(testProjectPath),
						task: async () => {
							// Determine what to give execa
							const execaInputRemove = await packageManager.remove(testProjectPath, packageFile.name);

							// Run execa command
							await execa(execaInputRemove.tool, execaInputRemove.args, {
								cwd: testProjectPath,
							}).catch((error) => {
								if (error.toString().includes(`This module isn't specified in a package.json file`)) {
									return;
								}

								return yarnErrorCatcher(error);
							});

							// Determine what to give execa
							const execaInputUnlink = await packageManager.unlink(testProjectPath, packageFile.name);

							// Run execa command
							await execa(execaInputUnlink.tool, execaInputUnlink.args, {
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
						task: async () => {
							// Determine what to give execa
							const execaInput = await packageManager.add(testProjectPath, `file:${ctx.packagePath}`);

							// Run execa command
							await execa(execaInput.tool, execaInput.args, {
								cwd: testProjectPath,
							}).catch(yarnErrorCatcher);
						},
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
