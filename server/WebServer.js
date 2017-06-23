/**
 * Created by alone on 17-5-10.
 */
'use strict';
const Utils = require('./Utils');
const logger = require('tracer-logger');
const Result = require('./dto/Result');
const config = require('../config.json');
const Router = require('koa-router');
const Static = require('koa-static');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const Store = require('./Store');
const Koa = require('koa');
const app = new Koa();
const router = new Router(config.base_path);

const ignoreUrl = config.ignoreUrl;
const loginUrl = config.loginUrl;

//body
app.use(bodyParser());
//logger
app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    logger.debug(`Web Method: ${ctx.method} Url: ${ctx.url} Time: ${ms}`);
});

//session
app.keys = ['session_key'];
const store = new Store();
app.use(session({
    store: store,
    ttl: config.session_ttl,
    cookie: {
        path: (!config.base_path || config.base_path === '') ? '/' : config.base_path
    },
    beforeSave: async function (ctx, session) {
        if (session.user) {
            let roles = session.user.roles;
            if (!roles) return;
            let needOnly = true;
            roles.forEach(role => {
                if (!role.only_login) {
                    needOnly = false;
                    return false;
                }
            });
            if (needOnly) {
                let key = `user:${session.user.id}`;
                let res = await store.get(key);
                if (res && res !== ctx.sessionId) {
                    logger.info('user: %s rep login now ip: %s destroy before session: %s', session.user.id, ctx.ip, res);
                    await store.destroy(res);
                }
                await store.set(key, ctx.sessionId, config.session_ttl);
            }
        }
        return false;
    }
}, app));
app.use(async (ctx, next) => {
    await next();
    // ignore favicon
    if (this.path === '/favicon.ico' || !ctx.session) return;

    let n = ctx.session.views || 0;
    ctx.session.views = ++n;
});

app.use(async (ctx, next) => {
    if (ctx.path.indexOf('.') !== -1){
        await next();
    } else {
        if (ignoreUrl.indexOf(ctx.path) === -1 && !ctx.session.user) {
            ctx.body = new Result(Result.CODE.NO_LOGIN).json;
            return;
        }
        if (loginUrl.indexOf(ctx.path) !== -1 && ctx.session.user) {
            await next();
            return;
        }
        if (ignoreUrl.indexOf(ctx.path) === -1) {
            let have = false;
            ctx.session.interfaces.forEach(auth => {
                if (auth.auth === ctx.path) {
                    have = true;
                    return false;
                }
            });
            if (!have) {
                ctx.body = new Result(Result.CODE.NO_ACCESS).json;
                return;
            }
            await next();
        }
    }
});

app.use(async (ctx, next) => {
    await next();
    if (404 !== ctx.status) return;
    if (ctx.accepts('html', 'json') === 'html') {

    } else {
        ctx.body = new Result(Result.CODE.NOT_FOUND).json;
    }
});

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