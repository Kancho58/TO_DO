/* eslint-disable no-useless-catch */
import { UserPayload, FetchUsers } from '../domains/requests/userpayload';
import knex from '../config/knex';
import logger from '../untils/logger';
import BadRequestError from '../exceptions/BadRequestError';
import Table from '../resources/enums/Table';
import * as object from '../untils/object';

export async function save(userPayload: UserPayload): Promise<UserPayload> {
  try {
    const { name, email } = userPayload;

    const user = await knex(Table.USERS).where(
      knex.raw('LOWER(email) =?', email.toLowerCase())
    );

    if (user.length) {
      logger.log('info', 'Users already exists');
      throw new BadRequestError('User already exists');
    }

    logger.log('info', 'User inserting');
    const newUser = await knex(Table.USERS)
      .insert(object.toSnakeCase({ name, email }))
      .returning(['name', 'email']);
    logger.log('info', 'User successfully inserted');

    return object.camelize(newUser);
  } catch (err) {
    throw err;
  }
}
export async function fetchUsers(
  page: number,
  perPage: number,
  total: number
): Promise<FetchUsers> {
  const users = await knex(Table.USERS)
    .select('*')
    .orderBy('id')
    .limit(perPage)
    .offset(total);
  if (!users) {
    logger.log('info', 'User not found');
    throw new BadRequestError('User not found');
  }

  logger.log('info', 'user fetched successfully');

  const data = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
  }));

  return object.camelize({ data, page, perPage, total });
}

export async function update(
  userId: number,
  userPayload: UserPayload
): Promise<UserPayload> {
  try {
    const { name, email } = userPayload;

    logger.log('info', 'Fetching User');
    const user = await knex(Table.USERS).where('id', userId);

    if (!user) {
      logger.log('info', 'User not found');
      throw new BadRequestError('User not found');
    }
    const updatedUser = await knex(Table.USERS)
      .where('id', userId)
      .update(object.toSnakeCase({ name, email }))
      .returning(['name', 'email']);

    logger.log('info', 'User updated successfully');

    return object.camelize(updatedUser);
  } catch (err) {
    throw err;
  }
}
