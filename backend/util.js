import cryptoRandomString from 'crypto-random-string';

export function randomString(length) {
    return cryptoRandomString({ length: length, type: 'alphanumeric' });
}