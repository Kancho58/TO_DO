import { Knex } from 'knex';

import Table from '../../resources/enums/Table';
import { onUpdateTrigger } from '../../untils/knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable(Table.USERS, (table: Knex.TableBuilder) => {
      table.increments('id').primary();
      table.string('name', 128).unique().notNullable();
      table.string('email', 128).unique().notNullable();

      table.timestamps(true, true);
    })
    .then(() => knex.raw(onUpdateTrigger(Table.USERS)));
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(Table.USERS);
}
