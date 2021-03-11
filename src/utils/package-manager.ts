// Imports
import getConfig from './get-config';
import getContext from './get-context';
import fs from 'fs';
import path from 'path';
import { PrintableError } from './errors';
import chalk from './chalk';
import execa from 'execa';

// Define what return values look like
interface ExecaInput {
	tool: string;
	args: string[];
}

/** Helper functions for producing fully-formed package manager commands for use with execa */
const packageManager = {
	/** Determine which package manager to use at a particular path */
	async choosePackageManager(absolutePath: string): Promise<'yarn' | 'npm'> {
		// Get context
		const context = await getContext();

		// Check for lock files
		if (fs.existsSync(path.join(absolutePath, 'yarn.lock'))) {
			// Error Yarn isn't available
			if (!context.yarnAvailableGlobally) {
				throw new PrintableError(
					`Found a ${chalk.bold('yarn.lock')} file at ${absolutePath}, but Yarn isn’t installed globally`
				);
			}

			// Return
			return 'yarn';
		} else if (fs.existsSync(path.join(absolutePath, 'package-lock.json'))) {
			// Error npm isn't available
			if (!context.npmAvailableGlobally) {
				throw new PrintableError(
					`Found a ${chalk.bold('package-lock.json')} file at ${absolutePath}, but npm isn’t installed globally`
				);
			}

			// Return
			return 'npm';
		} else if (fs.existsSync(path.join(absolutePath, 'npm-shrinkwrap.json'))) {
			// Error npm isn't available
			if (!context.npmAvailableGlobally) {
				throw new PrintableError(
					`Found a ${chalk.bold('npm-shrinkwrap.json')} file at ${absolutePath}, but npm isn’t installed globally`
				);
			}

			// Return
			return 'npm';
		}

		// Check what's globally installed
		if (context.yarnAvailableGlobally) {
			return 'yarn';
		} else if (context.yarnAvailableGlobally) {
			return 'npm';
		}

		// Unable to decide
		throw new PrintableError(`Neither Yarn nor npm is installed globally`);
	},

	/** Install dependencies at a particular path */
	async installDependencies(absolutePath: string): Promise<ExecaInput> {
		// Get config
		const config = await getConfig();

		// Handle based on the package manager
		if ((await packageManager.choosePackageManager(absolutePath)) === 'yarn') {
			return {
				tool: 'yarn',
				args: [`--mutex`, `network:${config.yarnMutexPort}`, `install`, `--prefer-offline`],
			};
		} else {
			return {
				tool: 'npm',
				args: [`install`, `--prefer-offline`],
			};
		}
	},

	/** Run a defined package script */
	async runScript(absolutePath: string, scriptName: string): Promise<ExecaInput> {
		// Handle based on the package manager
		if ((await packageManager.choosePackageManager(absolutePath)) === 'yarn') {
			return {
				tool: 'yarn',
				args: [`run`, scriptName],
			};
		} else {
			return {
				tool: 'npm',
				args: [`run`, scriptName],
			};
		}
	},

	/** Package up a package at a particular path */
	async packagePackage(absolutePath: string, filename: string): Promise<ExecaInput> {
		// Handle based on the package manager
		if ((await packageManager.choosePackageManager(absolutePath)) === 'yarn') {
			return {
				tool: 'yarn',
				args: [`pack`, `--filename`, filename],
			};
		} else {
			return {
				tool: 'npm',
				args: [`pack`],
			};
		}
	},

	/** Remove a single dependency at a particular path */
	async remove(absolutePath: string, dependency: string): Promise<ExecaInput> {
		// Get config
		const config = await getConfig();

		// Handle based on the package manager
		if ((await packageManager.choosePackageManager(absolutePath)) === 'yarn') {
			return {
				tool: 'yarn',
				args: [`--mutex`, `network:${config.yarnMutexPort}`, `remove`, dependency],
			};
		} else {
			return {
				tool: 'npm',
				args: [`uninstall`, dependency],
			};
		}
	},

	/** Unlink a single dependency at a particular path */
	async unlink(absolutePath: string, dependency: string): Promise<ExecaInput> {
		// Get config
		const config = await getConfig();

		// Handle based on the package manager
		if ((await packageManager.choosePackageManager(absolutePath)) === 'yarn') {
			return {
				tool: 'yarn',
				args: [`--mutex`, `network:${config.yarnMutexPort}`, `unlink`, dependency],
			};
		} else {
			return {
				tool: 'npm',
				args: [`uninstall`, dependency],
			};
		}
	},

	/** Add a single dependency to a particular path */
	async add(absolutePath: string, dependency: string): Promise<ExecaInput> {
		// Get config
		const config = await getConfig();

		// Handle based on the package manager
		if ((await packageManager.choosePackageManager(absolutePath)) === 'yarn') {
			return {
				tool: 'yarn',
				args: [
					`--mutex`,
					`network:${config.yarnMutexPort}`,
					`add`,
					config.injectAsDevDependency ? `--dev` : '',
					dependency,
				].filter((arg) => !!arg),
			};
		} else {
			if (dependency.startsWith('link:')) {
				return {
					tool: 'npm',
					args: [`link`, config.injectAsDevDependency ? `--save-dev` : '--save-prod', dependency.replace(/^link:/, '')],
				};
			} else {
				return {
					tool: 'npm',
					args: [`install`, config.injectAsDevDependency ? `--save-dev` : '--save-prod', dependency],
				};
			}
		}
	},

	/** Error catcher, generally for use inside Listr tasks */
	errorCatcher(error: execa.ExecaError<string>): void {
		throw new Error(
			error.stderr
				.split('\n')
				.map((line) => line.replace(/^error /, ''))
				.join('\n')
		);
	},
};

export default packageManager;
