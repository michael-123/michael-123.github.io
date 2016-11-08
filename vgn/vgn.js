// Wird aufgerufen, sobald das Dokument geladen wurde.
$(document).ready(function(){
		init();
});

function init(){
	$("#searchButton").click(processSearch);
	$("#searchForm").submit(function( event ) {
  	event.preventDefault();
		processSearch();
	});
}

function getAbfahrtsplanForHaltestelle(id){

}

function processSearch(){
	var query = $("#searchField").val();
	searchForHaltestelle(query);
}

function searchForHaltestelle(haltestelle){
	$.ajax({
    url: 'http://start.vag.de/dm/api/haltestellen.json/vgn?name='+haltestelle,
    dataType: 'jsonp',
    success: function(data) { processHaltestellen(data); },
    error: function() { alert('Failed!'); }
	});
}

function processHaltestellen(json){
	for(var i = 0; i < json.Haltestellen.length; i++) {
		createLinkForHaltestelle(json.Haltestellen[i]);
	}
}

function createLinkForHaltestelle(haltestelle){
	var name = haltestelle.Haltestellenname;
	var id = haltestelle.VGNKennung;
	$("#haltestellenListe").append("<button id=\"haltestelle"+id+"\">"+name+", "+id+"</button><br>");
	$("#haltestelle"+id).click(
		function() {
			getAbfahrtsplan(id);
		}
	);
}

function getAbfahrtsplan(haltestellenID){
	$.ajax({
		url: 'http://start.vag.de/dm/api/abfahrten.json/vgn/'+haltestellenID,
		dataType: 'jsonp',
		success: function(data) { processAbfahrtsplan(data); },
		error: function() { alert('Failed!'); }
	});
}

function processAbfahrtsplan(json){
	for(var i = 0; i < json.Abfahrten.length; i++) {
		createEntryForAbfahrt(json.Abfahrten[i]);
	}
}

function createEntryForAbfahrt(abfahrt){
	var linie = abfahrt.Linienname;
	var produkt = abfahrt.Produkt;
	var richtung = abfahrt.Richtungstext;
	var abfahrtSoll = abfahrt.AbfahrtszeitSoll;
	var abfahrtIst = abfahrt.AbfahrtszeitIst;

	$("#abfahrtenListe").append("<li>");
	$("#abfahrtenListe li").last().append("<span>" +
		produkt + " " + linie +
		" (Richtung: " + richtung + "). Abfahrt: " +
		abfahrtSoll + " Verspätung: " + abfahrtIst +
		"</span>");
}
