const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bugSchema = new Schema({
	projectid: String,
	title: String,
	reported_by: String,
	written_by: Object,
	reported_at: String,
	time: String,
	url: String,
	platform: String,
	browser: String,
	category: String,
	assigned: Object,
	priority: String,
	resolved_at:String,
	description: String,
	expected_result: String,
	actual_result: String,
	step_for_reproduction: String,
	comment: String,
	resolved: Boolean,
	created: String
});

module.exports = mongoose.model('bugs', bugSchema);
