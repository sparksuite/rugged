import path from 'path';

module.exports = {
	yarnMutexFilePath: path.join(process.cwd(), 'tmp', '.mutex'),
};
