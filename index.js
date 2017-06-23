/**
 * Created by alone on 17-5-10.
 */
'use strict';
const config = require('./config.json');
const Aspect = require('node-aspect');
const App = require('./server/WebServer');
const Utils = require('./server/Utils');
App.listen(config.port, '0.0.0.0');

// aop
new Aspect('/**/server/dao/*.js').around((target, bean, aspect, ctx, result, args) => {
    
});
// 初始化数据库
const DB = require('./server/DB');
Utils.loadEntity(DB.sequelize, './server/entity');

setTimeout(async () => {
    let t = await DB.sequelize.transaction();
    let Role = DB.sequelize.model('Role');
    await Role.create({}, {transaction: t});
    await t.rollback();
}, 2000);