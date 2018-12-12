const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
'use strict';
const nodemailer = require("nodemailer");
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public')));





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
        html: 'Dein Passwort lautet poseidon</b>'

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

app.listen(3000, function() {
    console.log('listening on 3000')
});

// Datenbank initialisieren
const sqlite3 = require('sqlite3').verbose();


//let db = new sqlite3.Database('logins.db');
let db = new sqlite3.Database('login.db',(error)=>{});

let dbAnzeigen = new sqlite3.Database('anzeigen.db',(error)=>{


    if(error){
        console.error(error.message);
    }else{
        console.log('Connected to the database.');
    }
});



//Sessionvariablen
const session = require('express-session');
app.use(session({
    secret: 'example',
    resave: false,
    saveUninitialized: true
}));


app.get('/' , function(req, rep) {
    rep.sendFile(__dirname + '/views/home.html')
});

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
    rep.sendFile(__dirname+ '/views/profil.html');

});
let userAnmelden;
let profilname;
app.get('/endprofil', function(req,res) {
    let sql = 'DEFAULT';
    let ary = [];
    if(profilname != undefined) {

        sql= `SELECT * FROM PROFIL WHERE NAME = '${profilname}'`;
        db.get(sql, function(err, rows){
            ary.push('Name: ' + rows.NAME);
            ary.push('Ater: '+ rows.AGE);
            ary.push('Semester: '+ rows.SEMSTER);
            ary.push('Studiengang: '+ rows.STUDIENGANG);
            ary.push('Können: '+ rows.ROLE);
            ary.push('Hobby: '+ rows.HOBBY);
            if(err){
                console.log(err.message);
            
            }
            else{
                console.log(rows);
    
                res.render('endprofil',{'rows' : ary });
                //res.render('endprofil',('rows' : rows || []}));
    
            }
        });
    } else {

    }
    console.log(sql);
    
});

app.post('/profilerstellen2', function(req,res) {
    profilname = req.body["profilname"];
    const profilalter = req.body["profilalter"];
    const profilsemester = req.body["profilsemester"];
    const profilstudiengang = req.body["profilstudiengang"];
    const profilrole = req.body["profilrole"];
    const profilhobby = req.body["profilhobby"];
    console.log(profilname);
    console.log(profilalter);
    console.log(profilsemester);
    console.log(profilstudiengang);
    console.log(profilrole);
    console.log(profilhobby);


    db.run(`INSERT INTO PROFIL (NAME,AGE,SEMESTER,STUDIENGANG,ROLE,HOBBY) VALUES ('${profilname}','${profilalter}','${profilsemester}', '${profilstudiengang}', '${profilrole}', '${profilhobby}')`, (error) => {
        if (error) {
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
let anzeigenListe;
app.post('/erstellen2', function (req, rep) {
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

    anzeigenListe = [];

    // Öffnen einer verbindung zur datenbank 'anzeigen.db'
    let db = new sqlite3.Database('./anzeigen.db');

    // SQL - Query zum auslesen
    let selectAllFromAnzeigen = `SELECT TITEL, INHALT, ROLLE FROM ANZEIGEN`;


    db.all(selectAllFromAnzeigen, [], (error, rows) => {
        if (rows !== undefined) {
            for(let i = 0; i < rows.length; i++) {
                anzeigenListe.push(rows[i]);
            }

        }
    });

    rep.redirect('/anzeigenListe');
});




let users;
app.post('/users', function (req, rep) {
    const role = req.body['text'];
    //const list = document.getElementById('userListId');
    console.log(role);
    users = [];

    db.all(`SELECT * FROM PROFIL`,(error,row)=>{
        if(row != undefined){
            console.log(row.length);
            for(let i = 0; i < row.length; i++) {
                console.log("Role: " + row[i].ROLE);
                console.log("Role: " + row[i].NAME);
                //Wenn ja, schau ob das Password richtig ist
                if(row[i].ROLE.includes(role)){
                    //hat geklappt
                    // Sessionvariable setzen
                    users.push(row[i].NAME);
                    console.log(row[i].NAME);
                }
            }

        } else {
            users = ['Ed', 'pye', 'joshi']; // Default Test
        }
        //Falls ein Fehler auftritt in der Abfrage, gebe ihn aus
        if(error){
            console.error(error.message);
        }
    });

    // Users have to be transfered from the databank with name, role and user page
    rep.redirect('/userListe');
});


app.post('/anzeigen', function (req, res) {

    anzeigenListe = [];

    // Öffnen einer verbindung zur datenbank 'anzeigen.db'
    let db = new sqlite3.Database('./anzeigen.db');

    // SQL - Query zum auslesen
    let selectAllFromAnzeigen = `SELECT TITEL, INHALT, ROLLE FROM ANZEIGEN`;


    db.all(selectAllFromAnzeigen, [], (error, rows) => {
        if (rows !== undefined) {
            for(let i = 0; i < rows.length; i++) {
                anzeigenListe.push(rows[i]);
            }

        }
    });

    res.redirect('/anzeigenListe');
});


app.get('/login', function (req, res) {
    //res.send('Hello World');
    res.sendFile(__dirname + "/views/login.html");
    console.log("YES");
});

app.post('/anmelden', function(req,rep){
	userAnmelden = req.body["user"];
    let password = req.body["password"];

    console.log(userAnmelden);
    
    //Überprüft, ob der User in unserer Datenbank gespreichert ist
    db.all(`SELECT * FROM USERS WHERE LOGIN`,(error,row)=>{
        if(row != undefined){
            for(let i = 0; i < row.length; i++) {
                console.log("Password: " + row[i].PASSWORD);
                //Wenn ja, schau ob das Password richtig ist
                if(password == row[i].PASSWORD && userAnmelden == row[i].LOGIN ){
                    //hat geklappt
                    // Sessionvariable setzen
                    req.session['user'] = userAnmelden;
                    console.log("User Found and password right");
                    rep.redirect('/success');
//				res.render('success', {'user': user});
                }else{
                    //hat nicht gklappt, weil Password falsch
                    rep.redirect('/errorLogin');
                }
            }

		}else{
			//hat es nicht geklappt, weil kein User mit dem namen
			rep.redirect('/errorLogin');
		}
		//Falls ein Fehler auftritt in der Abfrage, gebe ihn aus
		if(error){
				console.error(error.message);
		}
	});
});

app.get('/errorLogin', function(req, rep) {
    console.log("Red");
    rep.render('error', {});
});

app.get('/success', function(req, res){
	if (!req.session['user']){
		res.redirect('/login');
	}
	else{
		const user = req.session['user'];
		res.render('succes', {'user': user});
	}
});

app.get('/logout', function (req, res){
	delete req.session['user'];
	res.redirect('/login');
});

app.post('/registrierung', function (req, res) {
    res.redirect('/');
});

app.get('/registration', (req, res)=>{
	res.sendFile(__dirname + "/views/registration.html");
});

app.post('/registration2', (req,res)=> {
    //ABfrage von user input und abspeichern in variablen
    const user = req.body["user"];
    const pw = req.body["password"];
    console.log(user);
//Fügt den User in die Datenbank ein

db.get(`SELECT * FROM USERS WHERE LOGIN='${user}'`,(error,row)=>{
    let found = false;
    if (row !=undefined){
        found = true;
        console.log("found user");
    }
    if(!found) {
	db.run(`INSERT INTO USERS (LOGIN, PASSWORD) VALUES ('${user}','${pw}')`,(error)=>{
		if(error){
			console.error(error.message);
        }
        console.log("User now in database");
        
	});
    }
    res.redirect('/login');
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
app.get('/anzeigenListe', function (req, res) {

    for(let i = 0; i < anzeigenListe.length; i++) {
        console.log(anzeigenListe[i].TITEL);
    }
    res.render('anzeigenListe', {
        anzeigenListe: anzeigenListe
    });
});
