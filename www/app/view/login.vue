<template>
    <div class="login-box">
        <div class="login-logo">
            <a href="#">数据管理系统</a>
        </div>
        <!-- /.login-logo -->
        <div class="login-box-body">
            <p class="login-box-msg">登录开始您的会话</p>

            <Form ref="login" :model="login" :label-width="80" :rules="loginValidate">
                <Form-item label="用户名" prop="username">
                    <Input v-model="login.username" placeholder="请输入用户名">
                        <Icon type="ios-person-outline" slot="prepend"></Icon>
                    </Input>
                </Form-item>
                <Form-item label="密码" prop="password">
                    <Input type="password" v-model="login.password" placeholder="请输入密码">
                        <Icon type="ios-locked-outline" slot="prepend"></Icon>
                    </Input>
                </Form-item>
                <Form-item>
                    <Button type="primary" @click="loginHandler">登录</Button>
                </Form-item>
            </Form>
        </div>
        <!-- /.login-box-body -->
    </div>
    <!-- /.login-box -->
</template>
<script>
    import view from '../script/view/login';
    export default view;
</script>