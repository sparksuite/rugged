// Imports
import path from 'path';
import fs from 'fs';
import chalk from './chalk';
import { Config } from './get-config';
import { PrintableError } from './errors';

// Define what a package file should look like
export interface PackageFile {
	name: string;
	scripts?: {
		[script: string]: string;
	};
}

/** Helper functions for verifying things */
const verify = {
	/** Make sure package file exists and it has a name */
	packageFile(): PackageFile {
		const packageFilePath = path.join(process.cwd(), 'package.json');

		if (!fs.existsSync(packageFilePath)) {
			throw new PrintableError(`Couldn’t find ${chalk.bold('package.json')} in this directory (${process.cwd()})`);
		}

		const parsedFile = require(packageFilePath);

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
	},

	/** Verify that the test projects exist */
	testProjects(config: Config): string {
		const absolutePath = path.join(process.cwd(), config.testProjectsDirectory);

		if (!fs.existsSync(absolutePath)) {
			throw new PrintableError(
				`Couldn’t find ${chalk.bold(`./${config.testProjectsDirectory}/`)} in this directory (${process.cwd()})`
			);
		}

		return absolutePath;
	},
};

export default verify;
