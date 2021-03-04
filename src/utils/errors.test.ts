// Imports
import { yarnErrorCatcher } from './errors';

// Mock the function
console.log = jest.fn();

// Tests
describe('#yarnErrorCatcher()', () => {
	it('Handles plain errors', () => {
		expect(() => {
			yarnErrorCatcher({
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
			yarnErrorCatcher({
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
			yarnErrorCatcher({
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
			yarnErrorCatcher({
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
