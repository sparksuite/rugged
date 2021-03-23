// Imports
import glob from 'glob';
import { FinalResult } from '.';
import testProjects from './steps/test-projects';
import packageManager from './utils/package-manager';

jest.mock('./utils/print-header');
jest.mock('./utils/get-context', () => ({
	__esModule: true,
	default: (): { packageFile: { name: 'example' } } => ({ packageFile: { name: 'example' } }),
}));
jest.mock('./utils/package-manager');
jest.mock('./utils/verify');
jest.mock('execa', () => ({
	__esModule: true,
	default: (): Promise<void> => Promise.resolve(),
}));
jest.mock('./steps/install-dependencies');
jest.mock('./steps/inject-root-package');
jest.mock('./steps/test-projects');
jest.spyOn(glob, 'sync').mockReturnValue(['/example-project']);
jest.spyOn(packageManager, 'remove').mockReturnValue(Promise.resolve({ args: [], tool: 'yarn' }));
jest.spyOn(packageManager, 'add').mockReturnValue(Promise.resolve({ args: [], tool: 'yarn' }));
jest.spyOn(packageManager, 'errorCatcher').mockImplementation(() => {
	throw new Error();
});
jest.spyOn(console, 'log');
(testProjects as jest.Mock).mockImplementation(async (_, finalResult: FinalResult) => {
	finalResult.failedTests.push({
		project: 'example-project',
		output: 'Example error',
	});

	finalResult.successfulTests.push({
		project: 'example-project',
		output: 'Example output',
	});
});
jest.spyOn(process, 'exit').mockImplementation(() => {
	console.log('sanity check');
	return null as never;
});

// const waitForProcessExit = async (): Promise<void> => {
// 	return new Promise<void>((resolve) => {
// 		while ((process.exit as unknown as jest.SpyInstance<typeof process.exit>).mock.calls.length < 1) {
// 			// Do nothing
// 		}

// 		resolve();
// 	});
// }

// Tests
describe('Entry point', () => {
	beforeAll(async () => {
		await import('.');
		//await waitForProcessExit();
		console.log(((process.exit as unknown) as jest.SpyInstance<typeof process.exit>).mock.calls);
	});

	it('Does not crash', async () => {
		console.log(((process.exit as unknown) as jest.SpyInstance<typeof process.exit>).mock.calls);
		expect(process.exit).toHaveBeenCalledTimes(1);
	});

	it('Prints successful output when provided', async () => {
		console.log(((process.exit as unknown) as jest.SpyInstance<typeof process.exit>).mock.calls);
		expect(process.exit).toHaveBeenCalledTimes(1);
		expect(console.log).toHaveBeenCalledTimes(5);
		expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/ Output from: example-project /));
		expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/Example error/));
		expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/Example output/));
	});

	afterAll(() => {
		console.log(((process.exit as unknown) as jest.SpyInstance<typeof process.exit>).mock.calls);
	});
});
