const ErrorHandler = require('./ErrorHandler');
const EventMessage = require('./EventMessage');
const { EXCLUDE_FIELDS } = require('./commonFieldExcludes');

class FindAllHandler {
	constructor(collections, eventBus) {
		this.collections = collections;
		this.eventBus = eventBus;
	}
	async handle(message) {
		console.log(message)
		try {
			await this.collections[message.payload.collection]
				.find({}, { ...EXCLUDE_FIELDS })
				.exec((err, res) => {
					if (!err) {
						this.eventBus.next({
							...new EventMessage({ res, message }),
						});
					} else {
						this.eventBus.next({
							...new ErrorHandler({ err, message }),
						});
					}
				});
		} catch (err) {
			console.log(err);
		}
	}
}

FindAllHandler.TYPE = 'find-all';

module.exports = FindAllHandler;
