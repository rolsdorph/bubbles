import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { createRoot } from 'react-dom';
import React from 'react';
import { RANDOM } from './types.js';
import { BubbleSimulator } from './bubble_simulator.js';
import { buildParsers } from './message_parsing.js';
import { RadiusConfig } from './config_modal/radius_config.js';
import { sendTestSetupMessage, sendTestDataMessage } from './test_util.js';

/*
DEBUG_MODE, WS_URL and WS_PROTOCOL must be injected by the Webpack build (or in some other way, like uncommenting these):

const DEBUG_MODE = false;
const WS_URL = 'ws://127.0.0.1:3001';
const WS_PROTOCOL = "bubbler-v0";
*/

let bubbler;
let bubbleConfig = {
    'radiusType': RANDOM,
    'minRadius': 25,
    'maxRadius': 100
};
let bubbleParsers = buildParsers(bubbleConfig);
let ws;

function start() {
    createRoot(document.getElementById("settings")).render(
        React.createElement(RadiusConfig, { 'onSave': onConfigChange })
    );

    bubbler = new BubbleSimulator(document.getElementById('bubbles'));
    bubbler.start();

    const shareButton = document.getElementById("share");

    const copyUrlIcon = document.getElementById("copyUrlIcon");
    copyUrlIcon.onclick = copyUrlToClipboard;

    if (DEBUG_MODE) {
        sendTestSetupMessage(handleWsMessage);
        sendTestDataMessage(handleWsMessage);
        setInterval(() => sendTestDataMessage(handleWsMessage), 5000);
        shareButton.style.color = 'lightgray'; // Not enabled in debug mode
    } else {
        const restoreKey = new URL(window.location).searchParams.get('restoreFrom');
        const wsUrl = restoreKey ? WS_URL + "/" + restoreKey : WS_URL;
        ws = new WebSocket(wsUrl, WS_PROTOCOL);
        ws.onmessage = handleWsMessage;
        shareButton.addEventListener('click', persist);
    }
}

function persist() {
    ws.send(JSON.stringify({
        'type': 'persist',
        'currentConfig': bubbleConfig
    }));
}

function onConfigChange(newConfig) {
    bubbleConfig = newConfig;
    bubbleParsers = buildParsers(newConfig);
}

function setWebhookUrl(url) {
    document.getElementById("webhookUrl").innerText = url;
}

function handleWsMessage(event) {
    const msg = JSON.parse(event.data);
    if (msg.type == "setupInfo") {
        setWebhookUrl(msg.webhookUrl);
    }
    else if (msg.type == "restoredSetupInfo") {
        setWebhookUrl(msg.webhookUrl);
        onConfigChange(msg.config);
    }
    else if (msg.type == "webhookMessage") {
        let value = bubbleParsers.fieldExtractor(msg['dataFromWebhook']);
        bubbler.addBubble(bubbleParsers.radiusMapper(value), bubbleParsers.colorMapper(value));
    }
    else if (msg.type == "hookPersisted") {
        showPersistedModal(msg.restoreKey);
    }
    else {
        console.error(`Unexpected message type: ${msg.type}`);
    }
}

function showPersistedModal(restoreKey) {
    const currentUrl = new URL(window.location);
    currentUrl.searchParams.set('restoreFrom', restoreKey);

    document.getElementById("persistedModalUrl").innerText = currentUrl;
    const modal = new bootstrap.Modal(document.getElementById('persistedModal'));
    modal.show();
}

function copyUrlToClipboard(clickedElement) {
    const tooltip = bootstrap.Tooltip.getOrCreateInstance(clickedElement.target, {
        title: 'Copied!',
        trigger: 'focus'
    });
    navigator.clipboard.writeText(document.getElementById('persistedModalUrl').textContent);
    tooltip.show();
    setTimeout(() => {
        tooltip.hide();
    }, 300);
}

document.addEventListener('DOMContentLoaded', start);