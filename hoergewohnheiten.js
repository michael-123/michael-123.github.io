function dateToNum(d) {
	numbers = d.replace(".json", "").split("-");
	return Number(numbers[0] + numbers[1]);
}

function get(file, callback) {
    $.ajax({
        url: 'https://raw.githubusercontent.com/michael-123/HoergewohnheitenData/master/' + file,
        dataType: 'text',
        success: function (data) {
			callback(JSON.parse(data));
        },
        error: function () {
            alert('Failed!');
        }
    });
}

function applyStatJSON(stats) {
    var topTracks = stats['top_list']['top_tracks'];
    for(var i = 1; i <= Object.keys(topTracks).length; i++) {
        var track = topTracks[i];
        var row = $('<tr>');
        $('<td>')
            .html(i)
            .appendTo(row);
        $('<img>')
            .attr('src', track.album.image_url)
            .attr('class', 'album-cover')
            .appendTo($('<td>').appendTo(row));
        $('<a>')
            .attr('href',track.spotify_url)
            .html(track.artist.name + ' - ' + track.name)
            .appendTo($('<td>').appendTo(row));
        $('<td>')
            .html(track.plays)
            .appendTo(row);
        $(".table-body").append(row);
    }
}

function handleOverview(overview) {
	newestMonthJSON = overview.months.sort(function(a,b){
		return dateToNum(b) - dateToNum(a);
	})[0];
	// Create menu
	
	// Load newest month json
	get(newestMonthJSON, applyStatJSON);
}

$(document).ready(function () {
	get('overview.json', handleOverview);
});
