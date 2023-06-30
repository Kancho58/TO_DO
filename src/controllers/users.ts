import { Request, Response, NextFunction } from 'express';
import { UserPayload } from '../domains/requests/userpayload';
import * as HttpStatus from 'http-status-codes';
import * as userServices from '../services/users';

export async function save(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userPayload = req.body as UserPayload;
    console.log(userPayload);

    const users = await userServices.save(userPayload);
    res.status(HttpStatus.StatusCodes.CREATED).json({
      sucess: true,
      data: users,
    });
  } catch (err) {
    next(err);
  }
}

export async function fetch(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const id: number = parseInt(req.params.id);
    const data = await userServices.fetch(id);
    res.status(HttpStatus.StatusCodes.OK).json({
      sucess: true,
      ...data,
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

    await userServices.update(id, userPayload);
    res.status(HttpStatus.StatusCodes.OK).json({
      sucess: true,
    });
  } catch (err) {
    next(err);
  }
}
