var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var async = require('async');

// Create connection to database
var config = {
  server: 'localhost',
  authentication: {
      type: 'default',
      options: {
          userName: 'WebClient', // update me
          password: '123456789' // update me
      }
  },
  options: {
    database: 'phonebook'
  }
}

var connection = new Connection(config);

function Start(callback) {
    console.log('Starting...');
    callback(null, 'David', '3839932');
}

function Insert(name, number, callback) {
    console.log("Inserting '" + name + "' into Table...");

    request = new Request(
        'INSERT INTO dbo.phonebook (name, number) OUTPUT INSERTED.Id VALUES (@name, @number);',
        function(err, rowCount, rows) {
        if (err) {
            callback(err);
        } else {
            console.log(rowCount + ' row(s) inserted');
            callback(null, 'Lisset', '5378624364');
        }
        });
    request.addParameter('name', TYPES.NVarChar, name);
    request.addParameter('number', TYPES.NVarChar, number);

    // Execute SQL statement
    connection.execSql(request);
}

function Update(name, number, callback) {
    console.log("Updating number to '" + number + "' for '" + name + "'...");

    // Update the employee record requested
    request = new Request(
    'UPDATE dbo.phonebook SET number=@number WHERE name = @name;',
    function(err, rowCount, rows) {
        if (err) {
        callback(err);
        } else {
        console.log(rowCount + ' row(s) updated');
        callback(null, 'Lisset');
        }
    });
    request.addParameter('name', TYPES.NVarChar, name);
    request.addParameter('number', TYPES.NVarChar, number);

    // Execute SQL statement
    connection.execSql(request);
}

function Delete(name, callback) {
    console.log("Deleting '" + name + "' from Table...");

    // Delete the employee record requested
    request = new Request(
        'DELETE FROM dbo.phonebook WHERE name = @name;',
        function(err, rowCount, rows) {
        if (err) {
            callback(err);
        } else {
            console.log(rowCount + ' row(s) deleted');
            callback(null);
        }
        });
    request.addParameter('name', TYPES.NVarChar, name);

    // Execute SQL statement
    connection.execSql(request);
}

function Read(callback) {
    console.log('Reading rows from the Table...');

    // Read all rows from table
    request = new Request(
    'SELECT * FROM dbo.phonebook;',
    function(err, rowCount, rows) {
    if (err) {
        callback(err);
    } else {
        console.log(rowCount + ' row(s) returned');
        callback(null);
    }
    });

    // Print the rows read
    var result = "";
    request.on('row', function(columns) {
        columns.forEach(function(column) {
            if (column.value === null) {
                console.log('NULL');
            } else {
                result += column.value + " ";
            }
        });
        console.log(result);
        result = "";
    });

    // Execute SQL statement
    connection.execSql(request);
}

function Complete(err, result) {
    if (err) {
        callback(err);
    } else {
        console.log("Done!");
    }
}

// Attempt to connect and execute queries if connection goes through
connection.on('connect', function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Connected');

    // Execute all functions in the array serially
    async.waterfall([
        Start,
        Insert,
        Update,
        Delete,
        Read
    ], Complete)
  }
});