<template>
    <nav>
        <div class="logo">Binary Bugs</div>
        <div
            style="
                width: 40px;
                height: 40px;
                border-radius: 40px;
                background: #242526;
                margin-left: auto;
                margin-right: 10px;
                display: flex;
            "
            @click="openCreateNewProjectDialog"
        >
            <span
                class="mdi mdi-plus"
                style="
                    font-size: 22px;
                    color: #fff;
                    margin: auto;
                    cursor: pointer;
                "
            ></span>
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
    data: () => ({}),
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
    height: 60px;
    z-index: 10;
    top: 0px;
    position: fixed;
    display: flex;
    align-items: center;
    padding: 20px 30px;
    margin-top: 10px;
    .logo {
        color: #fff;
        font-size: 1.2em;
        font-weight: 600;
    }
}
</style>