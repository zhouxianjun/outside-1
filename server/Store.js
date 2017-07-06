/**
 * Created by alone on 17-6-21.
 */
const Redis = require("ioredis");
const { Store } = require("koa-session2");
const config = require('../config.json');
const SESSION = `${config.session || 'S'}`;
const KEYS = new Set();
class RedisStore extends Store{
    constructor({clearInterval = 1000 * 60, before = () => {return true}, after = () => {return true}} = {}) {
        super();
        this.redis = new Redis();
        this.before = before;
        this.after = after;
        setInterval(async () => {
            let map = await this.redis['hgetall'](`${SESSION}:KEY`);
            Reflect.ownKeys(map).forEach(async uid => {
                let exists = await this.redis.exists(RedisStore.buildKey(map[uid]));
                if (!exists) {
                    await this.redis.hdel(`${SESSION}:KEY`, uid);
                    KEYS.delete(map[uid]);
                }
            });
        }, clearInterval);
    }

    async get(sid) {
        let data = await this.redis.get(RedisStore.buildKey(sid));
        return JSON.parse(data);
    }

    async set(session, { sid = this.getID(16), maxAge = 300000 } = {}) {
        if (!await this.before(session, sid)) return sid;
        // Use redis set EX to automatically drop expired sessions
        if (session.user && !KEYS.has(sid)) {
            KEYS.add(sid);
            await this.redis.hset(`${SESSION}:KEY`, session.user.id, sid);
        }
        await this.redis.set(RedisStore.buildKey(sid), JSON.stringify(session), 'EX', maxAge / 1000);
        await this.after(session, sid);
        return sid;
    }

    async user(uid) {
        return await this.redis.hget(`${SESSION}:KEY`, uid);
    }

    async destroy(sid) {
        KEYS.delete(sid);
        return await this.redis.del(RedisStore.buildKey(sid));
    }

    static buildKey(sid) {
        return `${SESSION}:${sid}`;
    }
}
module.exports = RedisStore;