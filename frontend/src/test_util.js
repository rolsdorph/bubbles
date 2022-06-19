import { randomInRange } from './util.js';

export function sendTestSetupMessage(messageHandler) {
    messageHandler({
        "data": JSON.stringify({
            "type": "setupInfo",
            "webhookUrl": "http://localhost:3000/mAdS"
        })
    });
}

export function sendTestDataMessage(messageHandler) {
    messageHandler({
        "data": JSON.stringify({
            "type": "webhookMessage",
            "dataFromWebhook": {
                "room": {
                    "data": {
                        "temperature": randomInRange(5, 100)
                    }
                }
            }
        })
    });
}
