import { Request, Response, NextFunction } from 'express';
import * as HttpStatus from 'http-status-codes';
import * as itemServices from '../services/items';
import { ItemPayload } from '../domains/requests/itempayload';

export async function save(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const itemPayload = req.body as ItemPayload;
    console.log(itemPayload);
    const item = await itemServices.save(itemPayload);
    res.status(HttpStatus.StatusCodes.CREATED).json({
      sucess: true,
      data: item,
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
    const data = await itemServices.fetch(id);
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
    const itemPayload = req.body as ItemPayload;
    const id: number = parseInt(req.params.id);

    await itemServices.update(id, itemPayload);
    res.status(HttpStatus.StatusCodes.OK).json({
      sucess: true,
    });
  } catch (err) {
    next(err);
  }
}
