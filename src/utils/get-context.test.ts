// Imports
import path from 'path';
import { PrintableError } from './errors';
import getContext from './get-context';

// Set the absolute path to the test file trees directory
const testFileTreesPath = path.normalize(path.join(__dirname, '..', '..', 'test-file-trees'));

// Tests
describe('#getContext(true)', () => {
	it('Skips reconstructing the context when possible', async () => {
		jest.spyOn(process, 'cwd').mockReturnValue(path.join(testFileTreesPath, 'primary'));

		const context1 = await getContext(true);
		const context2 = await getContext();

		expect(Object.is(context2, context1)).toBe(true);
	});

	it('Catches missing package files', async () => {
		jest.spyOn(process, 'cwd').mockReturnValue(path.join(testFileTreesPath, 'missing-package'));

		await expect(() => getContext(true)).rejects.toThrow(PrintableError);
		await expect(() => getContext(true)).rejects.toThrow('Couldn’t find package.json in this directory');
	});

	it('Catches package files that are missing a name', async () => {
		jest.spyOn(process, 'cwd').mockReturnValue(path.join(testFileTreesPath, 'package-missing-name'));

		await expect(() => getContext(true)).rejects.toThrow(PrintableError);
		await expect(() => getContext(true)).rejects.toThrow('The package.json is missing a name');
	});

	it('Catches package files that are missing a version', async () => {
		jest.spyOn(process, 'cwd').mockReturnValue(path.join(testFileTreesPath, 'package-missing-version'));

		await expect(() => getContext(true)).rejects.toThrow(PrintableError);
		await expect(() => getContext(true)).rejects.toThrow('The package.json is missing a version');
	});

	it('Returns parsed package file', async () => {
		jest.spyOn(process, 'cwd').mockReturnValue(path.join(testFileTreesPath, 'primary'));

		expect((await getContext(true)).packageFile).toStrictEqual({
			name: 'primary',
			version: '1.2.3',
		});
	});
});
