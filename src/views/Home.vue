<template>
    <div id="main">
        <Nav :email="email" :socket="socket" :userId="userId" v-if="socket" />
        <Users :socket="socket" :userId="userId" />
        <div id="main-router-content">
            <transition name="fade" mode="out-in">
                <router-view
                    :key="$route.fullPath"
                    :socket="socket"
                ></router-view>
            </transition>
        </div>
        <Chatbar :socket="socket" :userId="userId" />
        <transition name="fade">
            <CreateProject
                :socket="socket"
                :userId="userId"
                v-if="createNewProjectDialog"
            />
            <CreateBug
                :socket="socket"
                :projectInfo="projectInfo"
                :userId="userId"
                v-if="createNewBugDialog"
            />
        </transition>
    </div>
</template>

<script>
import Nav from "@/components/Nav/";
import Users from "@/components/Users/";
import Chatbar from "@/components/Chatbar/";

import io from "socket.io-client";

import CreateProject from "@/components/Dialogs/Createproject";
import CreateBug from "@/components/Dialogs/Createbug";

import { bus } from "@/main";

export default {
    name: "Home",
    components: {
        Nav,
        Users,
        Chatbar,
        CreateProject,
        CreateBug,
    },
    data: () => ({
        createNewProjectDialog: false,
        createNewBugDialog: false,
        projectId: "",
    }),
    mounted() {},
    created() {
        bus.$on(
            "show-create-new-project-dialog",
            this.openCreateNewProjectDialog
        );
        bus.$on("show-create-new-bug-dialog", ({ projectId, name }) => {
            this.openCreateNewBugDialog({ projectId, name });
        });

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
        openCreateNewBugDialog({ projectId, name }) {
            this.projectInfo = { projectId, name };
            this.createNewBugDialog = !this.createNewBugDialog;
        },
        closeDialog() {
            this.createNewProjectDialog = false;
            this.createNewBugDialog = false;
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
        padding: 20px;
    }
}

#dialog-cover {
    position: absolute;
    width: calc(100% - 260px);
    height: 100%;
    top: 0px;
    left: 0px;
    background: rgba(0, 0, 0, 0.616);
    display: flex;
    z-index: 200;
    padding: 20px;
}

input,
textarea,
select {
    background: #18191a !important;
    border: 1px solid #3b3f44 !important;
    color: #fff;
    width: 100%;
    min-width: 100%;
    font-size: 1em !important;
    &:hover {
        border: 1px solid rgba(57, 182, 255, 0.445) !important;
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

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-active {
    opacity: 0;
}
</style>