import Chalk from 'chalk';

const chalk = new Chalk.Instance({
	level: process.env.NODE_ENV === 'test' ? 0 : undefined,
});

export default chalk;
