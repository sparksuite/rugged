// Imports
import glob from 'glob';
import { FinalResult } from '.';
import injectRootPackage from './steps/inject-root-package';
import installDependencies from './steps/install-dependencies';
import testProjects from './steps/test-projects';
import lockfile from './utils/lockfile';
import packageManager from './utils/package-manager';

jest.mock('./utils/print-header');
jest.mock('./utils/get-context', () => ({
	__esModule: true,
	default: (): { packageFile: { name: 'example' }; yarnAvailableGlobally: true } => ({
		packageFile: { name: 'example' },
		yarnAvailableGlobally: true,
	}),
}));
jest.mock('./utils/lockfile');
jest.mock('./utils/verify');
jest.mock('execa', () => ({
	__esModule: true,
	default: (): Promise<void> => Promise.resolve(),
}));
jest.mock('./steps/install-dependencies');
jest.mock('./steps/inject-root-package');
jest.mock('./steps/test-projects');
jest.spyOn(glob, 'sync').mockReturnValue(['/example-project']);
jest.spyOn(packageManager, 'choosePackageManager').mockImplementation(() => Promise.resolve('yarn'));
jest.spyOn(packageManager, 'remove').mockImplementation(() => Promise.resolve({ args: [], tool: 'yarn' }));
jest.spyOn(packageManager, 'add').mockImplementation(() => Promise.resolve({ args: [], tool: 'yarn' }));
jest.spyOn(packageManager, 'installDependencies').mockImplementation(() => Promise.resolve({ args: [], tool: 'yarn' }));
jest.spyOn(packageManager, 'errorCatcher').mockImplementation(() => {
	throw new Error();
});
jest.spyOn(lockfile, 'overwrite').mockImplementation();
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
(installDependencies as jest.Mock).mockImplementation(async () => null);
(injectRootPackage as jest.Mock).mockImplementation(async () => null);
jest.spyOn(process, 'cwd').mockImplementation(() => '/');
((process.exit as unknown) as jest.Mock) = jest.fn();

// Tests
describe('Entry point', () => {
	it('Does not crash', async () => {
		const promise = (await import('.')).default;

		await expect(promise).resolves.not.toThrow();
	});
});
