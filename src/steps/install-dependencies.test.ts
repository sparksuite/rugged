// Imports
import Listr from "listr";
import path from "path";
import { HandledError } from "../utils/errors";
import getContext from "../utils/get-context";
import packageManager from "../utils/package-manager";
import printHeader from "../utils/print-header";
import installDependencies from "./install-dependencies";

// Mocks
jest.mock('../utils/print-header');
jest.mock('../utils/get-context');
jest.mock('listr');

(Listr.prototype.run as jest.Mock).mockImplementation(() => Promise.resolve());

(getContext as jest.Mock).mockImplementation(() => ({
    packageFile: {
        name: 'example',
    },
}));

jest.mock('execa', () => ({
    __esModule: true,
    default: () => Promise.resolve(),
}));

jest.spyOn(packageManager, 'pack');
jest.spyOn(packageManager, 'remove');
jest.spyOn(packageManager, 'unlink');
jest.spyOn(packageManager, 'runScript');
jest.spyOn(packageManager, 'errorCatcher');
jest.spyOn(packageManager, 'choosePackageManager').mockReturnValue(Promise.resolve('yarn'));
jest.spyOn(path, 'basename').mockReturnValue('example');

// Tests
describe('#installDependencies()', () => {
    it('Prints header', async () => {
        await installDependencies(['/example-project']);

        expect(printHeader).toHaveBeenCalledTimes(1);
        expect(printHeader).toHaveBeenCalledWith("Installing dependencies");
    });

    it('Retrieves the context', async () => {
        await installDependencies(['/example-project']);

        expect(getContext).toHaveBeenCalledTimes(1);
    });

    it('Creates a list of tasks', async () => {
        await installDependencies(['/example-project']);

        expect(Listr).toHaveBeenCalledTimes(1);
        expect(Listr).toHaveBeenCalledWith(
            [
                {
                    title: 'example',
                    task: expect.any(Function),
                },
                {
                    title: 'Project: example',
                    task: expect.any(Function),
                },
            ],
            {
                concurrent: true,
                exitOnError: false,
            }
        );
    });

    it("Runs it's tasks", async () => {
        jest.mock('listr');
        await installDependencies(['/example-project']);

        expect((Listr as jest.Mock<Listr>).mock.instances[0].run).toHaveBeenCalledTimes(1);
    });

    it("Gracefully handles promise rejections", async () => {
        (Listr.prototype.run as jest.Mock).mockImplementationOnce(() => Promise.reject());

        await expect(() => installDependencies(['/example-project'])).rejects.toThrow(HandledError);
    });
})