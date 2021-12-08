
/*
have the following required and not-nullable fields:
Table name: <input name="table_name" />, which must be at least 2 characters long.
Capacity: <input name="capacity" />, this is the number of people that can be seated at the table, which must be at least 1 person.
*/

exports.up = function (knex) {
    return knex.schema.createTable("tables", (table) => {
      table.increments("table_id").primary();
      table.string("table_name").notNullable();
      table.integer("capacity").notNullable();
      table.integer("reservation_id").references("reservation_id").inTable("reservations")
      table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("tables");
};
