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
    var table = $('<table>').attr('class', 'table table-striped');
    var tableBody = $('<tbody>')
        .attr('class', 'table-body');
    tableBody.appendTo(table);
    table.appendTo($('#top-tracks'));
    for (var i = 1; i <= Object.keys(topTracks).length; i++) {
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
        row.appendTo(tableBody);
    }

    var topArtists = stats['top_list']['top_artists'];
    var table = $('<table>').attr('class', 'table table-striped');
    var tableBody = $('<tbody>')
        .attr('class', 'table-body');
    tableBody.appendTo(table);
    table.appendTo($('#top-artists'));
    for (var i = 1; i <= Object.keys(topArtists).length; i++) {
        var artist = topArtists[i];
        var row = $('<tr>');
        $('<td>')
            .html(i)
            .appendTo(row);
        $('<img>')
            .attr('src', artist.image_url)
            .attr('class', 'album-cover')
            .appendTo($('<td>').appendTo(row));
        $('<a>')
            .attr('href', artist.spotify_url)
            .html(artist.name)
            .appendTo($('<td>').appendTo(row));
        $('<td>')
            .html(artist.plays)
            .appendTo(row);
        row.appendTo(tableBody);
    }   

    var topAlbums = stats['top_list']['top_albums'];
    var table = $('<table>').attr('class', 'table table-striped');
    var tableBody = $('<tbody>')
        .attr('class', 'table-body');
    tableBody.appendTo(table);
    table.appendTo($('#top-albums'));
    for (var i = 1; i <= Object.keys(topAlbums).length; i++) {
        var album = topAlbums[i];
        var row = $('<tr>');
        $('<td>')
            .html(i)
            .appendTo(row);
        $('<img>')
            .attr('src', album.image_url)
            .attr('class', 'album-cover')
            .appendTo($('<td>').appendTo(row));
        $('<a>')
            .attr('href', album.spotify_url)
            .html(album.name)
            .appendTo($('<td>').appendTo(row));
        $('<td>')
            .html(album.plays)
            .appendTo(row);
        row.appendTo(tableBody);
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
