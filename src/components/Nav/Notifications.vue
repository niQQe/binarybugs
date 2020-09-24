<template>
    <div
        id="global-notifications-icon"
        @click="showNotifications = !showNotifications"
    >
        <i class="material-icons">notifications</i>
        <div class="notification-dot" v-if="newNotices > 0" style>
            <span class="notification-counter">{{ newNotices }}</span>
        </div>
        <div v-if="showNotifications" id="notification-dropdown">
            <div class="header">Notifications</div>
            <div
                v-for="(notice, index) in notifications"
                :key="index"
                class="notification"
            >
                {{ notice.value }} {{ notice.date }}
                <div v-for="(user, key) in notice.sender" :key="user._id">
                    {{ key === "fullname" ? user : null }}
                </div>
                <span
                    class="markasread-dot"
                    v-if="!notice.read"
                    @click="markAsRead(notice._id, index)"
                ></span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Notifications",
    props: {
        socket: Object,
    },
    data: () => ({
        showNotifications: false,
        newNotices: 0,
        notifications: null,
    }),
    mounted() {
        this.socket.emit("request", {
            type: "find-by-id",
            payload: {
                key: "toId",
                responseMessage: "ALL_USER_NOTIFICATIONS",
                collection: "Notification",
            },
        });
        this.socket.on("ALL_USER_NOTIFICATIONS", (message) => {
            this.notifications = message.payload.data.reverse();
            this.notifications.forEach((notice) =>
                !notice.read ? this.newNotices++ : null
            );
        });
        this.socket.on("NEW_NOTIFICATION", (data) => {
            console.log();
            console.log(data);
            this.notifications.unshift(data);
            this.newNotices++;
        });
        this.socket.on("NOTIFICATION_MARKED_AS_READ", (payload) => {
            this.notifications[this.currentNotificationIndex].read = true;
            this.newNotices--;
        });
    },
    methods: {
        markAsRead(id, index) {
            this.currentNotificationIndex = index;
            this.socket.emit("request", {
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
    },
};
</script>

<style lang="scss" scoped>
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
</style>