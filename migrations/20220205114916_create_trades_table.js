/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("trades", function (table) {
    table.increments("id");
    table.string("market");
    table.string("period");
    table.string("indicator");

    table.datetime("time", {
      useTz: true,
    });

    table.string("type");
    table.string("last_status").nullable();

    table.string("qty");

    table.double("price", 8, 8);
    table.double("target_price", 8, 8);

    // table.boolean("is_fillable").default(false);
    // table.boolean("is_close").default(false);

    table.datetime("fill_at");
    table.datetime("close_at");

    table.text("cause");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("trades");
};
