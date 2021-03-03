// Imports
import printHeader from './print-header';

// Mock the function
console.log = jest.fn();

// Tests
describe('#printHeader()', () => {
	it('Prints the header provided', () => {
		printHeader('Some example header');

		expect(console.log).toHaveBeenCalledTimes(1);
		expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/Some example header/));
	});
});
