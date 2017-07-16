/**
 * Created by alone on 17-7-8.
 */
'use strict';
const Utils = require('../Utils');
const Result = require('../dto/Result');
const trc = require('trc');
const logger = require('tracer-logger');
const versionService = trc.ServerProvider.instance(require('../thrift/VersionService'));
const PublicStruct = require('../thrift/PublicStruct_types');
module.exports = class VersionController {
    static get routers() {
        return [{
            method: 'get',
            path: '/version/list/page',
            value: VersionController.page
        }, {
            method: 'post',
            path: '/version/add',
            value: VersionController.add
        }, {
            method: 'post',
            path: '/version/config',
            value: VersionController.config
        }, {
            method: 'post',
            path: '/version/update',
            value: VersionController.update
        }, {
            method: 'post',
            path: '/version/support/remove',
            value: VersionController.removeSupport
        }]
    }

    static async page(ctx) {
        let params = Object.assign({}, ctx.query);
        Reflect.set(params, 'query', JSON.parse(decodeURIComponent(ctx.query.query)));
        let res = await versionService.page(new PublicStruct.PageParamStruct(params));
        ctx.body = new Result(true, {
            key: 'page',
            value: res
        }).json;
    }

    static async add(ctx) {
        let res = await versionService.add(new PublicStruct.VersionStruct(ctx.request.body));
        ctx.body = new Result(!!res, {
            key: 'id',
            value: res
        }).json;
    }

    static async update(ctx) {
        let res = await versionService.update(new PublicStruct.VersionStruct(ctx.request.body));
        ctx.body = new Result(!!res).json;
    }

    static async config(ctx) {
        await versionService.configPosition(new PublicStruct.VersionSupportConfigStruct(ctx.request.body));
        ctx.body = new Result(true).json;
    }

    static async removeSupport(ctx) {
        let res = await versionService.removeSupport(ctx.request.body.id);
        ctx.body = new Result(!!res).json;
    }
};