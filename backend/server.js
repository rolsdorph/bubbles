import 'dotenv/config';
import * as http from 'http';
import { WebSocketServer } from 'ws';
import { InMemoryPersistedWebhookStore } from './in-mem-persistence.js';
import { randomString } from './util.js';

const proxies = new Map(); // webhook key => Set<websocket connection>

function addProxy(wsConnection, connectionId) {
    let r = connectionId ? connectionId : createWebhookId();

    let existingSockets = proxies.get(r);
    if (!existingSockets) {
        existingSockets = new Set();
        proxies.set(r, existingSockets);
    }
    existingSockets.add(wsConnection);

    return r;
}

function createWebhookId() {
    return randomString(7);
}

const persistentWebhookStore = new InMemoryPersistedWebhookStore();

function readEnvVar(varName, defaultValue) {
    const val = process.env[varName];
    return val === undefined ? defaultValue : val;
}

/**
 * Webhook server
 */
const webhookBindHost = readEnvVar('webhookBindHost', '127.0.0.1');
const webhookBindPort = readEnvVar('webhookBindPort', 3000);
const webhookPublicUrl = readEnvVar('webhookPublicUrl', ('http://' + webhookBindHost + ':' + webhookBindPort));

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');

    const proxyId = req.url.replace('/', '');
    const targetProxies = proxies.get(proxyId); // No query parameter support, that's fine
    if (targetProxies == undefined) {
        res.statusCode = 404;
        console.log(`Unknown proxy: ${proxyId}`);
        res.end('Not found');
    } else {
        const method = req.method.toUpperCase();
        if (method === 'GET') {
            console.log(`Delivering empty message to ${proxyId} due to GET request`);
            sendToProxies(JSON.stringify(proxyMsg({})), targetProxies);
            res.statusCode = 201;
            res.end();
        } else if (method === 'POST') {
            let body = '';
            req.on('data', d => {
                body += d; // TODO: limit number of bytes here, or move to a framework that handles max size (and path mapping and whatnot)
            });
            req.on('end', () => {
                try {
                    const parsedMessage = JSON.parse(body);
                    console.log(`Delivering message to ${proxyId}`);
                    sendToProxies(JSON.stringify(proxyMsg(parsedMessage)), targetProxies);
                    res.statusCode = 201;
                    res.end();
                } catch (e) {
                    if (e instanceof SyntaxError) {
                        console.log(`Dropping invalid JSON to ${proxyId}`);
                        res.statusCode = 400;
                        res.end('Invalid JSON');
                    } else {
                        console.error(`Unexpected exception while proxying data: ${e}`);
                        res.statusCode = 500;
                        res.end('Internal Server Error');
                    }
                }
            });
        } else {
            console.log(`Unsupported request method: ${req.method}`);
            res.statusCode = 405;
            res.setHeader('Allow', 'POST');
            res.end('Method Not Allowed');
        }
    }
});

server.listen(webhookBindPort, webhookBindHost, () => {
    console.log(`Webhook server running at http://${webhookBindHost}:${webhookBindPort}/, advertising ${webhookPublicUrl}`);
});

function sendToProxies(msg, proxies) {
    for (const proxy of proxies) {
        proxy.send(msg);
    }
}

/**
 * Websocket server
 */
const wsBindHost = readEnvVar('wsBindHost', '127.0.0.1');
const wsBindPort = readEnvVar('wsBindPort', 3001);
const wsUrl = `ws://${wsBindHost}:${wsBindPort}`;

const wss = new WebSocketServer({
    host: wsBindHost,
    port: wsBindPort
}, () => {
    console.log(`WebSocket server running at ${wsUrl}`);
});
wss.on('connection', (ws, request) => {
    const requestUrl = request.url;

    let storedHook;
    if (requestUrl !== '/') {
        storedHook = persistentWebhookStore.lookup(requestUrl.substring(1)) // Drop leading slash
        if (!storedHook) {
            console.log(`No persisted hook found for ${requestUrl}`);
        }
    }

    let path;
    if (storedHook) {
        console.log(`Restoring old proxy: ${storedHook}`);
        path = addProxy(ws, storedHook.webhookKey);
        ws.send(JSON.stringify(restoredSetupInfoMsg(storedHook)));
    } else {
        path = addProxy(ws, null);
        ws.send(JSON.stringify(setupInfoMsg(path)));
    }

    console.log(`New proxy connected: ${path}`);

    ws.on('close', () => {
        console.log(`Proxy disconnected: ${path}`);
        const proxySet = proxies.get(path);
        proxySet.delete(ws);

        if (proxySet.size === 0) {
            proxies.delete(path);
        }
    });

    ws.on('message', (msg) => {
        try {
            const parsed = JSON.parse(msg);
            if (parsed.type === 'persist') {
                const restoreKey = persistentWebhookStore.persist(
                    path,
                    parsed.currentConfig,
                    ws.protocol
                );
                ws.send(JSON.stringify(hookPersistedMsg(restoreKey)));
            }
        } catch (e) {
            console.error(`Expection while handling message: ${e}`);
        }
    });
});

function setupInfoMsg(webhookId) {
    return {
        'type': 'setupInfo',
        'webhookUrl': `${webhookPublicUrl}/${webhookId}`
    }
}

function restoredSetupInfoMsg(storedHook) {
    return {
        'type': 'restoredSetupInfo',
        'webhookUrl': `${webhookPublicUrl}/${storedHook.webhookKey}`,
        'config': storedHook.config
    }
}

function hookPersistedMsg(restoreKey) {
    return {
        'type': 'hookPersisted',
        'restoreKey': restoreKey
    }
}

function proxyMsg(payload) {
    return {
        'type': 'webhookMessage',
        'dataFromWebhook': payload
    }
}