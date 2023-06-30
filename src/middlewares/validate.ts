import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

import logger from '../untils/logger';
import validate from '../untils/validate';

/**
 * A middleware to validate schema.
 *
 * @param {Joi.Schema} params
 */
export function schema(params: Joi.Schema) {
  return async (
    req: Request,
    _: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { password, ...rest } = req.body;
      const body = password ? { ...rest, password: '[FILTERED]' } : rest;
      logger.log('info', 'Validating schema', {
        body: body,
      });

      await validate(req.body, params);

      logger.log('info', 'Schema successfully validated');

      next();
    } catch (err) {
      next(err);
    }
  };
}
