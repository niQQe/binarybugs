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
    created() {
        
    },
};
</script>

<style lang="scss" scoped>
.btn {
    border: none;
    color: #fff;
    margin: 0px;
    transition: all 0.2s ease;
    &.standard {
        background: rgba(57, 182, 255, 0.404);
        &:hover {
            background: rgba(57, 182, 255, 0.74);
        }
    }
    &.cancel {
        &:hover {
            background: rgba(57, 182, 255, 0.74);
        }
    }
    &:disabled {
        &:hover {
            cursor: default !important;
        }
        background: rgba(255, 255, 255, 0.137) !important;
    }
}
</style>