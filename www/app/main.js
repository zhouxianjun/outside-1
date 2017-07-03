/**
 * Created by alone on 17-5-11.
 */
"use strict";
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './view/app.vue';
import Routers from './script/router.js';       // 路由列表
import iView from 'iview';
import 'iview/dist/styles/iview.css';    // 使用 CSS
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'ionicons/css/ionicons.min.css';
import 'admin-lte';
import 'admin-lte/dist/css/AdminLTE.min.css';
import 'admin-lte/dist/css/skins/_all-skins.min.css';
import './css/common.css';
import axios from 'axios';

iView['Notice'].config({top: 55});
iView['Message'].config({top: 55});
Vue.use(VueRouter);
Vue.use(iView);
/**
 * 拉取服务器信息
 * @param url
 * @param error
 * @param showError
 * @param config
 * @returns {Promise.<*>}
 */
Vue.prototype.fetch = async (url, config, showError = true, error) => {
    iView['LoadingBar'].start();
    let response = null, result = null;
    try {
        response = await axios(url, config);
        result = response ? response.data : null;
        if (!response || response.status !== 200 || !result || !result.success) {
            throw new Error(`fetch ${url} data ${JSON.stringify(config)} error`);
        }
        iView['LoadingBar'].finish();
        return result.data;
    } catch (err) {
        iView['LoadingBar'].error();
        if (result && result.code && result.code === 99) {
            app.$router.replace('/login');
            return false;
        }
        showError && iView['Notice'].error({title: result ? result.msg : '操作失败'});
        console.log(err.stack);
        if (typeof error === 'function') {
            Reflect.apply(error, response, result);
        }
        return false;
    }
};

const app = new Vue({
    el: '#app',
    router: new VueRouter({
        routes: Routers
    }),
    render: h => h(App)
});