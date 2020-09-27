const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
	value: String,
	fromId:String,
	fromFullName:String,
	toId:String,
	date:String,
	read:Boolean
});

module.exports = mongoose.model('notifications', notificationSchema);
