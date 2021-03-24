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
jest.spyOn(process, 'exit').mockImplementation(() => null as never);

// Tests
describe('Entry point', () => {
	beforeAll(async () => {
		await import('.')
	})

	it('Does not crash', () => {
		expect(true).toBeTruthy();
	});
});
