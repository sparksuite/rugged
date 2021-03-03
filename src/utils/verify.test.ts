// Imports
import verify from './verify';
import path from 'path';
import { HandledError } from './errors';
import configure from './configure';

// Mock the log function
console.log = jest.fn();

// Set the absolute path to the test file trees directory
const testFileTreesPath = path.normalize(path.join(__dirname, '..', '..', 'test-file-trees'));

// Tests
describe('#verify.packageFile()', () => {
	it('Catches missing package files', () => {
		jest.spyOn(process, 'cwd').mockReturnValue(path.join(testFileTreesPath, 'missing-package'));

		expect(() => {
			verify.packageFile();
		}).toThrow(HandledError);

		expect(console.log).toHaveBeenCalledTimes(1);
		expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/Couldn’t find package.json in this directory/));
	});

	it('Catches package files that are missing a name', () => {
		jest.spyOn(process, 'cwd').mockReturnValue(path.join(testFileTreesPath, 'package-missing-name'));

		expect(() => {
			verify.packageFile();
		}).toThrow(HandledError);

		expect(console.log).toHaveBeenCalledTimes(1);
		expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/The package.json is missing a name/));
	});

	it('Returns parsed version', () => {
		jest.spyOn(process, 'cwd').mockReturnValue(path.join(testFileTreesPath, 'primary'));

		expect(verify.packageFile()).toStrictEqual({
			name: 'primary',
		});
	});
});

describe('#verify.testProjects()', () => {
	it('Catches missing package files', async () => {
		jest.spyOn(process, 'cwd').mockReturnValue(path.join(testFileTreesPath, 'missing-test-projects'));

		const configuration = await configure();

		expect(() => {
			verify.testProjects(configuration);
		}).toThrow(HandledError);

		expect(console.log).toHaveBeenCalledTimes(1);
		expect(console.log).toHaveBeenCalledWith(
			expect.stringMatching(/Couldn’t find \.\/test\-projects\/ in this directory/)
		);
	});

	it('Returns absolute path', async () => {
		jest.spyOn(process, 'cwd').mockReturnValue(path.join(testFileTreesPath, 'primary'));

		const configuration = await configure();

		expect(verify.testProjects(configuration)).toMatch(/\/rugged\/test\-file\-trees\/primary\/test\-projects$/);
	});
});
