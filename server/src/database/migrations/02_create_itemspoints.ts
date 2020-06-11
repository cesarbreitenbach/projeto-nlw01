import Knex from 'knex'

export async function up(knex : Knex){
    return( knex.schema.createTable('itemspoints', table =>{
        table.increments('id').primary(),
        table.integer('id_items')
           .notNullable()
           .references('id')
           .inTable('items'),
        table.integer('id_points')
           .notNullable()
           .references('id')
           .inTable('items')
    }))
}

export async function down(knex : Knex){
    return( knex.schema.dropTable('itemspoints'))
}