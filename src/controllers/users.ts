import { Request, Response, NextFunction } from 'express';
import { UpdatePayload, UserPayload } from '../domains/requests/userpayload';
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

    const data = await userServices.fetchUserById(id);

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
    const data = await userServices.fetchUserById(
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

export async function fetchUsers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage || 5);
    const offset = perPage * (page - 1);

    const data = await userServices.fetchUsers(page, perPage, offset);
    res.status(HttpStatus.StatusCodes.OK).json({
      success: true,
      data,
      messages: messages.users.fetchAll,
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
    const updatePayload = req.body as UpdatePayload;

    const data = await userServices.update(
      res.locals.loggedInPayload.userId,
      updatePayload
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
