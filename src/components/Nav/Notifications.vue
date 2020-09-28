<template>
    <div id="nofications">
        <div
            id="global-notifications-icon"
            @click="showNotifications = !showNotifications"
        >
            <i class="material-icons">notifications</i>
            <div class="notification-dot" v-if="newNotices > 0" style>
                <span class="notification-counter">{{ newNotices }}</span>
            </div>
        </div>
        <div v-if="showNotifications" id="notification-dropdown">
            <div class="header">Notifications</div>
            <div
                v-for="(notice, index) in notifications"
                :key="index"
                class="notification"
            >
                <span class="name">{{ notice.fromFullName }}</span>
                <span>{{ notice.value }}</span>
                <span class="date">{{ getRelativeDate(notice.date) }}</span>
                <div class="mark-as-read-container">
                    <span
                        class="markasread-dot"
                        v-if="!notice.read"
                        @click="markAsRead(notice._id, index)"
                    ></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

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
    watch: {
        notifications(v) {
            console.log(v);
        },
    },
    mounted() {
        dayjs.extend(relativeTime);

        this.socket.emit("request", {
            type: "find-by-id",
            group: false,
            payload: {
                key: "toId",
                responseMessage: "ALL_USER_NOTIFICATIONS",
                collection: "Notification",
            },
        });
        this.socket.on("ALL_USER_NOTIFICATIONS", ({ payload }) => {
            this.notifications = payload.data.reverse();
            this.notifications.forEach((notice) =>
                !notice.read ? this.newNotices++ : null
            );
            console.log(this.notifications);
        });
        this.socket.on("NEW_NOTIFICATION", (data) => {
            this.notifications.unshift(data.payload.data);
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
                group: false,
                payload: {
                    _id: id,
                    key: "read",
                    value: true,
                    responseMessage: "NOTIFICATION_MARKED_AS_READ",
                    collection: "Notification",
                },
            });
        },
        getRelativeDate(date) {
            return dayjs(date).fromNow();
        },
    },
};
</script>

<style lang="scss" scoped>
#nofications {
    position: relative;
    #global-notifications-icon {
        color: #ffffff;
        float: right;
        position: relative;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        background: #242526;
        cursor: pointer;
        transition: all 0.2s ease;
        &:hover {
            background: #ffffff31;
        }
        i {
            font-size: 16px;
            margin: auto;
        }
        .notification-dot {
            width: 15px;
            height: 15px;
            border-radius: 50%;
            background: rgb(255, 75, 75);
            color: #fff;
            position: absolute;
            top: -4px;
            right: -4px;
            font-size: 10px;
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
        width: 300px;
        max-height: 600px;
        min-height: 600px;
        overflow: auto;
        border-radius: 10px;
        right: 0px;
        background: #242526;
        border: 1px solid rgba(255, 255, 255, 0.055);
        box-shadow: 0px 8px 20px 0px #000000;
        padding: 10px;
        .header {
            font-weight: 600;
            text-align: left;
            margin-bottom: 10px;
        }
        .notification {
            padding: 10px;
            text-align: left;
            position: relative;
            border-radius: 7px;
            font-size: 0.8em;
            padding-right: 30px;
            color: #ffffffab;
            cursor: pointer;
            float: left;
            .name {
                color: #fff !important;
                font-weight: 600;
                margin-right: 5px;
            }
            .date {
                width: 100%;
                float: left;
                font-weight: 600;
                color: #39b6ff;
            }
            &:hover {
                background: #ffffff1c;
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
    }
}
</style>