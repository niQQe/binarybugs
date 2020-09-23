const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
	value: String,
	toId:String,
	fromId:String,
	date:String,
	sender:Object,
	read:Boolean
});

module.exports = mongoose.model('notifications', notificationSchema);
