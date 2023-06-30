import knex from '../config/knex';
import logger from '../untils/logger';
import { ItemPayload } from '../domains/requests/itempayload';
import BadRequestError from '../exceptions/BadRequestError';
import Table from '../resources/enums/Table';
import * as object from '../untils/object';

export async function save(itemPayload: ItemPayload): Promise<any> {
  try {
    const { title, description } = itemPayload;

    const item = await knex(Table.ITEMS).where(
      knex.raw('LOWER(title) =?', title.toLowerCase())
    );
    if (item.length) {
      logger.log('info', 'Title already exists');
      throw new BadRequestError('Title already exists');
    }
    await knex(Table.ITEMS).insert(object.toSnakeCase({ title, description }));

    return item;
  } catch (err) {
    throw err;
  }
}

export async function fetch(itemId: number): Promise<any> {
  const [item] = await knex(Table.ITEMS).where({ id: itemId });

  if (!item) {
    logger.log('info', 'Item not found');
    throw new BadRequestError('Item not found');
  }

  logger.log('info', 'Item fetched successfully');
  return {
    data: {
      title: item.title,
      description: item.description,
    },
  };
}

export async function update(
  itemId: number,
  itemPayload: ItemPayload
): Promise<void> {
  try {
    const { title, description } = itemPayload;

    const item = await knex(Table.ITEMS).where({ id: itemId });

    if (!item) {
      logger.log('info', 'Item not found');
      throw new BadRequestError('Item not found');
    } else {
      await knex(Table.ITEMS)
        .where({ id: itemId })
        .update(object.toSnakeCase({ title, description }));
    }
  } catch (err) {
    throw err;
  }
}
