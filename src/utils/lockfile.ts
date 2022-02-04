// Imports
import tmp from 'tmp';
import fs from 'fs';
import path from 'path';

// Keep temporary directory in memory
let tempDirectory: string | null = null;

/** Helper functions to preserve a lockfile */
const lockfile = {
	/** Function that stores a temporary copy of a lockfile */
	store: (absolutePath: string): void => {
		// If the temp directory has not been created, create it
		if (tempDirectory === null) {
			tempDirectory = tmp.dirSync({
				unsafeCleanup: true,
			}).name;
		}

		// Grab the base name as an identifier for this lockfile
		const testProjectName = path.basename(absolutePath);

		// If the test project directory does not exist, create it
		if (!fs.existsSync(path.join(tempDirectory, testProjectName))) {
			fs.mkdirSync(path.join(tempDirectory, testProjectName));
		}

		// Build path to the lockfile
		let from = path.join(absolutePath, 'package-lock.json');
		let to = path.join(tempDirectory, testProjectName, 'package-lock.json');

		if (fs.existsSync(path.join(absolutePath, 'yarn.lock'))) {
			from = path.join(absolutePath, 'yarn.lock');
			to = path.join(tempDirectory, testProjectName, 'yarn.lock');
		}

		if (fs.existsSync(path.join(absolutePath, 'npm-shrinkwrap.json'))) {
			from = path.join(absolutePath, 'npm-shrinkwrap.json');
			to = path.join(tempDirectory, testProjectName, 'npm-shrinkwrap.json');
		}

		// Copy file
		fs.copyFileSync(from, to);
	},

	/** Function that retrieves a temporary copy of a lockfile if it exists, and overwrites the lockfile at the provided path */
	overwrite: (absolutePath: string): void => {
		// Throw if a temporary directory has not been created
		if (tempDirectory === null) {
			throw new Error('A temporary directory should exist if `overwriteLockfile` is called');
		}

		// Grab the base name as an identifier for this lockfile
		const testProjectName = path.basename(absolutePath);

		// Build path to the lockfile
		let from = path.join(tempDirectory, testProjectName, 'package-lock.json');
		let to = path.join(absolutePath, 'package-lock.json');

		if (fs.existsSync(path.join(absolutePath, 'yarn.lock'))) {
			to = path.join(absolutePath, 'yarn.lock');
			from = path.join(tempDirectory, testProjectName, 'yarn.lock');
		}

		if (fs.existsSync(path.join(absolutePath, 'npm-shrinkwrap.json'))) {
			to = path.join(absolutePath, 'npm-shrinkwrap.json');
			from = path.join(tempDirectory, testProjectName, 'npm-shrinkwrap.json');
		}

		// Copy file
		fs.copyFileSync(from, to);
	},
};

export default lockfile;
