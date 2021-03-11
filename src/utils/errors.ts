/** This error indicates it was expected and already handled */
export class HandledError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = 'HandledError';
	}
}

/** This error indicates it was expected, and a pretty error message should be printed */
export class PrintableError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'PrintableError';
	}
}
