<template>
    <div id="dialog-cover">
        <div id="inspect-bug">
            <div class="header">
                {{ bugInfo.title }}
                <div class="close-btn">
                    <span class="mdi mdi-close" @click="closeDialog()"></span>
                </div>
            </div>
            <div class="buginfo-container">
                <div
                    v-for="(info, key) in bugInfo"
                    :key="key"
                    :class="largeFields.includes(key) ? 'large-field' : 'field'"
                >
                    <div class="info-container">
                        <div class="field-header">
                            {{ key.replace(/_/g, " ") }}
                        </div>
                        <div class="info-field">
                            {{
                                info.name
                                    ? info.name
                                    : info.fullname
                                    ? info.fullname
                                    : info || "N/A"
                            }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { bus } from "@/main";

export default {
    name: "InspectBug",
    props: {
        bugInfo: Object,
    },
    data: () => ({
        largeFields: [
            "description",
            "expected_result",
            "actual_result",
            "step_for_reproduction",
            "comment",
        ],
    }),
    methods: {
        closeDialog() {
            bus.$emit("close-dialog");
        },
    },
};
</script>

<style lang="scss" scoped>
#inspect-bug {
    width: 1000px;
    max-height: 900px;
    margin: auto;
    background: #161617;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.3),
        0 6px 10px 4px rgba(0, 0, 0, 0.15) !important;
    .header {
        font-size: 20px;
        font-family: "Open Sans";
        color: #fff;
        font-weight: 600;
        letter-spacing: 0.25px;
        margin-bottom: 20px;
        .close-btn {
            float: right;
            width: 35px;
            height: 35px;
            border-radius: 30px;
            display: flex;
            cursor: pointer;
            transition: all 0.2s ease;
            color: rgba(255, 255, 255, 0.638);
            span {
                margin: auto;
            }
            &:hover {
                color: #fff;
            }
            &:active {
                background: rgba(255, 255, 255, 0.111);
            }
        }
    }
    .buginfo-container {
        font-size: 13px;
        border-radius: 8px;
        float: left;
        overflow: hidden;
        .field-header {
            color: rgba(255, 255, 255, 0.645);
            text-transform: capitalize;
            font-weight: 500;
            letter-spacing: 0.25px;
            margin-bottom: 5px;
        }
        .field,
        .large-field {
            padding: 1px;
            color: #f0f0f0;
        }

        .field {
            width: 33.333%;
            float: left;
            height: 100%;
        }
        .large-field {
            width: 100%;
            float: left;
        }
        .info-container {
            padding: 8px 12px;
            background: #252526;
        }
    }
}
</style>