const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
	name: String,
	created: String,
	createdBy: String,
	notification:Boolean
});

module.exports = mongoose.model('projects', projectSchema);
