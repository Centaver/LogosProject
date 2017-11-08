var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var request    = require('request-promise');
var mysql      = require('mysql');
var port       = 3000;

var options    = {method: 'GET',
                  uri: 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5',
                  json: true};

var app        = express();

request(options)
    .then(function (response) {
        // Ok
    console.log(response)
    
    })
    .catch(function (err) {
        // Error
    });

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'true'}));


//Database mysql
var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '25ser1987r'
});

createDB(connection);

connection.database = "coin_keeper";

//Authorization block 
app.post('/login', function (req, res) {
    connection.query('SELECT * FROM users  WHERE login = ?', req.body.login, function (err, rows) {
        if (err) throw err;
        if (rows[0] != undefined) {
            if (rows[0].password == req.body.pass) {
                res.status(200).send(rows[0]).end();
            } else {
                res.status(200).send("Error in password").end();
            }
        } else {
            res.status(200).send("Error in login").end();
        }
    });
});

//Registration block
app.post('/register', function (req, res) {
    connection.query('SELECT * FROM users  WHERE login = ?', req.body.login, function (err, rows) {
        if (err) throw err;
        if (rows[0] != undefined) {
            res.status(200).send("Choose another login!");
        } else {
            connection.query('INSERT INTO users SET ?', req.body,
                function (err, result) {
                    if (err) throw err;
                    res.status(200).send(req.body).end();
                }
            );
        }
    });
});


app.listen(port, function (err) {
    if (err) throw err;
    console.log('Server start on port '+port+'!');
});

function createDB(connection){
    
    var queryBase  = "CREATE SCHEMA IF NOT EXISTS `coin_keeper` DEFAULT CHARACTER SET utf8;";
    
    var queryTable = "CREATE TABLE IF NOT EXISTS `coin_keeper`.`users` (`iduser` INT(11) NOT NULL,`name` VARCHAR(45) NULL DEFAULT NULL,`sname` VARCHAR(45) NULL DEFAULT NULL,`age` INT(11) NULL DEFAULT NULL,`email` VARCHAR(45) NULL DEFAULT NULL,`password` VARCHAR(25) NULL DEFAULT NULL,PRIMARY KEY (`iduser`))";
    
    connection.query(queryBase, function (err, result) {
    if (err) throw err;
    console.log("Database created");});
    
    connection.query(queryTable, function (err, result) {
    if (err) throw err;
    console.log("Tables created");});
}