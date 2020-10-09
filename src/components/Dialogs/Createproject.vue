<template>
    <div id="dialog-cover">
        <div id="input-container">
            <div class="header">Create new project</div>
            <div class="group">
                <input type="text" ref="projectname" required v-model="name" placeholder="  "/>
                <span class="bar"></span>
                <label>Project name</label>
            </div>
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
            this.$socket.emit({
                type: "save-one",
                group: true,
                payload: {
                    collection: "Project",
                    storeAction: "setNewProject",
                    name: this.name,
                    created: new Date(),
                    createdBy: this.userId,
                },
            });
            this.closeDialog();
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
    padding: 20px 20px 20px 20px;
    box-shadow: 0px 0px 18px #000;
    .header {
        margin: 0px 0px 40px 0px;
        color: #fff;
    }
    input {
        width: 100%;
        color: #fff;
    }
}
</style>