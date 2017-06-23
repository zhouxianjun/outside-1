/**
 * Created by alone on 17-5-10.
 */
'use strict';
const path = require('path');
const watch = require('watch');
const walk = require('walk');
const logger = require('tracer-logger');
module.exports = class Utils {
    static objVal2Array(obj) {
        let array = [];
        Reflect.ownKeys(obj).forEach(key => {array.push(obj[key])});
        return array;
    }

    static load(root, fileStat) {
        let base = path.join(root, fileStat.name);
        if(fileStat.name.endsWith('.js')) {
            let pwd = path.relative(__dirname, base);
            if (!pwd.startsWith('.') && !pwd.startsWith('/')) {
                pwd = './' + pwd;
            }
            let indexOf = base.indexOf(':');
            if (!base.startsWith('/') && indexOf !== -1) {
                base = base.substring(0, indexOf).toUpperCase() + base.substring(indexOf);
            }
            return {
                path: pwd,
                name: fileStat.name,
                basePath: base,
                object: require.cache[base] || require(pwd)
            };
        }
        return {};
    }

    static loadController(router, root, filter) {
        let walker = walk.walk(root, {
            followLinks: true,
            filters: filter || ['node_modules']
        });
        walker.on("file", (root, fileStat, next) => {
            try {
                let result = Utils.load(root, fileStat);
                let routers = result.object.routers;
                if (Array.isArray(routers) && routers.length > 0) {
                    for (let item of routers) {
                        Reflect.apply(router[item.method], router, [item.path, item.value]);
                        logger.info(`load web [${item.method}] ${item.path} for ${path.resolve(__dirname, result.path)}[${item.value.name}]`);
                    }
                }
            } catch (err) {
                logger.error('加载Controller:%s:%s异常.', fileStat.name, root, err);
            }
            next();
        });
        walker.on("errors", (root, nodeStatsArray, next) => {
            nodeStatsArray.forEach(n => {
                logger.error("[ERROR] ", n);
            });
            next();
        });
        walker.on("end", () => {
            logger.info('文件Controller加载完成!');
        });
    }

    static loadEntity(sequelize, root, filter) {
        let walker = walk.walk(root, {
            followLinks: true,
            filters: filter || ['node_modules']
        });
        walker.on("file", async (root, fileStat, next) => {
            try {
                let result = Utils.load(root, fileStat);
                let model = result.object;
                if (typeof model === 'function') {
                    let Entity = sequelize.import(result.path);
                    await Entity.sync({force: true});
                    let prototype = Reflect.getPrototypeOf(Entity);
                    let keys = Reflect.ownKeys(prototype);
                    for (let method of keys) {
                        let descriptor = Reflect.getOwnPropertyDescriptor(prototype, method);
                        if (method !== 'constructor' && !descriptor.get && !descriptor.set && typeof descriptor.value === 'function') {
                            Reflect.set(prototype, method, new Proxy(prototype[method], {
                                apply(target, that, args) {
                                    Reflect.apply(target, that, args);
                                }
                            }));
                        }
                    }
                }
            } catch (err) {
                logger.error('加载Entity:%s:%s异常.', fileStat.name, root, err);
            }
            next();
        });
        walker.on("errors", (root, nodeStatsArray, next) => {
            nodeStatsArray.forEach(n => {
                logger.error("[ERROR] ", n);
            });
            next();
        });
        walker.on("end", () => {
            logger.info('文件Entity加载完成!');
        });
    }

    static writeResult(ctx, result) {
        if (ctx.path.startsWith(`/login`)) {
            return;
        }
        switch (ctx.accepts('html', 'json')) {
            case 'html':
                if (result.code === 99) {
                    ctx.redirect('/login');
                    return;
                }
                ctx.type = 'html';
                ctx.body = `<p>${JSON.stringify(result.json)}</p>`;
                break;
            case 'json':
                ctx.body = result.json;
                break;
            default:
                ctx.type = 'text';
                ctx.body = JSON.stringify(result.json);
        }
    }
};