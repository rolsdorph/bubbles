import * as http from 'http';
import { WebSocketServer } from 'ws';

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
        if (req.method.toUpperCase() !== 'POST') {
            console.log(`Unsupported request method: ${req.method}`);
            res.statusCode = 405;
            res.setHeader('Allow', 'POST');
            res.end('Method Not Allowed');
        } else {
            let body = '';
            req.on('data', d => {
                body += d; // TODO: limit number of bytes here, or move to a framework that handles max size (and path mapping and whatnot)
            });
            req.on('end', () => {
                try {
                    const parsedMessage = JSON.parse(body);
                    console.log(`Delivering message to ${proxyId}`);
                    targetProxy.send(JSON.stringify(proxyMsg({
                        'dataFromRequest': parsedMessage
                    })));
                    res.statusCode = 204;
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
        }
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