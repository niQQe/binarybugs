<template>
    <button class="btn" :class="type" :disabled="disabled">{{ text }}</button>
</template>

<script>
export default {
    name: "standardbutton",
    props: {
        text: String,
        type: String,
        disabled: Boolean,
    },
    created() {},
};
</script>

<style lang="scss" scoped>
.btn {
    border: none;
    color: #fff;
    margin: 0px;
    transition: all 0.2s ease;
    color: #fff;
    float: right;
    font-weight: 500;
    letter-spacing: 0.25px;
    background: #328abe;
    text-transform: capitalize;
    font-size: 14px;
    padding: 7px 15px;
    border-radius: 8px;
    transition: all 0.2s ease;
    font-family: "roboto";
    cursor:pointer;
    &.standard {
        background: #328abe;
        &:hover {
            background: #26698f;
        }
    }
    &.cancel {
        background:transparent;
        &:hover {
            background: rgba(225, 225, 225, 0.104);
        }
    }
    &:disabled {
        &:hover {
            cursor: default !important;
        }
        background: rgba(255, 255, 255, 0.137) !important;
    }
    &:focus{
        outline:none!important;
    }
}
</style>