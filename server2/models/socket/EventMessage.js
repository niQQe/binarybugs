class EventMessage {
	constructor({ res, message }) {
		console.log('EVENTMESSAGE')
		console.log(res, message)
		return {
			status: 200,
			responseMessage: message.payload.responseMessage,
			group:message.group,
			target: message.socketId,
			recieved:message.payload,
			payload: {
				data: res,
			},
		};
	}
}

module.exports = EventMessage;
