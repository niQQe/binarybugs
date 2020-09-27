<template>
    <div>
        <div class="header">Current bugs</div>

        <div v-for="bug in bugs" :key="bug._id" class="bug-container">
            <div class="bug">
                <div>
                    <div class="header">
                        <span class="title-and-category"
                            >{{ bug.title }}
                            <span class="category" :class="bug.category">{{
                                bug.category
                            }}</span>
                        </span>
                    </div>
                    <div class="bug-info-container">
                        <div class="icon-container">
                            <span class="mdi mdi-calendar"></span>
                        </div>
                        <span class="reported-at">{{ bug.reported_at }}</span>
                        <div class="icon-container">
                            <span class="mdi mdi-ladybug"></span>
                        </div>
                        <span class="dev">{{ bug.assigned }}</span>
                    </div>
                </div>
                <div class="action-container">
                    <div class="more-info">
                        <span class="mdi mdi-information-outline"></span>
                    </div>
                    <div class="assign">
                        <span class="mdi mdi-account-arrow-right"></span>
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
        <div v-for="bug in bugs" :key="bug._id" class="bug-container">
            <div class="bug">
                <div>
                    <div class="header">
                        <span class="title-and-category"
                            >{{ bug.title }}
                            <span class="category" :class="bug.category">{{
                                bug.category
                            }}</span>
                        </span>
                    </div>
                    <div class="bug-info-container">
                        <div class="icon-container">
                            <span class="mdi mdi-calendar"></span>
                        </div>
                        <span class="reported-at">{{ bug.reported_at }}</span>
                        <div class="icon-container">
                            <span class="mdi mdi-ladybug"></span>
                        </div>
                        <span class="dev">{{ bug.assigned }}</span>
                    </div>
                </div>
                <div class="action-container">
                    <div class="more-info">
                        <span class="mdi mdi-information-outline"></span>
                    </div>
                    <div class="assign">
                        <span class="mdi mdi-account-arrow-right"></span>
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
        <div v-for="bug in bugs" :key="bug._id" class="bug-container">
            <div class="bug">
                <div>
                    <div class="header">
                        <span class="title-and-category"
                            >{{ bug.title }}
                            <span class="category" :class="bug.category">{{
                                bug.category
                            }}</span>
                        </span>
                    </div>
                    <div class="bug-info-container">
                        <div class="more-info">
                            <span class="mdi mdi-information-outline"></span>
                        </div>
                        <div class="icon-container">
                            <span class="mdi mdi-calendar"></span>
                        </div>
                        <span class="reported-at">{{ bug.reported_at }}</span>
                        <div class="icon-container">
                            <span class="mdi mdi-ladybug"></span>
                        </div>
                        <span class="dev">{{ bug.assigned }}</span>
                    </div>
                </div>
                <div class="action-container">
                    <div class="more-info">
                        <span class="mdi mdi-information-outline"></span>
                    </div>
                    <div class="assign">
                        <span class="mdi mdi-account-arrow-right"></span>
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
    </div>
</template>

<script>
export default {
    name: "Project",
    props: {
        socket: Object,
    },
    data: () => ({
        bugs: [],
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
};
</script>

<style lang="scss" scoped>
.header {
    padding: 0px 10px;
    color: #fff;
    font-weight: 600;
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
        float: left;
        border-radius: 3px;
        background: #242526;
        box-shadow: 0px 2px 3px 0px #0000008f;
        .header {
            width: 100%;
            float: left;
            display: flex;
            padding: 0px 0px 10px 0px;
            color: #d0d0d0;
            font-size: 0.85em;
            font-weight: 600;
            letter-spacing: 0.02em;
            margin-bottom: 10px;
            .title-and-category {
                flex: 1;
                .category {
                    margin-left: auto;
                    text-transform: uppercase;
                    line-height: 1.1;
                    color: #fff;
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
        }
        .bug-info-container {
            float: left;
            display: flex;
            width: 100%;
            align-items: center;

            font-size: 0.8em;
            font-weight: 600;
            color: rgba(250, 250, 250, 0.822);

            .reported-at {
                margin-left: 5px;
                margin-right: 10px;
                opacity: 0.5;
            }
            .mdi:first-child {
                margin-right: 5px;
            }
            .mdi {
                color: rgb(57, 182, 255);
                opacity: 0.5;
            }
            .dev {
                float: left;
                margin-left: 2px;
                opacity: 0.5;
            }
        }
        .action-container {
            flex: 0;
            display: flex;
            margin-left: auto;
            align-items: center;
            .mark-as-done {
                margin-left: 10px;
                margin-right: 10px;
            }
            .more-info{
                margin-right:10px;
            }
            .mark-as-done,
            .assign,
            .remove,
            .more-info {
                cursor: pointer;
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
</style>