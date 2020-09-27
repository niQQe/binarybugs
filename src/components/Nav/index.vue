<template>
    <nav>
        <div class="logo">Binary Bugs</div>
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
</template>

<script>
import Notifications from "./Notifications";
import { bus } from "@/main";
export default {
    name: "Nav",
    components: {
        Notifications,
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
nav {
    width: calc(100% - 260px);
    height: 70px;
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
            background: rgb(60,61,62);
            width: 30px;
            height: 30px;
            float: left;
            border-radius: 50%;
            display: flex;
            color: #fff;
            span {
                margin: auto;
                font-size: 1.2em;
                color: rgb(57, 182, 255);
            }
        }
        .fullname {
            color: rgba(255, 255, 255, 0.678);
            margin-left: auto;
            margin-left: 10px;
            font-weight:600;
            font-size:1em;
        }
        &:hover {
            background: #ffffff1a;
        }
    }
    .add-project-btn {
        width: 40px;
        height: 40px;
        border-radius: 40px;
        background: #242526;
        margin-right: 10px;
        display: flex;
        cursor: pointer;
        &:hover {
            background: #ffffff31;
        }
        span {
            font-size: 22px;
            color: #fff;
            margin: auto;
        }
    }
}
</style>