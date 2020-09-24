<template>
    <div id="main">
        <Nav :email="email" :socket="socket" :userId="userId" v-if="socket" />
        <Users :socket="socket" :userId="userId" />
        <div id="main-router-content">
            <router-view :key="$route.fullPath"></router-view>
        </div>
        <Chatbar :socket="socket" :userId="userId" />
    </div>
</template>

<script>
import Nav from "@/components/Nav/";
import Users from "@/components/Users/";
import Chatbar from "@/components/Chatbar/";

import io from "socket.io-client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export default {
    name: "Home",
    components: {
        Nav,
        Users,
        Chatbar,
    },
    data: () => ({
        allUsers: [],
        notifications: [],
        notificationData: [],
        socket: null,
        newNotices: 0,
        showNotifications: false,
        userId: "",
        latestSent: "",
    }),
    mounted() {},
    created() {
        this.userId = JSON.parse(localStorage.getItem("site_info"))._id;
        this.email = JSON.parse(localStorage.getItem("site_info")).email;
        console.log(this.userId);

        this.socket = io("http://localhost:4000/", {
            query: {
                token: JSON.parse(localStorage.getItem("site_info")).token,
            },
        });
    },
    watch: {},
    methods: {},
};
</script>

<style lang="scss">
::-webkit-scrollbar {
    width: 10px;
    padding: 5px;
}

#main {
    width: 100%;
    float: left;
    height: 100%;
    padding-top: 60px;
    padding-right: 260px;
    #main-router-content {
        float: left;
        width: 100%;
        height: 100%;
        #content {
            width: 100%;
            height: 100%;
            padding: 20px;
        }
    }
}


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