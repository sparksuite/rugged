// Imports
import fs from 'fs';
import path from 'path';
import { PrintableError } from './errors';
import chalk from './chalk';
import execa from 'execa';

// Define what a fully-constructed context object looks like
export interface Context {
	/** Whether `yarn` is available globally */
	yarnAvailableGlobally: boolean;

	/** Whether `npm` is available globally */
	npmAvailableGlobally: boolean;

	/** Details from the root project's package file */
	packageFile: {
		version: string;
		name: string;
		scripts?: {
			[script: string]: string;
		};
	};
}

// Initialize
let context: Context | undefined = undefined;

/** Construct the context object */
export default async function getContext(reconstruct?: true): Promise<Context> {
	// Return already constructed version, if possible
	if (typeof context === 'object' && reconstruct !== true) {
		return context;
	}

	// Determine which package managers are available globally
	const yarnAvailableGlobally = !(
		await execa('which', ['yarn'], {
			reject: false,
		})
	).failed;

	const npmAvailableGlobally = !(
		await execa('which', ['npm'], {
			reject: false,
		})
	).failed;

	// Get details from the package file
	const packageFilePath = path.join(process.cwd(), 'package.json');

	if (!fs.existsSync(packageFilePath)) {
		throw new PrintableError(`Couldn’t find ${chalk.bold('package.json')} in this directory (${process.cwd()})`);
	}

	const packageFile: unknown = require(packageFilePath);

	// Check for required keys
	const validate: { [k in keyof Required<Context['packageFile']>]: (value: unknown) => boolean } = {
		version: (value) => typeof value === 'string',
		name: (value) => typeof value === 'string',
		scripts: (value) => value === undefined || typeof value === 'object', 
	}

	const packageFileHasRequiredKeys = (packageFile: unknown): packageFile is { [key in keyof Context['packageFile']]?: unknown } => {
		if (typeof packageFile !== 'object' || !packageFile) {
			throw new PrintableError(`The ${chalk.bold('package.json')} file doesn’t appear to be an object`);
		}

		for (const requiredKey of Object.keys(validate)) {
			if (!(requiredKey in packageFile)) {
				throw new PrintableError(
					`The ${chalk.bold('package.json')} file is missing a required key: ${chalk.bold(requiredKey)}`
				);
			}
		}

		return true;
	}

	if (!packageFileHasRequiredKeys(packageFile)) {
		throw new Error('This should be unreachable');
	}

	// Validate each key
	const packageFileHasValidValues = (
		packageFile: { [key in keyof Context['packageFile']]?: unknown }
	): packageFile is Context['packageFile'] => {
		const requiredKeys = Object.keys(validate) as (keyof Context['packageFile'])[];

		for (const requiredKey of requiredKeys) {
			if (!validate[requiredKey](packageFile[requiredKey])) {
				throw new PrintableError(
					`In the ${chalk.bold('package.json')} file, the ${chalk.bold(requiredKey)} key contains an invalid value`
				);
			}
		}

		return true;
	}

	if (!packageFileHasValidValues(packageFile)) {
		throw new Error('This should be unreachable');
	}

	// Set context
	context = {
		yarnAvailableGlobally: yarnAvailableGlobally,
		npmAvailableGlobally: npmAvailableGlobally,
		packageFile: packageFile,
	};

	// Return context
	return context;
}
