const ErrorHandler = require('./ErrorHandler');
const EventMessage = require('./EventMessage');
const { EXCLUDE_FIELDS } = require('./commonFieldExcludes');

class FindAllHandler {
	constructor(collections, eventBus, id) {
		this.collections = collections;
		this.eventBus = eventBus;
		this._id = id;
	}
	async handle(message) {
		try {
			await this.collections[message.payload.collection].find({}, { ...EXCLUDE_FIELDS }).exec((err, res) => {
				console.log(this._id)
				if (!err) {
					if (message.excludeSelf) res = res.filter((item) => item.fromId != this._id);
					
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

FindAllHandler.TYPE = 'find-all';

module.exports = FindAllHandler;
