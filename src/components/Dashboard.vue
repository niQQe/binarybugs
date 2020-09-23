<template>
    <div style="width:100%;height:100%;">
        <nav>
            <div class="logo">Binary Bugs {{ email }} {{ test }}</div>
            <div id="global-notifications-icon" @click="showNotifications = true">
                <i class="material-icons">notifications</i>
                <div class="notification-dot" v-if="newNotices > 0" style>
                    <span class="notification-counter">{{ newNotices }}</span>
                </div>
                <div v-if="showNotifications" id="notification-dropdown">
                    <div class="header">Notifications</div>
                    <div v-for="(notice, index) in notifications" :key="index" class="notification">
                        {{ notice.value }} {{ notice.date }}
                        <div
                            v-for="(user, key) in notice.sender"
                            :key="user._id"
                        >{{ key === 'fullname' ? user : null }}</div>
                        <span
                            class="markasread-dot"
                            v-if="!notice.read"
                            @click="markedAsRead(notice._id,index);"
                        ></span>
                    </div>
                </div>
            </div>
        </nav>
        <div id="users">
            <div class="header">Users</div>
            <div v-for="user in allUsers" :key="user._id">
                <div
                    class="user-container"
                    @click="activateChat(user.fullname, user._id)"
                    :class="{ offline: !user.online }"
                >
                    <!-- <div class="user-container" @click="sendNotification(user._id, user.fullname) -->
                    <i class="mdi mdi-code-braces-box"></i>
                    <span
                        class="user"
                        @click="sendNotification(user._id, user.fullname)"
                    >{{ user.fullname }}</span>
                    <div class="status" :class="{ online: user.online }"></div>
                </div>
            </div>
        </div>
        <div
            style="height:100%;width:100%;float:left;padding-top:60px;padding-right:260px;display:flex;"
        >
            <div style="width:90%;height:80%;margin:auto;display:flex;flex-direction:column;">
                <div class="header-container" style="width:100%;float:left;height:100%;flex:0;">
                    <div
                        class="header"
                        style="color:#fff;padding:20px;font-size:2em;color:#f3c442;flex:none;font-weight:700;"
                    >Projects</div>
                </div>
                <div class="projects-container" style="height:100%;float:left;">
                    <div
                        v-for="(project, index) in projects"
                        class="project-container"
                        :key="index"
                    >
                        <div
                            class="project-card"
                        >
                            <span class="project-header">{{ project.name}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom-bar" style>
            <div
                v-for="(chat, index) in activeChats"
                :key="chat.id"
                class="chat-container"
                :class="{minimized: chat.minimized, alert: chat.minimized && chat.newChatMessage }"
                @click="removeAlert(index)"
            >
                <div class="chat">
                    <div class="user-container">
                        <i class="mdi mdi-chat" style="color:#f3c442;"></i>
                        <span class="user" @click="expandChat(index)">{{ chat.name }}</span>
                        <div class="chat-actions-container">
                            <div class="chat-actions-btn minimize-chat">
                                <span class="mdi mdi-close" @click="hideChat(index)"></span>
                            </div>
                            <div class="chat-actions-btn hide-chat">
                                <span
                                    class="mdi"
                                    :class="chat.minimized  ? 'mdi-chevron-up' : 'mdi-minus'"
                                    @click="minimizeChat(index)"
                                ></span>
                            </div>
                        </div>
                    </div>
                    <div class="overflow-container" v-chat-scroll>
                        <div id="messages-container">
                            <div
                                v-for="(data) in chat.messages"
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
                            @keyup.enter="sendChatMessage(chat.toId, chat.fromFullName); chat.message = ''"
                            v-model="chat.message"
                            autofocus
                            type="text"
                            style="width:100%;margin:auto;"
                            placeholder="Aa"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import io from "socket.io-client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

let socket = "";

export default {
    data: () => ({
        allUsers: [],
        notifications: [],
        notificationData: [],
        projects: [
            {
                name: "Livenation",
            },
            {
                name: "COOP",
            },
            {
                name: "KRAFT",
            },
            {
                name: "McDonalds",
            },
            {
                name: "Livenation",
            },
            {
                name: "COOP",
            },
            {
                name: "KRAFT",
            },
            {
                name: "McDonalds",
            },
        ],
        newNotices: 0,
        showNotifications: false,
        activeChats: [],
        userId: "",
        latestSent: "",
        test: 0,
    }),
    mounted() {
        this.handleSocketData();
        this.getAllUsers();
        this.getUserNotifications();
    },
    created() {
        this.userId = JSON.parse(localStorage.getItem("site_info"))._id;
        this.email = JSON.parse(localStorage.getItem("site_info")).email;
    },
    watch: {},
    methods: {
        handleSocketData() {
            socket = io("http://localhost:4000/", {
                query: {
                    token: JSON.parse(localStorage.getItem("site_info")).token,
                },
            });

            /**
             *  GET RESPONSES
             */

            socket.on("ALL_USERS", (message) => {
                console.log(message);
                this.allUsers = message.payload.data.filter(
                    (user) => user._id != this.userId
                );
            });

            socket.on("ALL_USER_NOTIFICATIONS", (message) => {
                console.log(message);
                this.notifications = message.payload.data.reverse();
                this.notifications.forEach((notice) =>
                    !notice.read ? this.newNotices++ : null
                );
            });

            /**
             *  WATCHERS
             */

            socket.on("USER_ONLINE", ({ id }) => {
                for (let user of this.allUsers) {
                    if (user._id == id) user.online = true;
                }
            });

            socket.on("USER_OFFLINE", ({ id }) => {
                for (let user of this.allUsers) {
                    if (user._id === id) user.online = false;
                }
            });

            socket.on("ERROR", (payload) => {
                console.log(payload);
            });

            socket.on("NOTIFICATION_MARKED_AS_READ", (payload) => {
                this.notifications[this.currentNotificationIndex].read = true;
                this.newNotices--;
            });

            socket.on("CHAT_HISTORY", (message) => {
                console.log("CHAT HISTORY");
                console.log(message);
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

            /**
             *  UPDATE
             */

            socket.on("NEW_NOTIFICATION", (data) => {
                console.log();
                console.log(data);
                this.notifications.unshift(data);
                this.newNotices++;
            });
            socket.on("NEW_CHAT_MESSAGE", (message) => {
                console.log(message);
                //** CHECK IF CHAT EXISTS */
                const MERGE_IDS = (fromId, toId) =>
                    [fromId, toId].sort().join``;

                const INC_IDS = MERGE_IDS(
                    message.payload.data.fromId,
                    message.payload.data.toId
                );

                if (this.activeChats.length > 0) {
                    for (let chat of this.activeChats) {
                        if (MERGE_IDS(chat.toId, chat.fromId) === INC_IDS) {
                            chat.newChatMessage = true;
                            chat.messages.push(message.payload.data);
                        } else {
                            this.activateChat(
                                message.payload.data.fromFullName,
                                message.payload.data.fromId
                            );
                        }
                    }
                } else {
                    this.activateChat(
                        message.payload.data.fromFullName,
                        message.payload.data.fromId
                    );
                }
            });
        },
        // scrollToEnd() {
        //     var content = this.$refs.overflowcontainer;
        //     content.scrollTop = content.scrollHeight;
        // },
        sendChatMessage(id, fullname) {
            const { message } = this.activeChats.find(
                (chat) => chat.toId === id
            );
            console.log(id);
            if (message.trim().length > 0) {
                socket.emit("request", {
                    type: "new-chat-message",
                    payload: {
                        responseMessage: "NEW_CHAT_MESSAGE",
                        toId: id,
                        message,
                    },
                });
            }
        },
        getAllUsers() {
            socket.emit("request", {
                type: "find-all",
                payload: {
                    responseMessage: "ALL_USERS",
                    collection: "User",
                },
            });
        },
        getUserNotifications() {
            socket.emit("request", {
                type: "find-by-id",
                payload: {
                    key: "toId",
                    responseMessage: "ALL_USER_NOTIFICATIONS",
                    collection: "Notification",
                },
            });
        },
        markedAsRead(id, index) {
            this.currentNotificationIndex = index;
            socket.emit("request", {
                type: "update-one",
                payload: {
                    _id: id,
                    key: "read",
                    value: true,
                    responseMessage: "NOTIFICATION_MARKED_AS_READ",
                    collection: "Notification",
                },
            });
        },
        async getNotifications() {
            try {
                const response = await fetch(
                    "http://192.168.1.121:5000/notifications/",
                    {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            Authorization: JSON.parse(
                                localStorage.getItem("site_info")
                            ).token,
                        },
                    }
                );
                if (response.status == 200) {
                    const notifications = await response.json();
                    this.notifications = notifications.reverse();
                    this.notifications.forEach((notice) =>
                        !notice.read ? this.newNotices++ : null
                    );
                }
            } catch (err) {
                console.log(err);
            }
        },
        sendNotification(id, fullname) {
            socket.emit("NEW_NOTIFICATION", {
                value: "New Notification",
                toId: id,
                date: new Date(),
            });
        },
        activateChat(name, id) {
            console.log(name, id);
            console.log(this.userId);
            socket.emit("request", {
                type: "chat-history",
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
nav {
    width: 100%;
    height: 60px;
    z-index: 10;
    background: #202225;
    top: 0px;
    position: fixed;
    display: flex;
    align-items: center;
    padding: 20px;
    .logo {
        color: #fff;
        font-size: 1.2em;
        font-weight: 600;
    }
    #global-notifications-icon {
        color: #ffffff;
        float: right;
        margin-left: auto;
        position: relative;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        background: #3a3b3c;
        cursor: pointer;
        transition: all 0.2s ease;
        &:hover {
            background: #545557;
        }
        i {
            font-size: 22px;
            margin: auto;
        }
        .notification-dot {
            width: 19px;
            height: 19px;
            border-radius: 50%;
            background: rgb(255, 75, 75);
            color: #fff;
            position: absolute;
            top: -4px;
            right: -4px;
            font-size: 12px;
            display: flex;
            .notification-counter {
                margin: auto;
                line-height: 1;
                font-weight: 700;
            }
        }
        #notification-dropdown {
            position: absolute;
            color: #fff;
            top: 45px;
            width: 300px;
            max-height: 600px;
            overflow: auto;
            border-radius: 3px;
            right: 0px;
            background: #242526;
            border: 1px solid rgba(255, 255, 255, 0.055);
            box-shadow: 0px 2px 5px #0000003b;
            padding: 15px;
            .header {
                font-weight: 600;
                text-align: left;
                margin-bottom: 10px;
            }
            .notification {
                padding: 10px;
                text-align: left;
                position: relative;
                border-radius: 10px;
                cursor: pointer;

                &:hover {
                    background: #545557;
                }
                .markasread-dot {
                    position: absolute;
                    right: 10px;
                    top: 18px;
                    width: 15px;
                    height: 15px;
                    border-radius: 50%;
                    background: #8481ba;
                    cursor: pointer;
                }
            }
        }
    }
}

#users {
    width: 260px;
    position: fixed;
    right: 0px;
    padding: 10px;
    top: 60px;
    z-index: 2;
    height: calc(100% - 60px);
    background: #2f3136;
    .header {
        font-weight: 700;
        color: #b0b3b8;
        padding: 5px 7px;
        margin-bottom: 10px;
    }
    .user-container {
        border-radius: 3px;
        height: 40px;
        padding: 4px;
        margin-bottom: 10px;
        font-weight: 600;
        font-size: 0.9em;
        display: flex;
        align-items: center;
        color: rgb(241, 241, 241);
        transition: all 0.2s ease;
        position: relative;
        cursor: pointer;
        &.offline {
            opacity: 0.5;
        }
        &:hover {
            background: #ffffff18;
        }

        .user {
            margin-left: 10px;
            font-size: 1.2em;
            flex: 1;
        }
        .online {
            background: rgb(61, 202, 72);
            width: 14px;
            height: 14px;
            border-radius: 12px;
            position: absolute;
            margin-right: 5px;
            border: 2px solid #2f3136;
            bottom: 0px;
            left: 25px;
        }
        i {
            color: #f3c442;
            font-size: 2.5em;
        }
    }
}


.projects-container{
    .project-container{
        width:15%;
        height:300px;
        float:left;
        padding:20px;
        .project-card{
            height:100%;
            width:100%;
            border-radius:10px;
            background:#292b2f;
            padding:10px;
            .project-header{
                width:100%;
                float:left;
                color:#b0b3b8;
                text-align:center;
                font-size:1.2em;
                font-weight:700;
                letter-spacing:0.02em;

            }
        }
    }
}

.bottom-bar {
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

::-webkit-scrollbar {
    width: 10px;
    padding: 5px;
}

/* Track */
::-webkit-scrollbar-track {
}

/* Handle */
::-webkit-scrollbar-thumb {
    background: #4d4d4e;
    border-radius: 10px;
    margin-right: 5px;
    right: 5px;
    transition: all 0.2s ease;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: #636364;
}
</style>