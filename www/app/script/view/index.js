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
                path: '/home',
                show: false,
                closeable: false
            }, {
                id: 1,
                icon: 'ios-navigate',
                name: '服务治理',
                show: true,
                sub: [{
                    id: 2,
                    icon: 'ios-navigate',
                    name: '提供者',
                    path: '/provider',
                    pid: 1,
                    show: true
                }, {
                    id: 3,
                    icon: 'ios-navigate',
                    name: '消费者',
                    path: '/consumer',
                    pid: 1,
                    show: true
                }, {
                    id: 4,
                    icon: 'ios-navigate',
                    name: '路由规则',
                    path: '/router',
                    pid: 1,
                    show: true
                }]
            }, {
                id: 6,
                name: 'test2',
                show: true,
                sub: [{
                    id: 7,
                    name: 'test22',
                    show: true
                }]
            }],
            tabs: []
        }
    },
    created() {
        this.tabs.push(this.menus[0]);
    },
    async mounted() {
        let menu = this.findMenuForPath(this.menus, this.$route.path);
        this.selectedMenu(menu ? menu.id : 0);
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
                alert('未实现');
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
        }
    }
}