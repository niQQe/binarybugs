<template>
    <div id="chat-bar" style>
        <div
            v-for="(chat, index) in activeChats"
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
                    <i class="mdi mdi-chat" style="color: #f3c442"></i>

                    <span class="user" @click="expandChat(index)">{{
                        chat.name
                    }}</span>
                    <div class="chat-actions-container">
                        <div class="chat-actions-btn minimize-chat">
                            <span
                                class="mdi mdi-close"
                                @click="hideChat(index)"
                            ></span>
                        </div>
                        <div class="chat-actions-btn hide-chat">
                            <span
                                class="mdi"
                                :class="
                                    chat.minimized
                                        ? 'mdi-chevron-up'
                                        : 'mdi-minus'
                                "
                                @click="minimizeChat(index)"
                            ></span>
                        </div>
                    </div>
                </div>
                <div class="overflow-container" v-chat-scroll>
                    <div id="messages-container">
                        <div
                            v-for="data in chat.messages"
                            :class="data.fromId === userId ? 'from' : 'to'"
                            class="single-message-container"
                            :key="data._id"
                        >
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
import { bus } from "@/main";

export default {
    name: "chatbar",
    props: {
        socket: Object,
        userId: String,
    },
    data: () => ({
        activeChats: [],
    }),
    watch: {
        userId(v) {
            console.log(v);
        },
    },
    mounted() {
        console.log(this.userId);
        bus.$on("newActiveChat", (...args) => {
            const [name, id] = args;
            this.activateChat(name, id);
        });
        this.socket.on("NEW_CHAT_MESSAGE", ({ payload }) => {
            //** CHECK IF CHAT EXISTS */
            const MERGE_IDS = (fromId, toId) => [fromId, toId].sort().join``;

            const INC_IDS = MERGE_IDS(
                payload.data.fromId,
                payload.data.toId
            );

            if (this.activeChats.length > 0) {
                for (let chat of this.activeChats) {
                    if (MERGE_IDS(chat.toId, chat.fromId) === INC_IDS) {
                        chat.newChatMessage = true;
                        chat.messages.push(payload.data);
                    } else {
                        this.activateChat(
                            payload.data.fromFullName,
                            payload.data.fromId
                        );
                    }
                }
            } else {
                this.activateChat(
                    payload.data.fromFullName,
                    payload.data.fromId
                );
            }
        });
        this.socket.on("CHAT_HISTORY", (message) => {
            console.log(message.recieved);
            const CHAT_ALREADY_IN_ACTIVE_CHATS = this.activeChats.some(
                (chat) => chat.toId === message.recieved.toId
            );

            if (!CHAT_ALREADY_IN_ACTIVE_CHATS) {
                this.activeChats.unshift({
                    name: message.recieved.name,
                    toId: message.recieved.toId,
                    fromId: message.recieved.fromId,
                    message: "",
                    messages: [...message.payload.data],
                    minimized: false,
                    newChatMessage: false,
                });
            }
        });
    },
    methods: {
        sendChatMessage(id) {
            const { message } = this.activeChats.find(
                (chat) => chat.toId === id
            );
            if (message.trim().length > 0) {
                this.socket.emit("request", {
                    type: "new-chat-message",
                    group:false,
                    payload: {
                        responseMessage: "NEW_CHAT_MESSAGE",
                        toId: id,
                        message,
                    },
                });
            }
        },
        activateChat(name, id) {
            console.log(id);
            this.socket.emit("request", {
                type: "chat-history",
                group:false,
                payload: {
                    toId: id,
                    fromId: this.userId,
                    name,
                    responseMessage: "CHAT_HISTORY",
                    collection: "Message",
                },
            });
        },
        hideChat(index) {
            this.$delete(this.activeChats, index);
        },
        expandChat(index) {
            this.activeChats[index].minimized = false;
        },
        minimizeChat(index) {
            this.activeChats[index].minimized = !this.activeChats[index]
                .minimized;
        },
        removeAlert(index) {
            if (this.activeChats[index]) {
                this.activeChats[index].newChatMessage = false;
            }
        },
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
        background: #202225;
        border-bottom: none;
        width: 300px;
        height: 400px;
        max-height: 400px;
        font-size: 1em;
        font-weight: 600;
        margin-left: 20px;
        color: #fff;
        display: flex;
        padding: 0px;
        transition: all 0.2s ease;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
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
                }
                .chat-actions-container {
                    display: flex;
                    margin-left: auto;

                    .chat-actions-btn {
                        width: 25px;
                        height: 25px;
                        background: #ffffff2e;
                        display: flex;
                        border-radius: 20px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        &:hover {
                            background: #545557;
                        }
                        span {
                            color: #fff;
                            margin: auto;
                            height: 40px;
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
                            font-size: 0.88em;
                            position: relative;
                        }
                        .timestamp {
                            position: absolute;
                            width: auto;
                            top: -20px;
                            font-size: 1rem;
                            color: #626262;
                        }
                    }
                }
            }
            .input-container {
                height: 50px;
                width: 100%;
                display: flex;
                padding: 5px;
                input {
                    background: #3a3b3c;
                    border: none;
                    color: #fff;
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