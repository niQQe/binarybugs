<template>
    <div id="projects-container">
        <div class="project-header">Projects</div>
        <div class="row">
            
                <div
                    v-for="project in GET_ALL_PROJECTS"
                    class="project-container-wrapper"
                    :key="project.id"
                >
                    <ProjectBox :project="project" />

                
                    
                </div>
        </div>
    </div>
</template>

<script>
import { bus } from "@/main";
import { mapGetters, mapActions } from "vuex";

import ProjectBox from "@/components/ProjectBox";

export default {
    name: "Dashboard",
    components: {
        ProjectBox,
    },
    data: () => ({
        createNewDialog: false,
    }),
    async mounted() {
        bus.$emit("close-dialog");
        console.log(this.GET_ALL_PROJECTS);
    },
    created() {},
    watch: {
        GET_ALL_PROJECTS(v) {
            console.log(v);
        },
    },
    methods: {
        createBug(projectId, name) {
            bus.$emit("show-create-new-bug-dialog", { projectId, name });
        },
        getName(name) {
            console.log("GETNAME");
            bus.$emit("project-name", name);
        },
    },
    computed: {
        ...mapGetters(["GET_ALL_PROJECTS"]),
    },
};
</script>

<style lang="scss">
.project-header {
    color: #fff;
    margin-bottom: 20px;
    font-size: 32px;
    font-family: "Open Sans";
}
#projects-container {
    height: 100%;
    float: left;
    width: 100%;
    .project-container-wrapper {
        width: 20%;
        height: auto;
        float: left;
        padding: 10px;
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