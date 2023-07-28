/* eslint-disable no-useless-catch */
import knex from '../config/knex';
import logger from '../untils/logger';
import { ItemPayload, FetchItems } from '../domains/requests/itempayload';
import BadRequestError from '../exceptions/BadRequestError';
import Table from '../resources/enums/Table';
import * as object from '../untils/object';

export async function save(
  itemPayload: ItemPayload,
  userId: number
): Promise<ItemPayload> {
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

    logger.log('info', 'Item successfully inserted');

    return object.camelize(newItem[0]);
  } catch (err) {
    throw err;
  }
}

export async function fetchItems(
  userId: number,
  page: number,
  perPage: number,
  offset: number
): Promise<FetchItems> {
  logger.log('info', 'Fetching items');

  const items = await knex(Table.ITEMS)
    .where(object.toSnakeCase({ userId }))
    .select('*')
    .orderBy('id')
    .limit(perPage)
    .offset(offset);
  if (!items.length) {
    logger.log('info', 'Item not found');
    throw new BadRequestError('Item not found');
  }

  logger.log('info', 'Item fetched successfully');

  const data = items.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
  }));
  return object.camelize({ data, page, perPage });
}

export async function update(
  itemId: number,
  itemPayload: ItemPayload
): Promise<ItemPayload> {
  try {
    const { title, description } = itemPayload;

    logger.log('info', 'Fetching items');

    const items = await knex(Table.ITEMS).where({ id: itemId });

    if (!items.length) {
      logger.log('info', 'Item not found');
      throw new BadRequestError('Item not found');
    }
    const updatedItem = await knex(Table.ITEMS)
      .where({ id: itemId })
      .update(object.toSnakeCase({ title, description }))
      .returning(['id', 'title', 'description']);

    logger.log('info', 'Item updated successfully');

    return object.camelize(updatedItem[0]);
  } catch (err) {
    throw err;
  }
}
