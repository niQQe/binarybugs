class RequestHandler {
	constructor(io) {
		this.io = io;
	}
	async updateOne({ collection, _id, field, value }) {
		try {
			return await collection.updateOne({ _id }, { $set: { [field]: value } });
		} catch (err) {
			console.log(err);
		}
	}
	async findOne({ collection, _id }) {
		try {
			return await collection.findOne({ _id });
		} catch (err) {
			console.log(err);
		}
	}
	async find({ collection }) {
		return await collection.find({});
	}
	async findById({ collection, key, _id }) {
		return await collection.find({ [key]: _id });
	}
}

module.exports = RequestHandler;
