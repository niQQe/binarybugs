const JWT = require('jsonwebtoken');
const User = require('../models/schemas/user');
const { JWT_SECRET } = require('../config');
const decodeToken = require('../helpers/decodeToken');

const commonIgnores = { password: false, notifications: false, chats: false };

const signToken = (user) => {
	const currentDate = new Date();
	return JWT.sign(
		{
			iss: 'Socket',
			name: user.name,
			lastname: user.lastname,
			sub: user._id,
			iat: currentDate.getTime(),
			exp: currentDate.setDate(currentDate.getDate() + 1),
		},
		JWT_SECRET
	);
};

module.exports = {
	signUp: async (req, res, next) => {
		console.log(req.body);
		try {
			const { fullname, email, password } = req.body;

			// Check if there is a user with same email
			const foundUser = await User.findOne({ email });
			if (foundUser) return res.status(403).json({ error: 'Email is already in use' });

			// Create a new user
			const newUser = new User({ fullname, email, password, notifications: [], chats: [], online: false });
			await newUser.save();

			// Generate Token
			const token = signToken(newUser);

			res.status(200).json({ token });
		} catch (err) {
			res.send('Error', err);
		}
	},
	signIn: async (req, res, next) => {
		try {
			const token = signToken(req.user);
			const { sub: user } = await decodeToken(token);
			const { email, _id, fullname } = await User.findOne({ _id: user });
			res.status(200).json({ token, email, _id, fullname });
		} catch (err) {
			res.send('Error', err);
		}
	},
	getAllUsers: async (req, res, next) => {
		const { sub: user } = await decodeToken(req.headers.authorization);
		try {
			const allUsers = await User.find({}, commonIgnores);
			const ids = allUsers.map((v) => v._id).filter((id) => id == user);
			const filteredUsers = allUsers.filter((allUser) => !ids.includes(allUser._id));
			return res.status(200).json(filteredUsers);
		} catch (err) {
			res.send('Error', err);
		}
	},
};
