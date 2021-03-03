// Imports
import verify from './verify';
import path from 'path';
import { HandledError } from './errors';
import configure from './configure';

// Mock the function
console.log = jest.fn();

// Tests
describe('#verify.packageFile()', () => {
	it('Catches missing package files', () => {
		expect(() => {
			verify.packageFile(path.normalize(path.join(__dirname, '..', '..', 'test-file-trees', 'missing-package')));
		}).toThrow(HandledError);

		expect(console.log).toHaveBeenCalledTimes(1);
		expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/Couldn’t find package.json in this directory/));
	});

	it('Catches package files that are missing a name', () => {
		expect(() => {
			verify.packageFile(path.normalize(path.join(__dirname, '..', '..', 'test-file-trees', 'package-missing-name')));
		}).toThrow(HandledError);

		expect(console.log).toHaveBeenCalledTimes(1);
		expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/The package.json is missing a name/));
	});

	it('Returns parsed version', () => {
		expect(
			verify.packageFile(path.normalize(path.join(__dirname, '..', '..', 'test-file-trees', 'primary')))
		).toStrictEqual({
			name: 'primary',
		});
	});
});

describe('#verify.testProjects()', () => {
	it('Catches missing package files', async () => {
		const configuration = await configure();

		expect(() => {
			verify.testProjects(
				configuration,
				path.normalize(path.join(__dirname, '..', '..', 'test-file-trees', 'missing-test-projects'))
			);
		}).toThrow(HandledError);

		expect(console.log).toHaveBeenCalledTimes(1);
		expect(console.log).toHaveBeenCalledWith(
			expect.stringMatching(/Couldn’t find \.\/test\-projects\/ in this directory/)
		);
	});

	it('Returns absolute path', async () => {
		const configuration = await configure();

		expect(
			verify.testProjects(configuration, path.normalize(path.join(__dirname, '..', '..', 'test-file-trees', 'primary')))
		).toMatch(/\/rugged\/test\-file\-trees\/primary\/test\-projects$/);
	});
});
