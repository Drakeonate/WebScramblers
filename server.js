const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public')));

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
<<<<<<< HEAD
let db = new sqlite3.Database('logins.db');
=======
let dbAnzeigen = new sqlite3.Database('anzeigen.db',(error)=>{
    if(error){
        console.error(error.message);
    }else{
        console.log('Connected to the database.');
    }
});
>>>>>>> e01ccf25a754d554e6cf05fe6c0e744bd548ecc9


//Sessionvariablen
const session = require('express-session');
app.use(session({
    secret: 'example',
    resave: false,
    saveUninitialized: true
}));

app.get('/index', function(req,rep) {
   rep.sendFile(__dirname + '/index.html');
});

app.get('/anzeigeErstellen', function (req, rep) {
    rep.sendFile(__dirname + '/views/anzeigeErstellen.html');
});

app.post('/erstellen', function (req, rep) {
    const content = req.body["content"];
    const titel = req.body["titel"];
    const roles = req.body["role"];
    console.log(content);
    console.log(titel);
    console.log(roles);

app.get('/profil',(req,res)=>{
    res.render('profil');

});