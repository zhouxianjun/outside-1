/**
 * Created by alone on 17-7-8.
 */
'use strict';
const Utils = require('../Utils');
const Result = require('../dto/Result');
const trc = require('trc');
const logger = require('tracer-logger');
const uuid = require('uuid');
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
        }, {
            method: 'post',
            path: '/push/install',
            value: PushController.install
        }, {
            method: 'post',
            path: '/push/change/support',
            value: PushController.useSupport
        }, {
            method: 'post',
            path: '/push/ad/change',
            value: PushController.changeAd
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
        let res = await pushService.pushAd(new PublicStruct.PushStruct(Object.assign({uuid: uuid(), user: ctx.session.user.id}, body.push)), body.ads);
        ctx.body = new Result(!!res).json;
    }

    static async changeAd(ctx) {
        let body = ctx.request.body;
        let res;
        switch (body.push.type) {
            case 1003:
                res = await pushService.pushCmdFaultRate(
                    new PublicStruct.PushStruct(Object.assign({uuid: uuid(), user: ctx.session.user.id}, body.push)),
                    Utils.toThrift(body.body, PublicStruct.FaultClickStruct)
                );
                break;
            case 1004:
                res = await pushService.pushCmdShowRate(
                    new PublicStruct.PushStruct(Object.assign({uuid: uuid(), user: ctx.session.user.id}, body.push)),
                    Utils.toThrift(body.body, PublicStruct.ShowRateStruct)
                );
                break;
            case 1005:
                res = await pushService.pushCmdCountDown(
                    new PublicStruct.PushStruct(Object.assign({uuid: uuid(), user: ctx.session.user.id}, body.push)),
                    Utils.toThrift(body.body, PublicStruct.CountDownStruct)
                );
                break;
            default:
                res = false;
                break;
        }
        ctx.body = new Result(!!res).json;
    }

    static async install(ctx) {
        let body = ctx.request.body;
        let res = await pushService.pushInstall(new PublicStruct.PushStruct(Object.assign({uuid: uuid(), user: ctx.session.user.id}, body.push)), body.installs);
        ctx.body = new Result(!!res).json;
    }

    static async useSupport(ctx) {
        let body = ctx.request.body;
        let res = await pushService.pushCmdAdContentChange(new PublicStruct.PushStruct(Object.assign({uuid: uuid(), user: ctx.session.user.id}, body.push)), new PublicStruct.AdContentStruct(body.change));
        ctx.body = new Result(!!res).json;
    }
};