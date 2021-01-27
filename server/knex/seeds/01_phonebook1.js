
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('person').del()
    .then(function () {
      // Inserts seed entries
      return knex('person').insert([,
        {id: 2, name: 'Pepe'},
        {id: 3, number: '5523232323'}
      ]);
    });
};
