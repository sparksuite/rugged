// Imports
import packageManager from './package-manager';

// Mock the function
console.log = jest.fn();

// Tests
describe('#packageManager.errorCatcher()', () => {
	// TODO: More tests

	it('Handles plain errors', () => {
		expect(() => {
			packageManager.errorCatcher({
				command: '',
				exitCode: 1,
				failed: true,
				isCanceled: false,
				killed: false,
				message: '',
				name: '',
				shortMessage: '',
				stderr: 'Example error',
				stdout: '',
				timedOut: false,
			});
		}).toThrow(new Error('Example error'));
	});

	it('Handles multiline errors', () => {
		expect(() => {
			packageManager.errorCatcher({
				command: '',
				exitCode: 1,
				failed: true,
				isCanceled: false,
				killed: false,
				message: '',
				name: '',
				shortMessage: '',
				stderr: 'Example error 1\nExample error 2',
				stdout: '',
				timedOut: false,
			});
		}).toThrow(new Error('Example error 1\nExample error 2'));
	});

	it('Trims “error” prefix', () => {
		expect(() => {
			packageManager.errorCatcher({
				command: '',
				exitCode: 1,
				failed: true,
				isCanceled: false,
				killed: false,
				message: '',
				name: '',
				shortMessage: '',
				stderr: 'error Example error',
				stdout: '',
				timedOut: false,
			});
		}).toThrow(new Error('Example error'));

		expect(() => {
			packageManager.errorCatcher({
				command: '',
				exitCode: 1,
				failed: true,
				isCanceled: false,
				killed: false,
				message: '',
				name: '',
				shortMessage: '',
				stderr: 'error Example error 1\nerror Example error 2',
				stdout: '',
				timedOut: false,
			});
		}).toThrow(new Error('Example error 1\nExample error 2'));
	});
});
