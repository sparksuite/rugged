// Imports
import injectRootPackage from './steps/inject-root-package';
import installDependencies from './steps/install-dependencies';
import testProjects from './steps/test-projects';

// Tests
describe('#injectRootPackage', () => {
	it('Returns a function', () => {
		expect(typeof injectRootPackage).toBe('function');
	});
});

describe('#installDependencies', () => {
	it('Returns a function', () => {
		expect(typeof installDependencies).toBe('function');
	});
});

describe('#testProjects', () => {
	it('Returns a function', () => {
		expect(typeof testProjects).toBe('function');
	});
});
