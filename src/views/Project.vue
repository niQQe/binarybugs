<template>
    <div id="bugs">
        <div
            class="project-dropdown"
            @click="toggleShowProjects"
            v-on-clickaway="hideProjectDropdown"
            v-if="$route.params.id"
        >
            <div class="current-project">
                Ikea <span class="mdi mdi-menu-down"></span>
            </div>
            <div
                class="dropdown"
                :class="{ show: showProjects }"
                v-if="projectNames"
            >
                <div class="dropdown-container">
                    <div class="dropdown-header">All projects</div>
                    <div
                        v-for="project in projectNames"
                        :key="project.id"
                        class="project"
                        :class="{
                            active: project.id === $route.path.substring(1),
                        }"
                        @click="goTo(project.id)"
                    >
                        {{ project.name }}
                    </div>
                </div>
            </div>
        </div>
        <span class="project-header"
            >Current bugs for {{ currentProject.name }}</span
        >
        <div class="project-menu">
            <div class="menu">
                <div
                    class="menu-btn"
                    :class="selectedTab === 'activebugs' ? 'highlight' : ''"
                    @click="selectedTab = 'activebugs'"
                >
                    <span>Active bugs</span>
                </div>
                <div
                    class="menu-btn"
                    :class="selectedTab === 'resolved' ? 'highlight' : ''"
                    @click="selectedTab = 'resolved'"
                >
                    Resolved
                </div>
                <div
                    class="menu-btn"
                    :class="selectedTab === 'history' ? 'highlight' : ''"
                    @click="selectedTab = 'history'"
                >
                    History
                </div>
                <span class="active-bar" :class="selectedTab"></span>
            </div>
        </div>
        <div id="bug-table-container">
            <div class="bug-table">
                <div
                    class="action-container"
                    :class="{ searchActive: activateSearch }"
                    @click="highlightSearch"
                    v-on-clickaway="deactivateSearch"
                >
                    <div class="search-input-container">
                        <span class="mdi mdi-magnify"></span>
                        <input
                            type="text"
                            placeholder="Search for bugs"
                            ref="searchinput"
                            v-model="search"
                        />
                    </div>
                    <div
                        @click.stop="createBug()"
                        class="add-bug"
                        v-if="!activateSearch"
                    >
                        Add bug
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th
                                v-for="header in headers"
                                :key="header.id"
                                @click="sort(header)"
                            >
                                <span class="header">{{
                                    header.replace(/_/g, " ")
                                }}</span>
                                <span
                                    :class="
                                        header === sortHeader ? activeSort : ''
                                    "
                                    class="mdi mdi-arrow-down sort-arrow"
                                ></span>
                            </th>
                            <th
                                v-if="selectedTab === 'resolved'"
                                style="text-align: left"
                            >
                                Resolved at
                            </th>
                            <th style="text-align: right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="bug in filteredBugs"
                            :key="bug._id"
                            @click="inspectBug(bug)"
                        >
                            <td>{{ bug.title || "N/A" }}</td>
                            <td>{{ bug.written_by.fullname || "N/A" }}</td>
                            <td>{{ bug.reported_at || "N/A" }}</td>
                            <td>{{ bug.platform || "N/A" }}</td>
                            <td>{{ bug.browser || "N/A" }}</td>
                            <td>
                                <span
                                    class="mdi mdi-checkbox-blank-circle category"
                                    :class="bug.category"
                                ></span
                                >{{ bug.category }}
                            </td>
                            <td>{{ bug.assigned.name }}</td>
                            <td v-if="selectedTab === 'resolved'">
                                {{ getFormatedDate(bug.resolved_at) }}
                            </td>
                            <td
                                style="display: flex; justify-content: flex-end"
                            >
                                <div>
                                    <button
                                        class="table-action-btn"
                                        @click.stop="markAsResolved(bug._id)"
                                        v-if="!bug.resolved"
                                        :disabled="
                                            bug.assigned.id !==
                                            GET_USER_INFO._id
                                        "
                                    >
                                        <span class="mdi mdi-check"></span>
                                    </button>
                                    <div
                                        class="table-action-btn"
                                        v-if="bug.resolved"
                                        @click.stop="markAsActive(bug._id)"
                                    >
                                        <span class="mdi mdi-undo"></span>
                                    </div>
                                    <button
                                        class="table-action-btn"
                                        :disabled="
                                            bug.assigned.id !==
                                            GET_USER_INFO._id
                                        "
                                    >
                                        <span class="mdi mdi-close"></span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import { mixin as clickaway } from "vue-clickaway";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { bus } from "@/main";
import { mapGetters, mapActions, mapState } from "vuex";
export default {
    name: "Project",
    mixins: [clickaway],
    props: {
        socket: Object,
    },
    data: () => ({
        search: "",
        showProjects: false,
        projectNames: null,
        selectedTab: "activebugs",
        activateSearch: false,
        currentProject: "",
        previewHeaders: [
            "title",
            "written_by",
            "category",
            "assigned",
            "platform",
            "reported_at",
            "browser",
        ],
        headers: [],
        activeSort: null,
        activeHeaderSorted: "",
        sortHeader: null,
        original: null,
        showProjects: false,
    }),
    watch: {
        GET_ALL_PROJECTS: {
            handler: function (projects) {
                if (projects.length > 0) {
                    const project = projects.filter(
                        (project) =>
                            project.id === this.$route.path.substring(1)
                    );
                    this.currentProject = project[0];
                    const names = projects.map((project) => {
                        return { name: project.name, id: project.id };
                    });
                    this.projectNames = names;
                }
            },
            immediate: true,
            deep: true,
        },
        GET_ALL_BUGS_IN_PROJECT(bugs) {
            const [bug] = bugs;
            const headers = Object.keys(bug)
                .map((header) =>
                    this.previewHeaders.includes(header) ? header : ""
                )
                .filter((header) => header !== "");
            this.headers = headers;
        },
    },
    mounted() {
        dayjs.extend(relativeTime);
        this.$socket.emit({
            type: "find-by-id",
            group: false,
            payload: {
                key: "projectid",
                id: this.$route.params.id,
                storeAction: "setAllBugsInProject",
                collection: "Bug",
            },
        });
    },
    methods: {
        hideProjectDropdown() {
            this.showProjects = false;
        },
        highlightSearch() {
            this.activateSearch = true;
            this.$nextTick(() => this.$refs.searchinput.focus());
        },
        deactivateSearch() {
            this.activateSearch = false;
        },

        goTo(id) {
            this.$router.push({ path: id });
        },
        inspectBug(bug) {
            const excludedField = ["projectid", "__v", "resolved", "_id"];
            const filteredBugs = Object.keys(bug).reduce((acc, key) => {
                if (!excludedField.includes(key)) acc[key] = bug[key];
                return acc;
            }, {});

            bus.$emit("show-inspect-bug-dialog", filteredBugs);
        },
        sort(header) {
            if (this.sortHeader !== null && this.sortHeader !== header)
                this.activeSort = null;
            if (!this.original) {
                this.original = JSON.parse(
                    JSON.stringify(this.GET_ALL_BUGS_IN_PROJECT)
                );
            }

            if (!this.activeSort) {
                this.GET_ALL_BUGS_IN_PROJECT.sort((a, b) => {
                    this.sortHeader = header;
                    if (typeof a[header] === "object") {
                        if(a[header].name)
                            if (a[header].name.toLowerCase() < b[header].name.toLowerCase()) return -1;
                        if(a[header].fullname)
                            if (a[header].fullname.toLowerCase() < b[header].fullname.toLowerCase()) return -1;
                    } else {
                        if (a[header].toLowerCase() < b[header].toLowerCase()) return -1;
                        if (a[header].toLowerCase() > b[header].toLowerCase()) return 1;
                    }
                });
                this.activeSort = "asc";
                return;
            }
            if (this.activeSort === "asc") {
                this.sortHeader = header;
                this.GET_ALL_BUGS_IN_PROJECT.sort((a, b) => {
                    if (typeof a[header] === "object") {
                        if(a[header].name)
                            if (a[header].name.toLowerCase() > b[header].name.toLowerCase()) return -1;
                        if(a[header].fullname)
                            if (a[header].fullname.toLowerCase() > b[header].fullname.toLowerCase()) return -1;
                    } else {
                        if (a[header].toLowerCase() > b[header].toLowerCase()) return -1;
                        if (a[header].toLowerCase() < b[header].toLowerCase()) return 1;
                    }
                });
                this.activeSort = "desc";
                return;
            }
            if (this.activeSort === "desc") {
                this.sortHeader = header;
                this.$store.commit("SET_ALL_BUGS_IN_PROJECT", this.original);
                this.original = null;
                this.activeSort = null;
                this.sortHeader = null
            }
        },
        createBug(projectId, name) {
            bus.$emit("show-create-new-bug-dialog", {
                projectId: this.$route.params.id,
                name: this.currentProject.name,
            });
        },
        getFormatedDate(bug) {
            if (bug) return dayjs(bug).fromNow();
        },
        markAsResolved(id) {
            this.$socket.emit({
                type: "update-one",
                group: true,
                payload: {
                    _id: id,
                    keys: {
                        resolved: true,
                        resolved_at: new Date(),
                    },
                    storeAction: "setBugAsResolved",
                    collection: "Bug",
                },
            });
        },
        markAsActive(id) {
            this.$socket.emit({
                type: "update-one",
                group: true,
                payload: {
                    _id: id,
                    keys: {
                        resolved: false,
                        resolved_at: "",
                    },
                    storeAction: "setBugAsActive",
                    collection: "Bug",
                },
            });
        },
        toggleShowProjects() {
            this.showProjects = !this.showProjects;
        },
    },
    computed: {
        ...mapGetters([
            "GET_ALL_BUGS_IN_PROJECT",
            "GET_ALL_PROJECTS",
            "GET_USER_INFO",
        ]),
        filteredBugs() {
            let array = [];
            if (this.selectedTab === "activebugs")
                array = this.GET_ALL_BUGS_IN_PROJECT.filter(
                    (bug) => !bug.resolved
                );
            if (this.selectedTab === "resolved")
                array = this.GET_ALL_BUGS_IN_PROJECT.filter(
                    (bug) => bug.resolved
                );

            const bugsFound = array.filter((bug) => {
                let found = false;
                Object.values(bug).forEach((value) => {
                    if(typeof value === 'object'){
                        Object.values(value).forEach(innervalue => {
                            if (String(innervalue).toLowerCase().includes(this.search.toLowerCase())){
                                found = true
                            }
                        })
                    } else {
                        if (String(value).toLowerCase().includes(this.search.toLowerCase()))
                            found = true;
                    }
                });
                return found;
            });
            return bugsFound;
        },
    },
};
</script>

<style lang="scss" scoped>
#bugs {
    float: left;
    width:100%;
    .project-header {
        color: #fff;
        font-size: 32px;
        margin-bottom: 10px;
        margin-top: 0px;
        float: left;
        width: 100%;
        font-family: "Open Sans", sans-serif;
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
        .menu {
            float: left;
            height: 100%;
            position: relative;
            width: 100%;
            .menu-btn {
                margin-right: 25px;
                float: left;
                font-weight: 550;
                color: rgba(255, 255, 255, 0.644);
                position: relative;
                padding-bottom: 10px;
                cursor: pointer;
            }
            .active-bar {
                background: #39b6ff;
                border-top-left-radius: 3px;
                border-top-right-radius: 3px;
                position: absolute;
                bottom: 0px;
                height: 3px;
                transition: all 0.2s ease;
                &.activebugs {
                    width: 74px;
                    left: 0px;
                }
                &.resolved {
                    width: 58px;
                    left: 99px;
                }
                &.history {
                    width: 46px;
                    left: 182px;
                }
            }
        }
    }
    .header {
        float: left;
    }
}

#bug-table-container {
    float: left;
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 20px;
    padding-bottom: 20px;
    .bug-table {
        width: 100%;
        float: left;
        background: #1b1c1d;
        border-radius: 8px;
        box-shadow: 0px 1px 3px 0px #000000cd;
        overflow: hidden;
        .action-container {
            background: #161617;
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0px 10px;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            cursor: pointer;
            .search-input-container {
                height: 100%;
                float: left;
                display: flex;
                align-items: center;
                input {
                    background: transparent !important;
                    border: none !important;
                    width: 400px !important;
                    max-width: 400px !important;
                    min-width: 400px !important;
                    margin: 0 !important;
                    font-size: 14px !important;
                    pointer-events: none;
                    padding-left: 15px;
                    &:focus {
                        outline: none !important;
                        border: none !important;
                        box-shadow: none;
                    }
                }
                span {
                    font-size: 24px;
                    margin-left: 10px;
                    color: rgba(255, 255, 255, 0.644);
                }
            }
            .add-bug {
                color: #fff;
                float: right;
                font-weight: 500;
                letter-spacing: 0.25px;
                background: #328abe;
                font-size: 14px;
                padding: 7px 15px;
                border-radius: 8px;
                transition: all 0.2s ease;
                &:hover {
                    background: #26698f;
                }
            }
        }
        .searchActive {
            background: #1b1c1d;
            box-shadow: 0 1px 2px 0 #0000006e, 0 2px 6px 2px #00000045;
            border-top-right-radius: 8px;
            border-top-left-radius: 8px;
            pointer-events: none !important;
            z-index: 1;
            position: relative;
            input {
                color: #fff !important;
                pointer-events: all !important;
                &::placeholder {
                    color: rgba(255, 255, 255, 0.768);
                }
            }
        }
        .category {
            margin-right: 10px;
            &.critical {
                color: rgb(223, 56, 56);
            }
            &.severe {
                color: rgb(238, 110, 51);
            }
            &.easy {
                color: rgb(238, 201, 51);
            }
            &.nth {
                color: #39b6ff;
            }
        }
        .table-action-btn {
            width: 27px;
            height: 27px;
            display: flex;
            background: #242526;
            border: none;
            line-height: 1;
            padding: 0;
            border-radius: 25px;
            float: left;
            transition: all 0.2s ease;
            cursor: pointer;
            margin-left: 10px;
            color: #fff;
            &:hover {
                background: #2e2f31;
            }
            span {
                margin: auto;
                font-size: 15px;
            }
            .mdi-check {
                color: #26e826;
            }
            &:disabled {
                color: grey !important;
                pointer-events: none;
                span {
                    color: grey;
                }
            }
        }
        table {
            width: 100%;
            border-spacing: 0px;
            font-size: 12px;
            thead {
                color: #6e6e6e;
                background: #161617;
                border: none;
                th {
                    padding: 10px 20px;
                    font-weight: 600;
                    letter-spacing: 0.25px;
                    border-bottom: 1px solid #ffffff12;
                    text-transform: capitalize;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    &:hover {
                        .sort-arrow {
                            opacity: 1;
                        }
                    }
                    .header {
                        float: left;
                    }
                    .sort-arrow {
                        float: left;
                        opacity: 0;
                        font-size: 14px;
                        margin-left: 2px;
                        transition: all 0.2s ease;
                    }
                    .asc {
                        color: #fff;
                        opacity: 1;
                    }
                    .desc {
                        color: #fff;
                        transform: rotate(180deg);
                        opacity: 1;
                    }
                }

                tr {
                    border: none;
                }
            }
            tbody {
                td {
                    padding: 14px 20px;
                    color: rgba(255, 255, 255, 0.83);
                    font-weight: 400;
                    border-bottom: 1px solid #ffffff12;
                    text-transform: capitalize;
                    min-width: 170px;
                    min-height: 55px;
                }
                tr {
                    cursor: pointer;
                    &:last-child {
                        td {
                            border: none !important;
                        }
                    }
                }
                tr:hover {
                    background: #1d1e20;
                }
            }
        }
    }
}

.project-dropdown {
    float: left;
    color: #dbdbdb;
    display: flex;
    align-items: center;
    font-size: 14px;
    margin-top: 0px;
    cursor: pointer;
    z-index: 999;
    position: relative;
    transition: all 0.2s ease;
    margin-bottom: 20px;
    .current-project {
        display: flex;
        align-items: center;
        width: 100%;
        font-weight: 500;
        transition: opacity 0.2s ease;

        .mdi {
            margin-left: 15px;
            font-size: 22px;
        }
    }
    .dropdown {
        opacity: 1;
        max-height: 0px;
        max-width: 0px;
        min-width: 0;
        transition: all 0.2s ease;
        top: 9px;
        left: -5px;
        position: absolute;
        background: #242526;
        overflow: hidden;
        border-radius: 8px;
        padding: 10px 0px;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.3),
            0 2px 6px 2px rgba(0, 0, 0, 0.15);

        .dropdown-header {
            color: rgba(255, 255, 255, 0.589);
            margin-bottom: 10px;
            padding: 0px 16px;
            font-size: 13px;
            min-width: 170px;
            transition: opacity 0.2s ease;
        }
        .project {
            float: left;
            height: 32px;
            min-width: 170px;
            padding: 0px 16px;
            display: flex;
            align-items: center;
            color: rgba(255, 255, 255, 0.808);
            &:hover {
                background: rgba(255, 255, 255, 0.056);
            }
            &.active {
                background: #2d2f30;
                pointer-events: none;
                color: #39b6ff;
            }
        }
        .dropdown-container {
            opacity: 0;
            transition: all 0.2s ease;
        }
        &.show {
            .dropdown-container {
                transition-delay: 0.15s;
                opacity: 1 !important;
            }
        }
    }
    .dropdown.show {
        max-width: 170px !important;
        min-width: 170px;
        max-height: 500px;
        opacity: 1;
    }
}
</style>