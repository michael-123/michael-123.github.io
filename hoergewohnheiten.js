BASE_URL = 'https://blwndi.herokuapp.com/'


function get(url, callback) {
    $.ajax({
        url: url,
        dataType: 'text',
        success: function (data) {
			callback(JSON.parse(data));
        },
        error: function () {
            alert('Failed!');
        }
    });
}

function applyArtistStats(topArtists) {
    var table = $('<table>').attr('class', 'table table-striped');
    var tableBody = $('<tbody>')
        .attr('class', 'table-body')
        .appendTo(table);
    table.appendTo($('#top-artists'));

    for (var i = 0; i <= Object.keys(topArtists).length; i++) {
        var countEntry = topArtists[i];
        var row = $('<tr>');
            $('<td>')
            .html(i+1)
            .appendTo(row);
        $('<img>')
            .attr('src', countEntry.artist.image_url)
            .attr('class', 'album-cover')
            .appendTo($('<td>').appendTo(row));
        $('<a>')
            .attr('href', countEntry.artist.spotify_url)
            .html(countEntry.artist.name)
            .appendTo($('<td>').appendTo(row));
        $('<td>')
            .html(countEntry.count)
            .appendTo(row);
        row.appendTo(tableBody);
    } 
}

function applyAlbumStats(topAlbum) {
    var table = $('<table>').attr('class', 'table table-striped');
    var tableBody = $('<tbody>')
        .attr('class', 'table-body')
        .appendTo(table);
    table.appendTo($('#top-albums'));


    for (var i = 0; i < Object.keys(topAlbum).length; i++) {
        var countEntry = topAlbum[i];
        var row = $('<tr>');
        $('<td>')
            .html(i+1)
            .appendTo(row);
        $('<img>')
            .attr('src', countEntry.album.image_url)
            .attr('class', 'album-cover')
            .appendTo($('<td>').appendTo(row));

        if (countEntry.album.artists.length > 0) {
            artist = countEntry.album.artists[0]
            var artistName = artist.name
        } else {
            var artistName = 'n/a'
        }
        $('<a>')
            .attr('href',countEntry.album.spotify_url)
            .html(artistName + ' - ' + countEntry.album.name)
            .appendTo($('<td>').appendTo(row));
        $('<td>')
            .html(countEntry.count)
            .appendTo(row);
        row.appendTo(tableBody);
    }
}

function applyTrackStats(topTracks) {
    var table = $('<table>').attr('class', 'table table-striped');
    var tableBody = $('<tbody>')
        .attr('class', 'table-body')
        .appendTo(table);
    table.appendTo($('#top-tracks'));


    for (var i = 0; i < Object.keys(topTracks).length; i++) {
        var countEntry = topTracks[i];
        var row = $('<tr>');
        $('<td>')
            .html(i+1)
            .appendTo(row);
        $('<img>')
            .attr('src', countEntry.track.album.image_url)
            .attr('class', 'album-cover')
            .appendTo($('<td>').appendTo(row));

        if (countEntry.track.artists.length > 0) {
            artist = countEntry.track.artists[0]
            var artistName = artist.name
        } else {
            var artistName = 'n/a'
        }
        $('<a>')
            .attr('href',countEntry.track.spotify_url)
            .html(artistName + ' - ' + countEntry.track.name)
            .appendTo($('<td>').appendTo(row));
        $('<td>')
            .html(countEntry.count)
            .appendTo(row);
        row.appendTo(tableBody);
    }
}

function applyStats(stats) {
    applyTrackStats(stats.plays.per_track)
    applyAlbumStats(stats.plays.per_album)
    applyArtistStats(stats.plays.per_artist)
}


function applyPlays(plays) {
    latestPlays = plays['latest_plays']
    for (var i = 0; i < Object.keys(latestPlays).length; i++) {
        var trackName = latestPlays[i].track.name
        var artistName = latestPlays[i].track.artists[0].name
        $('<li>')
            .attr('class', 'list-group-item')
            .html(artistName + ' - ' + trackName)
            .appendTo($('#latest-plays'))
    }
}

$(document).ready(function () {
    get(BASE_URL+'plays/kalr123', applyPlays)
    get(BASE_URL+'stats/kalr123', applyStats)
});
