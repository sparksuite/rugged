// Imports
import path from 'path';

// Initialize
let getContext: jest.Mock;
let getConfig: jest.Mock;
let printHeader: jest.Mock;
let execa: jest.Mock;

// Mocks
jest.mock('../utils/print-header');
jest.mock('../utils/get-context');
jest.mock('../utils/get-config');
jest.mock('../utils/package-manager');
jest.mock('tmp');
jest.mock('execa');

// Tests
describe('#injectRootPackage()', () => {
	beforeEach(() => {
		// Resetting modules due to doMock
		jest.resetModules();

		// Modules have to be re-required after calls to doMock, or you get a different instance of the module than is used in testing
		printHeader = require('../utils/print-header').default;
		getContext = require('../utils/get-context').default;
		getConfig = require('../utils/get-config').default;
		execa = require('execa');
		getContext.mockImplementation(() => ({
			packageFile: {
				name: 'example',
				scripts: {
					compile: '',
				},
			},
		}));
		getConfig.mockImplementation(() => ({
			injectAsDevDependency: false,
			testProjectsDirectory: 'test-projects',
			yarnMutexPort: 31997,
			testInParallel: true,
			compileScriptName: 'compile',
			printSuccessfulOutput: false,
		}));
		const tmp = require('tmp');

		tmp.dirSync.mockReturnValue({ name: '/example-directory' });

		const packageManager = require('../utils/package-manager').default;

		packageManager.runScript.mockReturnValue(Promise.resolve({ args: [], tool: 'yarn' }));
		packageManager.pack.mockReturnValue(Promise.resolve({ args: [], tool: 'yarn' }));
		packageManager.remove.mockReturnValue(Promise.resolve({ args: [], tool: 'yarn' }));
		packageManager.unlink.mockReturnValue(Promise.resolve({ args: [], tool: 'yarn' }));
		packageManager.add.mockReturnValue(Promise.resolve({ args: [], tool: 'yarn' }));
		packageManager.choosePackageManager.mockReturnValue(Promise.resolve('yarn'));
		packageManager.errorCatcher.mockImplementation(() => {
			throw new Error();
		});
		jest.spyOn(path, 'basename').mockReturnValue('example');
	});

	it('Prints header', async () => {
		execa.mockImplementation(() => Promise.resolve({ stdout: '' }));
		const injectRootPackage = require('./inject-root-package').default;

		await injectRootPackage(['/example-project']);

		expect(printHeader).toHaveBeenCalledTimes(1);
		expect(printHeader).toHaveBeenCalledWith('Injecting example');
	});

	it('Retrieves the context', async () => {
		execa.mockImplementation(() => Promise.resolve({ stdout: '' }));
		const injectRootPackage = require('./inject-root-package').default;

		await injectRootPackage(['/example-project']);

		expect(getContext).toHaveBeenCalledTimes(1);
	});

	it('Creates a list of tasks', async () => {
		jest.doMock('listr');
		const Listr = require('listr');

		execa.mockImplementation(() => Promise.resolve({ stdout: '' }));

		(Listr.prototype.run as jest.Mock).mockImplementation(() => Promise.resolve());

		const injectRootPackage = require('./inject-root-package').default;

		await injectRootPackage(['/example-project']);

		expect(Listr).toHaveBeenCalledTimes(1);
		expect(Listr).toHaveBeenCalledWith([
			{
				title: 'Compiling',
				skip: expect.any(Function),
				task: expect.any(Function),
			},
			{
				title: 'Packaging',
				task: expect.any(Function),
			},
			{
				title: 'Removing linked version',
				task: expect.any(Function),
			},
			{
				title: 'Injecting packaged version',
				task: expect.any(Function),
			},
		]);

		jest.dontMock('listr');
	});

	it("Runs it's tasks", async () => {
		execa.mockImplementation(() => Promise.resolve({ stdout: '' }));

		const injectRootPackage = require('./inject-root-package').default;

		await expect(injectRootPackage(['/example-project'])).resolves.not.toThrow();
		expect(execa).toHaveBeenCalledTimes(5);
		expect(execa).toHaveBeenCalledWith('yarn', []);
		expect(execa).toHaveBeenCalledWith('yarn', [], { cwd: '/example-project' });
	});

	it('Gracefully handles promise rejections', async () => {
		execa.mockImplementation(() => Promise.reject());

		const { HandledError } = require('../utils/errors');
		const injectRootPackage = require('./inject-root-package').default;

		await expect(injectRootPackage(['/example-project'])).rejects.toThrow(HandledError);
	});

	it('Throws an error on the Packaging step if there is no output from stdout', async () => {
		execa.mockImplementation(() => Promise.resolve());

		const { HandledError } = require('../utils/errors');
		const injectRootPackage = require('./inject-root-package').default;

		await expect(injectRootPackage(['/example-project'])).rejects.toThrow(HandledError);
	});
});
