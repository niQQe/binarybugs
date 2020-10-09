const ErrorHandler = require('./ErrorHandler');
const EventMessage = require('./EventMessage');

class ChatHistoryHandler {
	constructor(collections, eventBus, _id) {
		this.collections = collections;
		this.eventBus = eventBus;
		this._id = _id;
	}
	async handle(message) {
		try{
            await this.collections[message.payload.collection]
                .find({ fromId: { $in: [this._id, message.payload.toId] }, toId: { $in: [this._id, message.payload.toId] } })
                .exec((err, res ) => {
                    message.payload.fromId = this._id
                    if(!err){
                        this.eventBus.next({
                            ...new EventMessage(res, message )
                        });
                    } else {
                        this.eventBus.next({
                            ...new ErrorHandler( err, message )
                        });
                    }
                });

        }catch(err){
            console.log(err)
        }

	}
}

ChatHistoryHandler.TYPE = 'chat-history';

module.exports = ChatHistoryHandler;
