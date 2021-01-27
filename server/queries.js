const connection = require('./knexfile')[process.env.NODE_ENV || 'development']
const database = require('knex')(connection)

module.exports = {
    getAll(){
        return database
            .select()
            .table('persons')
            .then(rows => rows);
    },

    getById(id) {
        return database
          .from("persons")
          .select("*")
          .where("id", id)
          .first();
    },

    insert(newUser) {
        return database
            .insert(newUser)
            .into("persons")
            .returning("*")
            .then(rows => rows);
    },

    delete(id) {
        return database
          .where({ id })
          .delete()
          .table('persons');
    },
    
    update(id, userFields) {
        return database
          .where({ id })
          .update(userFields)
          .table('persons');
    }
};