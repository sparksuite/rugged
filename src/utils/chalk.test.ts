// Imports
import Chalk from 'chalk';

// Tests
describe('chalk', () => {
	it('Sets its own color level outside of a test environment', () => {
		process.env.NODE_ENV = 'development';

		const chalk = (require('./chalk') as { default: Chalk.Chalk }).default;
		expect(chalk.level).toEqual(expect.any(Number));
	});

	afterAll(() => {
		process.env.NODE_ENV = 'test';
	});
});
