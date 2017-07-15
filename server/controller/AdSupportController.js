/**
 * Created by alone on 17-7-8.
 */
'use strict';
const Utils = require('../Utils');
const Result = require('../dto/Result');
const trc = require('trc');
const logger = require('tracer-logger');
const adSupportService = trc.ServerProvider.instance(require('../thrift/AdSupportService'));
const PublicStruct = require('../thrift/PublicStruct_types');
module.exports = class AdSupportController {
    static get routers() {
        return [{
            method: 'get',
            path: '/support/list/page',
            value: AdSupportController.page
        }, {
            method: 'get',
            path: '/support/list/all',
            value: AdSupportController.all
        }, {
            method: 'post',
            path: '/support/add',
            value: AdSupportController.add
        }, {
            method: 'post',
            path: '/support/remove',
            value: AdSupportController.remove
        }, {
            method: 'post',
            path: '/support/update',
            value: AdSupportController.update
        }]
    }

    static async page(ctx) {
        let params = Object.assign({}, ctx.query);
        Reflect.set(params, 'query', JSON.parse(decodeURIComponent(ctx.query.query)));
        let res = await adSupportService.page(new PublicStruct.PageParamStruct(params));
        ctx.body = new Result(true, {
            key: 'page',
            value: res
        }).json;
    }

    static async all(ctx) {
        let res = await adSupportService.all();
        ctx.body = new Result(true, {
            key: 'list',
            value: res
        }).json;
    }

    static async add(ctx) {
        let res = await adSupportService.add(new PublicStruct.AdSupportStruct(ctx.request.body));
        ctx.body = new Result(!!res, {
            key: 'id',
            value: res
        }).json;
    }

    static async update(ctx) {
        let res = await adSupportService.update(new PublicStruct.AdSupportStruct(ctx.request.body));
        ctx.body = new Result(!!res).json;
    }

    static async remove(ctx) {
        let res = await adSupportService.remove(ctx.request.body.id);
        ctx.body = new Result(!!res).json;
    }
};