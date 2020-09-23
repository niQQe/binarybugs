const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
	message: String,
	fromId: String,
	fromFullName:String,
	toId: String,
	toFullName:String,
	date: String,
	userDate:String
});

module.exports = mongoose.model('messages', messageSchema);
