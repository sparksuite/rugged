// Imports
import path from 'path';
import fs from 'fs';
import chalk from './chalk';
import { Config } from './get-config';
import { PrintableError } from './errors';

/** Helper functions for verifying things */
const verify = {
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
