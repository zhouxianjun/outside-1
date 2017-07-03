/**
 * Created by alone on 17-5-12.
 */
'use strict';
export default {
    data () {
        return {
            login: {
                username: '',
                password: ''
            },
            loginValidate: {
                username: [{required: true, trigger: 'blur', message: '请填写用户名' }],
                password: [{required: true, trigger: 'blur', message: '请填写密码' }, { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }]
            }
        }
    },
    created() {

    },
    async mounted() {

    },
    components: {

    },
    computed: {

    },
    methods: {
        loginHandler() {
            this.$refs['login'].validate(async valid => {
                if (valid) {
                    let success = await this.fetch('/permissions/user/login', {method: 'post', data: this.login});
                    if (success) {
                        this.$router.replace('/index');
                    }
                } else {
                    this.$Message.error('表单验证失败!');
                }
            })
        }
    }
}