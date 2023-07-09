/* eslint-disable no-useless-catch */
import knex from '../config/knex';
import logger from '../untils/logger';
import { ItemPayload } from '../domains/requests/itempayload';
import BadRequestError from '../exceptions/BadRequestError';
import Table from '../resources/enums/Table';
import * as object from '../untils/object';

export async function save(
  itemPayload: ItemPayload,
  userId: number
): Promise<any> {
  try {
    const { title, description } = itemPayload;

    const item = await knex(Table.ITEMS).where(
      knex.raw('LOWER(title) =?', title.toLowerCase())
    );

    if (item.length) {
      logger.log('info', 'Title already exists');
      throw new BadRequestError('Title already exists');
    }

    logger.log('info', 'Item Inserting');
    const newItem = await knex(Table.ITEMS)
      .insert(object.toSnakeCase({ title, description, userId }))
      .returning(['title', 'description']);

    logger.log('Info', 'Item successfully inserted');
    return newItem;
  } catch (err) {
    throw err;
  }
}

export async function fetchItems(userId: number): Promise<any> {
  logger.log('Info', 'Fetching items');

  const items = await knex(Table.ITEMS)
    .select('*')
    .where(object.toSnakeCase({ userId }));

  if (!items) {
    logger.log('info', 'Item not found');
    throw new BadRequestError('Item not found');
  }

  logger.log('info', 'Item fetched successfully');

  const data = items.map((item) => ({
    title: item.title,
    description: item.description,
  }));
  return data;
}

export async function update(
  itemId: number,
  itemPayload: ItemPayload
): Promise<any> {
  try {
    const { title, description } = itemPayload;

    logger.log('Info', 'Fetching items');

    const item = await knex(Table.ITEMS).where({ id: itemId });

    if (!item) {
      logger.log('info', 'Item not found');
      throw new BadRequestError('Item not found');
    }
    const updatedItem = await knex(Table.ITEMS)
      .where({ id: itemId })
      .update(object.toSnakeCase({ title, description }))
      .returning(['title', 'description']);

    return updatedItem;
  } catch (err) {
    throw err;
  }
}
