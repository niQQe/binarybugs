class EventMessage {
	constructor(res, message) {
		return {
			status: 200,
			storeAction: message.payload.storeAction,
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
