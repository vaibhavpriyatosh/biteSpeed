import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('contact', (table) => {
        table.increments('id');
        table.integer('phoneNumber');
        table.string('email');
        table.integer('linkedId');
        table.enum('linkPrecedence', ["secondary", "primary"]).notNullable();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
        table.timestamp('deletedAt');
        table.unique(['email', 'phoneNumber']);
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('contact');
}

