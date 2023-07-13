import jwbt from 'jsonwebtoken';

import logger from './logger';
import config from '../config/config';
import JWTPayload from '../domains/misc/JWTPayload';

const {
  accessTokenDuration,
  accessTokenSecretKey,
  refreshTokenDuration,
  refreshTokenSecretKey,
} = config.auth;

/**
 * Generate access token from given data
 *
 * @returns {string}
 */
export function generateAccessToken(data: JWTPayload): string {
  logger.log('info', 'JWT: Generating access token -', {
    data,
    expiresIn: accessTokenDuration,
  });

  return jwbt.sign({ data }, accessTokenSecretKey, {
    expiresIn: accessTokenDuration,
  });
}

/**
 * Generate refresh token from given data
 *
 * @param {JWTPayload} data
 * @returns {string}
 */
export function generateRefreshToken(data: JWTPayload): string {
  logger.log('info', 'JWT: Generating refresh token -', {
    data,
    expiresIn: refreshTokenDuration,
  });

  return jwbt.sign({ data }, refreshTokenSecretKey, {
    expiresIn: refreshTokenDuration,
  });
}

/**
 * Verify access token.
 *
 * @param {string} token
 * @returns {object | string}
 */
export function verifyAccessToken(token: string): object | string {
  return jwbt.verify(token, accessTokenSecretKey);
}

/**
 * Verify refresh token.
 *
 * @param {string} token
 * @returns {object | string}
 */
export function verifyRefreshToken(token: string): object | string {
  return jwbt.verify(token, refreshTokenSecretKey);
}
