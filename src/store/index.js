import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

class ProjectTemplate {
	constructor(data) {
		this.data = data;
		return {
			name: data.name,
			id: String(data._id),
			created: data.created,
			createdBy: data.createdBy,
			total: 0,
			critical: {
				amount: 0,
				percentage: 0,
			},
			severe: {
				amount: 0,
				percentage: 0,
			},
			easy: {
				amount: 0,
				percentage: 0,
			},
			nth: {
				amount: 0,
				percentage: 0,
			},
		};
	}
}

const store = new Vuex.Store({
	state: {
		userInfo: {},
		all_bugs: {},
		project_bugs: [],
		originalBugs: [],
		projects: [],
		users: [],
		notifications: [],
		activeChats: [],
	},
	getters: {
		GET_ALL_PROJECTS: (state) => state.projects,
		GET_ACTIVE_CHATS: (state) => state.activeChats,
		GET_ALL_USERS: (state) => state.users,
		GET_ALL_BUGS_IN_PROJECT: (state) => state.project_bugs.reverse(),
		GET_ALL_BUGS: (state) => state.all_bugs,
		GET_ALL_NOTIFICATIONS: (state) => state.notifications.sort((a, b) => new Date(b.created) - new Date(a.created)),
		GET_USER_INFO: (state) => state.userInfo,
	},
	actions: {
		setAllProjects({ commit }, { data }) {
			commit('SET_ALL_PROJECTS', data);
		},
		setAllBugsInProject({ commit }, { data }) {
			console.log(data);
			commit('SET_ALL_BUGS_IN_PROJECT', data);
		},
		setAllBugs({ commit }, { data }) {
			commit('SET_ALL_BUGS', data);
		},
		setAllUsers({ commit }, { data }) {
			commit('SET_ALL_USERS', data);
		},
		setUserOnline({ commit }, data) {
			console.log(data);
			commit('SET_USER_ONLINE', data.id);
		},
		setUserOffline({ commit }, data) {
			commit('SET_USER_OFFLINE', data.id);
		},
		setAllNotifications({ commit }, { data }) {
			commit('SET_ALL_NOTIFICATIONS', data);
		},
		setNewNotification({ commit }, { data }) {
			commit('SET_NEW_NOTIFICATION', data);
		},
		setNotificationAsRead({ commit }, { data }) {
			commit('SET_NOTIFICATION_AS_READ', data._id);
		},
		setNewProject({ commit }, { data }) {
			commit('SET_NEW_PROJECT', data);
		},
		setNewBug({ commit }, { data }) {
			console.log(data);
			commit('SET_NEW_BUG', data);
			commit('SET_NEW_BUG_TO_PROJECT', data);
		},
		setBugAsResolved({ commit }, { data }) {
			commit('SET_BUG_AS_RESOLVED', { id: data._id, resolved_at: data.keys.resolved_at });
		},
		setBugAsActive({ commit }, { data }) {
			commit('SET_BUG_AS_ACTIVE', { id: data._id, resolved_at: data.keys.resolved_at });
		},
		setUserInfo({ commit }, data) {
			commit('SET_USER_INFO', data);
		},
		setResolvedBugs({ commit }) {
			commit('SET_RESOLVED_BUGS');
		},
		setActiveBugs({ commit }) {
			console.log('SETACTIVEBUGS');
			commit('SET_ACTIVE_BUGS');
		},
		setChatHistory({ commit }, data) {
			console.log(data);
			commit('SET_CHAT_HISTORY', data);
		},
		setNewChatMessage({ commit }, { data }) {
			commit('SET_NEW_CHAT_MESSAGE', data);
		},
	},
	mutations: {
		SORT: (state, header) => state.project_bugs.sort((a, b) => (a[header] < b[header] ? -1 : 1)),
		SET_ALL_PROJECTS: (state, data) => (state.projects = data),
		SET_ALL_BUGS_IN_PROJECT: (state, data) => ((state.project_bugs = data), (state.originalBugs = data)),
		SET_ALL_BUGS: (state, data) => (state.all_bugs = data),
		SET_ALL_USERS: (state, data) => (state.users = data),
		SET_ALL_NOTIFICATIONS: (state, data) => (state.notifications = data),
		SET_NEW_NOTIFICATION: (state, data) => state.notifications.push(data),
		SET_USER_ONLINE: (state, id) => state.users.forEach((user) => (user._id == id ? (user.online = true) : null)),
		SET_USER_OFFLINE: (state, id) => state.users.forEach((user) => (user._id == id ? (user.online = false) : null)),
		SET_NEW_PROJECT: (state, data) => state.projects.push(new ProjectTemplate(data)),
		SET_NEW_BUG: (state, data) => (state.project_bugs.push(data), state.all_bugs.push(data)),
		SET_NEW_BUG_TO_PROJECT: (state, data) =>
			state.projects.forEach((project) => {
				if (project.id === data.projectid) {
					project.bugs.forEach((bug) => {
						if (bug.category === data.category) {
							bug.amount++;
						}
					});
					project.amount++;
				}
			}),
		SET_USER_INFO: (state, data) => (state.userInfo = data),
		SET_BUG_AS_RESOLVED: (state, data) => {
			state.project_bugs.forEach((bug) => {
				if (bug._id === data.id) {
					bug.resolved = true;
					bug.resolved_at = data.resolved_at;
				}
			});
			state.all_bugs.forEach((bug) => {
				if (bug._id === data.id) {
					bug.resolved = true;
					bug.resolved_at = data.resolved_at;
				}
			});
		},
		SET_BUG_AS_ACTIVE: (state, data) => {
			state.project_bugs.forEach((bug) => {
				if (bug._id === data.id) {
					bug.resolved = false;
					bug.resolved_at = '';
				}
			});
			state.all_bugs.forEach((bug) => {
				if (bug._id === data.id) {
					bug.resolved = false;
					bug.resolved_at = '';
				}
			});
		},
		SET_RESOLVED_BUGS: (state) => (state.bugs = state.originalBugs.filter((bug) => bug.resolved)),
		SET_NOTIFICATION_AS_READ: (state, id) => state.notifications.forEach((notice) => (notice._id == id ? (notice.read = true) : null)),
		SET_CHAT_HISTORY: (state, payload) => {
			const CHAT_ALREADY_IN_ACTIVE_CHATS = state.activeChats.some((chat) => chat.toId === payload.recieved.toId);

			if (!CHAT_ALREADY_IN_ACTIVE_CHATS) {
				state.activeChats.unshift({
					name: payload.recieved.name,
					toId: payload.recieved.toId,
					fromId: payload.recieved.fromId,
					message: '',
					messages: [...payload.data],
					minimized: false,
					newChatMessage: false,
				});
			}
		},
		SET_CHAT_CLOSED: (state, index) => state.activeChats.splice(index, 1),
		SET_CHAT_MINIMIZED: (state, index) => (state.activeChats[index].minimized = !state.activeChats[index].minimized),
		SET_EXPAND_CHAT: (state, index) => (state.activeChats[index].minimized = false),
		SET_ALERT_REMOVE: (state, index) => (state.activeChats[index] ? (state.activeChats[index].newChatMessage = false) : null),
		SET_NEW_CHAT_MESSAGE: (state, payload) => {
			const MERGE_IDS = (fromId, toId) => [fromId, toId].sort().join``;

			const INC_IDS = MERGE_IDS(payload.fromId, payload.toId);

			if (state.activeChats.length > 0) {
				for (let chat of state.activeChats) {
					if (MERGE_IDS(chat.toId, chat.fromId) === INC_IDS) {
						chat.newChatMessage = true;
						chat.messages.push(payload);
						
					} else {
						// this.activateChat(payload.fromFullName, payload.fromId);
						Vue.prototype.$socket.emit({
							type: 'chat-history',
							group: false,
							payload: {
								toId: payload.fromId,
								fromId: state.userInfo._id,
								name: payload.fromFullName,
								storeAction: 'setChatHistory',
								collection: 'Message',
							},
						});
					}
				}
			} else {
				Vue.prototype.$socket.emit({
					type: 'chat-history',
					group: false,
					payload: {
						toId: payload.fromId,
						fromId: state.userInfo._id,
						name: payload.fromFullName,
						storeAction: 'setChatHistory',
						collection: 'Message',
					},
				});
			}
		},
	},
});

export default store;
