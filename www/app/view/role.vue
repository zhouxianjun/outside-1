<template>
    <div>
        <div class="panel panel-default i-panel-default">
            <div class="panel-heading">
                <span>角色配置</span>
                <button type="button" class="btn btn-default btn-sm pull-right" @click="add">
                    <span class="glyphicon glyphicon glyphicon-plus" aria-hidden="true"></span> 添加
                </button>
            </div>
            <div class="panel-body">
                <table id="role-grid" class="fancytree-connectors" width="100%" style="max-height: 960px">
                    <thead>
                        <tr>
                            <th></th>
                            <th>登录</th>
                            <th>状态</th>
                            <th>创建时间</th>
                            <th>更新时间</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>
        <Modal v-model="roleModel" :title="roleTitle" :loading="loadingBtn" @on-ok="addOrUpdate">
            <Form ref="form" :model="vo" :label-width="80" :rules="roleValidate">
                <Form-item label="名称" prop="name">
                    <Input v-model="vo.name" placeholder="请输入角色名称"/>
                </Form-item>
                <Form-item label="登录" prop="show">
                    <i-switch v-model="vo.only_login" size="large">
                        <span slot="open">单人</span>
                        <span slot="close">多人</span>
                    </i-switch>
                </Form-item>
                <Form-item label="状态" prop="status">
                    <i-switch v-model="vo.status" size="large">
                        <span slot="open">启用</span>
                        <span slot="close">禁用</span>
                    </i-switch>
                </Form-item>
            </Form>
        </Modal>
        <Modal v-model="menuModel" title="设置菜单" :loading="loadingBtn" @on-ok="setMenu">
            <Tree ref="tree" :data="tree" :show-checkbox="true" :multiple="true"></Tree>
        </Modal>
        <Modal v-model="removeModal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>删除确认</span>
            </p>
            <div style="text-align:center">
                <p>确定删除 {{removeItem ? removeItem.name : ''}} 吗?，删除后将无法恢复。</p>
                <p>是否继续删除？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" @click="remove">删除</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import view from '../script/view/role';
    export default view;
</script>