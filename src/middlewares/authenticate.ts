import { Request, Response, NextFunction } from 'express';

import * as jwt from '../untils/jwt';
import logger from '../untils/logger';
import config from '../config/config';
import ErrorType from './../resources/enums/ErrorType';
import BadRequestError from '../exceptions/BadRequestError';
import UnauthorizedError from '../exceptions/UnauthorizedError';

const { errors } = config;

const tokenErrorMessageMap: any = {
  [ErrorType.INVALID]: errors.invalidToken,
  [ErrorType.EXPIRED]: errors.accessTokenExpired,
  [ErrorType.UNAUTHORIZED]: errors.unAuthorized,
};

/**
 * A middleware to authenticate the authorization token i.e. access token.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.locals.accessToken = String(req.headers.authorization).replace(
      'Bearer ',
      ''
    );

    if (!req.headers.authorization || !res.locals.accessToken) {
      throw new BadRequestError(errors.noToken);
    }

    logger.log('info', 'JWT: Verifying token - %s', res.locals.accessToken);
    const response: any = jwt.verifyAccessToken(res.locals.accessToken);

    if (response.data.roleId === 2) {
      logger.log(
        'debug',
        'JWT: Authentication verified -',
        res.locals.loggedInPayload
      );

      res.locals.loggedInPayload = response.data;

      next();
    } else {
      throw new BadRequestError(errors.unAuthorized);
    }
  } catch (err: any) {
    const tokenErrorMessage = tokenErrorMessageMap[err.name];
    logger.log('error', 'JWT: Authentication failed - %s', err.message);

    if (tokenErrorMessage) {
      logger.log('error', 'JWT: Token error - %s', tokenErrorMessage);

      next(new UnauthorizedError(tokenErrorMessage));
    } else {
      next(err);
    }
  }
};

export default authenticate;
