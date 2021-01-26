const express = require("express")
const app = express()
const sql = require("mssql")

/*const cors = require('cors')
app.use(cors())
app.use(express.json())*/

const config = {
    user: 'WebClient',
    password: '123456789',
    server: 'localhost', 
    database: 'phonebook',
    port: 1433
}

app.post('/persons',(req,res) => {
    const name = req.body.name
    const number = req.body.number
    sql.connect(config, (err) => {
        if (err){ 
            console.log(err)
        }else{
            const request = new sql.Request();
            request.query(
                'INSERT INTO person (name,number) VALUES (?,?)',
                [name,number],
                (err,result) => {
                    if (err){
                        console.log(err)
                    }else{
                        res.send("Values Inserted")
                    }
                }
            )
        }
    })
})

app.get('/persons',(req,res) => {
    sql.connect(config, (err) => {
        if (err){ 
            console.log(err)
        }else{
            var request = new sql.Request();
            request.query(
                'SELECT * FROM phonebook',
                (err,result) => {
                    if (err){
                        console.log(err)
                    }else{
                        res.send(result)
                    }
                }
            )
        }
    })
})

app.put('/persons',(req,res) => {
    const id = req.body.id
    const number = req.body.wage
    sql.connect(config, (err) => {
        if (err){ 
            console.log(err)
        }else{
            const request = new sql.Request();
            request.query(
                'UPDATE phonebook SET number = ? WHERE id = ?',
                [number, id],
                (err,result) => {
                    if (err){
                        console.log(err)
                    }else{
                        res.send(result)
                    }
                }
            )
        }
    })
})

app.delete('/persons/:id',(req,res) => {
    const id = req.params.id
    sql.connect(config, (err) => {
        if (err){ 
            console.log(err)
        }else{
            const request = new sql.Request();
            request.query(
                'DELETE FROM phonebook WHERE id = ?', 
                id,
                (err,result) => {
                    if (err){
                        console.log(err)
                    }else{
                        res.send(result)
                    }
                }
            )
        }
    })
})

app.listen(3001, () => {
    console.log("I'm running")
})