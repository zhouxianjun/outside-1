/**
 * Created by alone on 17-5-12.
 */
"use strict";
import moment from 'moment';
import $ from 'jquery';
import 'admin-lte/plugins/slimScroll/jquery.slimscroll.min';
// 重构Popper
import Popper from 'popper.js';
const _getPosition = Popper.prototype._getPosition;
Popper.prototype._getPosition = function(popper, reference) {
    if ($(popper).parents('div[role=dialog].modal').length > 0) {
        return 'absolute';
    }
    Reflect.apply(_getPosition, this, [popper, reference]);
};
const Common = {
    /**
     * 获取浏览器高度
     * @returns {number}
     */
    getWindowHeight() {
        let winHeight = 0;
        if (window.innerHeight){
            winHeight = window.innerHeight;
        }else if ((document.body) && (document.body.clientHeight)){
            winHeight = document.body.clientHeight;
        }
        return winHeight;
    },
    valid: {
        ip(rule, value, callback) {
            if (rule.required && (value === undefined || value === '' || value.length <= 0)) {
                callback(new Error(`不能为空`));
                return;
            }
            if (value) {
                value = Array.isArray(value) ? value : value.split(',');
                for (let val of value) {
                    let split = val.split('.');
                    if (split.length < 4 && !val.endsWith('*')) {
                        callback(new Error(`${val} 不是正确的IP地址`));
                        return;
                    }
                    for (let s of split) {
                        if (!/1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d\*\d|\*\d|\d\*|\d|\*/.test(s) || s.length > 3) {
                            callback(new Error(`${val} 不是正确的IP地址`));
                            return;
                        }
                    }
                }
            }
            callback();
        }
    },
    dateFormat(val, format = 'YYYY-MM-DD HH:mm:ss') {
        return moment(Number(val)).format(format);
    },
    statusFormat(val, trueTxt = '启用', falseTxt = '禁用') {
        return `<span class="${val === true ? 'text-green' : 'text-muted'}">${val === true ? trueTxt : falseTxt}</span>`;
    },
    emailFormat(val) {
        return `<a href="mailto:${val}">${val}</a>`;
    },
    RENDER: {
        DATE(h, params) {
            return h('span', Common.dateFormat(params.row[params.column.key]));
        },
        DATE_RANGE(h, params) {
            return function (start, end) {
                return h('span', `${Common.dateFormat(params.row[start])}~${Common.dateFormat(params.row[end])}`);
            };
        },
        APPEND(h, params) {
            return function (append) {
                return h('span', `${params.row[params.column.key]}${append}`);
            };
        },
        STATUS(h, params) {
            let status = params.row[params.column.key];
            return h('span', {class: status === true ? 'text-green' : 'text-muted'}, status === true ? '启用' : '禁用');
        }
    },
    clearVo(vo) {
        let keys = Reflect.ownKeys(vo);
        for (let key of keys) {
            if (key === '__ob__') continue;
            if (typeof vo[key] === 'object' && vo[key]) {
                this.clearVo(vo[key]);
            }
            Reflect.set(vo, key, null);
        }
    },
    renderTree(data, fn) {
        if (Array.isArray(data)) {
            data.forEach(item => {
                Reflect.apply(fn, data, [item]);
                if (item.children && Array.isArray(item.children)) {
                    this.renderTree(item.children, fn);
                }
            });
        }
    },
    slimScroll(el, options = {}) {
        $(el).slimScroll(Object.assign({
            height: '100%', //可滚动区域高度
            disableFadeOut: true
        }, options));
    },
    voNumberToChar(vo) {
        let keys = Reflect.ownKeys(vo);
        for (let key of keys) {
            if (!isNaN(vo[key]) && vo[key]) {
                Reflect.set(vo, key, `${vo[key]}`);
            }
        }
    }
};
export default Common;