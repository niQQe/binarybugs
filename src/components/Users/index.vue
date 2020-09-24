<template>
    <div id="users">
        <div class="header">Users</div>
        <div v-for="user in allUsers" :key="user._id">
            <div
                class="user-container"
                @click="activateChat(user.fullname, user._id)"
                :class="{ offline: !user.online }"
            >
                <!-- <div class="user-container" @click="sendNotification(user._id, user.fullname) -->
                <div
                    class="user-icon"
                    style="
                        background: #f3c442;
                        width: 33px;
                        height: 33px;
                        float: left;
                        border-radius: 50%;
                        display: flex;
                    "
                >
                    <span
                        class="mdi mdi-ladybug"
                        style="
                            margin: auto;
                            font-size: 1.5em;
                            color: rgb(47 49 54);
                        "
                    ></span>
                </div>
                <span
                    class="user"
                    @click="sendNotification(user._id, user.fullname)"
                    >{{ user.fullname }}</span
                >
                <div class="status" :class="{ online: user.online }"></div>
            </div>
        </div>
    </div>
</template>
<script>

import { bus } from '@/main'
export default {
    name: "Users",
    props: {
        socket: Object,
        userId: String,
    },
    data: () => ({
        allUsers: [],
    }),
    mounted() {
        this.socket.emit("request", {
            type: "find-all",
            payload: {
                responseMessage: "ALL_USERS",
                collection: "User",
            },
        });
        this.socket.on("ALL_USERS", (message) => {
            console.log(message);
            this.allUsers = message.payload.data.filter(
                (user) => user._id != this.userId
            );
        });
        this.socket.on("USER_ONLINE", ({ id }) => {
            for (let user of this.allUsers) {
                if (user._id == id) user.online = true;
            }
        });

        this.socket.on("USER_OFFLINE", ({ id }) => {
            for (let user of this.allUsers) {
                if (user._id === id) user.online = false;
            }
        });

        this.socket.on("ERROR", (payload) => {
            console.log(payload);
        });
    },
    methods: {
        
        activateChat(name, id) {
            bus.$emit('newActiveChat', name, id)
        },
        sendNotification(id, fullname) {
            this.socket.emit("NEW_NOTIFICATION", {
                value: "New Notification",
                toId: id,
                date: new Date(),
            });
        },
    },
};
</script>

<style lang="scss" scoped>
#users {
    width: 260px;
    position: fixed;
    right: 0px;
    padding: 10px;
    top:0px;
    z-index: 2;
    height: 100%;
    background: #2f3136;
    .header {
        font-weight: 700;
        color: #b0b3b8;
        padding: 5px 7px;
        margin-bottom: 10px;
    }
    .user-container {
        border-radius: 10px;
        height: 50px;
        padding: 4px 10px;
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
            .online {
                border: 2px solid #434449;
            }
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
            bottom: 3px;
            left: 30px;
        }
        i {
            color: #f3c442;
            font-size: 2.5em;
        }
    }
}
</style>