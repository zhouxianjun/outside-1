<template>
    <div>
        <div class="panel panel-default i-panel-default">
            <div class="panel-heading">
                <span>用户配置</span>
                <button type="button" class="btn btn-default btn-sm pull-right" @click="add">
                    <span class="glyphicon glyphicon glyphicon-plus" aria-hidden="true"></span> 添加
                </button>
            </div>
            <div class="panel-body">
                <table id="user-grid" class="fancytree-connectors" width="100%" style="max-height: 960px">
                    <thead>
                        <tr>
                            <th></th>
                            <th>用户名</th>
                            <th>邮箱</th>
                            <th>电话</th>
                            <th>省</th>
                            <th>市</th>
                            <th>状态</th>
                            <th>创建时间</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>
        <Modal v-model="userModel" :title="userTitle" :loading="loadingBtn" @on-ok="addOrUpdate">
            <Form ref="form" :model="vo" :label-width="80" :rules="userValidate" style="max-height: 400px;overflow: hidden">
                <Form-item label="用户名" prop="username">
                    <Input v-model="vo.username" placeholder="请输入登录用户名"/>
                </Form-item>
                <Form-item label="密码" prop="password" v-if="!vo.id">
                    <Input type="password" v-model="vo.password" placeholder="请输入密码"/>
                </Form-item>
                <Form-item label="名称" prop="name">
                    <Input v-model="vo.name" placeholder="请输入显示名称"/>
                </Form-item>
                <Form-item label="真实姓名" prop="real_name">
                    <Input v-model="vo.real_name" placeholder="请输入真实姓名"/>
                </Form-item>
                <Form-item label="邮箱" prop="email">
                    <Input v-model="vo.email" placeholder="请输入邮箱地址"/>
                </Form-item>
                <Form-item label="手机" prop="phone">
                    <Input v-model="vo.phone" placeholder="请输入手机号码"/>
                </Form-item>
                <Form-item label="地址">
                    <Row>
                        <Col span="11">
                        <Form-item prop="province">
                        <Select v-model="vo.province">
                            <Option v-for="item in province" :value="item.id" :key="item">{{ item.name }}</Option>
                        </Select>
                        </Form-item>
                        </Col>
                        <Col span="2" style="text-align: center">-</Col>
                        <Col span="11">
                        <Select v-model="vo.city">
                            <Option v-for="c in cityList" :value="c.id" :key="c">{{ c.name }}</Option>
                        </Select>
                        </Col>
                    </Row>
                </Form-item>
                <Form-item label="公司" prop="company">
                    <Input v-model="vo.company" placeholder="请输入公司名称"/>
                </Form-item>
                <Form-item label="状态" prop="status">
                    <i-switch v-model="vo.status" size="large">
                        <span slot="open">启用</span>
                        <span slot="close">禁用</span>
                    </i-switch>
                </Form-item>
            </Form>
        </Modal>
        <Modal v-model="roleModel" title="设置角色" :loading="loadingBtn" @on-ok="setRole">
            <Tree ref="tree" :data="tree" style="max-height: 500px" :show-checkbox="true" :multiple="true"></Tree>
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
    import view from '../script/view/user';
    export default view;
</script>