// see: http://www.trumpoji.com/presskit/
var array = Array(
    //'http://trumpoji.com/images/emojis/sombrero_256.png',
    //'http://trumpoji.com/images/emojis/turban_256.png',
    'http://trumpoji.com/images/emojis/yuge_anger_256.png',
    //'http://trumpoji.com/images/emojis/afro_256.png',
    //'http://trumpoji.com/images/emojis/emperor_256.png',
    //'http://trumpoji.com/images/emojis/peering_256.png',
    //'http://trumpoji.com/images/emojis/hair_256.png',
    //'http://trumpoji.com/images/emojis/oompa_loompa_256.png',
    //'http://www.trumpoji.com/presskit/deal_with_it_512.png',
    'http://www.trumpoji.com/presskit/yuge_anger.png',
    //'http://trumpoji.com/images/emojis/clown_256.png'
);

function getRandomEmojiURL() {
    return array[Math.floor(Math.random() * array.length)];
}

function getTrumpEmoji() {
    document.getElementById("emoji").src = getRandomEmojiURL();
}

function writeData(lines, tableId) {
    var htmlOut = '';

    for (var i = 0; i < lines.length; i++) {
        htmlOut += '<tr>';
        var line = lines[i];
        for (var j = 0; j < line.length; j++) {
            var field = line[j];
            htmlOut += '<td>' + field + '</td>';
        }
        htmlOut += '</tr>';
    }

    console.log(tableId);
    $(tableId).append(htmlOut);
}


function putCsvInTable(allText, tableId) {
    var allTextLines = allText.split(/\r\n|\n/);
    var lines = [];

    for (var i = 0; i < allTextLines.length; i++) {
        // Replace commas in quotes
        var s = allTextLines[i].replace(/"[^"]+"/g, function (match) {
            return match.replace(/,/g, '.');
        });
        var data = s.split(',');

        var tarr = [];
        for (var j = 0; j < data.length; j++) {
            tarr.push(data[j]);
        }
        lines.push(tarr);
    }
    writeData(lines, tableId);
}


function getCsv(csv, tableId) {
    $.ajax({
        type: "GET",
        url: csv,
        dataType: "text",
        success: function(data) {
            putCsvInTable(data, tableId);
        }
    });
}

var csvQuote = 'https://docs.google.com/spreadsheets/d/1ZNQqV-Y1xr0v9RiEc5FEN0Wcg8DrRLSuMiknLF9gT-Y/pub?gid=1859972974&single=true&output=csv';

var csvSpieleTore = 'https://docs.google.com/spreadsheets/d/1ZNQqV-Y1xr0v9RiEc5FEN0Wcg8DrRLSuMiknLF9gT-Y/pub?gid=221220647&single=true&output=csv';

$(document).ready(function() {    
    getTrumpEmoji();
    window.setInterval(function(){
        getTrumpEmoji();
    }, 1500);
});
