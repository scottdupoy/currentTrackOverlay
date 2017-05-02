
function loadTrackList(pid, callback) {
    var url = 'http://www.bbc.co.uk/programmes/' + pid + '/segments.json';
    retrieveJson(url, function(data) {
        unpackTrackList(data, callback);
    });
}

function unpackTrackList(data, callback) {
    // assume data is correctly structured
    console.log('Unpacking track list');
    tracks = [];
    for (var i = 0; i < data.segment_events.length; i++) {
        segment = data.segment_events[i];
        tracks.push({
            start: segment.version_offset,
            artist: getPerformers(segment.segment.contributions),
            title: segment.segment.track_title + getFeaturingArtists(segment.segment.contributions),
            duration: segment.segment.duration
        });
    }
    callback(tracks);
}

function getPerformers(contributions) {    
    // pull out all the performers and featuring artists
    performersList = [];
    for (var i = 0; i < contributions.length; i++) {
        contribution = contributions[i];
        if (contribution.role == 'Performer') {
            performersList.push(contribution.name);
        }
    }
    
    performers = '';
    for (var i = 0; i < performersList.length; i++) {
        if (i > 0) {
            performers += i == (performersList.length - 1) ? ' & ' : ', ';
        }
        performers += performersList[i];
    }
    
    return performers;
}

function getFeaturingArtists(contributions) {    
    // pull out all the performers and featuring artists
    featuringArtistsList = [];
    for (var i = 0; i < contributions.length; i++) {
        contribution = contributions[i];
        if (contribution.role == 'Featured Artist') {
            featuringArtistsList.push(contribution.name);
        }
    }
    
    if (featuringArtistsList.length == 0) {
        return '';
    }
    
    featuringArtists = ' (feat. ';
    for (var i = 0; i < featuringArtistsList.length; i++) {
        if (i > 0) {
            featuringArtists += i == (featuringArtistsList.length - 1) ? ' & ' : ', ';
        }
        featuringArtists += featuringArtistsList[i];
    }
    featuringArtists += ')';
    
    return featuringArtists;
}

function retrieveJson(url, callback) {
    // ignoring errors for now (don't want it to do any more anyway)
    console.log('Retrieving JSON: ' + url);
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            try {
                var data = JSON.parse(request.responseText);
                callback(data);
            }
            catch (e) {
                console.log('ERROR: Could not parse JSON: ' + e);
            }
        }
        else if (request.status == 404 && url !== request.responseURL) {
            retrieveJsonRedirected(url, request.responseURL, callback);
        }
        else {
            console.log('ERROR: An unknown JSON retrieval error occurred');
        }
    };
    request.onerror = function() {
        console.log('ERROR: An unknown JSON retrieval error occurred');
    };
    request.send();
}

function retrieveJsonRedirected(url, redirectedUrl, callback) {
    console.log('Response redirected and returned 404, attempting to correct URL');
    console.log('  url:           ' + url);
    console.log('  redirectedUrl: ' + redirectedUrl);
    
    // try to construct a new URL using the redirected pid
    var pidMatch = redirectedUrl.match(/^(.*)\/aps(\/programmes\/.{8}\/segments\.json)$/);
    if (pidMatch == null) {
        return;
    }
    var correctedUrl = pidMatch[1] + pidMatch[2];
    console.log('  correctedUrl:  ' + correctedUrl);
    
    retrieveJson(correctedUrl, callback);
}
