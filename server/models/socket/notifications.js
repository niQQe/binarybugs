const { JWT_SECRET } = require('../../config');
const Notification = require('../schemas/notification');
const User = require('../schemas/user');
const Message = require('../schemas/Message');
const jwt = require('jsonwebtoken');
const decodeToken = require('../../helpers/decodeToken');
const dayjs = require('dayjs');

class SocketConnection {
	constructor(port) {
		this.port = port;
		this.io = require('socket.io').listen(this.port).sockets;
		console.log(`New socketconection at ${port}`);
	}
	handle() {
		this.io
			.use((socket, next) => {
				/** Check if handshake and token is acquired */
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
						const { fullname, _id } = await User.findOne({ _id: decoded.sub });

						/**
						 * 	Set the full name, id and socketUserid in the
						 *	socket object to be used later
						 */
						socket.user = { fullname, _id, socketId: socket.id };

						/**
						 * 	Update the connected Users socketUserId in the database
						 *	so that we can find and emit messages to the correct user
						 */
						await User.updateOne({ _id: decoded.sub }, { $set: { socketUserId: socket.user.socketId } });
						next();
					});
				} else {
					next(new Error('Authentication error'));
				}
			})
			.on('connection', async (socket) => {
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
				this.io.emit('USER_ONLINE', { id: socket.user._id });

				socket.once('disconnect', async () => {
					/** When user disconnects, update the online status to = false
					 *  in the database.
					 */
					await User.updateOne({ _id: socket.user._id }, { $set: { online: false } });

					/**
					 * 	For users already connected and active we emit the userid
					 *  of the current user disconnected so that the status changes in
					 *  real time.
					 */
					this.io.emit('USER_OFFLINE', { id: socket.user._id });
				});
				socket.on('GET_GET_ALL_USERS', async () => {
					const GET_ALL_USERS = await User.find({});
					const ids = GET_ALL_USERS.map((v) => v._id).filter((id) => id == String(socket.user._id));
					const filteredUsers = GET_ALL_USERS.filter((allUser) => !ids.includes(allUser._id));

					this.io.to(socket.user.socketId).emit('GET_ALL_USERS', filteredUsers);
				});
				/**   Handles the new notification emitted by the user. */
				socket.on('NEW_NOTIFICATION', async ({ value, toId, date }) => {
					if (!value || !toId || !date) throw new Error('missing params');
					try {
						/**
						 *	Decode the token and get the ID of the user
						 *	who sent the notification.
						 */
						const { sub: user } = await decodeToken(socket.handshake.query.token);

						/**
						 * 	Find ID for reciever of the notification (toId).
						 *  We also need the socketUserId to send the notification
						 *  to the correct user.
						 */
						const { _id, socketUserId } = await User.findOne({ _id: toId });

						/**
						 * 	Create new Notification with params recieved from the sender
						 * 	included in the Notification Schema.
						 */
						const NEW_NOTIFICATION = new Notification({
							value,
							toId: _id,
							sender: {
								fullname: socket.user.fullname,
								_id: user,
							},
							date,
							read: false,
						});

						/**
						 * 	Save the new Notification and get the new ID generated.
						 *  This is required so that the user can mark the
						 *  notification as read when recieved.
						 */
						const { _id: newNotificationId } = await NEW_NOTIFICATION.save();

						/**
						 * 	Emit back the notification to the reciever.
						 *	Here we include the socketUserId and the fullname declared above.
						 *	We also include the newly saved Notification id and params.
						 */
						this.io.to(socketUserId).emit('NEW_NOTIFICATION', {
							_id: newNotificationId,
							value: value,
							from: socket.user.fullname,
							date,
						});
					} catch (err) {
						console.log(err);
					}
				});

				/** Handles a marked notification as read */
				socket.on('MARK_NOTIFICATION_AS_READ', async ({ notificationId }) => {
					if (!notificationId) throw new Error('missing params');
					try {
						/**
						 * 	Find the Notification that is to be marked as read
						 *	by the notificationId send from the user.
						 *	Update the value 'read' to true.
						 */
						await Notification.updateOne({ _id: notificationId }, { $set: { read: true } });
					} catch (err) {
						console.log(err);
					}
				});
				socket.on('NEW_CHAT_MESSAGE', async ({ toId, fromId, message }) => {
					if (!toId || !fromId || !message) throw new Error('missing params');
					try {
						/**
						 *	Here we get socketUserIds from fromId and toId to send the emit to both
						 * 	users when a chatmessage is sent. We also get get the fullname.
						 */
						const { socketUserId: toSocketUserId, fullname: toFullName } = await User.findOne({ _id: toId });
						const { socketUserId: fromSocketUserId, fullname: fromFullName } = await User.findOne({ _id: fromId });

						/**
						 *	We create a new Message from the Message Schema, We include all required params.
						 *	We have two different dates, one for the client to use and one regular date.
						 */

						const NEW_CHAT_MESSAGE = new Message({
							toFullName,
							fromFullName,
							fromId,
							toId,
							message,
							date: new Date(),
							userDate: dayjs(new Date()).format('MMM, DD, HH:mm:ss'),
						});

						/**
						 * Save new chatmessage to Database.
						 */
						await NEW_CHAT_MESSAGE.save();

						/**
						 * Emit back the new chatmessage to both users.
						 */
						this.io.to(toSocketUserId).emit('NEW_CHAT_MESSAGE', NEW_CHAT_MESSAGE);
						this.io.to(fromSocketUserId).emit('NEW_CHAT_MESSAGE', NEW_CHAT_MESSAGE);
					} catch (err) {
						console.log(err);
					}
				});
				/**
				 *	This is used when a user is starting a chat, in order to get all the previous chatmessages
				 *	 sent between the two.
				 */
				socket.on('GET_CHAT_HISTORY', async ({ toId, fromId, name }) => {
					if (!toId || !fromId || !name) throw new Error('missing params');

					try {
						/**
						 *	Get the current socketUserId from the client requesting the history.
						 */
						const { socketUserId: fromSocketUserId } = await User.findOne({ _id: fromId });

						/**
						 *  Here we find all the chatmessages between the two users. the user(fromId) and the
						 *  recieving user (toID).
						 */

						const FOUND_CHAT_HISTORY = await Message.find({ fromId: { $in: [fromId, toId] }, toId: { $in: [fromId, toId] } });

						/**
						 * Emit back all messages to the user to be handled. We also send back some neccessary params
						 */

						this.io.to(fromSocketUserId).emit('USER_CHAT_HISTORY', { history: FOUND_CHAT_HISTORY, toId, fromId, name });
					} catch (err) {
						console.log(err);
					}
				});
			});
	}
	handleChat() {
		this.io.on('connect', async (socket) => {
			console.log('chat user connected');
		});
	}
}

module.exports = SocketConnection;
