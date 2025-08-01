<template>
	<div id="chat-bar" style>
		<div
			v-for="(chat, index) in GET_ACTIVE_CHATS"
			:key="chat.id"
			class="chat-container"
			:class="{
				minimized: chat.minimized,
				alert: chat.minimized && chat.newChatMessage,
			}"
			@click="removeAlert(index)"
		>
			<div class="chat">
				<div class="user-container">
					<i class="mdi mdi-chat" style="color: #39b6ff"></i>

					<span class="user" @click="expandChat(index)">{{ chat.name }}</span>
					<div class="chat-actions-container">
						<div class="chat-actions-btn minimize-chat" @click="closeChat(index)">
							<span class="mdi mdi-close"></span>
						</div>
						<div class="chat-actions-btn hide-chat" @click="minimizeChat(index)">
							<span class="mdi" :class="chat.minimized ? 'mdi-chevron-up' : 'mdi-minus'"></span>
						</div>
					</div>
				</div>
				<div class="overflow-container" v-chat-scroll>
					<div id="messages-container">
						<div v-for="data in chat.messages" :class="data.fromId === userId ? 'from' : 'to'" class="single-message-container" :key="data._id">
							<span class="timestamp">{{ data.userDate }}</span>
							<div class="message">{{ data.message }}</div>
						</div>
					</div>
				</div>
				<div class="input-container">
					<input
						@keyup.enter="
							sendChatMessage(chat.toId, chat.fromFullName);
							chat.message = '';
						"
						v-model="chat.message"
						autofocus
						type="text"
						style="width: 100%; margin: auto"
						placeholder="Aa"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { bus } from '@/main';
import { mapGetters, mapState } from 'vuex';

export default {
	name: 'chatbar',
	props: {
		userId: String,
	},
	data: () => ({}),
	watch: {
		userId(v) {
			console.log(v);
		},
	},
	mounted() {
		bus.$on('newActiveChat', ({ name, id }) => {
			this.activateChat(name, id);
		});
	},
	methods: {
		sendChatMessage(id) {
			const { message } = this.activeChats.find((chat) => chat.toId === id);
			if (message.trim().length > 0) {
				this.$socket.emit({
					type: 'new-chat-message',
					group: false,
					payload: {
						storeAction: 'setNewChatMessage',
						toId: id,
						message,
					},
				});
			}
		},
		activateChat(name, id) {
			this.$socket.emit({
				type: 'chat-history',
				group: false,
				payload: {
					toId: id,
					fromId: this.userId,
					name,
					storeAction: 'setChatHistory',
					collection: 'Message',
				},
			});
		},
		closeChat(index) {
			this.$store.commit('SET_CHAT_CLOSED', index);
		},
		expandChat(index) {
			this.$store.commit('SET_EXPAND_CHAT', index);
		},
		minimizeChat(index) {
			this.$store.commit('SET_CHAT_MINIMIZED', index);
		},
		removeAlert(index) {
			this.$store.commit('SET_ALERT_REMOVE', index);
		},
	},
	computed: {
		...mapGetters(['GET_ACTIVE_CHATS', 'USER_INFO']),
		...mapState(['activeChats']),
	},
};
</script>

<style lang="scss" scoped>
#chat-bar {
	width: 100%;
	position: fixed;
	bottom: 0px;
	height: 60px;
	padding: 0px 280px 0px 0px;
	display: flex;
	align-items: flex-end;
	justify-content: flex-end;
	.chat-container {
		background: #242526;
		border-bottom: none;
		width: 300px;
		height: 413px;
		max-height: 413px;
		font-size: 1em;
		font-weight: 600;
		margin-left: 20px;
		color: #fff;
		display: flex;
		padding: 0px;
		transition: all 0.2s ease;
		border-top-left-radius: 18px;
		border-top-right-radius: 18px;
		box-shadow: 0px 0px 7px 0px #000000;
		.chat {
			width: 100%;
			display: flex;
			flex-direction: column;
			.user-container {
				width: 100%;
				float: left;
				display: flex;
				align-items: center;
				padding: 10px;
				border-bottom: 1px solid rgba(255, 255, 255, 0.055);
				.user {
					margin-left: 10px;
					flex: 1;
					cursor: pointer;
					font-weight: 500;
					font-size: 14px;
				}
				.chat-actions-container {
					display: flex;
					margin-left: auto;

					.chat-actions-btn {
						width: 22px;
						height: 22px;
						background: #ffffff17;
						display: flex;
						border-radius: 20px;
						cursor: pointer;
						transition: all 0.2s ease;
						&:hover {
							background: #ffffff33;
						}
						span {
							color: #fff;
							margin: auto;
							font-size: 13px;
						}
					}
					.minimize-chat {
						margin-right: 10px;
					}
					.hide-chat {
					}
				}
			}
			.overflow-container {
				height: 310px;
				overflow: auto;
				width: calc(100% - 3px);
				#messages-container {
					flex: 1;
					padding: 0px 10px;
					overflow: auto;
					min-height: 303px;
					display: flex;
					justify-content: flex-end;
					flex-direction: column;
					.single-message-container {
						width: 100%;
						float: left;
						margin-bottom: 10px;
						margin-top: 20px;
						position: relative;
						&.from .message {
							float: right;
							background: #198ac5;
						}
						&.from .user {
							right: 0px;
							top: -25px;
						}
						&.to .message {
							float: left;
						}
						&.to .timestamp {
							left: 0px;
						}
						&.from .timestamp {
							right: 0px;
						}
						.user {
							position: absolute;
							font-size: 0.8em;
						}
						.name {
							position: absolute;
							font-size: 0.7em;
							top: -20px;
							left: 0px;
						}
						.message {
							width: auto;
							float: left;
							background: #3e4042ed;
							padding: 5px 15px;
							border-radius: 15px;
							font-weight: 500;
							font-size: 13px;
							position: relative;
						}
						.timestamp {
							position: absolute;
							width: auto;
							top: -20px;
							font-weight: 500;
							font-size: 12px;
							color: #626262;
						}
					}
				}
			}
			.input-container {
				height: 55px;
				margin-top: 5px;
				width: 100%;

				display: flex;
				padding: 10px;
				input {
					background: #161617 !important;
					border-radius: 3px;
					padding: 0px 10px;
					border: none;
					color: #fff;
					height: 100%;
					&:focus {
						outline: none !important;
						background: #0f0f10 !important;
					}
				}
			}
		}
		&.minimized {
			max-height: 45px;
			overflow: hidden;
		}
		&.alert {
			background: #198ac5ed;
		}
	}
}

/* Track */
</style>
