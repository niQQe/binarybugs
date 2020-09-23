const User = require('../schemas/user');

export default class Update{
	constructor(collection, socket, _id, field) {
		this.socket = socket;
		this._id = _id;
        this.field = field;
        this.collection = collection;
        this.UpdateOne();
	}
	updateOne() {
        await collection.updateOne({ _id: decoded.sub }, { $set: { socketUserId: socket.user.socketId } });
    }
}
