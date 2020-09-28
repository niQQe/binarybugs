<template>
    <div id="bugs">
        <div class="project-dropdown" @click="showProjects = true" v-on-clickaway="hideProjectDropdown">
            <div class="current-project">
                Ikea <span class="mdi mdi-menu-down"></span>
            </div>
            <div class="dropdown" :class="{ show: showProjects }">
                <div class="dropdown-header">All projects</div>
                <div class="project">Pepsi</div>
                <div class="project">COOP</div>
                <div class="project">KRAFT</div>
                <div class="project">Dormy</div>
            </div>
        </div>
        <span class="project-header"
            >Current bugs for {{ currentProject }}</span
        >
        <div class="project-menu">
            <div class="menu">
                <div>
                    <span style="color: #39b6ff">Bugs</span>
                    <span class="active-bar"></span>
                </div>
                <div>Done</div>
                <div>History</div>
                <div class="add-bug">
                    <span class="mdi mdi-plus"></span>
                    Add bug
                </div>
            </div>
        </div>
        <div v-for="bug in bugs" :key="bug._id" class="bug-container">
            <div class="bug">
                <div style="display: flex">
                    <div class="header">
                        <span class="title-and-category"
                            >{{ bug.title }}
                            <span class="category" :class="bug.category">{{
                                bug.category
                            }}</span>
                        </span>
                        <div class="action-container">
                            <div class="assign">
                                <span
                                    class="mdi mdi-account-arrow-right"
                                ></span>
                            </div>
                            <div class="mark-as-done">
                                <span class="mdi mdi-check"></span>
                            </div>
                            <div class="remove">
                                <span class="mdi mdi-close"></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bug-info-container">
                    <div class="bug-info" style="flex: 1">
                        <div class="input-placeholder-container">
                            <div class="label">Id</div>
                            <div class="input">
                                {{ bug.id }}
                            </div>
                        </div>
                        <div class="input-placeholder-container">
                            <div class="label">Reported by</div>
                            <div class="input">
                                {{ bug.reported_by }}
                            </div>
                        </div>
                        <div class="input-placeholder-container">
                            <div class="label">Written by</div>
                            <div class="input">
                                {{ bug.written_by }}
                            </div>
                        </div>
                        <div class="input-placeholder-container">
                            <div class="label">Date reported</div>
                            <div class="input">
                                {{ bug.reported_at }}
                            </div>
                        </div>
                        <div class="input-placeholder-container">
                            <div class="label">time</div>
                            <div class="input">
                                {{ bug.time }}
                            </div>
                        </div>
                        <div class="input-placeholder-container">
                            <div class="label">url</div>
                            <div class="input">
                                {{ bug.url }}
                            </div>
                        </div>
                        <div class="input-placeholder-container">
                            <div class="label">platform</div>
                            <div class="input">
                                {{ bug.platform }}
                            </div>
                        </div>
                        <div class="input-placeholder-container">
                            <div class="label">Browser</div>
                            <div class="input">
                                {{ bug.browser }}
                            </div>
                        </div>

                        <div class="input-placeholder-container">
                            <div class="label">category</div>
                            <div class="input">
                                {{ bug.category }}
                            </div>
                        </div>
                        <div class="input-placeholder-container">
                            <div class="label">Assigned to</div>
                            <div class="input">
                                {{ bug.assigned }}
                            </div>
                        </div>
                        <div class="input-placeholder-container">
                            <div class="label">Priority</div>
                            <div class="input">
                                {{ bug.priority }}
                            </div>
                        </div>
                        <div class="textfield-placeholder-container">
                            <div class="label">Description</div>
                            <div class="textfield">
                                {{ bug.description }}
                            </div>
                        </div>
                        <div class="textfield-placeholder-container">
                            <div class="label">Expected result</div>
                            <div class="textfield">
                                {{ bug.expected_result }}
                            </div>
                        </div>
                        <div class="textfield-placeholder-container">
                            <div class="label">Actual result</div>
                            <div class="textfield">
                                {{ bug.actual_result }}
                            </div>
                        </div>
                        <div class="textfield-placeholder-container">
                            <div class="label">Step for reproduction</div>
                            <div class="textfield">
                                {{ bug.step_for_reproduction }}
                            </div>
                        </div>
                        <div class="textfield-placeholder-container">
                            <div class="label">Comment</div>
                            <div class="textfield">
                                {{ bug.comment }}
                            </div>
                        </div>

                        <!-- <div
                            class="input-placeholder-container"
                            style="width: 50%;float:left;padding:2px;M"
                        >
                            <div
                                class="input"
                                style="
                                    width: 100%;
                                    background:#3c3d3e;
                                    padding:3px;
                                "
                            >
                             {{ bug.reported_by }}
                            </div>
                        </div> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { mixin as clickaway } from 'vue-clickaway';
export default {
    name: "Project",
     mixins: [ clickaway ],
    props: {
        socket: Object,
        currentProject: String,
    },
    data: () => ({
        bugs: [],
        showProjects: false,
    }),
    mounted() {
        this.socket.emit("request", {
            type: "find-by-id",
            group: false,
            payload: {
                key: "projectid",
                id: this.$route.params.id,
                responseMessage: "ALL_BUGS_IN_PROJECT",
                collection: "Bug",
            },
        });
        this.socket.on("ALL_BUGS_IN_PROJECT", ({ payload }) => {
            console.log(payload);
            this.bugs = payload.data;
        });
    },
    methods:{
        hideProjectDropdown(){
            this.showProjects = false
        }
    }
};
</script>

<style lang="scss" scoped>
#bugs {
    .project-dropdown {
        float: left;
        color: #fff;
        display: flex;
        align-items: center;
        font-size: 14px;
        margin-top: -40px;
        cursor: pointer;
        z-index: 999;
        position: relative;
        .current-project {
            display: flex;
            align-items: center;
            width: 100%;
            font-weight: 600;
            .mdi {
                margin-left: 15px;
                font-size: 22px;
            }
        }
        .dropdown {
            opacity: 0;
            max-height: 0px;
            max-width:0px;
            min-width:0;
            transition: all 0.2s ease;
            top: 10px;
            position: absolute;
            background: #242526;
            overflow:hidden;
            border-radius: 8px;
            padding:10px 0px;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.3),
                0 2px 6px 2px rgba(0, 0, 0, 0.15);
            .dropdown-header{
                color:rgba(255, 255, 255, 0.589);
                margin-bottom:10px;
                padding:0px 16px;
                font-size:13px;
                min-width:170px;
            }
            .project {
                float:left;
                height:32px;
                min-width:170px;
                padding:0px 16px;
                display:flex;
                align-items: center;
                color:rgba(255, 255, 255, 0.808);
                &:hover{
                    background:rgba(255, 255, 255, 0.116);
                }
                
            }
        }
        .show {
            max-width: 170px !important;
            min-width:170px;
            max-height: 500px;
            opacity: 1;
        }
    }
    .project-header {
        color: #fff;
        font-size: 32px;
        margin-bottom: 10px;
        margin-top: 10px;
        float: left;
        width: 100%;
    }
    .project-menu {
        color: #fff;
        font-weight: 600;
        margin-bottom: 20px;
        font-size: 14px;
        margin-top: 10px;
        width: 100%;
        float: left;
        border-bottom: 1px solid rgba(255, 255, 255, 0.158);
        display: flex;
        height: 35px;
        .menu {
            float: left;
            height: 100%;
            div {
                margin-right: 25px;
                float: left;
                font-weight: 550;
                color: rgba(255, 255, 255, 0.644);
                position: relative;
                padding-bottom: 12px;
                cursor: pointer;
                .active-bar {
                    background: #39b6ff;
                    border-top-left-radius: 3px;
                    border-top-right-radius: 3px;
                    position: absolute;
                    bottom: 0px;
                    width: 100%;
                    height: 3px;
                    left: 0px;
                }
            }
            .add-bug {
                color: #fff;
            }
        }
    }
    .header {
        float: left;
    }
}

.bug-container {
    width: 25%;
    float: left;
    padding: 10px;
    border-radius: 3px;
    .bug {
        display: flex;
        color: #fff;
        padding: 15px;
        width: 100%;
        min-height: 300px;
        float: left;
        border-radius: 3px;
        flex-direction: column;
        margin-left: auto;
        background: #242526;
        box-shadow: 0px 2px 3px 0px #0000008f;
        .header {
            float: left;
            width: 100%;
            display: flex;
            color: #d0d0d0;
            font-size: 0.85em;
            font-weight: 600;
            letter-spacing: 0.02em;
            border-bottom: 1px solid #3c3d3e;
            padding-bottom: 15px;
            .title-and-category {
                display: flex;
                align-items: center;
                .category {
                    margin-left: auto;
                    text-transform: uppercase;
                    line-height: 1.1;
                    color: #fff;
                    height: 14px;
                    font-size: 0.7em;
                    padding: 2px 7px;
                    border-radius: 3px;
                    margin-left: 5px;
                    &.critical {
                        background: #943030;
                    }
                    &.severe {
                        background: #8f4a1c;
                    }
                    &.easy {
                        background: #8f711e;
                    }
                    &.nth {
                        background: #31680c;
                    }
                }
            }
            .action-container {
                flex: 0;
                display: flex;
                align-items: center;
                margin-left: auto;
                .mark-as-done {
                    margin-left: 10px;
                    margin-right: 10px;
                }
                .more-info {
                    margin-right: 10px;
                }
                .mark-as-done,
                .assign,
                .remove,
                .more-info {
                    cursor: pointer;
                    width: 27px;
                    height: 27px;
                    background: #3c3d3e;
                    border-radius: 50%;
                    display: flex;
                    &:hover {
                        background: #48494b;
                    }
                    span {
                        margin: auto;
                        color: #39b6ff;
                        font-size: 16px;
                    }
                }
            }
        }
        .bug-info-container {
            float: left;
            flex: 1;
            width: 100%;
            align-items: center;
            padding-top: 10px;
            font-size: 0.8em;
            font-weight: 600;
            color: rgba(250, 250, 250, 0.822);
            .input-placeholder-container {
                width: 50%;
                float: left;
                padding: 3px 7px;
                margin-bottom: 2px;
                .label {
                    color: rgba(248, 248, 248, 0.527);
                    font-weight: 300;
                    font-size: 0.85em;
                    text-transform: uppercase;
                    margin-bottom: 2px;
                }
                .input {
                    width: 100%;
                    background: #18191a80;
                    padding: 3px 7px;
                    border-radius: 3px;
                    min-height: 25px;
                    box-shadow: 0 0 0pt 1px #ffffff0f;
                }
            }
            .textfield-placeholder-container {
                width: 100%;
                float: left;
                padding: 3px 7px;
                margin-bottom: 2px;
                .label {
                    margin-left: 3px;
                    color: rgba(248, 248, 248, 0.527);
                    font-weight: 300;
                    font-size: 0.85em;
                    text-transform: uppercase;
                    margin-bottom: 2px;
                }
                .textfield {
                    width: 100%;
                    background: #18191a80;
                    padding: 3px 7px;
                    border-radius: 3px;
                    min-height: 25px;
                    box-shadow: 0 0 0pt 1px #ffffff0f;
                }
            }

            .reported-at {
                margin-left: 5px;
                margin-right: 10px;
                opacity: 0.5;
            }
            .mdi:first-child {
                margin-right: 5px;
            }
            .mdi {
                color: rgb(255, 57, 74);
                opacity: 0.5;
            }
            .dev {
                float: left;
                margin-left: 2px;
                opacity: 0.5;
            }
        }
    }
}
</style>