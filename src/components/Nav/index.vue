<template>
    <div>
        <div id="sidenav" style="">
            <div id="navigation">
                <router-link :to="{ path: '/' }">
                    <span class="mdi mdi-view-dashboard"></span> Projects
                </router-link>
                <router-link :to="{ path: '/history' }">
                    <span class="mdi mdi-history"></span> Bughistory
                </router-link>
            </div>
            <Users :socket="socket" />
        </div>
        <nav>
            <div class="logo">
                <span>Binary Bugs</span>
            </div>
            <div class="add-project-btn" @click="openCreateNewProjectDialog">
                <span class="mdi mdi-plus" style=""></span>
            </div>
            <Notifications />
            <div class="user-container">
                {{ fullname }}
            </div>
        </nav>
    </div>
</template>

<script>
import { mixin as clickaway } from "vue-clickaway";
import { bus } from "@/main";
import { mapActions, mapGetters } from "vuex";
import Notifications from "./Notifications";
import Users from "@/components/Users";
export default {
    name: "Nav",
    components: {
        Notifications,
        Users,
    },
    mixins: [clickaway],
    props: {
        email: String,
        socket: Object,
    },
    data: () => ({
        fullame: "",
        projectNames: null,
        showProjects: false,
    }),
    created() {
        const [first, second] = JSON.parse(
            localStorage.getItem("site_info")
        ).fullname;
        this.fullname = `${first}${second}`;
    },
    methods: {
        openCreateNewProjectDialog() {
            bus.$emit("show-create-new-project-dialog");
        },

        hideProjectDropdown() {
            this.showProjects = false;
        },
        goTo(id) {
            this.$router.push({ path: id });
        },
    },
};
</script>

<style lang="scss" scoped>
#sidenav {
    width: 250px;
    height: 100%;
    position: fixed;
    padding: 55px 20px 20px 20px;
    left: 0px;
    top: 0px;
    background: #1b1c1d;
    border-right: 1px solid #0c0c0c4a;
    font-family: "Roboto", sans-serif;
    #navigation {
        width: 100%;
        padding: 10px 0px;
        float: left;
        a {
            color: rgba(255, 255, 255, 0.705);
            float: left;
            width: 100%;
            font-size: 14px;
            padding: 5px 0px;
            width: 100%;
            float: left;
            display: flex;
            align-items: center;
            font-weight: 500;
            span {
                font-size: 18px;
                margin-right: 15px;
            }
        }
    }
}

nav {
    width: 100%;
    height: 48px;
    z-index: 10;
    top: 0px;
    left: 0px;
    position: fixed;
    display: flex;
    align-items: center;
    padding: 0px 20px;
    background: #161617;
    box-shadow: 0px 1px 3px #0000007a;
    .logo {
        color: #fff;
        font-size: 1em;
        font-weight: 500;
    }

    .user-container {
        display: flex;
        align-items: center;
        border-radius: 50px;
        width: 32px;
        height: 32px;
        background: rgb(1, 109, 172);
        display: flex;
        justify-content: center;
        font-weight: 400;
        font-size: 16px;
        color: #fff;
        margin-left: 20px;

        .user-icon {
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
    }
    .add-project-btn {
        width: 30px;
        margin-left: auto;
        height: 30px;
        border-radius: 40px;
        background: #242526;
        margin-right: 20px;
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