/**
 * Created by alone on 17-6-21.
 */
const co = require('co');
const redisStore = require('koa-redis');
class Store {
    constructor() {
        this.store = redisStore();
    }

    async get(sid) {
        return co(this.store.get(sid));
    }

    async set(sid, val, ttl) {
        return co(this.store.set(sid, val, ttl));
    }

    async destroy(sid) {
        return co(this.store.destroy(sid));
    }
}
module.exports = Store;