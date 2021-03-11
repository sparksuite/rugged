// Imports
import fs from 'fs';
import execa from 'execa';
import Listr from 'listr';
import path from 'path';
import { HandledError } from '../utils/errors';
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
				await execa(execaInput.tool, execaInput.args).catch(packageManager.errorCatcher);
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
				const result = await execa(execaInput.tool, execaInput.args).catch(packageManager.errorCatcher);

				if (!result) {
					throw new Error('Did not get result back from packaging command');
				}

				// Manually move the file to the temporary directory, if using npm
				if ((await packageManager.choosePackageManager(process.cwd())) === 'npm') {
					fs.copyFileSync(path.join(process.cwd(), result.stdout), ctx.packagePath);
					fs.unlinkSync(path.join(process.cwd(), result.stdout));
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

								return packageManager.errorCatcher(error);
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

								return packageManager.errorCatcher(error);
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
							}).catch(packageManager.errorCatcher);
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
