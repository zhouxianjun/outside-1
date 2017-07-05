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
                <table id="menu-grid" class="fancytree-connectors" width="100%" style="max-height: 960px">
                    <thead>
                        <tr>
                            <th></th>
                            <th>序号</th>
                            <th>图标</th>
                            <th>路径</th>
                            <th>显示</th>
                            <th>状态</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>
        <Modal v-model="menuModel" :title="modelTitle" :loading="loadingBtn" @on-ok="addOrUpdate">
            <Form ref="form" :model="vo" :label-width="80" :rules="menuValidate">
                <Form-item label="名称" prop="name">
                    <Input v-model="vo.name" placeholder="请输入菜单名"/>
                </Form-item>
                <Form-item label="路径" prop="path">
                    <Input v-model="vo.path" placeholder="请输入菜单路径"/>
                </Form-item>
                <Form-item label="图标" prop="icon">
                    <Input v-model="vo.icon" placeholder="请输入菜单图标"/>
                </Form-item>
                <Form-item label="序号" prop="seq">
                    <Input-number :min="0" :max="99" v-model="vo.seq" placeholder="请输入菜单排序序号"></Input-number>
                </Form-item>
                <Form-item label="描述" prop="description">
                    <Input v-model="vo.description" placeholder="请输入菜单描述"/>
                </Form-item>
                <Form-item label="显示" prop="show">
                    <i-switch v-model="vo.show" size="large">
                        <span slot="open">显示</span>
                        <span slot="close">隐藏</span>
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
        <Modal v-model="interfaceModel" :width="800" title="设置接口" :loading="loadingBtn" class="no-padding" @on-ok="setInterface">
            <Table ref="table" :height="400" :columns="table.columns" :data="table.data" @on-selection-change="selectionChange"></Table>
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
    import view from '../script/view/menu';
    export default view;
</script>