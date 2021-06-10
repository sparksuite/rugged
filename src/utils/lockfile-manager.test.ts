// Imports
import lockfileManager from './lockfile-manager';
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
			expect(fs.mkdirSync).toHaveBeenCalledWith('/temp-dir/test');
		});

		it('Saves a temporary copy of package-lock when present', () => {
			(fs.existsSync as jest.Mock).mockImplementation(() => false);

			lockfileManager.storeLockfile('/test');

			expect(fs.copyFileSync).toHaveBeenCalledTimes(1);
			expect(fs.copyFileSync).toHaveBeenCalledWith('/test/package-lock.json', '/temp-dir/test/package-lock.json');
		});

		it('Saves a temporary copy of yarn.lock when present', () => {
			(fs.existsSync as jest.Mock).mockImplementation((path: string) => path.includes('yarn.lock'));

			lockfileManager.storeLockfile('/test');

			expect(fs.copyFileSync).toHaveBeenCalledTimes(1);
			expect(fs.copyFileSync).toHaveBeenCalledWith('/test/yarn.lock', '/temp-dir/test/yarn.lock');
		});

		it('Saves a temporary copy of npm-shrinkwrap when present', () => {
			(fs.existsSync as jest.Mock).mockImplementation((path: string) => path.includes('npm-shrinkwrap'));

			lockfileManager.storeLockfile('/test');

			expect(fs.copyFileSync).toHaveBeenCalledTimes(1);
			expect(fs.copyFileSync).toHaveBeenCalledWith('/test/npm-shrinkwrap.json', '/temp-dir/test/npm-shrinkwrap.json');
		});
	});

	describe('#lockfileManager.overwriteLockfile()', () => {
		it('Saves a temporary copy of package-lock when present', () => {
			(fs.existsSync as jest.Mock).mockImplementation(() => false);

			lockfileManager.overwriteLockfile('/test');

			expect(fs.copyFileSync).toHaveBeenCalledTimes(1);
			expect(fs.copyFileSync).toHaveBeenCalledWith('/temp-dir/test/package-lock.json', '/test/package-lock.json');
		});

		it('Saves a temporary copy of yarn.lock when present', () => {
			(fs.existsSync as jest.Mock).mockImplementation((path: string) => path.includes('yarn.lock'));

			lockfileManager.overwriteLockfile('/test');

			expect(fs.copyFileSync).toHaveBeenCalledTimes(1);
			expect(fs.copyFileSync).toHaveBeenCalledWith('/temp-dir/test/yarn.lock', '/test/yarn.lock');
		});

		it('Saves a temporary copy of npm-shrinkwrap when present', () => {
			(fs.existsSync as jest.Mock).mockImplementation((path: string) => path.includes('npm-shrinkwrap'));

			lockfileManager.overwriteLockfile('/test');

			expect(fs.copyFileSync).toHaveBeenCalledTimes(1);
			expect(fs.copyFileSync).toHaveBeenCalledWith('/temp-dir/test/npm-shrinkwrap.json', '/test/npm-shrinkwrap.json');
		});
	});
});
