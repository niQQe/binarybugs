<template>
    <div id="dialog-cover">
        <div id="input-container">
            <div class="header">New bug for {{ projectInfo.name }}</div>
            <div class="row">
                <div class="input-wrapper">
                    <input
                        ref="id"
                        v-model="bugFields.id"
                        type="text"
                        placeholder="Id number"
                        autofocus
                    />
                </div>
                <div class="input-wrapper">
                    <input
                        v-model="bugFields.title"
                        name="title"
                        type="text"
                        placeholder="Title"
                    />
                </div>
                <div class="input-wrapper">
                    <input
                        v-model="bugFields.reported_by"
                        type="text"
                        placeholder="Reported by"
                    />
                </div>
                <div class="input-wrapper">
                    <input
                        v-model="bugFields.written_by"
                        type="text"
                        placeholder="Written by"
                    />
                </div>
                <div class="input-wrapper">
                    <input
                        v-model="bugFields.reported_at"
                        type="text"
                        placeholder="Date reported"
                    />
                </div>
                <div class="input-wrapper">
                    <input
                        v-model="bugFields.time"
                        type="text"
                        placeholder="Time"
                    />
                </div>
                <div class="input-wrapper">
                    <input
                        v-model="bugFields.url"
                        type="text"
                        placeholder="Url"
                    />
                </div>
                <div class="input-wrapper">
                    <input
                        v-model="bugFields.platform"
                        type="text"
                        placeholder="Platform"
                    />
                </div>
                <div class="input-wrapper">
                    <input
                        v-model="bugFields.webbrowser"
                        type="text"
                        placeholder="Web browser"
                    />
                </div>
                <div class="input-wrapper">
                    <select v-model="bugFields.category" style="text-transform:capitalize" >
                        <option value="" selected="selected">Category</option>
                        <option v-for="category in categories" :key="category">{{ category }} </option>
                    </select>
                </div>
                <div class="input-wrapper">
                    <input
                        v-model="bugFields.assignedTo"
                        type="text"
                        placeholder="Assigned to"
                    />
                </div>
                <div class="input-wrapper">
                    <input
                        v-model="bugFields.priority"
                        type="text"
                        placeholder="Priority"
                    />
                </div>
                <div class="textarea-wrapper">
                    <textarea
                        v-model="bugFields.description"
                        type="text"
                        placeholder="Description"
                    />
                </div>
                <div class="textarea-wrapper">
                    <textarea
                        v-model="bugFields.expected_result"
                        type="text"
                        placeholder="Expected result"
                    />
                </div>
                <div class="textarea-wrapper">
                    <textarea
                        v-model="bugFields.actual_result"
                        type="text"
                        placeholder="Actual result"
                    />
                </div>
                <div class="textarea-wrapper">
                    <textarea
                        v-model="bugFields.step_for_reproduction"
                        type="text"
                        placeholder="Step for reproducion"
                    />
                </div>
                <div class="textarea-wrapper">
                    <textarea
                        v-model="bugFields.comment"
                        type="text"
                        placeholder="Comment"
                    />
                </div>
            </div>
            <div class="btn-wrapper">
                <Button
                    :text="'save'"
                    :type="'standard'"
                    style="float: right"
                    @click.native="saveBug()"
                />

                <Button
                    :text="'cancel'"
                    :type="'cancel'"
                    @click.native="closeDialog()"
                    style="float: right; margin-right: 10px"
                />
            </div>
        </div>
    </div>
</template>

<script>
import Button from "@/components/Buttons/Standard";

import { bus } from "@/main";

export default {
    name: "Createbug",
    components: {
        Button,
    },
    props: {
        socket: Object,
        projectInfo: Object,
    },
    data: () => ({
        bugFields: {
            id: "",
            name: "",
            title: "",
            reported_by: "",
            written_by: "",
            reported_at: "",
            time: "",
            url: "",
            platform: "",
            browser: "",
            category: "",
            assigned: "",
            priority: "",
            description: "",
            expected_result: "",
            actual_result: "",
            step_for_reproduction: "",
            comment: "",
        },
        categories:['critical', 'severe', 'easy', 'nth']
    }),
    created() {
        this.$nextTick(() => this.$refs.id.focus());
        console.log(this.projectInfo)
    },
    methods: {
        closeDialog() {
            bus.$emit("close-dialog");
        },
        saveBug() {
            this.socket.emit("request", {
                type: "save-one",
                group: true,
                payload: {
                    collection: "Bug",
                    responseMessage: "NEW_BUG",
                    projectid: this.projectInfo.projectId,
                    ...this.bugFields,
                },
            });
        },
    },
};
</script>

<style lang="scss" scoped>
#input-container {
    margin: auto;
    width: 800px;
    height: auto;
    background: #242526;
    border-radius: 10px;
    padding: 15px 20px 20px 20px;
    box-shadow: 0px 0px 18px #000;
    label {
        margin: 0px 0px 20px 0px;
        color: #fff;
    }
}

.input-wrapper {
    width: 33.33%;
    float: left;
    padding: 5px;
    input {
        margin-bottom: 2px;
    }
}

.header {
    color: #d0d0d0;
    font-size: 1.1em;
    font-weight: 700;
    margin-bottom: 10px;
}

.row {
    margin-left: -8px;
    margin-right: -8px;
}

.btn-wrapper {
    margin-top: 10px;
}

.textarea-wrapper {
    width: 100%;
    float: left;
    padding: 5px;
    textarea {
        width: 100%;
        height: 70px;
        max-height: 70px;
        max-width: 100%;
        margin: 0px;
    }
}
</style>