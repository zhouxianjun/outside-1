/**
 * Created by alone on 17-5-10.
 */
'use strict';
const path = require('path');
const watch = require('watch');
const walk = require('walk');
const logger = require('tracer-logger');
const thrift = require('thrift');
module.exports = class Utils {
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

    static makeTree(array, pid, prop_parent, prop_id, prop_child, renderer) {
        let result = [] , temp;
        for(let item of array){
            Reflect.ownKeys(item).forEach(key => {
                if (item[key] instanceof thrift.Int64)
                    item[key] = `${item[key].toNumber()}`;
            });
            if(item[prop_parent] === pid){
                result.push(item);
                temp = Utils.makeTree(array, item[prop_id], prop_parent, prop_id, prop_child);
                if(temp.length > 0){
                    item[prop_child] = temp;
                }
            }
            if (typeof renderer === 'function') {
                renderer(item);
            }
        }
        return result;
    }
    static makeList(array) {
        for(let item of array){
            Reflect.ownKeys(item).forEach(key => {
                if (item[key] instanceof thrift.Int64)
                    item[key] = `${item[key].toNumber()}`;
            });
        }
        return array;
    }
    static makeTreeItemPoptip(item) {
        return `<Poptip trigger="hover" title="详细信息" content="提示内容">${item.name}</Poptip>`;
    }
};