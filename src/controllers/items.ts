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

    const item = await itemServices.save(
      itemPayload,
      res.locals.loggedInPayload.userId
    );

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
    const offset = perPage * (page - 1);

    const data = await itemServices.fetchItems(
      res.locals.loggedInPayload.userId,
      page,
      perPage,
      offset
    );
    res.status(HttpStatus.StatusCodes.OK).json({
      success: true,
      data,
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
    const offset = perPage * (page - 1);
    const userId = parseInt(req.params.id);

    const data = await itemServices.fetchItemsByAdmin(
      userId,
      page,
      perPage,
      offset
    );
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
