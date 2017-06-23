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
                <span>提供者列表</span>
            </div>
            <div class="panel-body">
                <Table :columns="table.columns" :data="table.data" :headerColor="`#fff`"></Table>
            </div>
        </div>
        <Modal v-model="editModel" title="动态配置" @on-ok="override">
            <Form ref="edit" :model="edit" :label-width="80" :rules="editValidate">
                <Form-item label="权重" prop="weight">
                    <Input-number :disabled="!overrideWeight" :max="99999" :min="0" v-model="edit.weight"></Input-number>
                    <i-switch style="margin-left: 5px" v-model="overrideWeight">
                        <Icon type="android-done" slot="open"></Icon>
                        <Icon type="android-close" slot="close"></Icon>
                    </i-switch>
                </Form-item>
                <Form-item label="预热" prop="warmup">
                    <Input-number :disabled="!overrideWarmup" :max="99999999999" :min="0" v-model="edit.warmup"></Input-number>
                    <i-switch style="margin-left: 5px" v-model="overrideWarmup">
                        <Icon type="android-done" slot="open"></Icon>
                        <Icon type="android-close" slot="close"></Icon>
                    </i-switch>
                </Form-item>
                <Form-item label="属性" prop="attr">
                    <Input :disabled="!overrideAttr" v-model="edit.attr" style="width: 200px"/>
                    <i-switch style="margin-left: 5px" v-model="overrideAttr">
                        <Icon type="android-done" slot="open"></Icon>
                        <Icon type="android-close" slot="close"></Icon>
                    </i-switch>
                </Form-item>
            </Form>
        </Modal>
        <Modal v-model="disableProviderModal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>禁用确认</span>
            </p>
            <div style="text-align:center">
                <p>确定禁用 {{selectItem ? `${selectItem.service}=>${selectItem.host}:${selectItem.port}` : ''}} 吗?</p>
                <p>是否继续禁用？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" @click="disableProvider">禁用</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import view from '../script/view/provider';
    export default view;
</script>