import { randomString } from './util.js';

export class InMemoryPersistedWebhookStore {
    constructor() {
        this.store = new Map();
        this.persist = this.persist.bind(this);
        this.lookup = this.lookup.bind(this);
        this.generateKey = this.generateKey.bind(this);
    }

    persist(webhookKey, webhookConfig, protocolVersion) {
        const restoreKey = this.generateKey();
        this.store.set(restoreKey, {
            webhookKey: webhookKey,
            config: webhookConfig,
            protocolVersion: protocolVersion
        });
        return restoreKey;
    }

    lookup(restoreKey) {
        return this.store.get(restoreKey);
    }

    generateKey() {
        let restoreKey;
        do {
            restoreKey = randomString(32);
        } while (this.store.has(restoreKey));
        return restoreKey;
    }
}