import { Request, Response, NextFunction } from 'express';
import { UserPayload } from '../domains/requests/userpayload';
import * as HttpStatus from 'http-status-codes';
import * as userServices from '../services/users';
import LoginPayload from '../domains/requests/loginpayload';
import config from '../config/config';

const { messages } = config;

export async function save(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userPayload = req.body as UserPayload;
    const users = await userServices.save(userPayload);

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

export async function fetchUsers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage || 5);
    const total = perPage * (page - 1);

    const data = await userServices.fetchUsers(page, perPage, total);
    res.status(HttpStatus.StatusCodes.OK).json({
      success: true,
      ...data,
    });
  } catch (err) {
    next(err);
  }
}

export async function fetchUsersById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id: number = parseInt(req.params.id);

    const data = await userServices.fetchUsersById(id);
    res.status(HttpStatus.StatusCodes.OK).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
}

export async function update(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userPayload = req.body as UserPayload;
    const id: number = parseInt(req.params.id);

    const updatedUser = await userServices.update(id, userPayload);
    res.status(HttpStatus.StatusCodes.OK).json({
      success: true,
      data: updatedUser,
    });
  } catch (err) {
    next(err);
  }
}
