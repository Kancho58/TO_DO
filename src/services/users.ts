import { UserPayload } from '../domains/requests/userpayload';
import knex from '../config/knex';
import logger from '../untils/logger';
import BadRequestError from '../exceptions/BadRequestError';
import Table from '../resources/enums/Table';
import * as object from '../untils/object';

export async function save(userPayload: UserPayload): Promise<any> {
  try {
    const { name, email } = userPayload;

    console.log({ name, email }, 'userpayload');
    const user = await knex(Table.USERS).where(
      knex.raw('LOWER(email) =?', email.toLowerCase())
    );
    console.log(user, 'im users');
    if (user.length) {
      logger.log('info', 'Users already exists');
      throw new BadRequestError('User already exists');
    }

    await knex(Table.USERS).insert(object.toSnakeCase({ name, email }));
    return user;
  } catch (err) {
    throw err;
  }
}
export async function fetch(userId: number): Promise<any> {
  const [user] = await knex(Table.USERS).where({ id: userId });

  if (!user) {
    logger.log('info', 'User not found');
    throw new BadRequestError('User not found');
  }

  logger.log('info', 'user fetched successfully');
  return {
    data: {
      name: user.name,
      email: user.email,
    },
  };
}

export async function update(
  userId: number,
  userPayload: UserPayload
): Promise<void> {
  try {
    const { name, email } = userPayload;

    const user = await knex(Table.USERS).where('id', userId);

    if (!user) {
      logger.log('info', 'User not found');
      throw new BadRequestError('User not found');
    }
    await knex(Table.USERS).update(object.toSnakeCase({ name, email }));
  } catch (err) {
    throw err;
  }
}
