var express = require("express");
var bodyParser = require("body-parser");
var sql = require("mssql");
var cors = require('cors');
var app = express(); 

// Body Parser Middleware
app.use(bodyParser.json()); 
app.use(cors());

//Setting up server
 var server = app.listen(process.env.PORT || 3001, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
 });

 //Initializing connection string
var dbConfig = {
    user:  "WebClient",
    password: "123456789",
    server: "DESKTOP-RVGL8OV\\SQLDEVELOPER",
    database: "phonebook",
    "options": {
        "encrypt": true,
        "enableArithAbort": true,
        "ous": true
        }
};

//GET API
app.get("/persons", function(req , res){
	var dbConn = new sql.ConnectionPool(dbConfig);
    dbConn.connect().then(function () {
        var request = new sql.Request(dbConn);
        request.query("select * from persons").then(function (resp) {
            console.log(resp);
            res.send(resp.recordset)
            dbConn.close();
        }).catch(function (err) {
            console.log(err);
            dbConn.close();
        });
    }).catch(function (err) {
        console.log(err);
    });
});

//POST API
app.post("/persons", function(req , res){
	var dbConn = new sql.ConnectionPool(dbConfig);
    dbConn.connect().then(function () {
		var transaction = new sql.Transaction(dbConn);
		transaction.begin().then(function () {
            var request = new sql.Request(transaction);
            var sqlStatment = "INSERT INTO persons (name,number) VALUES ('"+req.body.name+"','"+req.body.number+"')";
            request.query(sqlStatment)
			.then(function 	() {
				transaction.commit().then(function (resp) {
                    console.log(resp);
                    res.send("Values Inserted")
                    dbConn.close();
                }).catch(function (err) {
                    console.log("Error in Transaction Commit " + err);
                    dbConn.close();
                });
			}).catch(function (err) {
                console.log("Error in Transaction Begin " + err);
                dbConn.close();
            })
		}).catch(function (err) {
            console.log(err);
            dbConn.close();
        }).catch(function (err) {
        console.log(err);
    });
  });
});

//PUT API
app.put("/persons", function(req , res){
	var dbConn = new sql.ConnectionPool(dbConfig);
    dbConn.connect().then(function () {
		var transaction = new sql.Transaction(dbConn);
		transaction.begin().then(function () {
            var request = new sql.Request(transaction);
            console.log(req.body)
            var sqlStatment = "UPDATE persons SET number ='"+req.body.number+"' WHERE name='"+req.body.name+"';";
            request.query(sqlStatment)
			.then(function 	() {
				transaction.commit().then(function (resp) {
                    console.log(resp);
                    res.send("Value Updated")
                    dbConn.close();
                }).catch(function (err) {
                    console.log("Error in Transaction Commit " + err);
                    dbConn.close();
                });
			}).catch(function (err) {
                console.log("Error in Transaction Begin " + err);
                dbConn.close();
            })
		}).catch(function (err) {
            console.log(err);
            dbConn.close();
        }).catch(function (err) {
        console.log(err);
    });
  });
});

//PUT API
app.delete("/persons/:id", function(req , res){
	var dbConn = new sql.ConnectionPool(dbConfig);
    dbConn.connect().then(function () {
		var transaction = new sql.Transaction(dbConn);
		transaction.begin().then(function () {
            var request = new sql.Request(transaction);
            console.log(req.body)
            var sqlStatment = "DELETE FROM persons WHERE id='"+req.params.id+"';";
            request.query(sqlStatment)
			.then(function 	() {
				transaction.commit().then(function (resp) {
                    console.log(resp);
                    res.send("Value Deleted")
                    dbConn.close();
                }).catch(function (err) {
                    console.log("Error in Transaction Commit " + err);
                    dbConn.close();
                });
			}).catch(function (err) {
                console.log("Error in Transaction Begin " + err);
                dbConn.close();
            })
		}).catch(function (err) {
            console.log(err);
            dbConn.close();
        }).catch(function (err) {
        console.log(err);
    });
  });
});