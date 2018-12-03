const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
'use strict';
const nodemailer = require("nodemailer");
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public')));

app.get('/' , function(req, res) {
    res.send('Hello World')
});



nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.live.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "pyesonoo@hotmail.de", // generated ethereal user
            pass: "poseidon" // generated ethereal password
        }
    });
    
    

    let mailOptions = {
        from: '"Pyeson Oo" <pyesonoo@hotmail.de>',
        to: 'pyesonoo@hotmail.de',
        subject: 'Password',
        text: 'Moin Pyeson dein Passwort lautet hallo',
        html: 'forgot_password</b>'

    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', innfo.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessagerUrl(info));
        });
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


//let db = new sqlite3.Database('logins.db');
let db = new sqlite3.Database('login.db',(error)=>{

let dbAnzeigen = new sqlite3.Database('anzeigen.db',(error)=>{


    if(error){
        console.error(error.message);
    }else{
        console.log('Connected to the database.');
    }
});
});


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
});

app.get('/profil', function(req,rep) {
    rep.sendfile(__dirname+ '/profil.html');

});

app.get(['/endprofil'], function(req,res) {
    const sql= 'SELECT * FROM profil';
    console.log(sql);
    login.db(sql, function(err, rows){
        if(err){
            console.log(err.message);
        
        }
        else{
            console.log(rows);
            res.render('endprofil',{'rows' : rows || []});

        }
    })
});

app.post('/profilerstellen', function(req,res) {
    const profilname = req.body["profilname"];
    const profilalter = req.body["profilalter"];
    const profilsemester = req.body["profilsemester"];
    const profilstudiengang = req.body["profilstudiengang"];
    const profilkönnen = req.body["profilkönnen"];
    const profilhobby = req.body["profilhobby"];
    console.log(profilname);
    console.log(profilalter);
    console.log(profilsemester);
    console.log(profilstudiengang);
    console.log(profilkönnen);
    console.log(profilhobby);

    dblogin.run(`INSERT INTO PROFIL (NAME,ALTER,SEMESTER,STUDIENGANG,KÖNNEN,HOBBY) VALUES ('${profilname}','${profilalter})','${profilsemester}')`,(error)=>{ 
        if(error){
            console.error(error.message);
        } else {
            console.log('Wrote to database');
        }
    });

});

    //console.log(sql);
    //db.run(sql, function(err){
        //res.redirect("/profil");
    //});

    


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


    dbAnzeigen.run(`INSERT INTO ANZEIGEN (TITEL, INHALT, ROLLE) VALUES ('${titel}','${content}', '${roles}')`,(error)=>{
        if(error){
            console.error(error.message);
        } else {
            console.log('Wrote to database');
        }
    });

});

app.listen(3000, function() {
    console.log('listening on 3000')
});
let users;
app.post('/users', function (req, rep) {
    const role = req.body['text'];
    //const list = document.getElementById('userListId');
    console.log(role);
    users = ['Ed', 'pye', 'joshi'];
    // Users have to be transfered from the databank with name, role and user page
    rep.redirect('/userListe');
});

app.get('/login', (req, res)=>{
    res.sendFile(__dirname + "/login.html");
});

app.post('/anmelden', function(req,res){
	let user = req.body["user"];
    let password = req.body["password"];

    console.log(user);
    
    //Überprüft, ob der User in unserer Datenbank gespreichert ist
	db.get(`SELECT * FROM USERS WHERE NAME='${user}'`,(error,row)=>{
            console.log("Password: " + row.PASSWORD);
        if(row != undefined){
			//Wenn ja, schau ob das Password richtig ist
			if(password == row.PASSWORD){
				//hat geklappt
				// Sessionvariable setzen
                req.session['user'] = user;
                console.log("User Found and password right");
				res.redirect('/success');
//				res.render('success', {'user': user});
			}else{
				//hat nicht gklappt, weil Password falsch
				res.render('error');
			}
		}else{
			//hat es nicht geklappt, weil kein User mit dem namen
			res.render('error');
		}
		//Falls ein Fehler auftritt in der Abfrage, gebe ihn aus
		if(error){
				console.error(error.message);
		}
	});
});

app.get('/registration', (req, res)=>{
	res.sendFile(__dirname + "/registration.html");
});

app.post('/registrierung', (req,res)=>{
	//ABfrage von user input und abspeichern in variablen
	const user = req.body["user"];
    const pw = req.body["password"];
    console.log(user);
    
//Fügt den User in die Datenbank ein
let found = false;
db.get(`SELECT * FROM USERS WHERE NAME='${user}'`,(error,row)=>{
    found = true;
    console.log("found user");

    if(!found) {
	db.run(`INSERT INTO USERS (NAME, PASSWORD) VALUES ('${user}','${pw}')`,(error)=>{
		if(error){
			console.error(error.message);
        }
        console.log("User now in database");
	});
    } else { }
});
});
	
    //Nach der Registrierung, wird man zu der Login Seite geführt
    // redirect bringt uns direkt zu einer Seite und holt die Informationen und render holt die Infos aus ejs File
	

app.get('/userListe', function (req, rep) {
    rep.render('userListe', {
        users: users
    });


    console.log('rednering');
});

