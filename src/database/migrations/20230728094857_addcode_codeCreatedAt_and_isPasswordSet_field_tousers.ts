import { Knex } from 'knex';
import Table from '../../resources/enums/Table';

export function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(Table.USERS, (table: Knex.TableBuilder) => {
    table.text('code').index().unique().nullable();
    table.dateTime('code_created_at').nullable();
    table.boolean('is_password_set').defaultTo(false).notNullable();
  });
}

export function down(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.alterTable(Table.USERS, (table) => {
    table.dropColumn('code');
    table.dropColumn('code_created_at');
    table.dropColumn('is_password_set');
  });
}
