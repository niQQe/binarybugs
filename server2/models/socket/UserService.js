const { JWT_SECRET } = require('../../config');
const { Subject } = require('rxjs');
const jwt = require('jsonwebtoken');

// MODELS
const User = require('../schemas/user');
const Message = require('../schemas/message');
const Notification = require('../schemas/notification');
const Project = require('../schemas/project');
const Bug = require('../schemas/bug');

// CLASSES
const FindAllHandler = require('./FindAllHandler');
const FindByIdHandler = require('./FindByIdHandler');
const UpdateOneHandler = require('./UpdateOneHandler');
const ChatHistoryHandler = require('./ChatHistoryHandler');
const NewChatMessageHandler = require('./NewChatMessageHandler');
const SaveOneHandler = require('./SaveOneHandler');
const ProjectsHandler = require('./ProjectsHandler');
const NotificationHandler = require('./NotificationHandler');

const Handlers = require('./Handlers');

class UserService {
	constructor(io, mongoose) {
		this.io = io;
		this.collections = mongoose.connections[0].collections;
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

						const { fullname, _id } = await User.findOne({ collection: User, _id: decoded.sub });

						/**
						 * 	Set the full name, id and socketUserid in the
						 *	socket object to be used later
						 */
						socket.user = { fullname: fullname, _id, socketId: socket.id };

						/**
						 * 	Update the connected Users socketUserId in the database
						 *	so that we can find and emit messages to the correct user
						 */
						// await User.updateOne({ _id: decoded.sub }, { $set: { socketUserId: socket.user.socketId } });
						await User.updateOne({ _id: socket.user._id }, { $set: { socketUserId: socket.user.socketId } });
						next();
					});
				} else {
					next(new Error('Authentication error'));
				}
			})
			.on('connection', async (socket) => {
				console.log(socket.user.fullname + ' user connected');

				const eventBus = new Subject();
				eventBus.subscribe((message) => {
					if (message.type !== 'error') {
						if (message.group) {
							this.io.emit('UPDATE', {
								type: message.payload.type,
								storeAction: message.storeAction,
								status: message.payload.status,
								payload: message.payload,
								recieved: message.recieved,
							});
						} else {
							this.io.to(message.target).emit('UPDATE', {
								type: message.type,
								storeAction: message.storeAction,
								status: message.status,
								payload: message.payload,
								recieved: message.recieved,
							});
						}
					} else {
						this.io.to(message.target).emit('UPDATE', {
							type: message.type,
							status: message.status,
							storeAction: 'ERROR',
							errorOutput: message.errorOutput,
						});
					}
				});

				socket.join('all');
				/**
				 * 	Update the the status of the user to online = true in the database.
				 *  We do this so the initial GET from the user will have the correct status.
				 */
				await User.updateOne({ _id: socket.user._id }, { $set: { online: true } });

				/**
				 * 	For users already connected and active we emit the userid
				 *  of the current user connected so that the status changes in
				 *  real time.
				 */
				this.io.emit('UPDATE', { storeAction: 'setUserOnline', payload: { id: socket.user._id } });

				const handlers = new Handlers({
					[FindAllHandler.TYPE]: new FindAllHandler({ User, Message, Notification, Project }, eventBus, socket.user._id),
					[FindByIdHandler.TYPE]: new FindByIdHandler({ User, Message, Notification, Bug }, eventBus, socket.user._id),
					[UpdateOneHandler.TYPE]: new UpdateOneHandler({ User, Message, Notification, Bug }, eventBus, socket.user._id),
					[ChatHistoryHandler.TYPE]: new ChatHistoryHandler({ Message }, eventBus, socket.user._id),
					[NewChatMessageHandler.TYPE]: new NewChatMessageHandler({ Message, User }, eventBus, socket.user._id),
					[SaveOneHandler.TYPE]: new SaveOneHandler({ Project, User, Notification, Bug }, eventBus, socket.user._id),
					[ProjectsHandler.TYPE]: new ProjectsHandler({ Project, Bug }, eventBus, socket.user._id),
					[NotificationHandler.TYPE]: new NotificationHandler({ Notification, User }, eventBus, socket.user._id),
				});

				socket.on('request', (message) => {
					console.log(message)
					handlers.handle({
						...message,
						socketId: socket.id,
					});
				});

				socket.once('disconnect', async () => {
					/** When user disconnects, update the online status to false
					 *  in the database.
					 */
					await User.updateOne({ _id: socket.user._id }, { $set: { online: false } });

					/**
					 * 	For users already connected and active we emit the userid
					 *  of the current user disconnected so that the status changes in
					 *  real time.
					 */
					this.io.emit('UPDATE', {  storeAction: 'setUserOffline', payload: { id: socket.user._id, storeAction: 'setUserOffline' } });
				});
			});
	}
	async setUserData(socket) {
		socket.join('general');
		await this.updateOne({ collection: User, _id: socket.user._id, field: 'online', value: true });
	}
}

module.exports = UserService;
