<template>
    <nav>
        <div class="logo">Binary Bugs</div>
        <Notifications :socket="socket" />
    </nav>
</template>

<script>

import Notifications from './Notifications'

export default {
    name: "Nav",
    components:{
        Notifications
    },
    props: {
        email: String,
        socket: Object,
    },
    data: () => ({}),
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
    padding: 20px 40px;
    margin-top:10px;
    .logo {
        color: #fff;
        font-size: 1.2em;
        font-weight: 600;
    }
}
</style>