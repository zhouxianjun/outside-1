/**
 * Created by alone on 17-5-10.
 */
'use strict';
module.exports = class ErrorCodeDesc {
    static get errorCode() {
        return {
            FAIL: 0,
            SUCCESS: 1,
            EXISTING: 11,
            PARAM_FAIL: 400,
            NOT_FOUND: 404,
            UNKNOWN_ERROR: 500,
            UN_AUTHORIZED: 401,
            NO_ACCESS: 403,
            NO_LOGIN: 99
        }
    }
    static get errorDesc() {
        return {
            FAIL: '操作失败',
            SUCCESS: '操作成功',
            EXISTING: '已存在',
            PARAM_FAIL: '参数验证失败',
            NOT_FOUND: '未找到',
            UNKNOWN_ERROR: '未知错误',
            UN_AUTHORIZED: '未授权',
            NO_ACCESS: '禁止访问:没有访问的权限',
            NO_LOGIN: '未登录'
        }
    }
    static getDesc(code) {
        let res = '';
        Reflect.ownKeys(ErrorCodeDesc.errorCode).forEach(key => {
            if (ErrorCodeDesc.errorCode[key] === code) {
                res = ErrorCodeDesc.errorDesc[key];
                return false;
            }
        });
        return res;
    }
};