// Imports
import ListrDef from 'listr';
import unmockedPackageManager from '../utils/package-manager';
import injectRootPackageDef from './inject-root-package';
import tmpDef from 'tmp';
import * as Errors from '../utils/errors';
import fsDef from 'fs';

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
jest.mock('fs');

// Tests
describe('#injectRootPackage()', () => {
	beforeEach(() => {
		// Resetting modules due to doMock
		jest.resetModules();

		// Modules have to be re-required after calls to doMock, or you get a different instance of the module than is used in testing
		printHeader = (require('../utils/print-header') as { default: jest.Mock }).default;
		getContext = (require('../utils/get-context') as { default: jest.Mock }).default;
		getConfig = (require('../utils/get-config') as { default: jest.Mock }).default;
		execa = require('execa') as jest.Mock;
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
			timeouts: { test: 30000 },
		}));
		const tmp = require('tmp') as jest.Mocked<typeof tmpDef>;

		tmp.dirSync.mockReturnValue({ name: '/example-directory', removeCallback: () => null });

		const packageManager = (require('../utils/package-manager') as {
			default: jest.Mocked<typeof unmockedPackageManager>;
		}).default;

		packageManager.runScript.mockReturnValue(Promise.resolve({ args: [], tool: 'yarn' }));
		packageManager.pack.mockReturnValue(Promise.resolve({ args: [], tool: 'yarn' }));
		packageManager.remove.mockReturnValue(Promise.resolve({ args: [], tool: 'yarn' }));
		packageManager.unlink.mockReturnValue(Promise.resolve({ args: [], tool: 'yarn' }));
		packageManager.add.mockReturnValue(Promise.resolve({ args: [], tool: 'yarn' }));
		packageManager.choosePackageManager.mockReturnValue(Promise.resolve('yarn'));
		packageManager.errorCatcher.mockImplementation(() => {
			throw new Error();
		});
	});

	it('Prints header', async () => {
		execa.mockImplementation(() => Promise.resolve({ stdout: '' }));
		const injectRootPackage = (require('./inject-root-package') as { default: typeof injectRootPackageDef }).default;

		await injectRootPackage(['/example-project']);

		expect(printHeader).toHaveBeenCalledTimes(1);
		expect(printHeader).toHaveBeenCalledWith('Injecting example');
	});

	it('Retrieves the context', async () => {
		execa.mockImplementation(() => Promise.resolve({ stdout: '' }));
		const injectRootPackage = (require('./inject-root-package') as { default: typeof injectRootPackageDef }).default;

		await injectRootPackage(['/example-project']);

		expect(getContext).toHaveBeenCalledTimes(1);
	});

	it('Creates a list of tasks', async () => {
		jest.doMock('listr');
		const Listr = require('listr') as jest.MockedClass<typeof ListrDef>;

		execa.mockImplementation(() => Promise.resolve({ stdout: '' }));

		(Listr.prototype.run as jest.Mock).mockImplementation(() => Promise.resolve());

		const injectRootPackage = (require('./inject-root-package') as { default: typeof injectRootPackageDef }).default;

		await injectRootPackage(['/example-project']);

		expect(Listr).toHaveBeenCalledTimes(1);
		expect(Listr).toHaveBeenCalledWith([
			{
				title: 'Compiling',
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				skip: expect.any(Function),
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				task: expect.any(Function),
			},
			{
				title: 'Packaging',
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				task: expect.any(Function),
			},
			{
				title: 'Removing linked version',
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				task: expect.any(Function),
			},
			{
				title: 'Injecting packaged version',
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				task: expect.any(Function),
			},
		]);

		jest.dontMock('listr');
	});

	it('Runs its tasks', async () => {
		execa.mockImplementation(() => Promise.resolve({ stdout: '' }));

		const injectRootPackage = (require('./inject-root-package') as { default: typeof injectRootPackageDef }).default;

		await expect(injectRootPackage(['/example-project'])).resolves.not.toThrow();
		expect(execa).toHaveBeenCalledTimes(5);
		expect(execa).toHaveBeenCalledWith('yarn', []);
		expect(execa).toHaveBeenCalledWith('yarn', [], { cwd: '/example-project' });
	});

	it('Gracefully handles promise rejections', async () => {
		execa.mockImplementation(() => Promise.reject());

		const { HandledError } = require('../utils/errors') as typeof Errors;
		const injectRootPackage = (require('./inject-root-package') as { default: typeof injectRootPackageDef }).default;

		await expect(injectRootPackage(['/example-project'])).rejects.toThrow(HandledError);
	});

	it('Throws an error on the Packaging step if there is no output from stdout', async () => {
		execa.mockImplementation(() => Promise.resolve());

		const { HandledError } = require('../utils/errors') as typeof Errors;
		const injectRootPackage = (require('./inject-root-package') as { default: typeof injectRootPackageDef }).default;

		await expect(injectRootPackage(['/example-project'])).rejects.toThrow(HandledError);
	});

	it('Manually moves the file to the temporary directory, if using npm', async () => {
		execa.mockImplementation(() => Promise.resolve({ stdout: '' }));
		const packageManager = (require('../utils/package-manager') as {
			default: jest.Mocked<typeof unmockedPackageManager>;
		}).default;
		const fs = require('fs') as jest.Mocked<typeof fsDef>;

		packageManager.choosePackageManager.mockReturnValue(Promise.resolve('npm'));

		const injectRootPackage = (require('./inject-root-package') as { default: typeof injectRootPackageDef }).default;

		await injectRootPackage(['/example-project']);

		expect(fs.copyFileSync).toHaveBeenCalledTimes(1);
		expect(fs.copyFileSync).toHaveBeenCalledWith(expect.any(String), expect.any(String));
		expect(fs.unlinkSync).toHaveBeenCalledTimes(1);
		expect(fs.unlinkSync).toHaveBeenCalledWith(expect.any(String));
	});

	it('Gracefully handles promise rejections during unlink phase', async () => {
		const packageManager = (require('../utils/package-manager') as {
			default: jest.Mocked<typeof unmockedPackageManager>;
		}).default;

		packageManager.remove.mockReturnValue(Promise.resolve({ args: ['throw'], tool: 'yarn' }));
		packageManager.unlink.mockReturnValue(Promise.resolve({ args: ['throw'], tool: 'yarn' }));
		execa.mockImplementation((_, args) => {
			if (!Array.isArray(args)) {
				return;
			}

			if (args.length === 0) {
				return Promise.resolve({ stdout: '' });
			}

			return Promise.reject(new Error());
		});

		const { HandledError } = require('../utils/errors') as typeof Errors;
		const injectRootPackage = (require('./inject-root-package') as { default: typeof injectRootPackageDef }).default;

		await expect(injectRootPackage(['/example-project'])).rejects.toThrow(HandledError);
		expect(packageManager.errorCatcher).toHaveBeenCalledTimes(1);

		packageManager.errorCatcher.mockClear();
		packageManager.remove.mockReturnValue(Promise.resolve({ args: [], tool: 'yarn' }));

		await expect(injectRootPackage(['/example-project'])).rejects.toThrow(HandledError);
		expect(packageManager.errorCatcher).toHaveBeenCalledTimes(1);
	});

	it('Ignores expected errors in the unlink stage', async () => {
		const packageManager = (require('../utils/package-manager') as {
			default: jest.Mocked<typeof unmockedPackageManager>;
		}).default;
		const injectRootPackage = (require('./inject-root-package') as { default: typeof injectRootPackageDef }).default;

		execa.mockImplementation((_, args) => {
			if (!Array.isArray(args)) {
				return;
			}

			if (args.length === 0) {
				return Promise.resolve({ stdout: '' });
			}

			return Promise.reject(new Error("This module isn't specified in a package.json file"));
		});
		packageManager.remove.mockReturnValue(Promise.resolve({ args: ['throw'], tool: 'yarn' }));
		packageManager.unlink.mockReturnValue(Promise.resolve({ args: [], tool: 'yarn' }));

		await expect(injectRootPackage(['/example-project'])).resolves.not.toThrow();
		expect(packageManager.errorCatcher).toHaveBeenCalledTimes(0);

		execa.mockImplementation((_, args) => {
			if (!Array.isArray(args)) {
				return;
			}

			if (args.length === 0) {
				return Promise.resolve({ stdout: '' });
			}

			return Promise.reject(new Error('No registered package found called'));
		});
		packageManager.unlink.mockReturnValue(Promise.resolve({ args: ['throw'], tool: 'yarn' }));
		packageManager.remove.mockReturnValue(Promise.resolve({ args: [], tool: 'yarn' }));
		packageManager.errorCatcher.mockClear();

		await expect(injectRootPackage(['/example-project'])).resolves.not.toThrow();
		expect(packageManager.errorCatcher).toHaveBeenCalledTimes(0);
	});

	it('Handles no scripts in package file', async () => {
		execa.mockImplementation(() => Promise.resolve({ stdout: '' }));
		getContext.mockImplementation(() => ({
			packageFile: {
				name: 'example',
			},
		}));

		const injectRootPackage = (require('./inject-root-package') as { default: typeof injectRootPackageDef }).default;

		await expect(injectRootPackage(['/example-project'])).resolves.not.toThrow();
	});
});
