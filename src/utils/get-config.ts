// Imports
import fs from 'fs';
import path from 'path';
import { PrintableError } from './errors';
import chalk from './chalk';
import { register } from 'ts-node';

// Define what a fully-constructed config object looks like
export interface Config {
	/** Whether to inject the root package into the `devDependencies` object instead of the `dependencies`
	 *  object in the `package.json` file. Defaults to `false`. */
	injectAsDevDependency: boolean;

	/** Which directory to search for test projects. Defaults to `test-projects`. */
	testProjectsDirectory: string;

	/** The port Yarn commands should use for the `--mutex` flag. Defaults to 31997. */
	yarnMutexPort: number;

	/** Whether to run tests in parallel. Defaults to `true`. */
	testInParallel: boolean;

	/** Which `package.json` script to run to compile the root project. Defaults to `compile`; however, the compilation step will be skipped if the script does not exist. */
	compileScriptName: string;

	/** Whether to print successful test output, in addition to failed test output. Defaults to `false`. */
	printSuccessfulOutput: boolean;
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
		yarnMutexPort: 31997,
		testInParallel: true,
		compileScriptName: 'compile',
		printSuccessfulOutput: false,
	};

	// Initialize custom config
	let customConfig: unknown = undefined;

	// Define how to validate each key
	type Validate = {
		[key in keyof Config]: (value: unknown) => boolean;
	};

	const validate: Validate = {
		injectAsDevDependency: (value) => typeof value === 'boolean',
		testProjectsDirectory: (value) => typeof value === 'string' && fs.existsSync(value),
		yarnMutexPort: (value) => typeof value === 'number' && Number.isInteger(value) && value > 0 && value < 65536,
		testInParallel: (value) => typeof value === 'boolean',
		compileScriptName: (value) => typeof value === 'string',
		printSuccessfulOutput: (value) => typeof value === 'boolean',
	};

	// Initialize paths to possible config files
	const jsPath = path.join(process.cwd(), 'rugged.config.js');
	const tsPath = path.join(process.cwd(), 'rugged.config.ts');

	// Initialize the filename
	let configFilename = '';

	try {
		// Handle a JS file
		if (fs.existsSync(jsPath)) {
			// Remember the filename
			configFilename = path.basename(jsPath);

			// Require it
			customConfig = require(jsPath);
		}

		// Handle a TS file
		if (fs.existsSync(tsPath)) {
			// Remember the filename
			configFilename = path.basename(tsPath);

			// Register TypeScript compiler instance
			const service = register({
				compilerOptions: {
					module: 'CommonJS',
				},
			});

			// Enable the compiler
			service.enabled(true);

			// Require it
			const requiredConfig = require(tsPath) as { default: Config, __esModule: true } | Config;

			// Interoperability between ECMAScript / Common JS modules
			customConfig = '__esModule' in requiredConfig ? requiredConfig.default : requiredConfig;

			// Disable the compiler
			service.enabled(false);
		}
	} catch (error: unknown) {
		if (!(error instanceof Error)) {
			throw new Error('An unexpected error occurred');
		}

		throw new PrintableError(
			`An error was encountered while trying to compile ${chalk.bold(configFilename)} (see below):\n\n${chalk.red(
				error.message
			)}`
		);
	}

	// Handle the custom config
	if (configFilename) {
		// Check for unrecognized keys
		const customConfigHasKnownKeys = (customConfig: unknown): customConfig is { [key in keyof Config]?: unknown } => {
			if (typeof config !== 'object') {
				throw new Error('Config should be an object at this point');
			}

			if (typeof customConfig !== 'object' || customConfig === null) {
				throw new PrintableError(`The ${chalk.bold(configFilename)} file doesn’t export an object`);
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
		const customConfigHasValidValues = (
			customConfig: { [key in keyof Config]?: unknown }
		): customConfig is Partial<Config> => {
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
