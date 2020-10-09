<template>
    <router-link class="project-container" :to="{ path: '/' + project.id }">
        <div class="project-box-header">
            <span>{{ project.name }}</span>
        </div>
        <div style="padding: 10px 0px">
            <div
                class="project-stats-container"
                v-for="bug in project.bugs"
                :key="bug.category"
            >
                <ProjectStatBar :bug="bug" :project="project" />
            </div>
        </div>
    </router-link>
</template>

<script>
import ProjectStatBar from "./ProjectStatBar";

export default {
    name: "ProjectBox",
    props: {
        project: Object,
    },
    components: {
        ProjectStatBar,
    },
    data: () => ({}),
    methods: {
        getPercentage(amount, total) {
            const percentage = (amount / total) * 100;
            if (isNaN(percentage)) return "0%";
            return percentage + "%";
        },
    },
    created(){
        console.log('AS)ONDHA)=SDN')
        console.log(this.project)
    }
};
</script>

<style lang="scss" scoped>
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
    .project-box-header {
        width: 100%;
        float: left;
        display: flex;
        padding: 0px 0px 10px 0px;
        color: #d0d0d0;
        font-size: 1em;
        font-weight: 500;
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
                font-size: 11px;
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
                font-size: 12px;
                color: #f0f0f0;
                font-weight: 500;
                float: right;
                margin-left: auto;
            }
        }
    }
}
</style>