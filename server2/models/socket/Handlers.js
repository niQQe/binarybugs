class Handlers {
	constructor(handlers) {
		this.handlers = handlers;
	}

	handle(message) {
		console.log('MESSAGE TYPE')
		console.log(message.type)
		
		if (!this.handlers[message.type]) {
			throw new Error('No handler for message');
		}

		this.handlers[message.type].handle(message);
	}
}

module.exports = Handlers;
