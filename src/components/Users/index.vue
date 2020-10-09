<template>
	<div id="users">
		<div class="header">Users</div>
		<div v-for="user in GET_ALL_USERS" :key="user._id">
			<div class="user-container" @click="activateChat(user.fullname, user._id)" :class="{ offline: !user.online }">
				<!-- <div class="user-container" @click="sendNotification(user._id, user.fullname) -->
				<div class="user-icon">
					<span class="mdi mdi-account"></span>
				</div>
				<span class="user">{{ user.fullname }}</span>
				<div class="status" :class="{ online: user.online }"></div>
			</div>
		</div>
	</div>
</template>
<script>
import { bus } from '@/main';
import { mapGetters } from 'vuex';
export default {
	name: 'Users',
	props: {
		socket: Object,
		userId: String,
	},
	data: () => ({
		allUsers: [],
	}),
	created() {
		// this.socket.on("GET_ALL_USERS", ({ payload }) => {
		//     this.allUsers = payload.data.filter(
		//         (user) => user._id != this.userId
		//     );
		// });
		// this.socket.on("USER_ONLINE", ({ id }) => {
		//     for (let user of this.allUsers) {
		//         if (user._id == id) user.online = true;
		//     }
		// });
		// this.socket.on("USER_OFFLINE", ({ id }) => {
		//     for (let user of this.allUsers) {
		//         if (user._id === id) user.online = false;
		//     }
		// });
		// this.socket.on("ERROR", (payload) => {
		//     console.log(payload);
		// });
	},
	methods: {
		activateChat(name, id) {
			bus.$emit('newActiveChat', { name, id });
		},
	},
	computed: {
		...mapGetters(['GET_ALL_USERS']),
	},
};
</script>

<style lang="scss" scoped>
#users {
	float: left;
	width: 100%;

	margin-top: 20px;
	.header {
		font-weight: 500;
		color: #fff;
		font-size: 14px;
		margin-bottom: 10px;
	}
	.user-container {
		border-radius: 30px;
		padding: 5px 20px 5px 5px;
		margin-bottom: 15px;
		font-weight: 600;
		font-size: 0.9em;
		width: auto;
		display: flex;
		float: left;
		align-items: center;
		color: rgb(241, 241, 241);
		transition: all 0.2s ease;
		position: relative;
		cursor: pointer;
		.user-icon {
			background: rgb(57, 182, 255);
			width: 25px;
			height: 25px;
			float: left;
			border-radius: 50%;
			display: flex;
			color: #fff;
			span {
				margin: auto;
				font-size: 1.1em;
				color: rgb(255, 255, 255);
			}
		}
		&.offline {
			opacity: 0.5;
		}
		&:hover {
			background: #ffffff18;
			.online {
				border: 2px solid #2d2d30;
			}
		}

		.user {
			margin-left: 10px;
			font-size: 1em;
			flex: 1;
			font-weight: 500;
		}
		.online {
			background: rgb(48, 225, 63);
			width: 12px;
			height: 12px;
			border-radius: 12px;
			position: absolute;
			margin-right: 5px;
			border: 2px solid #2f3136;
			bottom: 0px;
			left: 20px;
		}
		i {
			color: #f3c442;
			font-size: 2.5em;
		}
	}
}
</style>
