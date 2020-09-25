<template>
    <div id="create-new-project-dialog">
        <div id="input-container">
            <label for="project">Project name</label>
            <input
                ref="projectname"
                v-model="name"
                name="project"
                type="text"
                placeholder="Project name"
                autofocus
            />
            <Button
                :text="'save'"
                :type="'standard'"
                style="float: right"
                :disabled="name.length === 0"
                @click.native="saveProject()"
            />

            <Button
                :text="'cancel'"
                :type="'cancel'"
                @click.native="closeDialog()"
                style="float: right; margin-right: 10px"
            />
        </div>
    </div>
</template>

<script>
import Button from "@/components/Buttons/Standard";

import { bus } from "@/main";

export default {
    name: "Createproject",
    components: {
        Button,
    },
    props: {
        socket: Object,
    },
    data: () => ({
        name: "",
        inputIsVisible: false,
    }),
    created() {
        this.$nextTick(() => this.$refs.projectname.focus());
    },
    methods: {
        closeDialog() {
            bus.$emit("close-dialog");
        },
        saveProject() {
            this.socket.emit("request", {
                type: "save-one",
                group:true,
                payload: {
                    collection:'Project',
                    responseMessage: "NEW_PROJECT",
                    name:this.name,
                },
            });
        },
    },
};
</script>

<style lang="scss" scoped>
#create-new-project-dialog {
    position: absolute;
    width: calc(100% - 260px);
    height: 100%;
    top: 0px;
    left: 0px;
    background: rgba(0, 0, 0, 0.616);
    display: flex;
    z-index: 200;
    #input-container {
        margin: auto;
        width: 500px;
        height: auto;
        background: #242526;
        border-radius: 10px;
        padding: 15px 20px 20px 20px;
        box-shadow: 0px 0px 18px #000;
        label {
            margin: 0px 0px 20px 0px;
            color: #fff;
        }
        input {
            width: 100%;
            color: #fff;
            font-size: 1.1em;
        }
    }
}
</style>