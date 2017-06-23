<template>
    <div class="slimScroll">
        <div class="row">
            <div class="col-md-3 col-sm-6 col-xs-12">
                <div class="info-box">
                    <span class="info-box-icon bg-aqua"><i class="ion ion-ios-gear-outline"></i></span>

                    <div class="info-box-content">
                        <span class="info-box-text">所有服务</span>
                        <span class="info-box-number" v-html="tables.service.data.length"></span>
                    </div>
                    <!-- /.info-box-content -->
                </div>
                <!-- /.info-box -->
            </div>
            <!-- /.col -->
            <div class="col-md-3 col-sm-6 col-xs-12">
                <div class="info-box">
                    <span class="info-box-icon bg-red"><i class="fa fa-google-plus"></i></span>

                    <div class="info-box-content">
                        <span class="info-box-text">生产者</span>
                        <span class="info-box-number" v-html="tables.provider.data.length"></span>
                    </div>
                    <!-- /.info-box-content -->
                </div>
                <!-- /.info-box -->
            </div>
            <!-- /.col -->

            <!-- fix for small devices only -->
            <div class="clearfix visible-sm-block"></div>

            <div class="col-md-3 col-sm-6 col-xs-12">
                <div class="info-box">
                    <span class="info-box-icon bg-green"><i class="ion ion-ios-cart-outline"></i></span>

                    <div class="info-box-content">
                        <span class="info-box-text">消费者</span>
                        <span class="info-box-number" v-html="tables.consumer.data.length"></span>
                    </div>
                    <!-- /.info-box-content -->
                </div>
                <!-- /.info-box -->
            </div>
            <!-- /.col -->
            <div class="col-md-3 col-sm-6 col-xs-12">
                <div class="info-box">
                    <span class="info-box-icon bg-yellow"><i class="ion ion-ios-people-outline"></i></span>

                    <div class="info-box-content">
                        <span class="info-box-text">机器</span>
                        <span class="info-box-number" v-html="tables.address.data.length"></span>
                    </div>
                    <!-- /.info-box-content -->
                </div>
                <!-- /.info-box -->
            </div>
            <!-- /.col -->
        </div>
        <!-- /.row -->
        <div class="view-hr" style="margin-top: 40px;font-size: 16px"><b>服务详情</b></div>
        <Tabs name="service" class="no-border" style="height: 100%;">
            <Tab-pane style="padding-right: 2px" name="service" label="服务">
                <Table :columns="tables.service.columns" :data="tables.service.data"></Table>
            </Tab-pane>
            <Tab-pane style="padding-right: 2px" name="provider" label="生产者">
                <Table :columns="tables.provider.columns" :data="tables.provider.data"></Table>
            </Tab-pane>
            <Tab-pane style="padding-right: 2px" name="consumer" label="消费者">
                <Table :columns="tables.consumer.columns" :data="tables.consumer.data"></Table>
            </Tab-pane>
            <Tab-pane style="padding-right: 2px" name="address" label="机器">
                <Table :columns="tables.address.columns" :data="tables.address.data"></Table>
            </Tab-pane>
        </Tabs>
    </div>
</template>
<script>
    import Common from '../script/common';
    export default {
        data() {
            return {
                tables: {
                    service: {
                        columns: [{
                            title: '命名空间',
                            key: 'namespace'
                        }, {
                            title: '服务名',
                            key: 'name'
                        }],
                        data: []
                    },
                    provider: {
                        columns: [{
                            title: '命名空间',
                            key: 'namespace'
                        }, {
                            title: '服务名',
                            key: 'service'
                        }, {
                            title: '版本号',
                            key: 'version'
                        }, {
                            title: '机器IP',
                            key: 'host'
                        }, {
                            title: '机器端口',
                            key: 'port'
                        }, {
                            title: '权重',
                            key: 'weight'
                        }, {
                            title: '启动时间',
                            key: 'start',
                            render: Common.RENDER.DATE
                        }],
                        data: []
                    },
                    consumer: {
                        columns: [{
                            title: '命名空间',
                            key: 'namespace'
                        }, {
                            title: '服务名',
                            key: 'service'
                        }, {
                            title: '版本号',
                            key: 'version'
                        }, {
                            title: '机器IP',
                            key: 'host'
                        }, {
                            title: '访问',
                            key: 'status'
                        }, {
                            title: '路由',
                            key: 'router',
                            render(h, params) {
                                return h('span', params.row.router ? params.row.router.name : '未路由');
                            }
                        }, {
                            title: '启动时间',
                            key: 'start',
                            render: Common.RENDER.DATE
                        }],
                        data: []
                    },
                    address: {
                        columns: [{
                            title: '地址',
                            key: 'value'
                        }, {
                            title: '所属',
                            key: 'own'
                        }],
                        data: []
                    }
                }
            }
        },
        async mounted() {
            // 初始化数据
            let result = await this.fetch('/index/total');
            this.updateTableData(result);
        },
        methods: {
            updateTableData(result) {
                this.tables.service.data = result.service;
                this.tables.provider.data = result.provider;
                this.tables.consumer.data = result.consumer;
                this.tables.address.data = result.address;
            }
        }
    }
</script>