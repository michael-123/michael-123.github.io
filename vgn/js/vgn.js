// Wird aufgerufen, sobald das Dokument geladen wurde.
$(document).ready(function () {
    init();
});

function init() {
    $("#searchButton").click(processSearch);
    $("#searchForm").submit(function (event) {
        event.preventDefault();
        processSearch();
    });

    processDeepLink();
}

function processDeepLink(){
  var search = decodeURIComponent(window.location.search.substring(1))
  var searchParameters = search.split("&");
  var id = undefined;
  var query = undefined;

  for(var i = 0; i < searchParameters.length; i++){
    var searchParameter = searchParameters[i].split("=");
    if(searchParameter[0] === "id"){
      id = searchParameter[1];
    }
    if(searchParameter[0] === "query"){
      query = searchParameter[1];
    }
  }

  if(query != undefined){
    $("#searchField").val(query);
    processSearch();
  }
  if(id != undefined){
    getAbfahrtsplan(id);
  }
}

function processSearch() {
    var query = $("#searchField").val();
    searchForHaltestelle(query);
}

function searchForHaltestelle(haltestelle) {
    // Update URL
    history.pushState("", "", "?query=" + encodeURI(haltestelle));

    $.ajax({
        url: 'https://start.vag.de/dm/api/haltestellen.json/vgn?name=' + haltestelle,
        dataType: 'jsonp',
        success: function (data) {
            processHaltestellen(data);
        },
        error: function () {
            alert('Failed!');
        }
    });
}

function processHaltestellen(json) {
    // Clear former results
    $("#haltestellenListe").empty();
    $("#abfahrtenListe").empty();

    // Print results
    for (var i = 0; i < json.Haltestellen.length; i++) {
        createLinkForHaltestelle(json.Haltestellen[i]);
    }
}

function createLinkForHaltestelle(haltestelle) {
    var name = haltestelle.Haltestellenname;
    var id = haltestelle.VGNKennung;
    $("#haltestellenListe").append("<button class='btn btn-haltestelle' id=\"haltestelle" + id + "\">" + name + "</button>");
    $("#haltestelle" + id).click(
        function () {
            getAbfahrtsplan(id);
        }
    );
}

function getAbfahrtsplan(haltestellenID) {
    $.ajax({
        url: 'https://start.vag.de/dm/api/abfahrten.json/vgn/' + haltestellenID,
        dataType: 'jsonp',
        success: function (data) {
            processAbfahrtsplan(data);
        },
        error: function () {
            alert('Failed!');
        }
    });
}

function processAbfahrtsplan(json) {
    // Update query
    var haltestellenID = encodeURI(json.VGNKennung);
    var haltestelle = encodeURI(json.Haltestellenname);
    history.pushState("", "", "?query=" + haltestelle + "&id=" + haltestellenID);

    // Print results
    $("#abfahrtenListe").empty();
    for (var i = 0; i < json.Abfahrten.length; i++) {
        createEntryForAbfahrt(json.Abfahrten[i]);
    }
}

function createEntryForAbfahrt(abfahrt) {
    var linie = abfahrt.Linienname;
    var produkt = abfahrt.Produkt;
    var richtung = abfahrt.Richtungstext;
    var abfahrtSoll = parseDate(abfahrt.AbfahrtszeitSoll);
    var abfahrtIst = parseDate(abfahrt.AbfahrtszeitIst);
    var verspaetung = getDelay(abfahrtSoll, abfahrtIst);

    $("#abfahrtenListe").append("<li>");
    $("#abfahrtenListe li").last().append("<span class='abfahrt-info'>" +
        "<span class='produkt'>" + produkt + " " + linie + " " + "</span>" +
        "<span class='richtung'>" + richtung + "</span>" +
        "<span class='soll'>" + formatDate(abfahrtSoll) + "</span>" +
        "<span class='ist'>" + verspaetung + "</span>" +
        "</span>");
}

function formatDate(date) {
    var result = "";
    if (date.getHours() < 10) {
        result = result.concat("0");
    }
    result = result.concat(date.getHours() + ":");
    if (date.getMinutes() < 10) {
        result = result.concat("0");
    }
    result = result.concat(date.getMinutes() + " Uhr");

    return result;
}

function getDelay(soll, ist) {
	var dif = new Date(ist.getTime() - soll.getTime() - 3600000);
	var minutes = dif.getMinutes() + (dif.getHours() * 60); // now forget hours
	var seconds = dif.getSeconds();

    var difString = "";

	if(minutes > 0 || seconds > 0){
		difString = "<span style='color: red;'>" + difString + "+";
		difString = difString + minutes + ":"
		if (seconds < 10) {
			difString = difString + "0";
		}
		difString = difString + seconds + "</span>";
	} else {
		difString = "<span style='color: green;'>+0</span>";
	}
	return difString;
}

function parseDate(dateString) {
    // Format: 2016-11-09T17:18:00+01:00
    return new Date(dateString);
}
