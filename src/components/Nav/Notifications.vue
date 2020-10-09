<template>
	<div id="nofications">
		<button class="global-notifications-icon" @click="showNotifications = !showNotifications">
			<i class="material-icons">notifications</i>
			<div class="notification-dot" v-if="unreadNotices > 0" style>
				<span class="notification-counter">{{ unreadNotices }}</span>
			</div>
		</button>
		<div v-if="showNotifications" id="notification-dropdown" v-on-clickaway="hideNotifications">
			<div class="header">Notifications</div>
			<div v-for="(notice, index) in GET_ALL_NOTIFICATIONS" :key="index" class="notification-container" @click="goToAndMarkAsRead(notice)">
				<div class="user-icon-container">
					<div class="user-icon">
						<span>{{ getIconShorts(notice.fromFullName) }}</span>
					</div>
				</div>
				<div class="notification-message">
					<span class="name">{{ notice.fromFullName }} </span>
					<span>{{ notice.value }}</span>
					<span class="date">{{ getRelativeDate(notice.date) }}</span>
					<div class="mark-as-read-container">
						<span class="markasread-dot" v-if="!notice.read" @click.stop="markAsRead(notice)"></span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { mixin as clickaway } from 'vue-clickaway';
import { mapGetters } from 'vuex';

export default {
	name: 'Notifications',
	props: {
		socket: Object,
	},
	mixins: [clickaway],
	data: () => ({
		showNotifications: false,
		newNotices: 0,
		notifications: null,
		unreadNotices: 0,
	}),
	watch: {
		GET_ALL_NOTIFICATIONS: {
			handler: function(notices) {
				this.unreadNotices = notices.filter((notice) => !notice.read).length;
			},
			immediate: true,
			deep: true,
		},
	},
	mounted() {
		dayjs.extend(relativeTime);
	},
	methods: {
		hideNotifications() {
			this.showNotifications = false;
		},
		markAsRead(notice) {
			this.$socket.emit({
				type: 'update-one',
				group: false,
				payload: {
					_id: notice._id,
					keys: {
						read: true,
					},
					storeAction: 'setNotificationAsRead',
					collection: 'Notification',
				},
			});
		},
		getRelativeDate(date) {
			return dayjs(date).fromNow();
		},
		goToAndMarkAsRead(notice) {
			if (!notice.read) {
				this.markAsRead(notice);
			}
			if (notice.projectId != this.$route.path.substring(1)) {
				this.$router.push({ path: notice.projectId });
				this.showNotifications = false;
			}
		},
		getIconShorts(name) {
			const [first, second] = name.split` `.join``.split``;
			return `${first}${second}`;
		},
	},
	computed: {
		...mapGetters(['GET_ALL_NOTIFICATIONS']),
	},
};
</script>

<style lang="scss" scoped>
#nofications {
	position: relative;
	.global-notifications-icon {
		color: #ffffffc2;
		background: transparent;
		border: none;
		float: right;
		position: relative;
		border-radius: 50%;
		display: flex;
		transition: all 0.2s ease;
		width: 40px;
		height: 40px;
		&:hover {
			color: #fff;
		}
		&:active {
			background: #313233;
			color: #fff;
			outline: none !important;
			border: none !important;
		}
		&:focus {
			background: #313233;
			outline: none !important;
			color: #fff;
		}
		cursor: pointer;
		i {
			font-size: 24px;
			margin: auto;
		}
		.notification-dot {
			width: 17px;
			height: 17px;
			border-radius: 50%;
			background: rgb(255, 75, 75);
			color: #fff;
			position: absolute;
			top: 0px;
			right: 0px;
			font-size: 11px;
			display: flex;
			.notification-counter {
				margin: auto;
				line-height: 1;
				font-weight: 700;
			}
		}
	}
	#notification-dropdown {
		position: absolute;
		color: #fff;
		top: 43px;
		width: 350px;
		max-height: 800px;
		min-height: 600px;
		overflow: auto;
		border-radius: 10px;
		right: 0px;
		background: #1b1c1d;
		box-shadow: 0px 8px 20px 0px #000000;
		padding: 10px;
		.header {
			font-weight: 500;
			text-align: left;
			margin-bottom: 10px;
			padding: 10px;
		}
		.notification-container {
			padding: 10px;
			text-align: left;
			position: relative;
			border-radius: 7px;
			font-size: 0.8em;
			padding-right: 45px;
			color: #ffffffab;
			display: flex;
			cursor: pointer;
			float: left;
			.user-icon-container {
				width: 50px;
				display: flex;
				padding-top: 5px;
				float: left;
				.user-icon {
					float: left;
					border-radius: 30px;
					width: 30px;
					height: 30px;
					background: #39b6ff;
					display: flex;
					span {
						margin: auto;
						color: #fff;
						line-height: 1;
						font-size: 17px;
					}
				}
			}
			.notification-message {
				padding-left: 10px;
				.name {
					color: #fff !important;
					font-weight: 500;
					margin-right: 3px;
				}
				.date {
					width: 100%;
					float: left;
					margin-top: 5px;
					font-weight: 500;
					color: #39b6ff;
				}
				.mark-as-read-container {
					position: absolute;
					right: 10px;
					top: 0px;
					height: 100%;
					width: 20px;
					display: flex;
					.markasread-dot {
						margin: auto;
						width: 12px;
						height: 12px;
						border-radius: 50%;
						background: #39b6ff;
						cursor: pointer;
					}
				}
			}
			&:hover {
				background: #ffffff1c;
			}
		}
	}
}
</style>
