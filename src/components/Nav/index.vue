<template>
    <div>
        <div id="sidenav" style="">
            <div class="logo">
                <span>BBugs</span>
            </div>
            <div id="navigation">
                <router-link :to="{ path: '/' }">
                    <span class="mdi mdi-view-dashboard"></span> Projects
                </router-link>
                <router-link :to="{ path: '/history' }">
                    <span class="mdi mdi-history"></span> Bughistory
                </router-link>
            </div>
            <Users :socket="socket"/>
        </div>
        <nav>
            <div class="user-container">
                <div class="user-icon">
                    <span class="mdi mdi-ladybug"></span>
                </div>
                <div class="fullname">{{ fullname }}</div>
            </div>
            <div class="add-project-btn" @click="openCreateNewProjectDialog">
                <span class="mdi mdi-plus" style=""></span>
            </div>
            <Notifications :socket="socket" />
        </nav>
    </div>
</template>

<script>
import Notifications from "./Notifications";
import Users from "@/components/Users";
import { bus } from "@/main";
export default {
    name: "Nav",
    components: {
        Notifications,
        Users,
    },
    props: {
        email: String,
        socket: Object,
    },
    data: () => ({
        fullame: "",
    }),
    created() {
        this.fullname = JSON.parse(localStorage.getItem("site_info")).fullname;
    },
    methods: {
        openCreateNewProjectDialog() {
            bus.$emit("show-create-new-project-dialog");
        },
    },
};
</script>

<style lang="scss" scoped>
#sidenav {
    width: 250px;
    height: 100%;
    position: fixed;
    padding:20px;
    left: 0px;
    top: 0px;
    background: #18191a;
    box-shadow: -4px 0px 20px 0px #000c;
    border-right: 1px solid #393a3b4a;
    font-family: "Roboto", sans-serif;
    .logo {
        color: rgba(255, 255, 255, 0.904);
        display: flex;
        align-items: center;
        font-size: 1.4em;
        font-weight: 600;
    }
    #navigation {
        width: 100%;
        padding:10px 0px;
        float:left;
        a {
            color: rgba(255, 255, 255, 0.705);
            float: left;
            width: 100%;
            font-size: 14px;
            padding: 5px 0px;
            width:100%;
            float:left;
            display:flex;
            align-items: center;
            font-weight:500;
            span{
                font-size:18px;
                margin-right:15px;
            }
        }
    }
}

nav {
    width: calc(100% - 260px);
    height: 48px;
    z-index: 10;
    top: 0px;
    position: fixed;
    display: flex;
    align-items: center;
    padding: 0px 30px;
    .logo {
        color: #fff;
        font-size: 1.2em;
        font-weight: 600;
    }

    .user-container {
        margin-left: auto;
        display: flex;
        align-items: center;
        border-radius: 50px;
        padding: 5px 15px 5px 5px;
        margin-right: 10px;
        .user-icon {
            background: rgb(60, 61, 62);
            width: 25px;
            height: 25px;
            float: left;
            border-radius: 50%;
            display: flex;
            color: #fff;
            span {
                margin: auto;
                font-size: 1em;
                color: rgb(57, 182, 255);
            }
        }
        .fullname {
            color: rgba(255, 255, 255, 0.678);
            margin-left: auto;
            margin-left: 10px;
            font-weight: 600;
            font-size: 1em;
        }
        &:hover {
            background: #ffffff1a;
        }
    }
    .add-project-btn {
        width: 30px;
        height: 30px;
        border-radius: 40px;
        background: #242526;
        margin-right: 10px;
        display: flex;
        cursor: pointer;
        &:hover {
            background: #ffffff31;
        }
        span {
            font-size: 16px;
            color: #fff;
            margin: auto;
        }
    }
}
</style>