/**
 * Created by alone on 17-7-8.
 */
'use strict';
const Utils = require('../Utils');
const Result = require('../dto/Result');
const trc = require('trc');
const logger = require('tracer-logger');
const randomstring = require('randomstring');
const loggerService = trc.ServerProvider.instance(require('../thrift/LoggerService'));
const PublicStruct = require('../thrift/PublicStruct_types');
module.exports = class AdminController {
    static get routers() {
        return [{
            method: 'get',
            path: '/admin/logger/list/page',
            value: AdminController.loggerPage
        }, {
            method: 'get',
            path: '/code/send/modify/password',
            value: AdminController.sendModifyCode
        }, {
            method: 'get',
            path: '/code/check',
            value: AdminController.checkCode
        }]
    }

    static async loggerPage(ctx) {
        let params = Object.assign({}, ctx.query);
        Reflect.set(params, 'query', JSON.parse(decodeURIComponent(ctx.query.query)));
        let res = await loggerService.page(new PublicStruct.PageParamStruct(params));
        ctx.body = new Result(true, {
            key: 'page',
            value: res
        }).json;
    }

    static async sendModifyCode(ctx) {
        let email = ctx.query.email;
        let oldPassword = ctx.query.password;
        if (email !== ctx.session.user.email) {
            ctx.body = new Result(false, '邮箱与用户的邮箱不一致').json;
            return;
        }
        if (Utils.md5(`${ctx.session.user.username}${oldPassword}`) !== ctx.session.user.password) {
            ctx.body = new Result(false, '原密码错误').json;
            return;
        }
        let code = await ctx.app['_store'].redis.get(`MODIFY:PASSWORD:CODE:${ctx.session.user.id}`);
        if (code) {
            ctx.body = new Result(false, '请稍后再试').json;
            return;
        }
        code = randomstring.generate(6);
        await Utils.sendMail({
            to: email,
            subject: '修改密码',
            html: `<b>${code}</b>`
        });
        await ctx.app['_store'].redis.set(`MODIFY:PASSWORD:CODE:${ctx.session.user.id}`, code, 'EX', 60);
        ctx.body = new Result(true).json;
    }

    static async checkCode(ctx) {
        switch (ctx.query.type) {
            case 'mp':
                let code = await ctx.app['_store'].redis.get(`MODIFY:PASSWORD:CODE:${ctx.session.user.id}`);
                if (code === ctx.query.code) {
                    ctx.body = new Result(true).json;
                    break;
                }
                ctx.body = new Result(false, '校验码错误').json;
                break;
            default:
                ctx.body = new Result(false, '不支持的类型').json;
                break;
        }
    }
};