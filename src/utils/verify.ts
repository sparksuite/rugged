// Imports
import path from 'path';
import fs from 'fs';
import chalk from './chalk';
import { Configuration } from './configure';
import { HandledError } from './errors';

// Define what a package file should look like
export interface PackageFile {
	name: string;
}

/** Helper functions for verifying things */
const verify = {
	/** Make sure package file exists and it has a name */
	packageFile(): PackageFile {
		const packageFilePath = path.join(process.cwd(), 'package.json');

		if (!fs.existsSync(packageFilePath)) {
			console.log(chalk.red(`\nCouldn’t find ${chalk.bold('package.json')} in this directory (${process.cwd()})\n`));
			throw new HandledError();
		}

		const parsedFile = require(packageFilePath);

		if (typeof parsedFile !== 'object' || !parsedFile) {
			console.log(chalk.red(`\nThe ${chalk.bold('package.json')} file doesn’t appear to be an object\n`));
			throw new HandledError();
		}

		if (typeof parsedFile.name !== 'string') {
			console.log(chalk.red(`\nThe ${chalk.bold('package.json')} is missing a name\n`));
			throw new HandledError();
		}

		return parsedFile;
	},

	/** Verify that the test projects exist */
	testProjects(configuration: Configuration): string {
		const absolutePath = path.join(process.cwd(), configuration.testProjectsDirectory);

		if (!fs.existsSync(absolutePath)) {
			console.log(
				chalk.red(
					`\nCouldn’t find ${chalk.bold(
						`./${configuration.testProjectsDirectory}/`
					)} in this directory (${process.cwd()})\n`
				)
			);

			throw new HandledError();
		}

		return absolutePath;
	},
};

export default verify;
