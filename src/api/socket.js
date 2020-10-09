import io from 'socket.io-client';

export default class Socket {
	constructor(store) {
		this.store = store;
		this.socket = io('http://localhost:4000/', {
			query: {
				token: JSON.parse(localStorage.getItem('site_info')).token,
			},
		});
		this.initEmitListeners();
	}
	initEmitListeners() {
		this.socket.on('UPDATE', (message) => {
			console.log(message);
			this.store.dispatch(message.storeAction, { data: message.payload.data, recieved: message.recieved });
		});
	}
	async emit(message) {
		this.socket.emit('request', message);
	}
}
