// Imports
import Listr from "listr";
import getConfig from "../utils/get-config";
import getContext from "../utils/get-context";
import packageManager from "../utils/package-manager";
import printHeader from "../utils/print-header";
import injectRootPackage from "./inject-root-package";

// Mocks
jest.mock('../utils/print-header');
jest.mock('../utils/get-context', () => ({
    __esModule: true,
    default: () => ({
        packageFile: {
            name: 'example',
        },
    })
}));
jest.mock('../utils/get-config', () => ({
    __esModule: true,
    default: () => ({
        injectAsDevDependency: false,
    })
}));

jest.mock('execa');
jest.mock('listr');

Listr.prototype.run = jest.fn().mockImplementation(() => Promise.resolve());

jest.spyOn(packageManager, 'pack');
jest.spyOn(packageManager, 'remove');
jest.spyOn(packageManager, 'unlink');
jest.spyOn(packageManager, 'runScript');
jest.spyOn(packageManager, 'errorCatcher');
jest.spyOn(packageManager, 'choosePackageManager').mockReturnValue(Promise.resolve('yarn'));

// Tests
describe('#injectRootPackage()', () => {
    it('Retrieves the context', async () => {
        await injectRootPackage(['/example-project']);

        expect(getContext).toHaveBeenCalledTimes(1);
    });

    it('Prints header', async () => {
        await injectRootPackage(['/example-project']);

        expect(printHeader).toHaveBeenCalledTimes(1);
        expect(printHeader).toHaveBeenCalledWith("Injecting example");
    });

    it('Retrieves the config', async () => {
        await injectRootPackage(['/example-project']);

        expect(getConfig).toHaveBeenCalledTimes(1);
    });

    it('Creates a list of tasks', async () => {
        await injectRootPackage(['/example-project']);

        expect(Listr).toHaveBeenCalledWith([
            {
                title: 'Compiling',
                skip: expect.any(Function),
                task: expect.any(Function),
            },
            {
                title: 'Packaging',
                task: expect.any(Function),
            },
            {
                title: 'Removing linked version',
                task: expect.any(Function),
            },
            {
                title: 'Injecting packaged version',
                task: expect.any(Function),
            },
        ]);
    });
})