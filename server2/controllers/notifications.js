const JWT = require('jsonwebtoken');
const Notification = require('../models/schemas/notification');
const decodeToken = require('../helpers/decodeToken');

module.exports = {
	getAll: async (req, res, next) => {
		try {
            const { sub: user } = await decodeToken(req.headers.authorization);
            const notifications = await Notification.find({ toId: user });
			res.status(200).json(notifications);
		} catch (err) {
			res.send('Error', err);
		}
	},
};
