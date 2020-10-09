const ErrorHandler = require('./ErrorHandler');
const EventMessage = require('./EventMessage');

class SaveOneHandler {
	constructor(collections, eventBus, id) {
		this.eventBus = eventBus;
		this.collections = collections;
		this._id = id;
	}
	async handle(message) {
		const fields = Object.keys(this.collections[message.payload.collection].schema.paths)
			.filter((key) => key != '_id' && key != '__v')
			.reduce((acc, key) => {
				acc[key] = message.payload[key];
				return acc;
			}, {});

		try {
			const NEW_DOCUMENT = new this.collections[message.payload.collection]({
				...fields,
				created: new Date(),
			});

			await NEW_DOCUMENT.save((err, res) => {
				if (!err) {
					this.eventBus.next({
						...new EventMessage(res, message),
					});
				} else {
					this.eventBus.next({
						...new ErrorHandler(err, message),
					});
				}
			});
		} catch (err) {
			console.log(err);
		}
	}
}

SaveOneHandler.TYPE = 'save-one';

module.exports = SaveOneHandler;
