const express = require('express');
const app = express();

app.listen(3000, function() {
    console.log('listening on 3000')
});

//app.get('/' , function(req, res) {
    //res.send('Hello World')
//});

// z.B. http://localhost:3000/image.html
app.use(express.static(__dirname + '/public'));

// Vorher npm install body-parser --save installieren
const bodyParser= require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

// Initialisierung EJS - Template Engine
app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');

// Datenbank initialisieren
// Vorher npm install sqlite3 --save installieren
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('logins.db',(error)=>{
         if(error){
         console.error(error.message);
        }else{
        console.log('Connected to the database.');
        }
});

// Sessionvariablen
const session = require('express-session');
app.use(session({ 
	secret: 'example',
	resave: false,
	saveUninitialized: true
}));

//Führt zur Login Seite
app.get('/login', (req, res) => {
	res.render('login');
});

//Führt zur Registration Seite
app.get('/registration', (req, res)=>{
	res.render('registration');
});

//Führt die Registrierung durch
app.post('/registrierung', (req,res)=>{
	//ABfrage von user input und abspeichern in variablen
	const user = req.body["user"];
    const pw = req.body["password"];
    
//Fügt den User in die Datenbank ein

	db.run(`INSERT INTO users (userName, userPW) VALUES ('${user}','${pw}')`,(error)=>{
		if(error){
			console.error(error.message);
		}
	});
    //Nach der Registrierung, wird man zu der Login Seite geführt
    // redirect bringt uns direkt zu einer Seite und holt die Informationen und render holt die Infos aus ejs File
	res.redirect('login');
});

app.get('/index', (req, res)=>{
    res.render('index');
});

app.post('/anmelden', function(req, res){

	const user = req.body["user"];
    const password = req.body["password"];
    //Überprüft, ob der User in unserer Datenbank gespreichert ist
	db.get(`SELECT * FROM users WHERE userName='${user}'`,(error,row)=>{
            
        if(row != undefined){
			//Wenn ja, schau ob das Password richtig ist
			if(password == row.userPW){
				//hat geklappt
				// Sessionvariable setzen
				req.session['user'] = user;
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
app.get('/success', function(req, res){
	if (!req.session['user']){
		res.redirect('/login');
	}
	else{
		const user = req.session['user'];
		res.render('success', {'user': user});
	}
});

app.get('/logout', function (req, res){
	delete req.session['user'];
	res.redirect('/login');
});





let db = new sqlite3.Database('logins.db');


//Sessionvariablen
const session = require('express-session');
app.use(session({
    secret: 'example',
    resave: false,
    saveUninitialized: true
}))



app.get('/profil',(req,res)=>{
    res.render('profil');

});

