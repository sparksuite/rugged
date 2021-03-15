// Imports
import path from 'path';
import { PrintableError } from './errors';
import getConfig from './get-config';

// Set the absolute path to the test file trees directory
const testFileTreesPath = path.normalize(path.join(__dirname, '..', '..', 'test-file-trees'));

// Tests
describe('#getConfig(true)', () => {
	it('Handles no config file', async () => {
		jest.spyOn(process, 'cwd').mockReturnValue(path.join(testFileTreesPath, 'no-config'));

		expect(await getConfig(true)).toMatchObject({
			injectAsDevDependency: false,
		});
	});

	it('Skips reconstructing the config when possible', async () => {
		jest.spyOn(process, 'cwd').mockReturnValue(path.join(testFileTreesPath, 'no-config'));

		const config1 = await getConfig(true);
		const config2 = await getConfig();

		expect(Object.is(config2, config1)).toBe(true);
	});

	it('Handles JS custom config files', async () => {
		jest.spyOn(process, 'cwd').mockReturnValue(path.join(testFileTreesPath, 'js-config'));

		expect(await getConfig(true)).toMatchObject({
			injectAsDevDependency: true,
		});
	});

	it('Handles TS custom config files', async () => {
		jest.spyOn(process, 'cwd').mockReturnValue(path.join(testFileTreesPath, 'ts-config'));

		expect(await getConfig(true)).toMatchObject({
			injectAsDevDependency: true,
		});
	});

	it('Handles compile errors in JS config files', async () => {
		jest.spyOn(process, 'cwd').mockReturnValue(path.join(testFileTreesPath, 'js-config-compile-error'));

		let error: Error | undefined = undefined;

		try {
			await getConfig(true);
		} catch (e) {
			if (e instanceof Error) {
				error = e;
			}
		}

		expect(error).toBeInstanceOf(PrintableError);
		expect(error).toMatchObject({
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			message: expect.stringContaining(
				'An error was encountered while trying to compile rugged.config.js (see below):\n\n'
			),
		});
	});

	it('Handles compile errors in TS config files', async () => {
		jest.spyOn(process, 'cwd').mockReturnValue(path.join(testFileTreesPath, 'ts-config-compile-error'));

		let error: Error | undefined = undefined;

		try {
			await getConfig(true);
		} catch (e) {
			if (e instanceof Error) {
				error = e;
			}
		}

		expect(error).toBeInstanceOf(PrintableError);
		expect(error).toMatchObject({
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			message: expect.stringContaining(
				'An error was encountered while trying to compile rugged.config.ts (see below):\n\n'
			),
		});
	});

	it('Handles invalid config file export', async () => {
		jest.spyOn(process, 'cwd').mockReturnValue(path.join(testFileTreesPath, 'invalid-config'));

		await expect(() => getConfig(true)).rejects.toThrow(PrintableError);
		await expect(() => getConfig(true)).rejects.toThrow('The rugged.config.js file doesn’t export an object');
	});

	it('Handles unknown config keys', async () => {
		jest.spyOn(process, 'cwd').mockReturnValue(path.join(testFileTreesPath, 'unknown-config-key'));

		await expect(() => getConfig(true)).rejects.toThrow(PrintableError);
		await expect(() => getConfig(true)).rejects.toThrow('The rugged.config.js file contains an unrecognized key: fake');
	});

	it('Handles invalid config key values', async () => {
		jest.spyOn(process, 'cwd').mockReturnValue(path.join(testFileTreesPath, 'invalid-config-value'));

		await expect(() => getConfig(true)).rejects.toThrow(PrintableError);
		await expect(() => getConfig(true)).rejects.toThrow(
			'In the rugged.config.js file, the injectAsDevDependency key contains an invalid value'
		);
	});
});
