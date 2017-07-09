<template>
    <div>
        <div class="row">
            <div class="col-md-6">
                <label>GET 参数:</label>
                <tree-view :data="params"></tree-view>
            </div>
            <div class="col-md-6">
                <label>POST RAW:</label>
                <tree-view :data="body"></tree-view>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            detail: Object,
            params: Object,
            body: Object
        }
    }
</script>