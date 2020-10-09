const ErrorHandler = require('./ErrorHandler');
const EventMessage = require('./EventMessage');

class NotificationHandler {
	constructor(collections, eventBus, _id) {
		this.collections = collections;
		this.eventBus = eventBus;
		this._id = _id;
	}
	async handle(message) {
		try {
			const { fullname } = await this.collections['User'].findOne({ _id: this._id });

			const { socketUserId } = await this.collections['User'].findOne({ _id: message.payload.toId });


			const NEW_NOTIFICATION = new this.collections['Notification']({
				value: message.payload.value,
				fromId: this._id,
				fromFullName: fullname,
				toId: message.payload.toId,
				created: new Date(),
				read: false,
				projectId:message.payload.projectId
			});

			await NEW_NOTIFICATION.save((err, res) => {
				if (!err) {
					message.socketId = socketUserId;
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

NotificationHandler.TYPE = 'new-notification';

module.exports = NotificationHandler;
