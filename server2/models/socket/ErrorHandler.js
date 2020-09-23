class ErrorHandler {
	constructor({ err, message }) {
		this.err = err;
		this.message = message;
		return {
			type: 'error',
			status: 400,
			responseMessage: 'ERROR',
			target: message.target,
			errorOutput: this.err,
			recieved: this.message,
		};
	}
}

module.exports = ErrorHandler;
