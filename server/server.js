const express = require('express');
const PORT = process.env.PORT || 3001;
const knex = require('./knex/knex.js');
const app = express();
const queries = require('./queries');
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

//post
app.post('/persons', (req, res) =>{
    queries.insert(req.body).then(data =>{
        res.status(204).end();
    });
});

//get
app.get('/persons', (req, resp) => {
    queries.getAll().then(results => resp.send(results));
});

app.get('/persons/:id', (req, res) => {
    queries.getById(req.params.id).then(data =>{
        res.send(data);
    })
});

//update
app.put('/persons/:id', (req,res) => {
    queries.update(req.params.id, req.body).then(data => {
        res.status(204).end();
      });
})

//delete
app.delete('/persons/:id', (req,res) => {
    queries.delete(req.params.id).then(data => {
        res.status(204).end();
      });
})

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});