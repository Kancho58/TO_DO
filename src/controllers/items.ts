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
    const userId: number = parseInt(req.params.id);
    const item = await itemServices.save(itemPayload, userId);

    res.status(HttpStatus.StatusCodes.CREATED).json({
      success: true,
      data: item,
    });
  } catch (err) {
    next(err);
  }
}

export async function fetchItems(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage || 5);
    const total = perPage * (page - 1);

    const userId: number = parseInt(req.params.id);
    const data = await itemServices.fetchItems(userId, page, perPage, total);
    res.status(HttpStatus.StatusCodes.OK).json({
      success: true,
      ...data,
    });
  } catch (err) {
    next(err);
  }
}

export async function fetchItemsByAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage || 5);
    const total = perPage * (page - 1);

    const data = await itemServices.fetchItemsByAdmin(page, perPage, total);
    res.status(HttpStatus.StatusCodes.OK).json({
      success: true,
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

    const updatedItem = await itemServices.update(id, itemPayload);
    res.status(HttpStatus.StatusCodes.OK).json({
      success: true,
      data: updatedItem,
    });
  } catch (err) {
    next(err);
  }
}
