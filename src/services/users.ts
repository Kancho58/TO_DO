/* eslint-disable no-useless-catch */
import { UserPayload } from '../domains/requests/userpayload';
import knex from '../config/knex';
import logger from '../untils/logger';
import BadRequestError from '../exceptions/BadRequestError';
import Table from '../resources/enums/Table';
import * as object from '../untils/object';

export async function save(userPayload: UserPayload): Promise<any> {
  try {
    const { name, email } = userPayload;

    const user = await knex(Table.USERS).where(
      knex.raw('LOWER(email) =?', email.toLowerCase())
    );

    if (user.length) {
      logger.log('info', 'Users already exists');
      throw new BadRequestError('User already exists');
    }

    logger.log('Info', 'User inserting');
    const newUser = await knex(Table.USERS)
      .insert(object.toSnakeCase({ name, email }))
      .returning(['name', 'email']);
    logger.log('Info', 'User successfully inserted');

    return newUser;
  } catch (err) {
    throw err;
  }
}
export async function fetchUsers(): Promise<any> {
  const users = await knex(Table.USERS).select('*');

  if (!users) {
    logger.log('info', 'User not found');
    throw new BadRequestError('User not found');
  }

  logger.log('info', 'user fetched successfully');

  const data = users.map((user) => ({
    name: user.name,
    email: user.email,
  }));

  return data;
}

export async function update(
  userId: number,
  userPayload: UserPayload
): Promise<void> {
  try {
    const { name, email } = userPayload;

    logger.log('info', 'Fetching User');
    const user = await knex(Table.USERS).where('id', userId);

    if (!user) {
      logger.log('info', 'User not found');
      throw new BadRequestError('User not found');
    }
    await knex(Table.USERS)
      .where('id', userId)
      .update(object.toSnakeCase({ name, email }));
    logger.log('info', 'User updated successfully');
  } catch (err) {
    throw err;
  }
}
