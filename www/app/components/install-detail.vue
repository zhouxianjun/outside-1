<template>
    <div>
        <div class="row">
            <div class="col-md-4">
                <label>时间类型:</label>
                <span v-html="getAttribute(InstallTimeType, 'id', detail['time_type']).name"></span>
            </div>
            <div class="col-md-4">
                <label>时间点:</label>
                <span v-html="Common.dateFormat(detail['point_time'])"></span>
            </div>
            <div class="col-md-4">
                <label>时间段:</label>
                <span v-html="`${Common.dateFormat(detail['start_time'])}~${Common.dateFormat(detail['end_time'])}`"></span>
            </div>
        </div>
        <div class="row">
            <div class="col-md-4">
                <label>联网打开:</label>
                <span v-html="Common.statusFormat(detail['net_open'])"></span>
            </div>
            <div class="col-md-4">
                <label>网络类型:</label>
                <span v-html="getAttribute(NetType, 'id', detail['net_type']).name"></span>
            </div>
            <div class="col-md-4">
                <label>安装位置:</label>
                <span v-html="getAttribute(InstallPathType, 'id', detail['install_path']).name"></span>
            </div>
        </div>
    </div>
</template>
<script>
    import Common from '../script/common';
    import {getAttribute, InstallTimeType, NetType, InstallPathType} from "../script/dic";
    export default {
        props: {
            detail: Object
        },
        data() {
            return {
                InstallTimeType,
                NetType,
                InstallPathType,
                Common
            }
        },
        methods: {
            getAttribute
        }
    }
</script>