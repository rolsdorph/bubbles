import { WebSocketServer } from 'ws';
import * as http from 'http';

const proxies = new Map();

function addProxy(wsConnection) {
    let r = createWebhookId();
    proxies.set(r, wsConnection);
    return r;
}

function createWebhookId() {
    return (Math.random() + 1).toString(36).substring(7);
}

/**
 * Webhook server
 */
const webhookBaseUrl = '127.0.0.1:3000';
const webhookHostname = '127.0.0.1';
const webhookPort = 3000;

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');

    const proxyId = req.url.replace('/', '');
    const targetProxy = proxies.get(proxyId); // No query parameter support, that's fine
    if (targetProxy == undefined) {
        res.statusCode = 404;
        console.log(`Unknown proxy: ${proxyId}`);
        res.end('Not found');
    } else {
        res.statusCode = 204;
        console.log(`Delivering message to ${proxyId}`);
        targetProxy.send(JSON.stringify(proxyMsg({
            'data-from-request': 'hello' // TODO: proxy real data
        })));
        res.end();
    }
});

server.listen(webhookPort, webhookHostname, () => {
    console.log(`Webhook server running at http://${webhookHostname}:${webhookPort}/, advertising ${webhookBaseUrl}`);
});

/**
 * Websocket server
 */
const wsHostname = '127.0.0.1';
const wsPort = 3001;

const wss = new WebSocketServer({
    host: wsHostname,
    port: wsPort
}, () => {
    console.log(`WebSocket server running at http://${wsHostname}:${wsPort}/`);
});
wss.on('connection', (ws) => {
    let path = addProxy(ws);
    console.log(`New proxy connected: ${path}`);

    ws.send(JSON.stringify(setupInfoMsg(path)));

    ws.on('close', () => {
        console.log(`Proxy disconnected: ${path}`);
        proxies.delete(path);
    });
});

function setupInfoMsg(webhookId) {
    return {
        'type': 'setupInfo',
        'webhookUrl': `${webhookBaseUrl}/${webhookId}`
    }
}

function proxyMsg(payload) {
    return {
        'type': 'webhookMessage',
        'payload': payload
    }
}