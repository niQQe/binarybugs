<template>
    <div id="content">
            <div
                style="
                    width: 100%;
                    height: 100%;
                    margin: auto;
                    display: flex;
                    flex-direction: column;
                "
            >
                <div
                    class="header-container"
                    style="width: 100%; float: left; height: 100%; flex: 0"
                >
                    <!-- <div
                        class="header"
                        style="
                            color: #fff;
                            padding: 0px 20px;
                            font-size: 1em;
                            color: #f3c442;
                            flex: none;
                            font-weight: 700;
                        "
                    >
                        Projects
                    </div> -->
                </div>
                <div
                    class="projects-container"
                    style="height: 100%; float: left"
                >
                    <div
                        v-for="(project, index) in projects"
                        class="project-container"
                        :key="index"
                    >
                        <div class="project-card">
                            <span class="project-header">{{
                                project.name
                            }}</span>
                         <div style="color:#fff; flex:1;margin-top:10px;padding:10px">
                             <div style="margin:auto;">
                             <div style="display:flex;align-items:center;margin-bottom:10px;">
                                <div style="float:left;text-transform:uppercase;font-size:0.8em;font-weight:700;letter-spacing:0.05rem;min-width:60px">Critical</div>
                                <div style="width:10%;margin-top:3px;margin-left:10px;height:5px;background:#dc5e58;border-top-right-radius:10px;border-bottom-right-radius:10px;float:left;"></div><span style="font-size:0.8em;color:#f0f0f0; font-weight:700;margin-left:auto;">3</span>
                             </div>
                             <div style="display:flex;align-items:center;margin-bottom:10px;">
                                <div style="float:left;text-transform:uppercase;font-size:0.8em;font-weight:700;letter-spacing:0.05rem;min-width:60px">Severe</div>
                                <div style="width:20%;margin-top:3px;margin-left:10px;height:5px;background:rgb(255 129 0);border-top-right-radius:10px;border-bottom-right-radius:10px;float:left;"></div><span style="font-size:0.8em;color:#f0f0f0; font-weight:700;margin-left:auto;">5</span>
                             </div>
                             <div style="display:flex;align-items:center;margin-bottom:10px;">
                                <div style="float:left;text-transform:uppercase;font-size:0.8em;font-weight:700;letter-spacing:0.05rem;min-width:60px">Easy</div>
                                <div style="width:30%;margin-top:3px;margin-left:10px;height:5px;background:rgb(255 247 0);border-top-right-radius:10px;border-bottom-right-radius:10px;float:left;"></div><span style="font-size:0.8em;color:#f0f0f0; font-weight:700;margin-left:auto;">7</span>
                             </div>
                             <div style="display:flex;align-items:center;margin-bottom:10px;">
                                <div style="float:left;text-transform:uppercase;font-size:0.8em;font-weight:700;letter-spacing:0.05rem;min-width:60px;">NTH</div>
                                <div style="width:50%;margin-top:3px;margin-left:10px;height:5px;background:rgb(145 255 0);border-top-right-radius:10px;border-bottom-right-radius:10px;float:left;"></div><span style="font-size:0.8em;color:#f0f0f0; font-weight:700;margin-left:auto;">20</span>
                             </div>
                             </div>
                         </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Dashboard",
    components: {},
    data: () => ({
        projects: [
            {
                name: "Livenation",
            },
            {
                name: "COOP",
            },
            {
                name: "KRAFT",
            },
            {
                name: "McDonalds",
            },
            {
                name: "Livenation",
            },
            {
                name: "COOP",
            },
            {
                name: "KRAFT",
            },
            {
                name: "McDonalds",
            },
        ],
    }),
    mounted() {},
    created() {},
};
</script>

<style lang="scss">
.projects-container {
    .project-container {
        width: 324px;
        height: auto;
        float: left;
        padding: 20px;
        .project-card {
            height: 100%;
            width: 100%;
            display: flex;
            flex-direction: column;
            border-radius: 10px;
            background: #292b2f;
            padding: 10px;
            .project-header {
                width: 100%;
                float: left;
                color: #b0b3b8;
                text-align: center;
                font-size: 1.2em;
                font-weight: 700;
                letter-spacing: 0.02em;
            }
        }
    }
}
</style>