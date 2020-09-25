const ErrorHandler = require('./ErrorHandler');
const EventMessage = require('./EventMessage');

class SaveOneHandler {
	constructor(collections, eventBus, id) {
		this.eventBus = eventBus;
		this.collections = collections;
		this._id = id;
	}
	async handle(message) {
		try {
			const NEW_DOCUMENT = new this.collections[message.payload.collection]({
				name: message.payload.name,
				created: new Date().toISOString(),
				createdBy: this._id,
			});

			await NEW_DOCUMENT.save((err, res) => {
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

SaveOneHandler.TYPE = 'save-one';

module.exports = SaveOneHandler;
