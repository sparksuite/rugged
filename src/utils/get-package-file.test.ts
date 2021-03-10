// Imports
import path from 'path';
import { PrintableError } from './errors';
import getPackageFile from './get-package-file';

// Set the absolute path to the test file trees directory
const testFileTreesPath = path.normalize(path.join(__dirname, '..', '..', 'test-file-trees'));

// Tests
describe('#getPackageFile()', () => {
	it('Catches missing package files', () => {
		jest.spyOn(process, 'cwd').mockReturnValue(path.join(testFileTreesPath, 'missing-package'));

		expect(() => {
			getPackageFile();
		}).toThrow(PrintableError);

		expect(() => {
			getPackageFile();
		}).toThrow('Couldn’t find package.json in this directory');
	});

	it('Catches package files that are missing a name', () => {
		jest.spyOn(process, 'cwd').mockReturnValue(path.join(testFileTreesPath, 'package-missing-name'));

		expect(() => {
			getPackageFile();
		}).toThrow(PrintableError);

		expect(() => {
			getPackageFile();
		}).toThrow('The package.json is missing a name');
	});

	it('Catches package files that are missing a version', () => {
		jest.spyOn(process, 'cwd').mockReturnValue(path.join(testFileTreesPath, 'package-missing-version'));

		expect(() => {
			getPackageFile();
		}).toThrow(PrintableError);

		expect(() => {
			getPackageFile();
		}).toThrow('The package.json is missing a version');
	});

	it('Returns parsed version', () => {
		jest.spyOn(process, 'cwd').mockReturnValue(path.join(testFileTreesPath, 'primary'));

		expect(getPackageFile()).toStrictEqual({
			name: 'primary',
			version: '1.2.3',
		});
	});
});
