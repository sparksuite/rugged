// Imports
import verify from './verify';
import path from 'path';
import getConfig from './get-config';
import { PrintableError } from './errors';

// Set the absolute path to the test file trees directory
const testFileTreesPath = path.normalize(path.join(__dirname, '..', '..', 'test-file-trees'));

// Tests
describe('#verify.packageFile()', () => {
	it('Catches missing package files', () => {
		jest.spyOn(process, 'cwd').mockReturnValue(path.join(testFileTreesPath, 'missing-package'));

		expect(() => {
			verify.packageFile();
		}).toThrow(PrintableError);

		expect(() => {
			verify.packageFile();
		}).toThrow('Couldn’t find package.json in this directory');
	});

	it('Catches package files that are missing a name', () => {
		jest.spyOn(process, 'cwd').mockReturnValue(path.join(testFileTreesPath, 'package-missing-name'));

		expect(() => {
			verify.packageFile();
		}).toThrow(PrintableError);

		expect(() => {
			verify.packageFile();
		}).toThrow('The package.json is missing a name');
	});

	it('Catches package files that are missing a version', () => {
		jest.spyOn(process, 'cwd').mockReturnValue(path.join(testFileTreesPath, 'package-missing-version'));

		expect(() => {
			verify.packageFile();
		}).toThrow(PrintableError);

		expect(() => {
			verify.packageFile();
		}).toThrow('The package.json is missing a version');
	});

	it('Returns parsed version', () => {
		jest.spyOn(process, 'cwd').mockReturnValue(path.join(testFileTreesPath, 'primary'));

		expect(verify.packageFile()).toStrictEqual({
			name: 'primary',
			version: '1.2.3',
		});
	});
});

describe('#verify.testProjects()', () => {
	it('Catches missing package files', async () => {
		jest.spyOn(process, 'cwd').mockReturnValue(path.join(testFileTreesPath, 'missing-test-projects'));

		const config = await getConfig();

		expect(() => {
			verify.testProjects(config);
		}).toThrow(PrintableError);

		expect(() => {
			verify.testProjects(config);
		}).toThrow('Couldn’t find ./test-projects/ in this directory');
	});

	it('Returns absolute path', async () => {
		jest.spyOn(process, 'cwd').mockReturnValue(path.join(testFileTreesPath, 'primary'));

		const config = await getConfig();

		expect(verify.testProjects(config)).toMatch(/\/rugged\/test\-file\-trees\/primary\/test\-projects$/);
	});
});
