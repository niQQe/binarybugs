<template>
    <div id="dialog-cover">
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
        userId: String,
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
                group: true,
                payload: {
                    collection: "Project",
                    responseMessage: "NEW_PROJECT",
                    name: this.name,
                    created: new Date(),
                    createdBy: this.userId,
                },
            });
            this.socket.emit('request', {
                type:'new-notification',
                group:true,
                payload:{
                    collection:'Notification',
                    responseMessage:'NEW_NOTIFICATION',
                    value:`Created a new Project called ${this.name}`
                }
            })
        },
    },
};
</script>

<style lang="scss" scoped>
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
        font-size: 1.2em !important;
    }
}
</style>