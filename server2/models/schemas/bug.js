const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bugSchema = new Schema({
	projectid:String,
	id: String,
	title: String,
	reported_by: String,
	written_by: String,
	reported_at: String,
	time: String,
	url: String,
	platform: String,
	browser: String,
	category: String,
	assigned: String,
	priority: Number,
	description: String,
	expected_result: String,
	actual_result: String,
	step_for_reproduction: String,
	comment: String,
});

module.exports = mongoose.model('bugs', bugSchema);
