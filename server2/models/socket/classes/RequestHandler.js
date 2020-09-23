const Notification = require('../../schemas/notification');
const User = require('../../schemas/user');
const Message = require('../../schemas/Message');
const decodeToken = require('../../../helpers/decodeToken');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../../config');

class RequestHandler {
	constructor(socket, socketId, _id) {
		this._id = _id;
		this.socketId = String(socketId);
		this.socket = socket;
		this.user = '';
		this.model = null;
		this.fullname = null;
		this.getUser();
	}
	async getUser() {
        console.log('-----------')
        console.log(this._id)
        console.log('-----------')
	}
	async updateOne({ collection, field, value }) {
		
		try {
			await collection.updateOne({ _id: this._id }, { $set: { [field]: value } });
		} catch (err) {
			console.log(err);
		}
		// const test = await collection.find({});
		// console.log(test)
	}
	async findOne({ collection, _id }) {
		if ((!collection, !_id)) throw new Error('MISSING_PARAMS');
		try {
			return await collection.findOne({ _id });
		} catch (err) {
			console.log(err);
		}
	}
	async save({ model }) {
		return await model.save();
	}
}

module.exports = RequestHandler;
