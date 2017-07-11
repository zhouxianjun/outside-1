/**
 * Created by alone on 17-7-8.
 */
'use strict';
const Utils = require('../Utils');
const Result = require('../dto/Result');
const config = require('../../config.json');
const trc = require('trc');
const qiniu = require('qiniu');
const logger = require('tracer-logger');
const resourcesService = trc.ServerProvider.instance(require('../thrift/ResourcesService'));
const PublicStruct = require('../thrift/PublicStruct_types');

const Mac = new qiniu.auth.digest.Mac(config.qiniu.ACCESS_KEY, config.qiniu.SECRET_KEY);
const PutPolicy = new qiniu.rs.PutPolicy({
    scope: config.qiniu.bucket,
    callbackUrl: `${config.server_url}/resources/callback`,
    callbackBody: '{"name":"$(fname)","md5":"$(etag)","size":$(fsize),"type":"$(x:type)","pkg":"$(x:pkg)"}',
    callbackBodyType: 'application/json',
    expires: 5 * 60
});
module.exports = class ResourcesController {
    static get routers() {
        return [{
            method: 'get',
            path: '/resources/upload/token',
            value: ResourcesController.uploadToken
        }, {
            method: 'get',
            path: '/resources/list/page',
            value: ResourcesController.page
        }, {
            method: 'post',
            path: '/resources/add',
            value: ResourcesController.add
        }, {
            method: 'post',
            path: '/resources/remove',
            value: ResourcesController.remove
        }]
    }

    static async page(ctx) {
        let params = Object.assign({}, ctx.query);
        Reflect.set(params, 'query', JSON.parse(decodeURIComponent(ctx.query.query)));
        let res = await resourcesService.page(new PublicStruct.PageParamStruct(params));
        ctx.body = new Result(true, {
            key: 'page',
            value: res
        }).json;
    }

    static async uploadToken(ctx) {
        ctx.body = new Result(true, {
            key: 'token',
            value: PutPolicy.uploadToken(Mac)
        }).json;
    }

    static async callback(ctx) {
        const auth = qiniu.util.isQiniuCallback(Mac, ctx.url, null, ctx.header.Authorization);
        if (!auth) {
            ctx.throw(400);
            return;
        }
        const res = resourcesService.add(new PublicStruct.ResourcesStruct(Object.assign({
            user: ctx.session.user.id
        }, ctx.request.body)));
        ctx.body = new Result(true, {
            key: 'res',
            value: res
        }).json;
    }

    static async add(ctx) {
        let params = ctx.request.body;
        let res = await resourcesService.add(new PublicStruct.ResourcesStruct(Object.assign({
            md5: Utils.md5(params.path),
            user: ctx.session.user.id
        }, params)));
        ctx.body = new Result(!!res, {
            key: 'id',
            value: res
        }).json;
    }

    static async remove(ctx) {
        let params = ctx.request.body;
        let res = await resourcesService.remove(params.id);
        ctx.body = new Result(!!res).json;
    }
};