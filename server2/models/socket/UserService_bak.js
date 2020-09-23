const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config');
const User = require('../schemas/user');
const Message = require('../schemas/message');
const Notification = require('../schemas/notification');
const RequestHandler = require('./RequestHandler.js');

class UserService extends RequestHandler {
	constructor(io, mongoose) {
		super(io);
		this.socketUser = null;
	}
	init() {
		this.io
			.use((socket, next) => {
				if (socket.handshake.query && socket.handshake.query.token) {
					/**
					 * 	Verify the TOKEN sent from the user
					 *	with the secret
					 */
					jwt.verify(socket.handshake.query.token, JWT_SECRET, async (err, decoded) => {
						if (err) return next(new Error('Authentication error'));

						/**
						 *	Find the user in database from the decoded token
						 *	Get the full name and ID from that user
						 */

						const { fullname, _id } = await this.findOne({ collection: User, _id: decoded.sub });

						console.log(fullname);

						/**
						 * 	Set the full name, id and socketUserid in the
						 *	socket object to be used later
						 */
						this.socketUser = { fullname: fullname, _id, socketId: socket.id };

						/**
						 * 	Update the connected Users socketUserId in the database
						 *	so that we can find and emit messages to the correct user
						 */
						// await User.updateOne({ _id: decoded.sub }, { $set: { socketUserId: socket.user.socketId } });
						await this.updateOne({ collection: User, _id: this.socketUser._id, field: 'socketUserId', value: this.socketUser.socketId });
						next();
					});
				} else {
					next(new Error('Authentication error'));
				}
			})
			.on('connection', async (socket) => {
				this.setUserData(socket);
				this.handleUserRequests(socket);
				socket.on('disconnect', () => {
					console.log(`${this.socketUser.fullname} disconnceted`);
				});
			});
	}
	async setUserData(socket) {
		socket.join('general');
		await this.updateOne({ collection: User, _id: this.socketUser._id, field: 'online', value: true });
	}
	handleUserRequests(socket) {
		const MODELS = {
			USERS: {
				collection: User,
			},
			MESSAGES: {
				collection: Message,
			},
			NOTIFICATIONS: {
				collection: Notification,
			},
		};

		socket.on('FIND', async (payload) => {
			this.io.to(this.socketUser.socketId).emit(
				`ALL_${payload.collection}`,
				await this.find({
					collection: MODELS[payload.collection].collection,
				})
			);
		});

		socket.on('FIND_BY_ID', async (payload) => {
			this.io.to(this.socketUser.socketId).emit(
				`ALL_${payload.collection}`,
				await this.findById({
					collection: MODELS[payload.collection].collection,
					key: payload.key,
					_id: payload.id,
				})
			);
		});
	}
}

module.exports = UserService;
