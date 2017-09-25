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
    for(var i = 1; i < Object.keys(topTracks).length; i++) {
        var track = topTracks[i];
        $(".table-body").append('<tr><td>' + i + 
                                '</td><td>' + track.artist.name + 
                                ' - ' + track.name +
                                '</td><td>' + track.plays + 
                                '</td></tr>');
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
