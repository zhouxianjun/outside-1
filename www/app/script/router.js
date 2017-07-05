/**
 * Created by alone on 17-5-11.
 */
import Login from '../view/login.vue';
import Index from '../view/index.vue';
import Home from '../view/home.vue';
import Interface from '../view/interface.vue';
import Menu from '../view/menu.vue';
import Role from '../view/role.vue';
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
    }]
}]