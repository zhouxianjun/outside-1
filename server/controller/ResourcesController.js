/**
 * Created by alone on 17-7-8.
 */
'use strict';
const Utils = require('../Utils');
const Result = require('../dto/Result');
const config = require('../../config.json');
const trc = require('trc');
const moment = require('moment');
const qiniu = require('qiniu');
const logger = require('tracer-logger');
const resourcesService = trc.ServerProvider.instance(require('../thrift/ResourcesService'));
const PublicStruct = require('../thrift/PublicStruct_types');

const Mac = new qiniu.auth.digest.Mac(config.qiniu.ACCESS_KEY, config.qiniu.SECRET_KEY);
const PutPolicy = new qiniu.rs.PutPolicy({
    scope: config.qiniu.bucket,
    callbackUrl: `${config.domain}/resources/callback`,
    callbackBody: '{"name":"$(fname)","md5":"$(etag)","size":$(fsize),"type":$(x:type),"pkg":"$(x:pkg)","user":$(x:user)}',
    callbackBodyType: 'application/json',
    expires: 5 * 60
});
const BucketManager = new qiniu.rs.BucketManager(Mac, new qiniu.conf.Config());
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
            method: 'get',
            path: '/resources/download',
            value: ResourcesController.download
        }, {
            method: 'post',
            path: '/resources/add',
            value: ResourcesController.add
        }, {
            method: 'post',
            path: '/resources/remove',
            value: ResourcesController.remove
        }, {
            method: 'post',
            path: '/resources/callback',
            value: ResourcesController.callback
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
        try {
            const auth = qiniu.util.isQiniuCallback(Mac, ctx.url, null, ctx.header['authorization']);
            if (!auth) {
                ctx.throw(400);
                return;
            }
            const body = ctx.request.body;
            const res = resourcesService.add(new PublicStruct.ResourcesStruct(Object.assign({
                path: `${config.domain}/resources/download?key=${body.md5}`
            }, body)));
            ctx.body = new Result(true, {
                key: 'res',
                value: res
            }).json;
        } catch (err) {
            logger.error('七牛回调异常', err);
            ctx.throw(500);
        }
    }

    static async download(ctx) {
        let deadline = parseInt(Date.now() / 1000) + 5 * 60;
        const url = BucketManager.privateDownloadUrl(config.qiniu.domain, ctx.query.key, deadline);
        logger.debug(`download timeout: ${moment(deadline * 1000).format('YYYY-MM-DD HH:mm:ss')} url: ${url}`);
        ctx.redirect(url);
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