import Chalk from 'chalk';

const chalk = new Chalk.Instance({
	level: process.env.JEST_WORKER_ID ? 0 : undefined,
});

export default chalk;
