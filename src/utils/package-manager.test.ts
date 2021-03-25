// Imports
import path from 'path';
import { PrintableError } from './errors';
import getContext, { Context } from './get-context';
import packageManager from './package-manager';

// Set the absolute path to the test file trees directory
const testFileTreesPath = path.normalize(path.join(__dirname, '..', '..', 'test-file-trees'));

// Initialize context object for mocking later
let context: Context;

// Mocks
jest.mock('./get-context');

// Tests
describe('#packageManager', () => {
	beforeAll(async () => {
		context = await jest.requireActual<{ default: () => Promise<Context> }>('./get-context').default();
	});

	describe('#packageManager.choosePackageManager()', () => {
		it('Detects Yarn’s lock file', async () => {
			(getContext as jest.MockedFunction<typeof getContext>).mockImplementation(async () => context);

			expect(await packageManager.choosePackageManager(path.join(testFileTreesPath, 'has-yarn-lock'))).toEqual('yarn');
		});

		it('Throws an error if it detects Yarn’s lock file but Yarn is not globally available', async () => {
			(getContext as jest.MockedFunction<typeof getContext>).mockImplementation(async () => ({
				...context,
				yarnAvailableGlobally: false,
			}));

			await expect(packageManager.choosePackageManager(path.join(testFileTreesPath, 'has-yarn-lock'))).rejects.toThrow(
				PrintableError
			);
			await expect(packageManager.choosePackageManager(path.join(testFileTreesPath, 'has-yarn-lock'))).rejects.toThrow(
				'Yarn isn’t installed globally'
			);
		});

		it('Detects npm’s lock files', async () => {
			(getContext as jest.MockedFunction<typeof getContext>).mockImplementation(async () => context);

			expect(await packageManager.choosePackageManager(path.join(testFileTreesPath, 'has-package-lock'))).toEqual(
				'npm'
			);
			expect(await packageManager.choosePackageManager(path.join(testFileTreesPath, 'has-shrinkwrap'))).toEqual('npm');
		});

		it('Throws an error if it detects npm’s lock files but npm is not globally available', async () => {
			(getContext as jest.MockedFunction<typeof getContext>).mockImplementation(async () => ({
				...context,
				npmAvailableGlobally: false,
			}));

			await expect(
				packageManager.choosePackageManager(path.join(testFileTreesPath, 'has-package-lock'))
			).rejects.toThrow(PrintableError);
			await expect(
				packageManager.choosePackageManager(path.join(testFileTreesPath, 'has-package-lock'))
			).rejects.toThrow('npm isn’t installed globally');

			await expect(packageManager.choosePackageManager(path.join(testFileTreesPath, 'has-shrinkwrap'))).rejects.toThrow(
				PrintableError
			);
			await expect(packageManager.choosePackageManager(path.join(testFileTreesPath, 'has-shrinkwrap'))).rejects.toThrow(
				'npm isn’t installed globally'
			);
		});

		it('If it can not detect Yarn or npm’s lockfiles it relies on what is globally available', async () => {
			(getContext as jest.MockedFunction<typeof getContext>).mockImplementation(async () => context);

			expect(await packageManager.choosePackageManager(path.join(testFileTreesPath, 'nonexistent-path'))).toEqual(
				'yarn'
			);

			(getContext as jest.MockedFunction<typeof getContext>).mockImplementation(async () => ({
				...context,
				yarnAvailableGlobally: false,
			}));

			expect(await packageManager.choosePackageManager(path.join(testFileTreesPath, 'nonexistent-path'))).toEqual(
				'npm'
			);
		});

		it('Throws an error if neither Yarn nor npm is globally installed', async () => {
			(getContext as jest.MockedFunction<typeof getContext>).mockImplementation(async () => ({
				...context,
				npmAvailableGlobally: false,
				yarnAvailableGlobally: false,
			}));

			await expect(
				packageManager.choosePackageManager(path.join(testFileTreesPath, 'nonexistent-path'))
			).rejects.toThrow(PrintableError);
			await expect(
				packageManager.choosePackageManager(path.join(testFileTreesPath, 'nonexistent-path'))
			).rejects.toThrow('Neither Yarn nor npm is installed globally');
		});
	});

	describe('#packageManager.installDependencies()', () => {
		it('Returns correct data for Yarn', async () => {
			(getContext as jest.MockedFunction<typeof getContext>).mockImplementation(async () => context);

			expect(await packageManager.installDependencies(path.join(testFileTreesPath, 'has-yarn-lock'))).toStrictEqual({
				tool: 'yarn',
				args: [`--mutex`, `network:31997`, `install`, `--prefer-offline`],
			});
		});

		it('Returns correct data for npm', async () => {
			(getContext as jest.MockedFunction<typeof getContext>).mockImplementation(async () => context);

			expect(await packageManager.installDependencies(path.join(testFileTreesPath, 'has-package-lock'))).toStrictEqual({
				tool: 'npm',
				args: [`install`, `--prefer-offline`],
			});
		});
	});

	describe('#packageManager.runScript()', () => {
		it('Returns correct data for Yarn', async () => {
			(getContext as jest.MockedFunction<typeof getContext>).mockImplementation(async () => context);

			expect(await packageManager.runScript(path.join(testFileTreesPath, 'has-yarn-lock'), 'example')).toStrictEqual({
				tool: 'yarn',
				args: ['run', 'example'],
			});
		});

		it('Returns correct data for npm', async () => {
			(getContext as jest.MockedFunction<typeof getContext>).mockImplementation(async () => context);

			expect(await packageManager.runScript(path.join(testFileTreesPath, 'has-package-lock'), 'example')).toStrictEqual(
				{
					tool: 'npm',
					args: ['run', 'example'],
				}
			);
		});
	});

	describe('#packageManager.pack()', () => {
		it('Returns correct data for Yarn', async () => {
			(getContext as jest.MockedFunction<typeof getContext>).mockImplementation(async () => context);

			expect(await packageManager.pack(path.join(testFileTreesPath, 'has-yarn-lock'), './example.tgz')).toStrictEqual({
				tool: 'yarn',
				args: ['pack', '--filename', './example.tgz'],
			});
		});

		it('Returns correct data for npm', async () => {
			(getContext as jest.MockedFunction<typeof getContext>).mockImplementation(async () => context);

			expect(
				await packageManager.pack(path.join(testFileTreesPath, 'has-package-lock'), './example.tgz')
			).toStrictEqual({
				tool: 'npm',
				args: ['pack'],
			});
		});
	});

	describe('#packageManager.remove()', () => {
		it('Returns correct data for Yarn', async () => {
			(getContext as jest.MockedFunction<typeof getContext>).mockImplementation(async () => context);

			expect(await packageManager.remove(path.join(testFileTreesPath, 'has-yarn-lock'), 'example')).toStrictEqual({
				tool: 'yarn',
				args: ['--mutex', 'network:31997', 'remove', 'example'],
			});
		});

		it('Returns correct data for npm', async () => {
			(getContext as jest.MockedFunction<typeof getContext>).mockImplementation(async () => context);

			expect(await packageManager.remove(path.join(testFileTreesPath, 'has-package-lock'), 'example')).toStrictEqual({
				tool: 'npm',
				args: ['uninstall', 'example'],
			});
		});
	});

	describe('#packageManager.unlink()', () => {
		it('Returns correct data for Yarn', async () => {
			(getContext as jest.MockedFunction<typeof getContext>).mockImplementation(async () => context);

			expect(await packageManager.unlink(path.join(testFileTreesPath, 'has-yarn-lock'), 'example')).toStrictEqual({
				tool: 'yarn',
				args: ['--mutex', 'network:31997', 'unlink', 'example'],
			});
		});

		it('Returns correct data for npm', async () => {
			(getContext as jest.MockedFunction<typeof getContext>).mockImplementation(async () => context);

			expect(await packageManager.unlink(path.join(testFileTreesPath, 'has-package-lock'), 'example')).toStrictEqual({
				tool: 'npm',
				args: ['unlink', 'example'],
			});
		});
	});

	describe('#packageManager.add()', () => {
		it('Returns correct data for Yarn', async () => {
			(getContext as jest.MockedFunction<typeof getContext>).mockImplementation(async () => context);

			expect(await packageManager.add(path.join(testFileTreesPath, 'has-yarn-lock'), 'example')).toStrictEqual({
				tool: 'yarn',
				args: ['--mutex', 'network:31997', 'add', '--dev', 'example'],
			});
		});

		it('Returns correct data for npm', async () => {
			(getContext as jest.MockedFunction<typeof getContext>).mockImplementation(async () => context);

			expect(await packageManager.add(path.join(testFileTreesPath, 'has-package-lock'), 'example')).toStrictEqual({
				tool: 'npm',
				args: ['install', '--save-dev', 'example'],
			});
		});
	});

	describe('#packageManager.errorCatcher()', () => {
		it('Handles plain errors', () => {
			(getContext as jest.MockedFunction<typeof getContext>).mockImplementation(async () => context);

			expect(() => {
				packageManager.errorCatcher({
					command: '',
					exitCode: 1,
					failed: true,
					isCanceled: false,
					killed: false,
					message: '',
					name: '',
					shortMessage: '',
					stderr: 'Example error',
					stdout: '',
					timedOut: false,
				});
			}).toThrow(new Error('Example error'));
		});

		it('Handles multiline errors', () => {
			(getContext as jest.MockedFunction<typeof getContext>).mockImplementation(async () => context);

			expect(() => {
				packageManager.errorCatcher({
					command: '',
					exitCode: 1,
					failed: true,
					isCanceled: false,
					killed: false,
					message: '',
					name: '',
					shortMessage: '',
					stderr: 'Example error 1\nExample error 2',
					stdout: '',
					timedOut: false,
				});
			}).toThrow(new Error('Example error 1\nExample error 2'));
		});

		it('Trims “error” prefix', () => {
			(getContext as jest.MockedFunction<typeof getContext>).mockImplementation(async () => context);

			expect(() => {
				packageManager.errorCatcher({
					command: '',
					exitCode: 1,
					failed: true,
					isCanceled: false,
					killed: false,
					message: '',
					name: '',
					shortMessage: '',
					stderr: 'error Example error',
					stdout: '',
					timedOut: false,
				});
			}).toThrow(new Error('Example error'));

			expect(() => {
				packageManager.errorCatcher({
					command: '',
					exitCode: 1,
					failed: true,
					isCanceled: false,
					killed: false,
					message: '',
					name: '',
					shortMessage: '',
					stderr: 'error Example error 1\nerror Example error 2',
					stdout: '',
					timedOut: false,
				});
			}).toThrow(new Error('Example error 1\nExample error 2'));
		});
	});
});
