
exports.up = function(knex) {
    return knex.schema.createTable('person', table => {
        table.increments('id') 
        table.string('name')
        table.integer('number')
    }) 
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('person')
};
