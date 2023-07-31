/* eslint-disable no-useless-catch */
import {
  UserPayload,
  FetchUsers,
  UpdatePayload,
} from '../domains/requests/userpayload';
import knex from '../config/knex';
import logger from '../untils/logger';
import BadRequestError from '../exceptions/BadRequestError';
import Table from '../resources/enums/Table';
import * as object from '../untils/object';
import * as bcrypt from '../untils/bcrypt';
import LoginPayload from '../domains/requests/loginpayload';
import * as jwt from '../untils/jwt';
import { createOtp, isTokenExpired } from '../untils/tokens';

export async function save(userPayload: UserPayload): Promise<any> {
  try {
    const { name, email } = userPayload;
    const codeCreatedAt = new Date();

    logger.log('info', 'Code Created For User');
    const code: string = createOtp();

    const user = await knex(Table.USERS).where(
      knex.raw('LOWER(email) =?', email.toLowerCase())
    );

    if (user.length) {
      logger.log('info', 'Users already exists');
      throw new BadRequestError('User already exists');
    }

    logger.log('info', 'User inserting');
    await knex(Table.USERS)
      .insert(object.toSnakeCase({ name, email, code, codeCreatedAt }))
      .returning(['name', 'email']);
    logger.log('info', 'User successfully inserted');

    return code;
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
    logger.log('info', 'Comparing users password');

    const isPasswordValidate = await bcrypt.compare(
      password,
      user.password || ''
    );

    logger.log('info', 'Comparing users code');

    const isCodeValidate = await knex(Table.USERS).where('code', password);
    if (isTokenExpired(object.toSnakeCase(user).codeCreatedAt)) {
      logger.log('info', 'code expired');
      throw new BadRequestError('Code expired');
    }

    if (!isPasswordValidate && isCodeValidate.length === 0) {
      logger.log('info', "Users' password or code dose not match");
      throw new BadRequestError("Users' password or code dose not match");
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
  if (!users.length) {
    logger.log('info', 'User not found');
    throw new BadRequestError('User not found');
  }

  logger.log('info', 'user fetched successfully');

  const data = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
  }));
  return object.camelize({
    data,
    page,
    perPage,
  });
}

export async function fetchUserById(userId: number): Promise<FetchUsers> {
  const users = await knex(Table.USERS).where('id', userId);

  if (!users.length) {
    logger.log('info', 'User not found');
    throw new BadRequestError('User not found');
  }

  logger.log('info', 'user fetched successfully');

  const user = users[0];

  return object.camelize({ id: user.id, name: user.name, email: user.email });
}

export async function update(
  userId: number,
  updatePayload: UpdatePayload
): Promise<UpdatePayload> {
  try {
    const { name } = updatePayload;
    const password = await bcrypt.hash(updatePayload.password);

    logger.log('info', 'Fetching User');
    const users = await knex(Table.USERS).where('id', userId);

    if (!users.length) {
      logger.log('info', 'User not found');
      throw new BadRequestError('User not found');
    }
    const updatedUser = await knex(Table.USERS)
      .where('id', userId)
      .update(object.toSnakeCase({ name, password, isPasswordSet: true }))
      .returning(['id', 'name', 'email']);

    logger.log('info', 'User updated successfully');

    return object.camelize(updatedUser[0]);
  } catch (err) {
    throw err;
  }
}
