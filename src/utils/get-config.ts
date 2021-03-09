// Imports
import tmp from 'tmp';
import fs from 'fs';
import path from 'path';
import { PrintableError } from './errors';
import chalk from './chalk';

// Define what a fully-constructed config object looks like
export interface Config {
	/** Whether to inject the root package into the `devDependencies` object instead of the `dependencies`
	 *  object in the `package.json` file. Defaults to `false`. */
	injectAsDevDependency: boolean;

	/** Which directory to search for test projects. Defaults to `test-projects`. */
	testProjectsDirectory: string;

	/** An absolute path to the file Yarn commands should use for the `--mutex` flag. Defaults to a randomly
	 * generated temporary file. */
	yarnMutexFilePath: string;

	/** Whether to run tests in parallel */
	testInParallel: boolean;

	/** Which `package.json` script to run to compile the root project. Defaults to `compile`; however, the compilation step will be skipped if the script does not exist. */
	compileScriptName: string;
}

// Initialize
let config: Config | undefined = undefined;

/** Construct the config object */
export default async function getConfig(reconstruct?: true): Promise<Config> {
	// Return already constructed version, if possible
	if (typeof config === 'object' && reconstruct !== true) {
		return config;
	}

	// Start by setting the default configuration
	config = {
		injectAsDevDependency: false,
		testProjectsDirectory: 'test-projects',
		yarnMutexFilePath: tmp.fileSync().name,
		testInParallel: true,
		compileScriptName: 'compile',
	};

	// Initialize custom config
	let customConfig: unknown = undefined;

	// Define how to validate each key
	type Validate = {
		[key in keyof Config]: (value: any) => boolean;
	};

	const validate: Validate = {
		injectAsDevDependency: (value) => typeof value === 'boolean',
		testProjectsDirectory: (value) => typeof value === 'string' && fs.existsSync(value),
		yarnMutexFilePath: (value) => typeof value === 'string' && fs.existsSync(value),
		testInParallel: (value) => typeof value === 'boolean',
		compileScriptName: (value) => typeof value === 'string',
	};

	// Initialize paths to possible config files
	const jsPath = path.join(process.cwd(), 'rugged.config.js');
	// const tsPath = path.join(process.cwd(), 'rugged.config.ts');

	// Initialize the filename
	let configFilename = '';

	// Handle a JS file
	if (fs.existsSync(jsPath)) {
		// Remember the filename
		configFilename = path.basename(jsPath);

		// Require it
		customConfig = require(jsPath);
	}

	// Handle the custom config
	if (configFilename) {
		// Make sure it's an object
		if (typeof customConfig !== 'object' || customConfig === null) {
			throw new PrintableError(`The ${chalk.bold(configFilename)} file doesn’t export an object`);
		}

		// Check for unrecognized keys
		function customConfigHasKnownKeys(customConfig: object): customConfig is { [key in keyof Config]?: any } {
			if (typeof config !== 'object') {
				throw new Error('Config should be an object at this point');
			}

			const allowedKeys = Object.keys(config);
			const presentKeys = Object.keys(customConfig);

			for (const presentKey of presentKeys) {
				if (!allowedKeys.includes(presentKey)) {
					throw new PrintableError(
						`The ${chalk.bold(configFilename)} file contains an unrecognized key: ${chalk.bold(presentKey)}`
					);
				}
			}

			return true;
		}

		if (!customConfigHasKnownKeys(customConfig)) {
			throw new Error('This should be unreachable');
		}

		// Validate each key
		function customConfigHasValidValues(
			customConfig: { [key in keyof Config]?: any }
		): customConfig is Partial<Config> {
			for (const [untypedKey, value] of Object.entries(customConfig)) {
				const key = untypedKey as keyof typeof customConfig;

				if (!validate[key](value)) {
					throw new PrintableError(
						`In the ${chalk.bold(configFilename)} file, the ${chalk.bold(key)} key contains an invalid value`
					);
				}
			}

			return true;
		}

		if (!customConfigHasValidValues(customConfig)) {
			throw new Error('This should be unreachable');
		}

		// Merge in the custom config
		config = {
			...config,
			...customConfig,
		};
	}

	// Return
	return config;
}
