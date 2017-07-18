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
};