const express = require('express');
const app = express();

app.listen(3000, function() {
    console.log('listening on 3000')
});

app.get('/' , function(req, res) {
    res.send('Hello World')
});

// z.B. http://localhost:3000/image.html
app.use(express.static(__dirname + '/public'));

const bodyParser= require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

// Initialisierung EJS - Template Engine
app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');

// Datenbank initialisieren
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('logins.db');