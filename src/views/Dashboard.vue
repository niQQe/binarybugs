<template>
    <div id="projects-container">
        <transition-group name="insert" tag="div">
            <div
                v-for="(project, index) in projects"
                class="project-container-wrapper"
                :key="index"
            >
                <div class="project-container">
                    <span class="project-header">{{ project.name }}</span>
                    <div style="padding:10px 0px;">
                        <div
                            class="project-stats-container"
                            v-for="bug of project.bugs"
                            :key="bug.category"
                        >
                            <div class="project-stat">
                                <div class="project-stat-header">
                                    {{ bug.category }}
                                </div>

                                <div class="percentage-bar-container">
                                    <div
                                        class="percentage-bar"
                                        :style="{ width: bug.percentage + '%' }"
                                    ></div>
                                </div>
                                <span class="bug-amount">{{ bug.amount }}</span>
                            </div>
                        </div>
                    </div>
                </div>
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
            type: "find-all",
            group: true,
            payload: {
                responseMessage: "ALL_PROJECTS",
                collection: "Project",
            },
        });
        this.socket.on("ALL_PROJECTS", ({ payload }) => {
            for (let project of payload.data) {
                project.bugs = [
                    {
                        category: "critical",
                        amount: Math.floor((Math.random() * 7) + 1),
                        percentage: 10,
                    },
                    {
                        category: "Severe",
                       amount: Math.floor((Math.random() * 10) + 1),
                        percentage: 15,
                    },
                    {
                        category: "Easy",
                        amount: Math.floor((Math.random() * 15) + 1),
                        percentage: 23,
                    },
                    {
                        category: "NTH",
                        amount: Math.floor((Math.random() * 25) + 1),
                        percentage: 30,
                    },
                ];
            }
            this.projects = payload.data;
        });
        this.socket.on("NEW_PROJECT", ({ payload }) => {
            console.log("new");
            this.projects.push({
                name: payload.data.name,
                bugs: [
                    {
                        category: "critical",
                        amount: 0,
                        percentage: 0,
                    },
                    {
                        category: "Severe",
                        amount: 0,
                        percentage: 0,
                    },
                    {
                        category: "Easy",
                        amount: 0,
                        percentage: 0,
                    },
                    {
                        category: "NTH",
                        amount: 0,
                        percentage: 0,
                    },
                ],
            });
            bus.$emit("close-dialog");
        });
    },
    created() {
        console.log(this.projects);
    },
    methods: {},
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
                background: #2b2d2e;
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
                        min-width: 75px;
                    }
                    .percentage-bar-container {
                        width: 60%;
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
                padding: 0px 0px 10px 0px;
                color: #d0d0d0;
                font-size: 1em;
                font-weight: 700;
                letter-spacing: 0.02em;
                border-bottom: 1px solid #9898981f;
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