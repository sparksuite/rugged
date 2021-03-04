// Imports
import tmp from 'tmp';

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
}

// Initialize
let config: Config | undefined = undefined;

/** Construct the config object */
export default async function getConfig(): Promise<Config> {
	// Return already constructed version
	if (typeof config === 'object') {
		return config;
	}

	// Build config
	config = {
		injectAsDevDependency: true,
		testProjectsDirectory: 'test-projects',
		yarnMutexFilePath: tmp.fileSync().name,
	};

	// Return
	return config;
}
