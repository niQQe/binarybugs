const Notification = require('../../schemas/notification');
const User = require('../../schemas/user');
const REQHandler = require('./RequestHandler');

class NotificationHandler extends REQHandler {
	constructor({ socket, toId, value, date }) {
		super(socket);
		this.toId = toId;
		this.value = value;
		this.date = date;
		this.recieverSocketId = null;
		this.recieverId = null;
		this.getReciever();
	}
	async getReciever() {
		const { _id, socketUserId } = await this.findOne({ collection: User, _id: this.toId });
		this.recieverSocketId = socketUserId;
		this.recieverId = _id;
	}
	async saveNotification() {
		const NEW_NOTIFICATION = new Notification({
			value: this.value,
			toId: this.toId,
			sender: {
				fullname: this.socket.user.fullname,
				_id: this.user,
			},
			date: this.date,
			read: false,
		});
		const { _id: newNotificationId } = await this.save({ model: NEW_NOTIFICATION });
		return {
			newNotificationId,
			value: this.value,
			recieverSocketId: this.recieverSocketId,
			date: this.date,
		};
	}
}

module.exports = NotificationHandler;
