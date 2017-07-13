/**
 * Created by alone on 17-7-8.
 */
'use strict';
const Utils = require('../Utils');
const Result = require('../dto/Result');
const trc = require('trc');
const logger = require('tracer-logger');
const adService = trc.ServerProvider.instance(require('../thrift/AdService'));
const PublicStruct = require('../thrift/PublicStruct_types');
module.exports = class AdController {
    static get routers() {
        return [{
            method: 'get',
            path: '/ad/list/page',
            value: AdController.page
        }, {
            method: 'post',
            path: '/ad/add',
            value: AdController.add
        }, {
            method: 'post',
            path: '/ad/remove',
            value: AdController.remove
        }, {
            method: 'post',
            path: '/ad/update',
            value: AdController.update
        }, {
            method: 'post',
            path: '/ad/set/resources',
            value: AdController.setResources
        }]
    }

    static async page(ctx) {
        let params = Object.assign({}, ctx.query);
        Reflect.set(params, 'query', JSON.parse(decodeURIComponent(ctx.query.query)));
        let res = await adService.page(new PublicStruct.PageParamStruct(params));
        ctx.body = new Result(true, {
            key: 'page',
            value: res
        }).json;
    }

    static async add(ctx) {
        let res = await adService.add(new PublicStruct.AdStruct(Object.assign({user: ctx.session.user.id}, ctx.request.body)));
        ctx.body = new Result(!!res, {
            key: 'id',
            value: res
        }).json;
    }

    static async update(ctx) {
        let res = await adService.update(new PublicStruct.AdStruct(ctx.request.body));
        ctx.body = new Result(!!res).json;
    }

    static async setResources(ctx) {
        let body = ctx.request.body;
        let res = await adService.setResource(body.id, body.resources);
        ctx.body = new Result(!!res).json;
    }

    static async remove(ctx) {
        let params = ctx.request.body;
        let res = await adService.remove(params.id);
        ctx.body = new Result(!!res).json;
    }
};