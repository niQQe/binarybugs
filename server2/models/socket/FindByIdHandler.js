const ErrorHandler = require('./ErrorHandler');
const EventMessage = require('./EventMessage');
const { EXCLUDE_FIELDS } = require('./commonFieldExcludes');

class FindByIdHandler {
	constructor(collections, eventBus, _id) {
		this.collections = collections;
		this.eventBus = eventBus;
		this._id = _id;
	}
	async handle(message) {
		if (message.payload.id) {
			this._id = message.payload.id;
		}

		try {
			await this.collections[message.payload.collection].find({ [message.payload.key]: { $in: [this._id, null] } }).exec((err, res) => {
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

FindByIdHandler.TYPE = 'find-by-id';

module.exports = FindByIdHandler;
