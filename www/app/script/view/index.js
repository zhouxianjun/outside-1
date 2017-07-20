/**
 * Created by alone on 17-5-12.
 */
'use strict';
import SelfMenu from "../../components/menu.vue";
const user2x160 = require('admin-lte/dist/img/user2-160x160.jpg');
export default {
    data () {
        return {
            active: 0,
            img: {
                user2x160: user2x160
            },
            menus: [{
                id: 0,
                name: '我的主页',
                icon: 'fa-home',
                path: '/index/home',
                show: false,
                closeable: false
            }],
            tabs: [],
            user: {},
            modifyModal: false,
            sendEmail: false,
            modify: {
                oldPassword: null,
                newPassword: null,
                passwordCheck: null,
                code: null,
                email: null
            },
            percent: 0,
            current: 0,
            loadingBtn: false,
            modifyValidate: {
                oldPassword: [{required: true, pattern: /^[a-zA-Z]\w{5,17}$/, trigger: 'blur'}],
                newPassword: [{required: true, pattern: /^[a-zA-Z]\w{5,17}$/, trigger: 'blur'}],
                code: [{required: true, trigger: 'blur'}],
                email: [
                    {type: 'email', required: true, trigger: 'blur' },
                    {validator: (rule, value, callback) => {
                        if (value !== this.user.email) {
                            callback(new Error('输入的邮箱与用户的邮箱不一致!'));
                        } else {
                            callback();
                        }
                    }, trigger: 'blur'}
                ],
                passwordCheck: [
                    {required: true, trigger: 'blur' },
                    { validator: (rule, value, callback) => {
                        if (value === '') {
                            callback(new Error('请再次输入密码'));
                        } else if (value !== this.modify.newPassword) {
                            callback(new Error('两次输入密码不一致!'));
                        } else {
                            callback();
                        }
                    }, trigger: 'blur' }
                ]
            }
        }
    },
    async created() {
        this.tabs.push(this.menus[0]);
    },
    async ready() {
    },
    async mounted() {
        let menus = await this.fetch('/permissions/menu/list');
        if (menus && menus.tree) {
            menus.tree.forEach(m => this.menus.push(m));
            this.user = menus.user;
            this.$nextTick(() => {
                let menu = this.findMenuForPath(this.menus, this.$route.path);
                this.selectedMenu(menu ? menu.id : 0);
                $.AdminLTE.layout && $.AdminLTE.layout.fix();
            });
        }
    },
    components: {
        SelfMenu
    },
    watch:{
        $route(to, from) {
            let menu = this.findMenuForPath(this.menus, to.path);
            let matched = menu && menu.path ? this.$router.getMatchedComponents(menu.path): [];
            if (!matched.length) {
                alert('404:' + to.path);
                return;
            }
            this.selectedMenu(menu.id);
        }
    },
    computed: {

    },
    methods: {
        async logout() {
            await this.fetch('/permissions/user/logout');
            this.$router.replace('/login');
        },
        closeTab(name) {
            let index = this.tabs.findIndex(tab => {
                if (tab.id === parseInt(name)) {
                    return true;
                }
            });
            if (index > -1) {
                this.tabs.splice(index, 1);
                this.tabs.length && this.selectedMenu(this.tabs[this.tabs.length - 1].id);
            }
        },
        selectedMenu(selected) {
            let menu = this.findMenu(this.menus, selected);
            let matched = menu.path ? this.$router.getMatchedComponents(menu.path): [];
            if (!matched.length) {
                alert('未实现' + menu.path);
                this.$refs['menus'].active = this.active;
                return;
            }
            if (!this.tabs.includes(menu)) {
                this.tabs.push(menu);
            }
            this.$router.push(menu.path);
            this.active = selected;
        },
        findMenu(menus, id) {
            for (let menu of menus) {
                if (menu.id === id) {return menu}
                if (menu.sub && menu.sub.length) {
                    let m = this.findMenu(menu.sub, id);
                    if (m) return m;
                }
            }
        },
        findMenuForPath(menus, path) {
            for (let menu of menus) {
                if (menu.path === path) {return menu}
                if (menu.sub && menu.sub.length) {
                    let m = this.findMenuForPath(menu.sub, path);
                    if (m) return m;
                }
            }
        },
        showModify() {
            this.modifyModal = true;
            this.loadingBtn = true;
        },
        async sendModifyEmail() {
            this.$refs['form'].validateField('email', async valid => {
                if (valid) {
                    return;
                }
                let res = await this.fetch('/code/send/modify/password', {params: {password: this.modify.oldPassword, email: this.modify.email}});
                if (res) {
                    clearInterval(this.inter);
                    clearTimeout(this.timer);
                    this.sendEmail = true;
                    this.current = 0;
                    this.percent = 0;
                    this.inter = setInterval(() => {this.percent = parseInt(this.current / 60 * 100); this.current++}, 1000);
                    this.timer = setTimeout(() => this.sendEmail = false, 60 * 1000);
                }
            });
        },
        async modifyPassword() {
            this.$refs['form'].validate(async valid => {
                if (!valid) {
                    this.resetLoadingBtn();
                    return false;
                }
                let res = await this.fetch('/code/check', {params: {type: 'mp', code: this.modify.code}});
                if (res) {
                    res = await this.fetch('/permissions/user/update', {method: 'post', data: {password: this.modify.newPassword}});
                    if (res) {
                        await this.logout();
                    } else {
                        this.resetLoadingBtn();
                    }
                } else {
                    this.resetLoadingBtn();
                }
            });
        },
        resetLoadingBtn() {
            this.loadingBtn = false;
            this.$nextTick(() => this.loadingBtn = true);
        },
        selfResize() {
            setTimeout(() => {
                let e = document.createEvent("HTMLEvents");
                e.initEvent('resize', true, true);
                window.dispatchEvent(e);
            }, 350);
        }
    }
}