// Globale Variablen, die oft benötigt werden.
var _userName;
var _sessionId;
var _isIndex;

// Wird aufgerufen, sobald das Dokument geladen wurde.
$(document).ready(function(){
	// Globale Variablen befüllen
	fillGlobalVars();
	
	// Login-Funktionalität implementieren
	checkLogin();
	
	// Falls wir uns auf index.html befinden, 
	// alle 30 Sekunden nach neuen Artikeln schauen
	if(_isIndex) {
		// Lädt Artikel einmal initial
		loadArticles();
		// Lädt Artikel alle 30 Sekunden
		setInterval(function() {
    		loadArticles();
		}, 30000);
	}
});

// Lädt Artikel
function loadArticles() {
	console.log('loadArticles()');
	$.get('/articles', function(data, status) {
		if(status === "success") {
			var dataArray = JSON.parse(data);
			// Falls Artikel vorhanden sind
			if(dataArray.length) {				
				
				// Array sortieren
				// siehe http://stackoverflow.com/questions/19430561/how-to-sort-a-javascript-array-of-objects-by-date
				dataArray.sort(function(a,b) { 
					return new Date(b.date).getTime() - new Date(a.date).getTime();
				});
				
				// Alte Artikel entfernen
				$('#headerMain main').empty();
				
				// Artikel hinzufügen
				for(var i = 0; i < dataArray.length; i++) {
					createArticleFromJSONObject(dataArray[i], i);
				}
			}
		}
	});
}

// Erzeugt aus JSON-Objekt einen Artikel
function createArticleFromJSONObject(jsonObject, index) {	
	// JSON-Date in in JavaScript-Date umwandeln
	var articleDate = new Date(jsonObject.date);

	// Artikel hinzufügen
	$('#headerMain main').append('<article id="article'+index+'">');
	$('#headerMain main #article'+index).append('<header>');
	$('#headerMain main #article'+index+' header').append('<h2>');
	// Überschrift
	$('#headerMain main #article'+index+' header h2').append(jsonObject.title);
	// Datum
	$('#headerMain main #article'+index+' header').append('<span>');
	$('#headerMain main #article'+index+' header span').append(articleDate.formattedDate());
	// Beitrag
	$('#headerMain main #article'+index).append('<p class="articleContent">');
	$('#headerMain main #article'+index+' .articleContent').append(jsonObject.text.escapeLinebreaks());
}

// Formatiert das DateObject, wie es im Blog gewünscht ist
Date.prototype.formattedDate = function() {
	// '0' und slice(-2) führen dazu, dass bei einstelligen Werten eine führende 0 hinzugefügt wird
	// Es wird immer '0' vorangeschrieben (auch bei zweistelligen Werten)
	// slice(-2) führt dazu, dass nur die letzten zwei Stellen betrachtet werden	
	var dd = ('0'+this.getDate()).slice(-2);
	var mm = ('0'+this.getMonth()).slice(-2);
	var yyyy = this.getFullYear();
	var h = ('0'+this.getHours()).slice(-2);
	var m = ('0'+this.getMinutes()).slice(-2);
	
	return dd+'.'+mm+'.'+yyyy+' - '+h+':'+m+' Uhr';
};

// Funktion überprüft, ob Nutzer eingeloggt ist
// Falls Nutzer eingeloggt ist, wird Login-Formular ausgetauscht
// und die Möglichkeit zum Erstellen von Beiträgen geschaffen.
function checkLogin(){
	var query = document.location.search;
	if(query != "undefined") {
		if(query.search("sessionId=") > -1){	
			// Erzeugt das Formular zum Erstellen von Beiträgen
			if(_isIndex == true) {
				generateArticleForm();	
			}
			
			// Ändert das Login-Formular in ein Logout-Formular mit Begrüßungsformel
			generateLogoutForm(query);
			
			// Aufruf index.html/about.html manipulieren (um uname und sessionId erweitern)
			manipulateLinks();
		}
	}
}

// Zieht die SessionID und den Username durch alle wichtigen Links
function manipulateLinks() {
	// about.html
	var href = $('#about').attr('href');
	$('#about').attr('href', href+'?sessionId='+_sessionId+'&uname='+_userName);
	// index.html
	var href = $('#blogHeader h1 a').attr('href');
	$('#blogHeader h1 a').attr('href', href+'?sessionId='+_sessionId+'&uname='+_userName);
}

// Füllt global wichtige Variablen
function fillGlobalVars() {
	var query = document.location.search;
	var queryItem, queryItems;

	// Benutzernamen und SessionID 
	// ermitteln und global speichern.
	queryItems = query.split("&");
	
	for(var i=0; i<queryItems.length; i++) {
		// Benutzername-Item gefunden
		if(queryItems[i].indexOf("uname=") > -1) {
			queryItem = queryItems[i];
			_userName = queryItem.split("=")[1];
		}
		
		if(queryItems[i].indexOf("sessionId=") > -1) {
			queryItem = queryItems[i];
			_sessionId = queryItem.split("=")[1];
		}
	}
	
	// Ermitteln ob man sich auf "index.html" befindet
	if(document.URL.indexOf("about.html") > -1) {
		_isIndex = false;
	} else {
		_isIndex = true;
	}
}

// Generiert das Formular zum Erstellen von Artikeln
function generateArticleForm() {
	$('#headerMain').append('<div id="generatorWrapper">');
	$('#generatorWrapper').append('<aside id="articleGenerator">');
	$('#articleGenerator').append('<form action="/new_article">');
	$('#articleGenerator form').append('<input type="hidden" name="sessionId" value="'+_sessionId+'">');
	$('#articleGenerator form').append('<input type="hidden" name="uname" value="'+_userName+'">');
	$('#articleGenerator form').append('<div class="inputWrapper">');
	$('.inputWrapper').last().append('<input type="text" name="title" placeholder="&Uuml;berschrift">');
	$('#articleGenerator form').append('<div class="inputWrapper">');
	$('.inputWrapper').last().append('<textarea placeholder="Was m&ouml;chtest du gerade loswerden?" name="text"></textarea>');
	$('#articleGenerator form').append('<div id="postingWrapper">');
	$('#postingWrapper').append('<input type="submit" value="Posten">');
	
	$('#headerMain').css('margin-bottom', '26em'); // Standard: 5em
}

// Generiert das Logout-Formular und entfernt das Login-Formular
function generateLogoutForm() {
	$('#loginForm').remove();
	
	$('#headerBar aside').append('<form id="logoutForm" action="/logout" method="get">');
	$('#logoutForm').append('<img src="img/user.png" alt="'+_userName+'" title="'+_userName+'">');
	$('#logoutForm').append('<span id="unameSpan">Willkommen '+_userName+'</span>');
	$('#logoutForm').append('<input type="submit" value="Ausloggen">');/**/
	$('#logoutForm').append('<input type="hidden" name="sessionId" value="'+_sessionId+'">');
}

// ***********
// PROTOTYPES
// ***********
String.prototype.escapeLinebreaks = function() {
    return this.replace("\n", "<br>").replace("\r", "<br>");
};
