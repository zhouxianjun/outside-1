/**
 * Created by alone on 17-7-8.
 */
'use strict';
const Utils = require('../Utils');
const Result = require('../dto/Result');
const trc = require('trc');
const logger = require('tracer-logger');
const statisticsService = trc.ServerProvider.instance(require('../thrift/StatisticsService'));
const PublicStruct = require('../thrift/PublicStruct_types');
module.exports = class StatisticsController {
    static get routers() {
        return [{
            method: 'get',
            path: '/statistics/ad/click',
            value: StatisticsController.adClick
        }, {
            method: 'get',
            path: '/statistics/resources/install',
            value: StatisticsController.installRes
        }, {
            method: 'get',
            path: '/statistics/resources/error',
            value: StatisticsController.errorRes
        }, {
            method: 'get',
            path: '/statistics/client/active',
            value: StatisticsController.activeClient
        }]
    }

    static async adClick(ctx) {
        let params = Object.assign({}, ctx.query);
        Reflect.set(params, 'query', JSON.parse(decodeURIComponent(ctx.query.query)));
        let res = await statisticsService.adClick(new PublicStruct.PageParamStruct(params));
        ctx.body = new Result(true, {
            key: 'page',
            value: res
        }).json;
    }

    static async installRes(ctx) {
        let params = Object.assign({}, ctx.query);
        Reflect.set(params, 'query', JSON.parse(decodeURIComponent(ctx.query.query)));
        let res = await statisticsService.installRes(new PublicStruct.PageParamStruct(params));
        ctx.body = new Result(true, {
            key: 'page',
            value: res
        }).json;
    }

    static async errorRes(ctx) {
        let params = Object.assign({}, ctx.query);
        Reflect.set(params, 'query', JSON.parse(decodeURIComponent(ctx.query.query)));
        let res = await statisticsService.errorRes(new PublicStruct.PageParamStruct(params));
        ctx.body = new Result(true, {
            key: 'page',
            value: res
        }).json;
    }

    static async activeClient(ctx) {
        let params = Object.assign({}, ctx.query);
        Reflect.set(params, 'query', JSON.parse(decodeURIComponent(ctx.query.query)));
        let res = await statisticsService.activeClient(new PublicStruct.PageParamStruct(params));
        ctx.body = new Result(true, {
            key: 'page',
            value: res
        }).json;
    }
};