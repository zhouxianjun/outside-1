/**
 * Created by alone on 17-7-8.
 */
'use strict';
const Utils = require('../Utils');
const Result = require('../dto/Result');
const trc = require('trc');
const logger = require('tracer-logger');
const clientService = trc.ServerProvider.instance(require('../thrift/ClientService'));
const PublicStruct = require('../thrift/PublicStruct_types');
module.exports = class ClientController {
    static get routers() {
        return [{
            method: 'get',
            path: '/client/list/page',
            value: ClientController.page
        }, {
            method: 'post',
            path: '/client/activate',
            value: ClientController.activate
        }, {
            method: 'post',
            path: '/client/check',
            value: ClientController.check
        }]
    }

    static async page(ctx) {
        let params = Object.assign({}, ctx.query);
        Reflect.set(params, 'query', JSON.parse(decodeURIComponent(ctx.query.query)));
        let res = await clientService.page(new PublicStruct.PageParamStruct(params));
        ctx.body = new Result(true, {
            key: 'page',
            value: res
        }).json;
    }

    static async activate(ctx) {
        let res = await clientService.activate(new PublicStruct.ClientStruct(Object.assign({ip: ctx.request.ip}, ctx.request.body)));
        ctx.body = new Result(true, {
            access_id: res.access_id,
            access_key: res.access_key
        }).json;
    }

    static async check(ctx) {
        const {sign, noncestr, md5} = ctx.request.body;
        if (!noncestr || noncestr.length < 6) {
            ctx.throw(401);
            return;
        }
        let res = await clientService.check(sign, noncestr, md5);
        ctx.body = new Result(true, {
            access_id: res.access_id,
            access_key: res.access_key
        }).json;
    }
};