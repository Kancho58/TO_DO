/* eslint-disable no-useless-catch */
import knex from '../config/knex';
import logger from '../untils/logger';
import { ItemPayload } from '../domains/requests/itempayload';
import BadRequestError from '../exceptions/BadRequestError';
import Table from '../resources/enums/Table';
import * as object from '../untils/object';

export async function save(
  itemPayload: ItemPayload
  // userId: number
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

    await knex(Table.ITEMS).insert(object.toSnakeCase({ title, description }));

    return item;
  } catch (err) {
    throw err;
  }
}

export async function fetchItems(): Promise<any> {
  const items = await knex(Table.ITEMS).select('*');

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

// export const getItemByUserId = async (userId: number): Promise<any> => {
//   return object.camelize(
//     (
//       await knex(Table.USERS)
//         .innerJoin('items', 'user.id', '=', 'item.user_id')
//         .whereRaw('users.id = ?', [userId])
//     )[0]
//   );
// };

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
