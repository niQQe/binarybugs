<template>
    <div id="projects-container">
        <transition-group name="insert" tag="div">
            <div
                v-for="project in projects"
                class="project-container-wrapper"
                :key="project.id"
                @click="getName(project.name)"
            >
                <router-link
                    class="project-container"
                    :to="{ path: '/' + project.id }"
                    
                >
                    <div class="project-header">
                        <span>{{ project.name }}</span>
                        <div class="action-container">
                            <div
                                class="add-bug-container"
                                @click.prevent="
                                    createBug(project.id, project.name)
                                "
                            >
                                <span class="mdi mdi-plus"></span>
                            </div>
                        </div>
                    </div>
                    <div style="padding: 10px 0px">
                        <div class="project-stats-container">
                            <div class="project-stat">
                                <div class="project-stat-header">Critical</div>

                                <div class="percentage-bar-container">
                                    <div
                                        class="percentage-bar"
                                        :style="{
                                            width: getPercentage(
                                                project.critical.amount,
                                                project.total
                                            ),
                                        }"
                                    ></div>
                                </div>
                                <span class="bug-amount">{{
                                    project.critical.amount
                                }}</span>
                            </div>
                        </div>
                        <div class="project-stats-container">
                            <div class="project-stat">
                                <div class="project-stat-header">Severe</div>

                                <div class="percentage-bar-container">
                                    <div
                                        class="percentage-bar"
                                        :style="{
                                            width: getPercentage(
                                                project.severe.amount,
                                                project.total
                                            ),
                                        }"
                                    ></div>
                                </div>
                                <span class="bug-amount">{{
                                    project.severe.amount
                                }}</span>
                            </div>
                        </div>
                        <div class="project-stats-container">
                            <div class="project-stat">
                                <div class="project-stat-header">Easy</div>

                                <div class="percentage-bar-container">
                                    <div
                                        class="percentage-bar"
                                        :style="{
                                            width: getPercentage(
                                                project.easy.amount,
                                                project.total
                                            ),
                                        }"
                                    ></div>
                                </div>
                                <span class="bug-amount">{{
                                    project.easy.amount
                                }}</span>
                            </div>
                        </div>
                        <div class="project-stats-container">
                            <div class="project-stat">
                                <div class="project-stat-header">NTH</div>

                                <div class="percentage-bar-container">
                                    <div
                                        class="percentage-bar"
                                        :style="{
                                            width: getPercentage(
                                                project.nth.amount,
                                                project.total
                                            ),
                                        }"
                                    ></div>
                                </div>
                                <span class="bug-amount">{{
                                    project.nth.amount
                                }}</span>
                            </div>
                        </div>
                    </div>
                </router-link>
            </div>
        </transition-group>
    </div>
</template>

<script>
import { bus } from "@/main";

export default {
    name: "Dashboard",
    props: {
        socket: Object,
    },
    components: {},
    data: () => ({
        projects: [],
        createNewDialog: false,
    }),
    mounted() {
        this.socket.emit("request", {
            type: "find-all-projects",
            group: false,
            payload: {
                responseMessage: "ALL_PROJECTS",
                collection: "Project",
            },
        });
        this.socket.on("ALL_PROJECTS", ({ payload }) => {
            this.projects = payload.data;
        });

        this.socket.on("NEW_BUG", ({ payload }) => {
            for (let project of this.projects) {
                if (project.id === payload.data.projectid) {
                    project[payload.data.category].amount++;
                    project.total++;
                }
            }
            bus.$emit("close-dialog");
        });
        this.socket.on("NEW_PROJECT", ({ payload }) => {
            this.projects.push({
                name: payload.data.name,
                id: String(payload.data._id),
                created: payload.data.created,
                createdBy: payload.data.createdBy,
                total: 0,
                critical: {
                    amount: 0,
                    percentage: 0,
                },
                severe: {
                    amount: 0,
                    percentage: 0,
                },
                easy: {
                    amount: 0,
                    percentage: 0,
                },
                nth: {
                    amount: 0,
                    percentage: 0,
                },
            });
            bus.$emit("close-dialog");
        });
    },
    created() {},
    methods: {
        createBug(projectId, name) {
            bus.$emit("show-create-new-bug-dialog", { projectId, name });
        },
        getPercentage(amount, total) {
            const percentage = (amount / total) * 100;
            if (isNaN(percentage)) return "0%";
            return percentage + "%";
        },
        getName(name){
            console.log('GETNAME')
            bus.$emit('project-name', name)
        }
    },
};
</script>

<style lang="scss">
#projects-container {
    height: 100%;
    float: left;
    .project-container-wrapper {
        width: 324px;
        height: auto;
        float: left;
        padding: 10px;
        .project-container {
            height: 100%;
            width: 100%;
            display: flex;
            flex-direction: column;
            border-radius: 3px;
            background: #242526;
            box-shadow: 0px 2px 3px 0px #0000008f;
            padding: 10px 15px 0px 15px;
            transition: all 0.2s ease;
            cursor: pointer;
            &:hover {
                background: #28292a;
            }
            .project-stats-container {
                color: rgb(152, 152, 152);
                flex: 1;
                .project-stat {
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                    .project-stat-header {
                        color: rgb(152, 152, 152);
                        float: left;
                        text-transform: uppercase;
                        font-size: 0.8em;
                        font-weight: 700;
                        letter-spacing: 0.05rem;
                        min-width: 65px;
                    }
                    .percentage-bar-container {
                        width: 63%;
                        height: 4px;
                        background: #3c3c3d;
                        margin-left: 10px;
                        border-top-right-radius: 10px;
                        border-bottom-right-radius: 10px;
                        float: left;
                        .percentage-bar {
                            width: 10%;
                            height: 4px;
                            background: rgb(57, 182, 255);
                            float: left;
                            transition: all 0.5s ease;
                        }
                    }
                    .bug-amount {
                        font-size: 0.8em;
                        color: #f0f0f0;
                        font-weight: 600;
                        float: right;
                        margin-left: auto;
                    }
                }
            }
            .project-header {
                width: 100%;
                float: left;
                display: flex;
                padding: 0px 0px 10px 0px;
                color: #d0d0d0;
                font-size: 1em;
                font-weight: 700;
                letter-spacing: 0.02em;
                .action-container {
                    margin-left: auto;
                    .add-bug-container {
                        width: 25px;
                        height: 25px;
                        background: #3c3d3e;
                        border-radius: 50%;
                        display: flex;
                        &:hover {
                            background: #48494b;
                        }
                        span {
                            margin: auto;
                            color: #39b6ff;
                        }
                    }
                }
            }
        }
    }
}

.insert {
    &-enter,
    &-leave-to {
        opacity: 1;
    }
    &-enter {
        opacity: 0;
    }
    &-leave-to {
        opacity: 0;
    }
    &-enter-active {
        transition: opacity 0.2s ease,
            transform 1s cubic-bezier(0.68, -0.12, 0, 1.18);
    }
    &-leave-active {
        transition: opacity 0.2s ease,
            transform 1s cubic-bezier(0.68, -0.12, 0, 1.18);
    }
    &-move {
        transition: all 0.3s ease;
    }
}
</style>