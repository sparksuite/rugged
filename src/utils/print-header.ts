// Imports
import chalk from './chalk';

/** Print a stylized section header */
export default function printHeader(header: string): void {
	console.log(`\n${chalk.inverse(chalk.bold(` ${header} `))}\n`);
}
