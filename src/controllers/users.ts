import { Request, Response, NextFunction } from 'express';
import { UserPayload } from '../domains/requests/userpayload';
import * as HttpStatus from 'http-status-codes';
import * as userServices from '../services/users';

export async function save(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  console.log('save');
  try {
    const userPayload = req.body as UserPayload;
    const users = await userServices.save(userPayload);

    res.status(HttpStatus.StatusCodes.CREATED).json({
      success: true,
      data: users,
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
    const data = await userServices.fetchUsers();
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
