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
                        <label>名称</label>
                        <div class="form-group">
                            <input type="text" v-model="search.name" class="form-control pull-right">
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
                <span>路由规则列表</span>
                <button type="button" class="btn btn-default btn-sm pull-right" @click="addRouterModel = true">
                    <span class="glyphicon glyphicon glyphicon-plus" aria-hidden="true"></span> 添加
                </button>
            </div>
            <div class="panel-body">
                <Table :columns="table.columns" :data="table.data" :headerColor="`#fff`"></Table>
            </div>
        </div>
        <Modal v-model="addRouterModel" title="新增路由" @on-ok="saveRouter">
            <Form ref="router" :model="router" :label-width="80" :rules="routerValidate">
                <Form-item label="名称" prop="name">
                    <Input v-model="router.name" placeholder="请输入路由名称"/>
                </Form-item>
                <Form-item label="服务" prop="service">
                    <Select @on-change="changeService" v-model="router.service" placeholder="请选择服务">
                        <Option v-for="item in providers" :value="`${item.namespace}/${item.version}/${item.service}`" :key="item" v-html="`${item.namespace}.${item.version}.${item.service}`"></Option>
                    </Select>
                </Form-item>
                <Form-item label="方法" prop="method">
                    <Select v-model="router.method" multiple>
                        <Option v-for="item in methods" :value="item" :key="item" v-html="item"></Option>
                    </Select>
                </Form-item>
                <Form-item label="消费者" prop="consumeHost">
                    <i-tags-input :tags="router.consumeHost" @tags-change="changeConsumeHost" :klass="{
                        container: 'tags-input ivu-input',
                        input: 'input',
                        placeholder: 'placeholder',
                        gap: 'gap',
                        tag: 'tag'
                    }"></i-tags-input>
                </Form-item>
                <Form-item label="提供者" prop="providerAddress">
                    <i-tags-input :tags="router.providerAddress" @tags-change="changeProviderAddress" :klass="{
                        container: 'tags-input ivu-input',
                        input: 'input',
                        placeholder: 'placeholder',
                        gap: 'gap',
                        tag: 'tag'
                    }"></i-tags-input>
                </Form-item>
            </Form>
        </Modal>
        <Modal v-model="removeRouterModal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>删除确认</span>
            </p>
            <div style="text-align:center">
                <p>确定删除 {{removeRouterName}} 吗?，删除后将无法恢复。</p>
                <p>是否继续删除？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" @click="removeRouter">删除</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import view from '../script/view/router';
    export default view;
</script>