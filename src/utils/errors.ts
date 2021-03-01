// Imports
import execa from 'execa';

/** This error indicates it was expected and already handled */
export class HandledError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = 'HandledError';
	}
}

/** Yarn error catcher for Listr */
export const yarnErrorCatcher = (error: execa.ExecaError<string>) => {
	throw new Error(
		error.stderr
			.split('\n')
			.map((line) => line.replace(/^error /, ''))
			.join('\n')
	);
};
