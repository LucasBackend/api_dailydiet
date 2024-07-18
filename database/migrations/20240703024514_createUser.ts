import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users',(table)=>{
    table.increments('id').primary();
    table.text('nome').notNullable();
    table.text('email').notNullable();
    table.text('password').notNullable();

  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
}

