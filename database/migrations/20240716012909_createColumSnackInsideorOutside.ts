import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('snack',(table)=>{
    table.boolean('inside_or_outside').defaultTo(false);
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('snack',(table)=>{
    table.dropColumn('inside_or_outside');
  })
}

