/**
 * otp.ts
 * Adapted from https://github.com/jhermsmeier/node-hotp under the
 * following license:
 *
 * Copyright (c) 2019 Jonas Hermsmeier
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 * OR OTHER DEALINGS IN THE SOFTWARE.
 */
import { Buffer } from 'buffer';
import CryptoJS from 'crypto-es';

const zeropad = (value, digits = 16) => {
  const fill = '0'.repeat(digits);
  return (fill + value).slice(-digits);
};

const getCounter = (value) => {
  const buffer = Buffer.alloc(8);
  if (!Number.isFinite(value)) {
    throw new Error('Expected a number');
  }
  for (let i = 0; i < 4; i++) {
    buffer[i + 4] = (value >> (8 * (3 - i))) & 0xff;
  }
  return buffer;
};

/**
 * HOTP truncate function
 * @param {Buffer} hmac
 * @param {Number} digits
 * @returns {Number}
 */
const truncate = (hmac, digits) => {
  const offset = hmac[hmac.length - 1] & 0x0f;
  const value =
    ((hmac[offset + 0] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  return value % 10 ** digits;
};

/**
 * Time-step function
 * @param {Number} t
 * @param {Number} t0
 * @param {Number} ts
 * @returns {Number}
 */
const calcTimestep = (t, t0, ts) => {
  return Math.floor((t - t0) / ts);
};

/**
 * Time-Based One-Time Password (TOTP)
 * @param {Buffer|String} key
 * @param {Object} [options]
 * @param {Number} [options.algorithm='sha1']
 * @param {Number} [options.digits=6]
 * @param {Number} [options.time=(Date.now() / 1000)]
 * @param {Number} [options.timeStep=30]
 * @param {Number} [options.t0=0]
 * @returns {String}
 */
export const totp = (key, options) => {
  const time = options && options.time != null ? options.time : Date.now() / 1000;
  const timeStep = (options && options.timeStep) || 30;
  const t0 = options && options.t0 != null ? options.t0 : 0;
  const digits = (options && options.digits) || 6;
  const algorithm = (options && options.algorithm) || 'sha1';

  const counter = calcTimestep(time, t0, timeStep);

  return hotp(key, counter, { algorithm, digits });
};

/**
 * HMAC-Based One-Time Password (HOTP)
 * @param {Buffer|String} key
 * @param {Buffer|String|Number} counter
 * @param {Object} [options]
 * @param {Number} [options.digits=6]
 * @returns {String} token
 */
export const hotp = (key, counter, options) => {
  const digits = (options && options.digits) || 6;
  const counterBytes = getCounter(counter);
  const hmac = CryptoJS.HmacSHA1(CryptoJS.lib.WordArray.create(counterBytes), key);
  const hmacBuf = Buffer.from(hmac.toString(), 'hex');
  const truncated = truncate(hmacBuf, digits);
  return zeropad(truncated, digits);
};
