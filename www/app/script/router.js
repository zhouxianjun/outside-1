/**
 * Created by alone on 17-5-11.
 */
import Login from '../view/login.vue';
import Index from '../view/index.vue';
import Home from '../view/home.vue';
import Interface from '../view/interface.vue';
import Menu from '../view/menu.vue';
import Role from '../view/role.vue';
import User from '../view/user.vue';
import Logger from '../view/logger.vue';
import Resources from '../view/resources.vue';
import Ad from '../view/ad.vue';
import Push from '../view/push.vue';
import Install from '../view/install.vue';
import Client from '../view/client.vue';
import Support from '../view/support.vue';
import Version from '../view/version.vue';
import AdClick from '../view/statistics/adClick.vue';
import installStatistics from '../view/statistics/install.vue';
import errorStatistics from '../view/statistics/error.vue';
import clientActive from '../view/statistics/active.vue';
export default [{
    path: '/login',
    component: Login
}, {
    path: '/index',
    component: Index,
    children: [{
        path: 'home',
        component: Home
    }, {
        path: 'interface',
        component: Interface
    }, {
        path: 'menu',
        component: Menu
    }, {
        path: 'role',
        component: Role
    }, {
        path: 'user',
        component: User
    }, {
        path: 'logger',
        component: Logger
    }, {
        path: 'resources',
        component: Resources
    }, {
        path: 'ad',
        component: Ad
    }, {
        path: 'push',
        component: Push
    }, {
        path: 'install',
        component: Install
    }, {
        path: 'client',
        component: Client
    }, {
        path: 'support',
        component: Support
    }, {
        path: 'version',
        component: Version
    }, {
        path: 'ad/click',
        component: AdClick
    }, {
        path: 'resources/install',
        component: installStatistics
    }, {
        path: 'resources/error',
        component: errorStatistics
    }, {
        path: 'client/active',
        component: clientActive
    }]
}]