/**
 * Created by alone on 17-7-8.
 */
'use strict';
const Utils = require('../Utils');
const Result = require('../dto/Result');
const trc = require('trc');
const logger = require('tracer-logger');
const installService = trc.ServerProvider.instance(require('../thrift/InstallService'));
const PublicStruct = require('../thrift/PublicStruct_types');
module.exports = class InstallController {
    static get routers() {
        return [{
            method: 'post',
            path: '/api/apk/can/install',
            value: InstallController.canInstall
        }, {
            method: 'get',
            path: '/install/list/page',
            value: InstallController.page
        }, {
            method: 'post',
            path: '/install/add',
            value: InstallController.add
        }, {
            method: 'post',
            path: '/install/remove',
            value: InstallController.remove
        }, {
            method: 'post',
            path: '/install/update',
            value: InstallController.update
        }]
    }

    static async canInstall(ctx) {
        let res = await installService.canInstall(ctx.request.body.install);
        ctx.body = new Result(!!res, {
            install: res
        }).json;
    }

    static async page(ctx) {
        let params = Object.assign({}, ctx.query);
        Reflect.set(params, 'query', JSON.parse(decodeURIComponent(ctx.query.query)));
        let res = await installService.page(new PublicStruct.PageParamStruct(params));
        ctx.body = new Result(true, {
            key: 'page',
            value: res
        }).json;
    }

    static async add(ctx) {
        let res = await installService.add(new PublicStruct.InstallStruct(Object.assign({user: ctx.session.user.id}, ctx.request.body)));
        ctx.body = new Result(!!res, {
            key: 'id',
            value: res
        }).json;
    }

    static async update(ctx) {
        let res = await installService.update(new PublicStruct.InstallStruct(ctx.request.body));
        ctx.body = new Result(!!res).json;
    }

    static async remove(ctx) {
        let params = ctx.request.body;
        let res = await installService.remove(params.id);
        ctx.body = new Result(!!res).json;
    }
};