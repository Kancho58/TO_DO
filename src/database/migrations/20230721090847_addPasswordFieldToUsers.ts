import { Knex } from 'knex';
import Table from '../../resources/enums/Table';

export function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(Table.USERS, (table: Knex.TableBuilder) => {
    table.string('password').nullable();
  });
}

export function down(knex: Knex): Knex.SchemaBuilder {
  return knex.schema.alterTable(Table.USERS, (table) => {
    table.dropColumn('password');
  });
}
