// Imports
import path from 'path';
import packageManager from './package-manager';

// Set the absolute path to the test file trees directory
const testFileTreesPath = path.normalize(path.join(__dirname, '..', '..', 'test-file-trees'));

// Tests
describe('#packageManager.choosePackageManager()', () => {
	it('Detects Yarn’s lock file', async () => {
		expect(await packageManager.choosePackageManager(path.join(testFileTreesPath, 'has-yarn-lock'))).toEqual('yarn');
	});

	it('Detects npm’s lock files', async () => {
		expect(await packageManager.choosePackageManager(path.join(testFileTreesPath, 'has-package-lock'))).toEqual('npm');
		expect(await packageManager.choosePackageManager(path.join(testFileTreesPath, 'has-shrinkwrap'))).toEqual('npm');
	});
});

describe('#packageManager.installDependencies()', () => {
	it('Returns correct data for Yarn', async () => {
		expect(await packageManager.installDependencies(path.join(testFileTreesPath, 'has-yarn-lock'))).toStrictEqual({
			tool: 'yarn',
			args: [`--mutex`, `network:31997`, `install`, `--prefer-offline`],
		});
	});

	it('Returns correct data for npm', async () => {
		expect(await packageManager.installDependencies(path.join(testFileTreesPath, 'has-package-lock'))).toStrictEqual({
			tool: 'npm',
			args: [`install`, `--prefer-offline`],
		});
	});
});

describe('#packageManager.runScript()', () => {
	it('Returns correct data for Yarn', async () => {
		expect(await packageManager.runScript(path.join(testFileTreesPath, 'has-yarn-lock'), 'example')).toStrictEqual({
			tool: 'yarn',
			args: ['run', 'example'],
		});
	});

	it('Returns correct data for npm', async () => {
		expect(await packageManager.runScript(path.join(testFileTreesPath, 'has-package-lock'), 'example')).toStrictEqual({
			tool: 'npm',
			args: ['run', 'example'],
		});
	});
});

describe('#packageManager.pack()', () => {
	it('Returns correct data for Yarn', async () => {
		expect(
			await packageManager.pack(path.join(testFileTreesPath, 'has-yarn-lock'), './example.tgz')
		).toStrictEqual({
			tool: 'yarn',
			args: ['pack', '--filename', './example.tgz'],
		});
	});

	it('Returns correct data for npm', async () => {
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
		expect(await packageManager.remove(path.join(testFileTreesPath, 'has-yarn-lock'), 'example')).toStrictEqual({
			tool: 'yarn',
			args: ['--mutex', 'network:31997', 'remove', 'example'],
		});
	});

	it('Returns correct data for npm', async () => {
		expect(await packageManager.remove(path.join(testFileTreesPath, 'has-package-lock'), 'example')).toStrictEqual({
			tool: 'npm',
			args: ['uninstall', 'example'],
		});
	});
});

describe('#packageManager.unlink()', () => {
	it('Returns correct data for Yarn', async () => {
		expect(await packageManager.unlink(path.join(testFileTreesPath, 'has-yarn-lock'), 'example')).toStrictEqual({
			tool: 'yarn',
			args: ['--mutex', 'network:31997', 'unlink', 'example'],
		});
	});

	it('Returns correct data for npm', async () => {
		expect(await packageManager.unlink(path.join(testFileTreesPath, 'has-package-lock'), 'example')).toStrictEqual({
			tool: 'npm',
			args: ['unlink', 'example'],
		});
	});
});

describe('#packageManager.add()', () => {
	it('Returns correct data for Yarn', async () => {
		expect(await packageManager.add(path.join(testFileTreesPath, 'has-yarn-lock'), 'example')).toStrictEqual({
			tool: 'yarn',
			args: ['--mutex', 'network:31997', 'add', '--dev', 'example'],
		});
	});

	it('Returns correct data for npm', async () => {
		expect(await packageManager.add(path.join(testFileTreesPath, 'has-package-lock'), 'example')).toStrictEqual({
			tool: 'npm',
			args: ['install', '--save-dev', 'example'],
		});
	});
});

describe('#packageManager.errorCatcher()', () => {
	it('Handles plain errors', () => {
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
