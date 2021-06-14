// Imports
import ListrDef from 'listr';
import unmockedPackageManager from '../utils/package-manager';
import installDependenciesDef from './install-dependencies';
import * as Errors from '../utils/errors';

// Initialize
let getContext: jest.Mock;
let printHeader: jest.Mock;
let execa: jest.Mock;

// Mocks
jest.mock('../utils/print-header');
jest.mock('../utils/get-context');
jest.mock('../utils/package-manager');
jest.mock('../utils/lockfile-manager');
jest.mock('execa');

// Tests
describe('#installDependencies()', () => {
	beforeEach(() => {
		jest.resetModules();
		printHeader = (require('../utils/print-header') as { default: jest.Mock }).default;
		getContext = (require('../utils/get-context') as { default: jest.Mock }).default;
		execa = require('execa') as jest.Mock;
		getContext.mockImplementation(() => ({
			packageFile: {
				name: 'example',
			},
		}));

		const packageManager = (require('../utils/package-manager') as {
			default: jest.Mocked<typeof unmockedPackageManager>;
		}).default;

		packageManager.installDependencies.mockReturnValue(Promise.resolve({ args: [], tool: 'yarn' }));
		packageManager.choosePackageManager.mockReturnValue(Promise.resolve('yarn'));
		packageManager.errorCatcher.mockImplementation(() => {
			throw new Error();
		});
	});

	it('Prints header', async () => {
		execa.mockImplementation(() => Promise.resolve());
		const installDependencies = (require('./install-dependencies') as { default: typeof installDependenciesDef })
			.default;

		await installDependencies(['/example-project']);

		expect(printHeader).toHaveBeenCalledTimes(1);
		expect(printHeader).toHaveBeenCalledWith('Installing dependencies');
	});

	it('Retrieves the context', async () => {
		execa.mockImplementation(() => Promise.resolve());
		const installDependencies = (require('./install-dependencies') as { default: typeof installDependenciesDef })
			.default;

		await installDependencies(['/example-project']);

		expect(getContext).toHaveBeenCalledTimes(1);
	});

	it('Creates a list of tasks', async () => {
		jest.doMock('listr');
		const Listr = require('listr') as jest.MockedClass<typeof ListrDef>;

		execa.mockImplementation(() => Promise.resolve());

		Listr.prototype.run.mockImplementation(() => Promise.resolve());

		const installDependencies = (require('./install-dependencies') as { default: typeof installDependenciesDef })
			.default;

		await installDependencies(['/example-project']);

		expect(Listr).toHaveBeenCalledTimes(1);
		expect(Listr).toHaveBeenCalledWith(
			[
				{
					title: 'example',
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					task: expect.any(Function),
				},
				{
					title: 'Project: example-project',
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					task: expect.any(Function),
				},
			],
			{
				concurrent: true,
				exitOnError: false,
			}
		);

		jest.dontMock('listr');
	});

	it('Runs its tasks', async () => {
		execa.mockImplementation(() => Promise.resolve());

		const installDependencies = (require('./install-dependencies') as { default: typeof installDependenciesDef })
			.default;

		await expect(installDependencies(['/example-project'])).resolves.not.toThrow();
		expect(execa).toHaveBeenCalledTimes(2);
		expect(execa).toHaveBeenCalledWith('yarn', []);
		expect(execa).toHaveBeenCalledWith('yarn', [], { cwd: '/example-project' });
	});

	it('Gracefully handles promise rejections', async () => {
		execa.mockImplementation(() => Promise.reject());

		const { HandledError } = require('../utils/errors') as typeof Errors;
		const installDependencies = (require('./install-dependencies') as { default: typeof installDependenciesDef })
			.default;

		await expect(installDependencies(['/example-project'])).rejects.toThrow(HandledError);
	});
});
