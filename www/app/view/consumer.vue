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
                    <div class="col-sm-6">
                        <label>命名空间</label>
                        <div class="form-group">
                            <input type="text" v-model="search.namespace" class="form-control pull-right">
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <label>服务</label>
                        <div class="form-group">
                            <input type="text" v-model="search.service" class="form-control pull-right">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6">
                        <label>版本</label>
                        <div class="form-group">
                            <input type="text" v-model="search.version" class="form-control pull-right">
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <label>机器</label>
                        <div class="form-group">
                            <input type="text" v-model="search.address" class="form-control pull-right">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="panel panel-default i-panel-default">
            <div class="panel-heading">
                <span>消费者列表</span>
            </div>
            <div class="panel-body">
                <Table :columns="table.columns" :data="table.data" :headerColor="`#fff`"></Table>
            </div>
        </div>
        <Modal v-model="disableModal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>禁用确认</span>
            </p>
            <div style="text-align:center">
                <p>确定禁用 {{selectItem ? `${selectItem.service}=>${selectItem.host}` : ''}} 吗?</p>
                <p>是否继续禁用？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" @click="disableConsumer">禁用</Button>
            </div>
        </Modal>
        <Modal v-model="shieldModal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>屏蔽确认</span>
            </p>
            <div style="text-align:center">
                <p>确定屏蔽 {{selectItem ? `${selectItem.service}=>${selectItem.host}` : ''}} 吗?</p>
                <p>屏蔽后，将不发起远程调用，直接在客户端返回空对象</p>
                <p>是否继续屏蔽？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" @click="shieldConsumer">屏蔽</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import view from '../script/view/consumer';
    export default view;
</script>