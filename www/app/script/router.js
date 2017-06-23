/**
 * Created by alone on 17-5-11.
 */
import Index from '../view/index.vue';
import Home from '../view/home.vue';
import Router from '../view/router.vue';
import Provider from '../view/provider.vue';
import Consumer from '../view/consumer.vue';
export default [{
    path: '/',
    component: Index,
    children: [{
        path: 'home',
        component: Home
    }, {
        path: 'router',
        component: Router
    }, {
        path: 'provider',
        component: Provider
    }, {
        path: 'consumer',
        component: Consumer
    }]
}]