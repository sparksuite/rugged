// Imports
import path from 'path';
import { PrintableError } from './errors';
import getConfig from './get-config';

// Set the absolute path to the test file trees directory
const testFileTreesPath = path.normalize(path.join(__dirname, '..', '..', 'test-file-trees'));

// Tests
describe('#getConfig()', () => {
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

		let error: PrintableError | undefined = undefined;

		try {
			await getConfig(true);
		} catch (e) {
			if (e instanceof PrintableError) {
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

		let error: PrintableError | undefined = undefined;

		try {
			await getConfig(true);
		} catch (e) {
			if (e instanceof PrintableError) {
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

	it('Handles invalid compileScriptName configuration', async () => {
		jest
			.spyOn(process, 'cwd')
			.mockReturnValue(path.join(testFileTreesPath, 'invalid-config-value', 'compile-script-name'));

		await expect(() => getConfig(true)).rejects.toThrow(PrintableError);
		await expect(() => getConfig(true)).rejects.toThrow(
			'In the rugged.config.js file, the compileScriptName key contains an invalid value'
		);
	});

	it('Handles invalid injectAsDevDependency configuration', async () => {
		jest
			.spyOn(process, 'cwd')
			.mockReturnValue(path.join(testFileTreesPath, 'invalid-config-value', 'inject-as-dev-dependency'));

		await expect(() => getConfig(true)).rejects.toThrow(PrintableError);
		await expect(() => getConfig(true)).rejects.toThrow(
			'In the rugged.config.js file, the injectAsDevDependency key contains an invalid value'
		);
	});

	it('Handles invalid printSuccessfulOutput configuration', async () => {
		jest
			.spyOn(process, 'cwd')
			.mockReturnValue(path.join(testFileTreesPath, 'invalid-config-value', 'print-successful-output'));

		await expect(() => getConfig(true)).rejects.toThrow(PrintableError);
		await expect(() => getConfig(true)).rejects.toThrow(
			'In the rugged.config.js file, the printSuccessfulOutput key contains an invalid value'
		);
	});

	it('Handles invalid testInParallel configuration', async () => {
		jest
			.spyOn(process, 'cwd')
			.mockReturnValue(path.join(testFileTreesPath, 'invalid-config-value', 'test-in-parallel'));

		await expect(() => getConfig(true)).rejects.toThrow(PrintableError);
		await expect(() => getConfig(true)).rejects.toThrow(
			'In the rugged.config.js file, the testInParallel key contains an invalid value'
		);
	});

	it('Handles invalid testProjectsDirectory configuration', async () => {
		jest
			.spyOn(process, 'cwd')
			.mockReturnValue(path.join(testFileTreesPath, 'invalid-config-value', 'test-projects-directory'));

		await expect(() => getConfig(true)).rejects.toThrow(PrintableError);
		await expect(() => getConfig(true)).rejects.toThrow(
			'In the rugged.config.js file, the testProjectsDirectory key contains an invalid value'
		);

		jest
			.spyOn(process, 'cwd')
			.mockReturnValue(path.join(testFileTreesPath, 'invalid-config-value', 'non-existent-test-projects-directory'));

		await expect(() => getConfig(true)).rejects.toThrow(PrintableError);
		await expect(() => getConfig(true)).rejects.toThrow(
			'In the rugged.config.js file, the testProjectsDirectory key contains an invalid value'
		);
	});

	it('Handles invalid yarnMutexPort configuration', async () => {
		jest.spyOn(process, 'cwd').mockReturnValue(path.join(testFileTreesPath, 'invalid-config-value', 'yarn-mutex-port'));

		await expect(() => getConfig(true)).rejects.toThrow(PrintableError);
		await expect(() => getConfig(true)).rejects.toThrow(
			'In the rugged.config.js file, the yarnMutexPort key contains an invalid value'
		);

		jest
			.spyOn(process, 'cwd')
			.mockReturnValue(path.join(testFileTreesPath, 'invalid-config-value', 'non-integer-yarn-mutex-port'));

		await expect(() => getConfig(true)).rejects.toThrow(PrintableError);
		await expect(() => getConfig(true)).rejects.toThrow(
			'In the rugged.config.js file, the yarnMutexPort key contains an invalid value'
		);

		jest
			.spyOn(process, 'cwd')
			.mockReturnValue(path.join(testFileTreesPath, 'invalid-config-value', 'port-number-too-high-yarn-mutex-port'));

		await expect(() => getConfig(true)).rejects.toThrow(PrintableError);
		await expect(() => getConfig(true)).rejects.toThrow(
			'In the rugged.config.js file, the yarnMutexPort key contains an invalid value'
		);

		jest
			.spyOn(process, 'cwd')
			.mockReturnValue(path.join(testFileTreesPath, 'invalid-config-value', 'port-number-too-low-yarn-mutex-port'));

		await expect(() => getConfig(true)).rejects.toThrow(PrintableError);
		await expect(() => getConfig(true)).rejects.toThrow(
			'In the rugged.config.js file, the yarnMutexPort key contains an invalid value'
		);
	});

	it('Handles invalid timeouts configuration', async () => {
		jest.spyOn(process, 'cwd').mockReturnValue(path.join(testFileTreesPath, 'invalid-config-value', 'timeouts-is-not-object'));

		await expect(() => getConfig(true)).rejects.toThrow(PrintableError);
		await expect(() => getConfig(true)).rejects.toThrow(
			'In the rugged.config.js file, the timeouts key contains an invalid value'
		);
	});
});
