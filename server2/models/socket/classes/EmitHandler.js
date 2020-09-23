class EmitHandler {
	constructor(socket, io) {
		this.socket = socket;
		this.io = io;
	}
	toAll({ trigger, value = null }) {
		this.io.emit(`${trigger}`, value || this.socket.user._id);
	}
	toUser({ trigger, recieverSocketId, id = null, value, date }) {
		this.io.to(recieverSocketId).emit(`${trigger}`, {
			_id: id,
			value,
            from: this.socket.user.fullname,
            date
		});
	}
}

module.exports = EmitHandler;
