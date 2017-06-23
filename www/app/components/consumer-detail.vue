<template>
    <div>
        <div class="row">
            <div class="col-md-2">
                <label>时间戳:</label>
                <span v-html="dateFormat(detail.start)"></span>
            </div>
            <div class="col-md-2">
                <label>进程号:</label>
                <span v-html="detail.pid"></span>
            </div>
            <div class="col-md-4">
                <label>路由:</label>
                <router-detail :detail="detail.router"></router-detail>
            </div>
        </div>
        <div class="row">
            <div class="col-md-4">
                <label>方法:</label>
                <span v-html="detail.methods"></span>
            </div>
            <div class="col-md-4">
                <label>扩展信息:</label>
                <span v-html="detail.attr"></span>
            </div>
        </div>
    </div>
</template>
<script>
    import Common from '../script/common';
    import routerDetail from './router-detail.vue';
    export default {
        props: {
            detail: Object
        },
        methods: {
            dateFormat: Common.dateFormat
        },
        components: {
            routerDetail
        }
    }
</script>