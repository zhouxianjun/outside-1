<template>
    <div>
        <div class="box box-default">
            <div class="box-header with-border">
                <h3 class="box-title">查询</h3>

                <div class="box-tools pull-right">
                    <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i></button>
                    <button type="button" class="btn btn-box-tool" @click="doQuery"><i class="glyphicon glyphicon-search"></i></button>
                </div>
            </div>
            <div class="box-body">
                <div class="row">
                    <div class="col-sm-4">
                        <label>用户</label>
                        <div class="form-group">
                            <input type="text" v-model="search.query.user" class="form-control pull-right">
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <label>版本</label>
                        <div class="form-group">
                            <input type="text" v-model="search.query.version" class="form-control pull-right">
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <label>厂商</label>
                        <div class="form-group">
                            <input type="text" v-model="search.query.producer" class="form-control pull-right">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-4">
                        <label>渠道</label>
                        <div class="form-group">
                            <input type="text" v-model="search.query.channel" class="form-control pull-right">
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <label>包名</label>
                        <div class="form-group">
                            <input type="text" v-model="search.query.pkg" class="form-control pull-right">
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <label>反馈时间</label>
                        <div class="form-group">
                            <Date-picker ref="date" placement="bottom-end" style="width: 100%" type="datetimerange" placeholder="选择日期和时间"></Date-picker>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="panel panel-default i-panel-default">
            <div class="panel-heading">
                <span>静默安装统计</span>
            </div>
            <div class="panel-body">
                <Table :columns="table.columns" :data="table.data" :headerColor="`#fff`"></Table>
                <div style="margin: 10px;overflow: hidden">
                    <div style="float: right;">
                        <Page :total="table.total" :show-sizer="true" placement="top" @on-page-size-change="changePageSize" @on-change="changePage"></Page>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import view from '../../script/view/statistics/install';
    export default view;
</script>