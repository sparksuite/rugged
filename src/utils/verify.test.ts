// Imports
import verify from './verify';
import path from 'path';
import getConfig from './get-config';
import { PrintableError } from './errors';

// Set the absolute path to the test file trees directory
const testFileTreesPath = path.normalize(path.join(__dirname, '..', '..', 'test-file-trees'));

// Tests
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
