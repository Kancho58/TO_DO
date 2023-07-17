/* eslint-disable no-useless-catch */
import { UserPayload, FetchUsers } from '../domains/requests/userpayload';
import knex from '../config/knex';
import logger from '../untils/logger';
import config from '../config/config';
import BadRequestError from '../exceptions/BadRequestError';
import Table from '../resources/enums/Table';
import * as object from '../untils/object';
import * as bcrypt from '../untils/bcrypt';
import LoginPayload from '../domains/requests/loginpayload';
import * as jwt from '../untils/jwt';
import UnauthorizedError from '../exceptions/BadRequestError';

const { errors } = config;

export async function save(userPayload: UserPayload): Promise<UserPayload> {
  try {
    const { email } = userPayload;
    const password = await bcrypt.hash(userPayload.password);

    const user = await knex(Table.USERS).where(
      knex.raw('LOWER(email) =?', email.toLowerCase())
    );

    if (user.length) {
      logger.log('info', 'Users already exists');
      throw new BadRequestError('User already exists');
    }

    logger.log('info', 'User inserting');
    const newUser = await knex(Table.USERS)
      .insert(object.toSnakeCase({ ...userPayload, password, roleId: 2 }))
      .returning(['name', 'email']);
    logger.log('info', 'User successfully inserted');

    return object.camelize(newUser);
  } catch (err) {
    throw err;
  }
}

export async function login(loginPayload: LoginPayload): Promise<LoginPayload> {
  try {
    const { email, password } = loginPayload;

    logger.log('info', 'Fetching user');
    const [user] = object.camelize(
      await knex(Table.USERS).where(
        knex.raw('LOWER(email) =?', email.toLowerCase())
      )
    );
    if (!user) {
      throw new BadRequestError('User not found');
    }

    const oldPassword = await bcrypt.compare(password, user.password || '');
    if (!oldPassword) {
      throw new UnauthorizedError(errors.password);
    }

    logger.log('info', 'Generating access token');

    const accessToken = jwt.generateAccessToken({
      email: user.email,
      name: user.name,
      roleId: user.roleId,
    });

    return object.camelize({ id: user.id, email, accessToken });
  } catch (error) {
    throw error;
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

export async function fetchUsersById(userId: number): Promise<FetchUsers> {
  const users = await knex(Table.USERS).where('id', userId);

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

  return object.camelize({ data });
}

export async function update(
  userId: number,
  userPayload: UserPayload
): Promise<UserPayload> {
  try {
    const { name, email } = userPayload;
    const password = await bcrypt.hash(userPayload.password);

    logger.log('info', 'Fetching User');
    const user = await knex(Table.USERS).where('id', userId);

    if (!user) {
      logger.log('info', 'User not found');
      throw new BadRequestError('User not found');
    }
    const updatedUser = await knex(Table.USERS)
      .where('id', userId)
      .update(object.toSnakeCase({ name, email, password }))
      .returning(['id', 'name', 'email']);

    logger.log('info', 'User updated successfully');

    return object.camelize(updatedUser);
  } catch (err) {
    throw err;
  }
}
