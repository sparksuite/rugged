// Imports
import glob from 'glob';
import packageManager from './utils/package-manager';

// Mocks
jest.mock('./utils/print-header');
jest.mock('./utils/get-context', () => ({
	__esModule: true,
	default: () => ({ packageFile: { name: 'example' } }),
}));
jest.mock('./utils/package-manager');
jest.mock('./utils/verify');
jest.mock('execa', () => ({
	__esModule: true,
	default: () => Promise.resolve(),
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

// Tests
describe('Entry point', () => {
	it('Does not crash', async () => {
		return import('.').then(() => {
			expect(true).toBeTruthy();
		});
	});
});
