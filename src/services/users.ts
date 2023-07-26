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

export async function register(userPayload: UserPayload): Promise<UserPayload> {
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

    return object.camelize(newUser[0]);
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
    await knex(Table.USERS).where(
      knex.raw('LOWER(email) =?', email.toLowerCase())
    );

    const isValidate = await bcrypt.compare(password, user.password || '');
    if (!isValidate) {
      throw new UnauthorizedError(errors.password);
    }

    logger.log('info', 'Generating access token');

    const accessToken = jwt.generateAccessToken({
      email: user.email,
      name: user.name,
      roleId: user.roleId,
      userId: user.id,
    });

    return object.camelize({ id: user.id, email, accessToken });
  } catch (error) {
    throw error;
  }
}

export async function fetchUsers(
  page: number,
  perPage: number,
  offset: number
): Promise<FetchUsers> {
  const users = await knex(Table.USERS)
    .select('*')
    .orderBy('id')
    .limit(perPage)
    .offset(offset);
  if (!users) {
    logger.log('info', 'User not found');
    throw new BadRequestError('User not found');
  }

  logger.log('info', 'user fetched successfully');

  const user = users[0];
  return object.camelize({
    id: user.id,
    name: user.name,
    email: user.email,
    page,
    perPage,
  });
}

export async function fetchUsersById(userId: number): Promise<FetchUsers> {
  const users = await knex(Table.USERS).where('id', userId);

  if (!users.length) {
    logger.log('info', 'User is not logged in');
    throw new BadRequestError('User is not logged in');
  }

  logger.log('info', 'user fetched successfully');

  const user = users[0];

  return object.camelize({ id: user.id, name: user.name, email: user.email });
}

export async function update(
  userId: number,
  userPayload: UserPayload
): Promise<UserPayload> {
  try {
    const { name, email } = userPayload;
    const password = await bcrypt.hash(userPayload.password);

    logger.log('info', 'Fetching User');
    const users = await knex(Table.USERS).where('id', userId);

    if (!users.length) {
      logger.log('info', 'User not found');
      throw new BadRequestError('User not found');
    }
    const updatedUser = await knex(Table.USERS)
      .where('id', userId)
      .update(object.toSnakeCase({ name, email, password }))
      .returning(['id', 'name', 'email']);

    logger.log('info', 'User updated successfully');

    return object.camelize(updatedUser[0]);
  } catch (err) {
    throw err;
  }
}
