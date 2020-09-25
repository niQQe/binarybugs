<template>
    <div id="main">
        <Nav :email="email" :socket="socket" :userId="userId" v-if="socket" />
        <Users :socket="socket" :userId="userId" />
        <div id="main-router-content">
            <router-view :key="$route.fullPath" :socket="socket"></router-view>
        </div>
        <Chatbar :socket="socket" :userId="userId" />
        <CreateProject :socket="socket" v-if="createNewProjectDialog" />
    </div>
</template>

<script>
import Nav from "@/components/Nav/";
import Users from "@/components/Users/";
import Chatbar from "@/components/Chatbar/";

import io from "socket.io-client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import CreateProject from "@/components/Dialogs/Createproject";

import { bus } from "@/main";

export default {
    name: "Home",
    components: {
        Nav,
        Users,
        Chatbar,
        CreateProject,
    },
    data: () => ({
        createNewProjectDialog: false,
    }),
    mounted() {},
    created() {
        bus.$on(
            "show-create-new-project-dialog",
            this.openCreateNewProjectDialog
        );
        bus.$on("close-dialog", this.closeDialog);
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
    methods: {
        openCreateNewProjectDialog() {
            this.createNewProjectDialog = !this.createNewProjectDialog;
        },
        closeDialog() {
            this.createNewProjectDialog = false;
        },
    },
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
        position: relative;
        padding:20px;
    }
}

input {
    background: #18191a !important;
    border: 1px solid #3b3f44 !important;
    &:hover {
        box-shadow: 0 0 0pt 1px rgba(57, 182, 255, 0.445);
    }
    &:focus {
        box-shadow: 0 0 0pt 1px rgb(57, 182, 255);
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