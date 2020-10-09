const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
	value: String,
	fromId:String,
	fromFullName:String,
	toId:String,
	created:String,
	read:Boolean,
	projectId:String
});

module.exports = mongoose.model('notifications', notificationSchema);
