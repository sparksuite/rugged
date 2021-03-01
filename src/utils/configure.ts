// Define what configuration looks like
export interface Configuration {
	testProjectsDirectory: string;
}

/** Construct the configuration object */
export default async function configure(): Promise<Configuration> {
	// Return
	return {
		testProjectsDirectory: 'test-projects',
	};
}
