<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
import io from "socket.io-client";

let socket = null;

export default {
    name: "App",
    data: () => ({
        usermessage: "",
        chat: [],
        notificationData: [],
        notification: "",
    }),
    async created() {},
    methods: {},
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    height: 100%;
    font-family: 'Open Sans', sans-serif;
}

* {
    box-sizing: border-box;
}

html {
    height: 100%;
    width: 100%;
}

html,
body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    background: #18191a;
    
}



</style>
