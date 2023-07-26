import { Request, Response, NextFunction } from 'express';
import { UserPayload } from '../domains/requests/userpayload';
import * as HttpStatus from 'http-status-codes';
import * as userServices from '../services/users';
import LoginPayload from '../domains/requests/loginpayload';
import config from '../config/config';

const { messages } = config;

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userPayload = req.body as UserPayload;
    const users = await userServices.register(userPayload);

    res.status(HttpStatus.StatusCodes.CREATED).json({
      success: true,
      data: users,
      messages: messages.auth.signupSuccess,
    });
  } catch (err) {
    next(err);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const user = req.body as LoginPayload;

    const data = await userServices.login(user);
    res.status(HttpStatus.StatusCodes.OK).json({
      success: true,
      data,
      message: messages.auth.loginSuccess,
    });
  } catch (err) {
    next(err);
  }
}
