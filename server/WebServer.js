/**
 * Created by alone on 17-5-10.
 */
'use strict';
const Utils = require('./Utils');
const logger = require('tracer-logger');
const Result = require('./dto/Result');
const config = require('../config.json');
const path = require('path');
const QS = require('querystring');
const Router = require('koa-router');
const Static = require('koa-static');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session2');
const Store = require('./Store');
const Koa = require('koa');
const app = new Koa();
const router = new Router(config.base_path);

const ignoreUrl = config.ignoreUrl;
const loginUrl = config.loginUrl;

const trc = require('trc');
const loggerService = trc.ServerProvider.instance(require('./thrift/LoggerService'));
const clientService = trc.ServerProvider.instance(require('./thrift/ClientService'));
const PublicStruct = require('./thrift/PublicStruct_types');

//body
app.use(bodyParser());
//logger
app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    logger.debug(`Web Method: ${ctx.method} Url: ${ctx.url} Time: ${ms}`);
    if (Utils.filter(ctx.url, config.loggerPath) && ctx.session && ctx.session.user) {
        loggerService.admin(new PublicStruct.AdminLoggerStruct({
            user: ctx.session.user.id,
            ip: ctx.request.ip,
            path: ctx.path,
            body: JSON.stringify(ctx.request.body),
            params: JSON.stringify(ctx.query),
            method: ctx.method,
            ms
        })).catch(err => {
            logger.warn(`logger admin error`, err);
        });
    }
});

//session
app.keys = ['session_key'];
const store = new Store({
    async before(session, sid) {
        if (session.user && Utils.isOnlyLogin(session.user)) {
            let key = await this.user(session.user.id);
            if (key && key !== sid) {
                logger.info('user: %s rep login destroy before session: %s', session.user.id, key);
                await this.destroy(key);
            }
        }
        return true;
    }
});
app._store = store;
app.use(session({
    store: store,
    maxAge: config.session_ttl,
    path: (!config.base_path || config.base_path === '') ? '/' : config.base_path
}, app));
app.use(async (ctx, next) => {
    await next();
    // ignore favicon
    if (this.path === '/favicon.ico' || !ctx.session) return;

    let n = ctx.session.views || 0;
    ctx.session.views = ++n;
});

app.use(async (ctx, next) => {
    if (ctx.path === '/') {
        if (ctx.session['user']) {
            ctx.redirect(path.normalize(`${config.base_path}/index.html#index`));
            return;
        }
        ctx.redirect(path.normalize(`${config.base_path}/index.html#login`));
        return;
    }
    // 文件 || 过滤 || 登录
    if (ctx.path.indexOf('.') > -1 || Utils.filter(ctx.path, ignoreUrl) || (Utils.filter(ctx.path, loginUrl) && ctx.session['user'])){
        await next();
    } else {
        if (Utils.filter(ctx.path, config.api)) {
            const {access_id, sign} = ctx.query;
            let accessKey = await store.redis.get(`ACCESS:${access_id}`);
            if (!accessKey) {
                accessKey = await clientService.getAccessKey(access_id);
                await store.redis.set(`ACCESS:${access_id}`, accessKey, 'EX', 86400);
            }
            const raw = QS.stringify(ctx.request.body, '&', '=', {encodeURIComponent: val => {return val}});
            const checkSign = Utils.md5(`${raw}${accessKey}`);
            if (checkSign !== sign) {
                ctx.body = new Result(Result.CODE.NO_ACCESS).json;
                return;
            }
            await next();
            return;
        }
        if (!ctx.session['user']) {
            ctx.body = new Result(Result.CODE.NO_LOGIN).json;
            return;
        }

        let auth = ctx.session['interfaces'].includes(ctx.path);
        if (!auth) {
            ctx.body = new Result(Result.CODE.NO_ACCESS).json;
            return;
        }
        await next();
    }
});

// 404
app.use(async (ctx, next) => {
    await next();
    if (404 !== ctx.status) return;
    if (ctx.accepts('html', 'json') === 'html') {

    } else {
        ctx.body = new Result(Result.CODE.NOT_FOUND).json;
    }
});

// 异常
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.body = new Result(false, err.msg || err.message || '操作失败').json;
        logger.error('router error', err, this);
    }
});

//static
app.use(Static('./www/public'));

app.on('error', (err, ctx) => {
    logger.error('server error', err, ctx);
});

process.on('uncaughtException', err => {logger.error('uncaughtException', err)});

Utils.loadController(router, './server/controller');
app.use(router.routes()).use(router.allowedMethods());

module.exports = app;