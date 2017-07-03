/**
 * Created by alone on 17-5-10.
 */
'use strict';
const path = require('path');
const config = require('./config.json');

// trc
const thrift = require('thrift');
const trc = require('trc');
const client = trc.zk.createClient(config.zookeeper);
client.connect();
const ServerProvider = trc.ServerProvider;
const provider = new ServerProvider(client, {
    invoker: new trc.invoker.factory.PoolInvokerFactory({
        transport: thrift.TFramedTransport,
        protocol: thrift.TCompactProtocol
    }),
    loadBalance: new trc.loadBalance.RoundRobinLoadBalance()
});
provider.loadType(path.resolve(__dirname, './server/thrift'));
provider.on('ready', () => {
    // web
    const App = require('./server/WebServer');
    App.listen(config.port, '0.0.0.0');
});