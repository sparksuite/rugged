// Imports
import lockfileManager from './lockfile-manager';
import path from 'path';
import tmp from 'tmp';
import fs from 'fs';

// Mocks
jest.mock('fs');
jest.spyOn(tmp, 'dirSync').mockImplementation(() => ({
	name: '/temp-dir',
	removeCallback: (): null => null,
}));

// Tests
describe('#lockfileManager', () => {
	describe('#lockfileManager.storeLockfile()', () => {
		it('Creates a temporary directory for the test project when it does not exist', () => {
			lockfileManager.storeLockfile('/test');

			expect(fs.mkdirSync).toHaveBeenCalledTimes(1);
			expect(fs.mkdirSync).toHaveBeenCalledWith(path.join('/', 'temp-dir', 'test'));
		});

		it('Saves a temporary copy of package-lock', () => {
			(fs.existsSync as jest.Mock).mockImplementation(() => false);

			lockfileManager.storeLockfile('/test');

			expect(fs.copyFileSync).toHaveBeenCalledTimes(1);
			expect(fs.copyFileSync).toHaveBeenCalledWith(
				path.join('/', 'test', 'package-lock.json'),
				path.join('/', 'temp-dir', 'test', 'package-lock.json')
			);
		});

		it('Saves a temporary copy of yarn.lock', () => {
			(fs.existsSync as jest.Mock).mockImplementation((path: string) => path.includes('yarn.lock'));

			lockfileManager.storeLockfile('/test');

			expect(fs.copyFileSync).toHaveBeenCalledTimes(1);
			expect(fs.copyFileSync).toHaveBeenCalledWith(
				path.join('/', 'test', 'yarn.lock'),
				path.join('/', 'temp-dir', 'test', 'yarn.lock')
			);
		});

		it('Saves a temporary copy of npm-shrinkwrap', () => {
			(fs.existsSync as jest.Mock).mockImplementation((pathName: string) => pathName.includes('npm-shrinkwrap'));

			lockfileManager.storeLockfile('/test');

			expect(fs.copyFileSync).toHaveBeenCalledTimes(1);
			expect(fs.copyFileSync).toHaveBeenCalledWith(
				path.join('/', 'test', 'npm-shrinkwrap.json'),
				path.join('/', 'temp-dir', 'test', 'npm-shrinkwrap.json')
			);
		});
	});

	describe('#lockfileManager.overwriteLockfile()', () => {
		it('Overwrites package-json with the temporary copy', () => {
			(fs.existsSync as jest.Mock).mockImplementation(() => false);

			lockfileManager.overwriteLockfile('/test');

			expect(fs.copyFileSync).toHaveBeenCalledTimes(1);
			expect(fs.copyFileSync).toHaveBeenCalledWith(
				path.join('/', 'temp-dir', 'test', 'package-lock.json'),
				path.join('/', 'test', 'package-lock.json')
			);
		});

		it('Overwrites yarn.lock with the temporary copy', () => {
			(fs.existsSync as jest.Mock).mockImplementation((path: string) => path.includes('yarn.lock'));

			lockfileManager.overwriteLockfile('/test');

			expect(fs.copyFileSync).toHaveBeenCalledTimes(1);
			expect(fs.copyFileSync).toHaveBeenCalledWith(
				path.join('/', 'temp-dir', 'test', 'yarn.lock'),
				path.join('/', 'test', 'yarn.lock')
			);
		});

		it('Overwrites npm-shrinkwrap with the temporary copy', () => {
			(fs.existsSync as jest.Mock).mockImplementation((path: string) => path.includes('npm-shrinkwrap'));

			lockfileManager.overwriteLockfile('/test');

			expect(fs.copyFileSync).toHaveBeenCalledTimes(1);
			expect(fs.copyFileSync).toHaveBeenCalledWith(
				path.join('/', 'temp-dir', 'test', 'npm-shrinkwrap.json'),
				path.join('/', 'test', 'npm-shrinkwrap.json')
			);
		});
	});
});
