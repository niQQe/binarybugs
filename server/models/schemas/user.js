const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// create schema
const userSchema = new Schema({
	fullname:{
		type:String,
		required:true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
	},
	password: {
		type: String,
		required: true,
	},
	notifications: [Schema.Types.Mixed],
    chats: [Schema.Types.Mixed],
	socketUserId:String,
	online:false
});

userSchema.pre('save', async function(next) {
	try {
		// Generate a salt
		const salt = await bcrypt.genSalt(10);
		// Generate a password hash (salt + hash)
		const passwordHash = await bcrypt.hash(this.password, salt);
		// Re-assign hashed version of original plain text password
		this.password = passwordHash;
		next();
	} catch (error) {
		next(error);
	}
});

userSchema.methods.isValidPassword = async function(incPassword) {
	try {
		return await bcrypt.compare(incPassword, this.password);
	} catch (error) {
		throw Error(error);
	}
};

// create a model

const User = mongoose.model('user', userSchema);

// export a model

module.exports = User;
