import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('snack',(table)=>{
    table.increments('id').primary(),
    table.integer('id_user').references('id').inTable('users').onDelete('CASCADE'),
    table.text('name').notNullable(),
    table.text('description').notNullable(),
    table.dateTime('date_hour').notNullable(),
    table.dateTime('create_at').defaultTo(knex.fn.now()),
    table.dateTime('update_at').defaultTo(knex.fn.now())
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('snack')
}

