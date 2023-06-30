import { Knex } from 'knex';

import Table from '../../resources/enums/Table';
import { onUpdateTrigger } from '../../untils/knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable(Table.ITEMS, (table: Knex.TableBuilder) => {
      table.increments('id').primary();
      table.string('title', 128).unique().notNullable();
      table.string('description', 500).notNullable();
      table
        .integer('user_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable(Table.USERS)
        .onDelete('SET NULL');

      table.timestamps(true, true);
    })
    .then(() => knex.raw(onUpdateTrigger(Table.ITEMS)));
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(Table.ITEMS);
}
