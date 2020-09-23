const dayjs = require('dayjs');
const ErrorHandler = require('./ErrorHandler');
const EventMessage = require('./EventMessage');

class NewChatMessageHandler {
	constructor(collections, eventBus, _id) {
		this.collections = collections;
		this.eventBus = eventBus;
		this._id = _id;
	}
	async handle(message) {
		try {
			const { Message, User } = this.collections;

			/**
			 *	Here we get socketUserIds from fromId and toId to send the emit to both
			 * 	users when a chatmessage is sent. We also get get the fullname.
			 */
			const { socketUserId: toSocketUserId, fullname: toFullName } = await User.findOne({ _id: message.payload.toId });

            const { socketUserId: fromSocketUserId, fullname: fromFullName } = await User.findOne({ _id: this._id });
            


			const NEW_CHAT_MESSAGE = new Message({
				toFullName,
				fromFullName,
				fromId: this._id,
				toId: message.payload.toId,
				message: message.payload.message,
				date: new Date(),
				userDate: dayjs(new Date()).format('MMM, DD, HH:mm:ss'),
			});

			await NEW_CHAT_MESSAGE.save((err, res, ) => {
				if (!err) {
                    message.socketId = toSocketUserId
                    this.eventBus.next({
						...new EventMessage({ res, message }),
                    });
                    message.socketId = fromSocketUserId
					this.eventBus.next({
						...new EventMessage({ res, message }),
					});
				} else {
					this.eventBus.next({
						...new ErrorHandler({ err, message }),
					});
				}
			});
		} catch (err) {}
	}
}

NewChatMessageHandler.TYPE = 'new-chat-message';

module.exports = NewChatMessageHandler;
