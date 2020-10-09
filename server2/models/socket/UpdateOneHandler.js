const ErrorHandler = require('./ErrorHandler');
const EventMessage = require('./EventMessage');

class UpdateOneHandler {
	constructor(collections, eventBus) {
		this.collections = collections;
		this.eventBus = eventBus;
	}
	async handle(message) {
		try {
			await this.collections[message.payload.collection].updateOne({ _id: message.payload._id }, { $set: { ...message.payload.keys } }).exec((err, res) => {
				if (!err) {
					res = message.payload;
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

UpdateOneHandler.TYPE = 'update-one';

module.exports = UpdateOneHandler;
