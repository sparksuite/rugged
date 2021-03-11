import path from 'path';
import { Config } from 'rugged';

const config: Config = {
	yarnMutexFilePath: path.join(process.cwd(), 'tmp', '.mutex'),
};

export default config;
