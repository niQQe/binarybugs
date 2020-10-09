<template>
    <div
        class="project-stat"
        :class="{ resolved: category === 'resolved' }"
    >
        <div class="project-stat-header">{{ category }}</div>

        <div class="percentage-bar-container">
            <div
                class="percentage-bar"
                :class="{ green: category === 'resolved' }"
                :style="{
                    width: getPercentage(amount, totalBugAmount),
                }"
            ></div>
        </div>
        <span class="bug-amount">{{ amount }}</span>
    </div>
</template>

<script>
export default {
    name: "ProjectStatBar",
    props: {
        category:String,
        amount: Number,
        totalBugAmount: Number,
    },
    methods: {
        getPercentage(amount, total) {
            const percentage = (amount / total) * 100;
            if (isNaN(percentage)) return "0%";
            return percentage + "%";
        },
    },
    created() {},
};
</script>

<style lang="scss" scoped>
.project-stats-container {
    color: rgb(152, 152, 152);
    flex: 1;
    .project-stat {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        &.resolved{
            margin-bottom:5px!important;
            .project-stat-header{
                color:rgba(255, 255, 255, 0.789);
            }
            
        }
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
                &.green {
                    background: rgb(17, 189, 17) !important;
                }
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
</style>