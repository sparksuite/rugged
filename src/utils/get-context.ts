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

	const packageFile = require(packageFilePath);

	if (typeof packageFile !== 'object' || !packageFile) {
		throw new PrintableError(`The ${chalk.bold('package.json')} file doesn’t appear to be an object`);
	}

	if (typeof packageFile.name !== 'string') {
		throw new PrintableError(`The ${chalk.bold('package.json')} is missing a name`);
	}

	if (typeof packageFile.version !== 'string') {
		throw new PrintableError(`The ${chalk.bold('package.json')} is missing a version`);
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
