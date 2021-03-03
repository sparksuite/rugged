// Imports
import tmp from 'tmp';

// Define what configuration looks like
export interface Configuration {
	injectAsDevDependency: boolean;
	testProjectsDirectory: string;
	yarnMutexFilePath: string;
}

/** Construct the configuration object */
export default async function configure(): Promise<Configuration> {
	// Return
	return {
		injectAsDevDependency: true,
		testProjectsDirectory: 'test-projects',
		yarnMutexFilePath: tmp.fileSync().name,
	};
}
