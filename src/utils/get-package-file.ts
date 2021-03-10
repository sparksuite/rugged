// Imports
import path from 'path';
import fs from 'fs';
import chalk from './chalk';
import { PrintableError } from './errors';

// Define what a package file should look like
export interface PackageFile {
	version: string;
	name: string;
	scripts?: {
		[script: string]: string;
	};
}

// Initialize
let parsedFile: PackageFile | undefined = undefined;

/** Retrieve and validate package file */
export default function getPackageFile(): PackageFile {
	if (typeof parsedFile === 'object') {
		return parsedFile;
	}

	const packageFilePath = path.join(process.cwd(), 'package.json');

	if (!fs.existsSync(packageFilePath)) {
		throw new PrintableError(`Couldn’t find ${chalk.bold('package.json')} in this directory (${process.cwd()})`);
	}

	parsedFile = require(packageFilePath);

	if (typeof parsedFile !== 'object' || !parsedFile) {
		throw new PrintableError(`The ${chalk.bold('package.json')} file doesn’t appear to be an object`);
	}

	if (typeof parsedFile.name !== 'string') {
		throw new PrintableError(`The ${chalk.bold('package.json')} is missing a name`);
	}

	if (typeof parsedFile.version !== 'string') {
		throw new PrintableError(`The ${chalk.bold('package.json')} is missing a version`);
	}

	return parsedFile;
}
