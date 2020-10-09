<template>
    <div id="dialog-cover">
        <div id="input-container">
            <div class="header">New bug for {{ projectInfo.name }}</div>
            <div class="row">
                <div style="padding: 20px 0px 0px 0px; float: left">
                    <div
                        :class="
                            field.type === 'input' || field.type === 'select'
                                ? 'input-wrapper'
                                : 'form__group'
                        "
                        v-for="(field, index) of metaFields"
                        :key="index"
                        ref="title"
                    >
                        <div class="group" v-if="field.type === 'input'">
                            <input
                                type="text"
                                v-if="
                                    typeof bugFields[field.field] === 'object'
                                "
                                required
                                readonly
                                v-model="bugFields[field.field].fullname"
                                style="
                                    cursor: not-allowed;
                                    pointer-events: none;
                                "
                            />
                            <input
                                v-else
                                ref="title"
                                type="text"
                                required
                                v-model="bugFields[field.field]"
                            />
                            <span class="bar"></span>
                            <label>{{ formatLabel(field.field) }}</label>
                        </div>
                        <div class="select" v-if="field.type === 'select'">
                            <select
                                v-if="field.field === 'category'"
                                v-model="bugFields[field.field]"
                                style="text-transform: capitalize"
                                class="select-text"
                            >
                                <option value="" selected>
                                    Select Category
                                </option>
                                <option
                                    v-for="item in field.dropdown"
                                    :key="item.id"
                                >
                                    {{ item }}
                                </option>
                            </select>
                            <select
                                v-if="field.field === 'assigned'"
                                v-model="bugFields[field.field]"
                                style="text-transform: capitalize"
                                class="select-text"
                            >
                                <option value="" selected>Select user</option>
                                <option
                                    v-for="item in field.dropdown"
                                    :key="item.id"
                                    :value="{
                                        id: item._id,
                                        name: item.fullname,
                                    }"
                                >
                                    {{ item.fullname }}
                                </option>
                            </select>
                            <span class="select-highlight"></span>
                            <span class="select-bar"></span>
                            <label class="select-label">
                                {{ formatLabel(field.field) }}</label
                            >
                        </div>
                        <div v-if="field.type === 'textarea'">
                            <textarea
                                class="form__field"
                                placeholder="  "
                                v-model="bugFields[field.field]"
                                rows="6"
                            ></textarea>
                            <label for="message" class="form__label">
                                {{ formatLabel(field.field) }}</label
                            >
                        </div>
                    </div>
                    <!-- <div class="input-wrapper">
                        <div class="group">
                            <input
                                type="text"
                                required
                                v-model="bugFields.reported_by"
                            />
                            <span class="bar"></span>
                            <label>Reported By</label>
                        </div>
                    </div>
                    <div class="input-wrapper">
                        <div class="group">
                            <input
                                type="text"
                                readonly
                                required
                                v-model="bugFields.written_by.fullname"
                            />
                            <span class="bar"></span>
                            <label>Written by</label>
                        </div>
                    </div>
                    <div class="input-wrapper">
                        <div class="group">
                            <input
                                type="text"
                                required
                                v-model="bugFields.reported_at"
                            />
                            <span class="bar"></span>
                            <label>Date reported</label>
                        </div>
                    </div>
                    <div class="input-wrapper">
                        <div class="group">
                            <input
                                type="text"
                                required
                                v-model="bugFields.time"
                            />
                            <span class="bar"></span>
                            <label>Time</label>
                        </div>
                    </div>
                    <div class="input-wrapper">
                        <div class="group">
                            <input
                                type="text"
                                required
                                v-model="bugFields.url"
                            />
                            <span class="bar"></span>
                            <label>Url</label>
                        </div>
                    </div>
                    <div class="input-wrapper">
                        <div class="group">
                            <input
                                type="text"
                                required
                                v-model="bugFields.platform"
                            />
                            <span class="bar"></span>
                            <label>Platform</label>
                        </div>
                    </div>
                    <div class="input-wrapper">
                        <div class="group">
                            <input
                                type="text"
                                required
                                v-model="bugFields.browser"
                            />
                            <span class="bar"></span>
                            <label>Web browser</label>
                        </div>
                    </div>
                    <div class="input-wrapper">
                        <div class="select">
                            <select
                                v-model="bugFields.category"
                                style="text-transform: capitalize"
                                class="select-text"
                            >
                                <option
                                    v-for="category in categories"
                                    :key="category"
                                >
                                    {{ category }}
                                </option>
                            </select>
                            <span class="select-highlight"></span>
                            <span class="select-bar"></span>
                            <label class="select-label">Category</label>
                        </div>
                    </div>
                    <div class="input-wrapper">
                        <div class="select">
                            <select
                                v-model="bugFields.assigned"
                                style="text-transform: capitalize"
                                class="select-text"
                            >
                                <option
                                    v-for="user in GET_ALL_USERS"
                                    :key="user._id"
                                    :value="{
                                        id: user._id,
                                        name: user.fullname,
                                    }"
                                >
                                    {{ user.fullname }}
                                </option>
                            </select>
                            <span class="select-highlight"></span>
                            <span class="select-bar"></span>
                            <label class="select-label">Assign to</label>
                        </div>
                    </div>
                    <div class="input-wrapper">
                        <div class="group">
                            <input
                                type="text"
                                required
                                v-model="bugFields.priority"
                            />
                            <span class="bar"></span>
                            <label>Priority</label>
                        </div>
                    </div> -->
                    <!-- <div class="form__group">
                        <textarea
                            class="form__field"
                            placeholder="  "
                            v-model="bugFields.description"
                            rows="6"
                        ></textarea>
                        <label for="message" class="form__label"
                            >Description</label
                        >
                    </div>
                    <div class="form__group">
                        <textarea
                            class="form__field"
                            placeholder="  "
                            v-model="bugFields.expected_result"
                            rows="6"
                        ></textarea>
                        <label for="message" class="form__label"
                            >Expected result</label
                        >
                    </div>

                    <div class="form__group">
                        <textarea
                            class="form__field"
                            placeholder="  "
                            v-model="bugFields.actual_result"
                            rows="6"
                        ></textarea>
                        <label for="message" class="form__label"
                            >Actual result</label
                        >
                    </div>
                    <div class="form__group">
                        <textarea
                            class="form__field"
                            placeholder="  "
                            v-model="bugFields.step_for_reproduction"
                        ></textarea>
                        <label for="message" class="form__label"
                            >Step for reproduction</label
                        >
                    </div>
                    <div class="form__group">
                        <textarea
                            class="form__field"
                            placeholder="  "
                            v-model="bugFields.comment"
                        ></textarea>
                        <label for="message" class="form__label">Comment</label>
                    </div> -->
                </div>
            </div>
            <div class="btn-wrapper">
                <Button
                    :text="'Add bug'"
                    :type="'standard'"
                    style="float: right"
                    @click.native="saveBug()"
                    ref="test"
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
import { mapGetters } from "vuex";
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
        metaFields: [
            { field: "title", type: "input" },
            { field: "reported_by", type: "input" },
            { field: "written_by", type: "input" },
            { field: "reported_at", type: "input" },
            { field: "time", type: "input" },
            { field: "url", type: "input" },
            { field: "platform", type: "input" },
            { field: "browser", type: "input" },
            {
                field: "category",
                type: "select",
                dropdown: ["critical", "severe", "easy", "nth"],
            },
            { field: "assigned", type: "select", dropdown: [] },
            { field: "priority", type: "input" },
            { field: "resolved_at", type: "input" },
            { field: "description", type: "textarea" },
            { field: "expected_result", type: "textarea" },
            { field: "actual_result", type: "textarea" },
            { field: "step_for_reproduction", type: "textarea" },
            { field: "comment", type: "textarea" },
        ],
        bugFields: {
            name: "",
            title: "",
            reported_by: "",
            written_by: { fullname: "test" },
            reported_at: "",
            time: "",
            url: "",
            platform: "",
            browser: "",
            category: "",
            assigned: "",
            priority: "",
            resolved_at: "",
            description: "",
            expected_result: "",
            actual_result: "",
            step_for_reproduction: "",
            comment: "",
            resolved: false,
        },

        categories: ["critical", "severe", "easy", "nth"],
    }),
    watch: {
        GET_ALL_USERS: {
            handler: function (users) {
                this.metaFields.forEach((meta) => {
                    if (meta.field === "assigned") meta.dropdown = users;
                });
            },
            immediate: true,
            deep: true,
        },
    },
    created() {
        this.bugFields.written_by = this.GET_USER_INFO;
        this.$nextTick(() => this.$refs.title[0].focus());
    },

    methods: {
        closeDialog() {
            bus.$emit("close-dialog");
        },
        saveBug() {
            this.$socket.emit({
                type: "save-one",
                group: true,
                payload: {
                    collection: "Bug",
                    storeAction: "setNewBug",
                    projectid: this.projectInfo.projectId,
                    ...this.bugFields,
                },
            });
            if (this.GET_USER_INFO._id !== this.bugFields.assigned.id) {
                this.$socket.emit({
                    type: "new-notification",
                    group: false,
                    payload: {
                        toId: this.bugFields.assigned.id,
                        value: `Assigned a new bug for You in project ${this.projectInfo.name}`,
                        projectId: this.projectInfo.projectId,
                        storeAction: "setNewNotification",
                    },
                });
            }
            this.closeDialog();
        },
        formatLabel(label) {
            return label.replace(/_/g, " ");
        },
    },
    computed: {
        ...mapGetters(["GET_ALL_USERS", "GET_USER_INFO"]),
    },
};
</script>

<style lang="scss" scoped>
#input-container {
    margin: auto;
    width: 1200px;
    max-height: 900px;
    overflow: auto;
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

label {
    text-transform: capitalize;
}

.input-wrapper {
    width: 25%;
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
select {
    margin: 0;
}
</style>