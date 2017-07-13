/**
 * Created by alone on 17-7-8.
 */
'use strict';
const Utils = require('../Utils');
const Result = require('../dto/Result');
const trc = require('trc');
const logger = require('tracer-logger');
const pushService = trc.ServerProvider.instance(require('../thrift/PushService'));
const PublicStruct = require('../thrift/PublicStruct_types');
module.exports = class PushController {
    static get routers() {
        return [{
            method: 'get',
            path: '/push/list/page',
            value: PushController.page
        }, {
            method: 'post',
            path: '/push/ad',
            value: PushController.ad
        }]
    }

    static async page(ctx) {
        let params = Object.assign({}, ctx.query);
        Reflect.set(params, 'query', JSON.parse(decodeURIComponent(ctx.query.query)));
        let res = await pushService.page(new PublicStruct.PageParamStruct(params));
        ctx.body = new Result(true, {
            key: 'page',
            value: res
        }).json;
    }

    static async ad(ctx) {
        let body = ctx.request.body;
        let res = await pushService.pushAd(new PublicStruct.PushStruct(body.push), body.ads);
        ctx.body = new Result(!!res).json;
    }
};