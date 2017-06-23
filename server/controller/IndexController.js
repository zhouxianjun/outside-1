/**
 * Created by alone on 17-5-15.
 */
'use strict';
const Utils = require('../Utils');
const Result = require('../dto/Result');
module.exports = class IndexController {
    static get routers() {
        return [{
            method: 'get',
            path: '/index/total',
            value: IndexController.total
        }];
    }
    static async total(ctx) {
        ctx.body = new Result(true, {
            key: 'service',
            value: ZookeeperOperation.service
        }, {
            key: 'provider',
            value: ZookeeperOperation.provider
        }, {
            key: 'consumer',
            value: ZookeeperOperation.consumer
        }, {
            key: 'address',
            value: ZookeeperOperation.address
        }).json;
    }
};