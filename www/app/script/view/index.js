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
            user: {}
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
        }
        this.$nextTick(() => {
            let menu = this.findMenuForPath(this.menus, this.$route.path);
            this.selectedMenu(menu ? menu.id : 0);
            $.AdminLTE.layout && $.AdminLTE.layout.fix();
        });
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
        }
    }
}