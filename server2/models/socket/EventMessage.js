class EventMessage {
	constructor({ res, message }) {
		return {
			status: 200,
			responseMessage: message.payload.responseMessage,
			target: message.socketId,
			recieved:message.payload,
			payload: {
				data: res,
			},
		};
	}
}

module.exports = EventMessage;
