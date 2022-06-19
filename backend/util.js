import { randomBytes } from 'crypto';

export function randomString(length) {
    return randomBytes(length / 2).toString('hex');
}