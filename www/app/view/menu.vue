<template>
    <div>
        <div class="panel panel-default i-panel-default">
            <div class="panel-heading">
                <span>菜单配置</span>
                <button type="button" class="btn btn-default btn-sm pull-right" @click="add">
                    <span class="glyphicon glyphicon glyphicon-plus" aria-hidden="true"></span> 添加
                </button>
            </div>
            <div class="panel-body">
                <Tree style="margin-left: 20px;margin-top: 10px;" :data="tree.data"></Tree>
            </div>
        </div>
        <Modal v-model="model" :title="modelTitle" @on-ok="addOrUpdate">
            <Form ref="form" :model="vo" :label-width="80" :rules="interfaceValidate">
                <Form-item label="名称" prop="name">
                    <Input v-model="vo.name" placeholder="请输入接口名"/>
                </Form-item>
                <Form-item label="接口" prop="auth">
                    <Input v-model="vo.auth" placeholder="请输入接口地址"/>
                </Form-item>
                <Form-item label="描述" prop="description">
                    <Input v-model="vo.description" placeholder="请输入接口描述"/>
                </Form-item>
                <Form-item label="状态" prop="status">
                    <i-switch v-model="vo.status" size="large">
                        <span slot="open">启用</span>
                        <span slot="close">禁用</span>
                    </i-switch>
                </Form-item>
            </Form>
        </Modal>
    </div>
</template>
<script>
    import view from '../script/view/menu';
    export default view;
</script>