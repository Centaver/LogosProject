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
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '25ser1987r',
    database: 'coin_keeper'
});

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