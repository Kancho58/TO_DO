import { Request, Response, NextFunction } from 'express';
import { UserPayload } from '../domains/requests/userpayload';
import * as HttpStatus from 'http-status-codes';
import * as userServices from '../services/users';
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
      messages: messages.users.insert,
    });
  } catch (err) {
    next(err);
  }
}

export async function fetchUserById(
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
      messages: messages.users.fetchAll,
    });
  } catch (err) {
    next(err);
  }
}

export async function fetchUserDetails(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await userServices.fetchUsersById(
      res.locals.loggedInPayload.userId
    );
    res.status(HttpStatus.StatusCodes.OK).json({
      success: true,
      data,
      messages: messages.users.fetch,
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

    const data = await userServices.update(
      res.locals.loggedInPayload.userId,
      userPayload
    );
    res.status(HttpStatus.StatusCodes.OK).json({
      success: true,
      data,
      messages: messages.users.update,
    });
  } catch (err) {
    next(err);
  }
}
