<template>
    <div id="main">
        <Nav :email="email" :userId="userId" />
        <div id="main-router-content">
            <transition name="fade" mode="out-in">
                <router-view
                    :key="$route.fullPath"
                    :currentProject="currentProject"
                ></router-view>
            </transition>
        </div>
        <Chatbar :userId="userId" />
        <transition name="fade">
            <CreateProject :userId="userId" v-if="createNewProjectDialog" />
            <CreateBug
                :projectInfo="projectInfo"
                :userId="userId"
                v-if="createNewBugDialog"
            />
            <InspectBug v-if="inspectBugDialog" :bugInfo="bugInfo" />
        </transition>
    </div>
</template>

<script>
import Nav from "@/components/Nav/";
import Users from "@/components/Users/";
import Chatbar from "@/components/Chatbar/";

import CreateProject from "@/components/Dialogs/Createproject";
import CreateBug from "@/components/Dialogs/Createbug";
import InspectBug from "@/components/Dialogs/InspectBug";

import { bus } from "@/main";
import { mapActions } from "vuex";

export default {
    name: "Home",
    components: {
        Nav,
        Users,
        Chatbar,
        CreateProject,
        CreateBug,
        InspectBug,
    },
    data: () => ({
        createNewProjectDialog: false,
        createNewBugDialog: false,
        inspectBugDialog: false,
        currentProject: null,
        projectId: "",
        projectInfo: "",
        bugInfo: "",
        userId: "",
        email: "",
    }),
    mounted() {
        this.userId = JSON.parse(localStorage.getItem("site_info"))._id;
        this.email = JSON.parse(localStorage.getItem("site_info")).email;
        const { _id, fullname } = JSON.parse(localStorage.getItem("site_info"));

        this.setUserInfo({ fullname, _id });

        bus.$on(
            "show-create-new-project-dialog",
            this.openCreateNewProjectDialog
        );
        bus.$on("show-create-new-bug-dialog", ({ projectId, name }) => {
            this.openCreateNewBugDialog({ projectId, name });
        });

        bus.$on("close-dialog", this.closeDialog);

        bus.$on("show-inspect-bug-dialog", (bug) => {
            this.openInspectBugDialog(bug);
        });

        this.$socket.emit({
            type: "find-all",
            group: false,
            payload: {
                storeAction: "setAllProjects",
                collection: "Project",
            },
        });
        this.$socket.emit({
            type: "find-all",
            group: false,
            key: "_id",
            payload: {
                storeAction: "setAllUsers",
                collection: "User",
            },
        });
        this.$socket.emit({
            type: "find-all",
            group: false,
            excludeSelf:true,
            payload: {
                storeAction: "setAllNotifications",
                collection: "Notification",
            },
        });
    },

    watch: {},
    methods: {
        ...mapActions(["setUserInfo"]),
        openCreateNewProjectDialog() {
            this.createNewProjectDialog = !this.createNewProjectDialog;
        },
        openCreateNewBugDialog({ projectId, name }) {
            this.projectInfo = { projectId, name };
            this.createNewBugDialog = !this.createNewBugDialog;
        },
        openInspectBugDialog(bug) {
            this.bugInfo = bug;
            this.inspectBugDialog = true;
        },
        closeDialog() {
            this.createNewProjectDialog = false;
            this.createNewBugDialog = false;
            this.inspectBugDialog = false;
        },
        setName(name) {
            this.currentProject = name;
        },
    },
};
</script>

<style lang="scss">
::-webkit-scrollbar {
    width: 10px;
    padding: 5px;
}

.highlight {
    color: #39b6ff !important;
}

#main {
    width: 100%;
    float: left;
    height: 100%;
    padding-top: 50px;
    padding-left: 251px;
    #main-router-content {
        float: left;
        width: 100%;
        height: 100%;
        position: relative;
        padding: 20px 20px 20px 20px;
    }
}

#dialog-cover {
    position: absolute;
    width: calc(100%);
    height: 100%;
    top: 0px;
    left: 0px;
    background: rgba(0, 0, 0, 0.398);
    display: flex;
    z-index: 200;
    padding: 20px;
}

input,
textarea,
select {
    background: transparent !important;
    border: none;
    color: #fff;
    width: 100%;
    max-width: 100%;
    min-width: 100%;
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

// INPUT STYLING

select {
    cursor: pointer;
}

select,
textarea {
    font-size: 14px;
    padding: 8px 10px 8px 2px;
    display: block;
    width: 100%;
    max-width: 1000px !important;
    min-width: 100%;
    border: none;
    border-bottom: 1px solid #757575 !important;
    background: #1c1d1d !important;
}

option {
    background: #1c1d1d;
}

.group {
    position: relative;
    margin-bottom: 18px;

    input,
    textarea {
        background: #1c1d1d !important;
        font-size: 14px;
        padding: 10px 10px 10px 10px;
        display: block;
        width: 100%;
        border: none;
        border-bottom: 1px solid #757575;
    }
    input:focus {
        outline: none;
    }

    /* LABEL ======================================= */
    label {
        font-size: 14px;
        font-weight: normal;
        position: absolute;
        pointer-events: none;
        left: 10px;
        top: 9px;
        transition: 0.2s ease all;
        -moz-transition: 0.2s ease all;
        -webkit-transition: 0.2s ease all;
        color: rgba(255, 255, 255, 0.501) !important;
    }

    /* active state */
    input:focus ~ label,
    input:valid ~ label,
    input:read-only ~ label,
    textarea:focus ~ label,
    textarea:valid ~ label {
        top: -18px;
        left: 0px;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.768) !important;
    }

    /* BOTTOM BARS ================================= */
    .bar {
        position: relative;
        display: block;
        width: 100%;
    }
    .bar:before,
    .bar:after {
        content: "";
        height: 2px;
        width: 0;
        bottom: 1px;
        position: absolute;
        background: #39b6ff;
        transition: 0.2s ease all;
        -moz-transition: 0.2s ease all;
        -webkit-transition: 0.2s ease all;
    }
    .bar:before {
        left: 50%;
    }
    .bar:after {
        right: 50%;
    }

    /* active state */
    input:focus ~ .bar:before,
    input:focus ~ .bar:after,
    textarea:focus ~ .bar:before,
    textarea:focus ~ .bar:after {
        width: 50%;
    }

    /* HIGHLIGHTER ================================== */
    .highlight {
        position: absolute;
        height: 60%;
        width: 100px;
        top: 25%;
        left: 0;
        pointer-events: none;
        opacity: 0.5;
    }

    /* active state */
    input:focus ~ .highlight,
    textarea:focus ~ .highlight {
        -webkit-animation: inputHighlighter 0.3s ease;
        -moz-animation: inputHighlighter 0.3s ease;
        animation: inputHighlighter 0.3s ease;
    }

    /* ANIMATIONS ================ */
    @-webkit-keyframes inputHighlighter {
        from {
            background: #39b6ff;
        }
        to {
            width: 0;
            background: transparent;
        }
    }
    @-moz-keyframes inputHighlighter {
        from {
            background: #39b6ff;
        }
        to {
            width: 0;
            background: transparent;
        }
    }
    @keyframes inputHighlighter {
        from {
            background: #39b6ff;
        }
        to {
            width: 0;
            background: transparent;
        }
    }
}

.form__group {
    position: relative;
    padding: 5px;
    margin-top: 5px;
    margin-bottom: 15px;
    float: left;
    width: 100%;
    textarea {
        min-height: 80px !important;
        height: 80px;
    }
}

.form__field {
    font-family: inherit;
    width: 100%;
    border: 0;
    border-bottom: 1px solid #d2d2d2;
    background: rgba(0, 0, 0, 0.227) !important;
    outline: 0;
    font-size: 14px;
    color: #fff;
    padding: 10px 10px;
    transition: border-color 0.2s;
}

.form__field::placeholder {
    color: transparent;
}

.form__field:placeholder-shown ~ .form__label {
    font-size: 14px;
    cursor: text;
    top: 15px;
    left: 15px;
    color: rgba(255, 255, 255, 0.501) !important;
}

label,
.form__field:focus ~ .form__label {
    position: absolute;
    top: -15px;
    left: 5px;
    display: block;
    transition: 0.2s;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.768) !important;
}

.form__field:focus ~ .form__label {
    color: #39b6ff;
}

.form__field:focus {
    padding-bottom: 6px;
    border-bottom: 2px solid #39b6ff !important;
}

.select {
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    position: relative;
    width: 100%;
}

.select-text {
    position: relative;
    font-family: inherit;
    background-color: transparent;
    width: 100%;
    padding: 9px 10px 8px 5px;
    font-size: 14px;
    border-radius: 0;
    border: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

/* Remove focus */
.select-text:focus {
    outline: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0);
}

.select:after {
    position: absolute;
    top: 18px;
    right: 10px;
    /* Styling the down arrow */
    width: 0;
    height: 0;
    padding: 0;
    content: "";
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid rgba(0, 0, 0, 0.12);
    pointer-events: none;
}

/* LABEL ======================================= */
.select-label {
    color: rgba(0, 0, 0, 0.26);
    font-size: 14px;
    font-weight: normal;
    position: absolute;
    pointer-events: none;
    left: 0;
    top: 10px;
    transition: 0.2s ease all;
}

/* active state */
.select-text:focus ~ .select-label,
.select-text:valid ~ .select-label {
    color: #2f80ed;
    top: -20px;
    transition: 0.2s ease all;
    font-size: 13px;
}

/* BOTTOM BARS ================================= */
.select-bar {
    position: relative;
    display: block;
    width: 100%;
}

.select-bar:before,
.select-bar:after {
    content: "";
    height: 2px;
    width: 0;
    bottom: 1px;
    position: absolute;
    background: #2f80ed;
    transition: 0.2s ease all;
}

.select-bar:before {
    left: 50%;
}

.select-bar:after {
    right: 50%;
}

/* active state */
.select-text:focus ~ .select-bar:before,
.select-text:focus ~ .select-bar:after {
    width: 50%;
}

/* HIGHLIGHTER ================================== */
.select-highlight {
    position: absolute;
    height: 60%;
    width: 100px;
    top: 25%;
    left: 0;
    pointer-events: none;
    opacity: 0.5;
}


.row{
    margin-left:-10px;
    margin-right:-10px;
    float:left;
    width:100%;
}

</style>