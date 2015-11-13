
function renderPosition(tracks, position) {
    track = getTrack(tracks, position);
    if (track == null) {
        console.log('No track for position ' + formatTime(position));
        return;
    }
    render(track, position);
}

function render(track, position) {
    console.log('Render: currentPosition: ' + formatTime(position) + ' => ' + formatTime(track.start) + ' => ' + track.artist + ', ' + track.title);
}

function getTrack(tracks, position) {
    // go through all the tracks in case they're out of order. find the one with the latest start
    // time before or equal to the the current position
    currentTrack = null;
    for (var i = 0; i < tracks.length; i++) {
        track = tracks[i];
        if (track.start > position) {
            // this track is after the current position so it can't be this one
            continue;
        }
        if (currentTrack != null && track.start <= currentTrack.start) {
            // this track is not later than the current track
            continue;
        }
        currentTrack = track;
    }
    
    // did we find a latest track?
    if (currentTrack == null) {
        return null;
    }
    
    // got a track but if the we're after the end then don't use the track
    endOfTrack = currentTrack.start + track.duration;
    if (position > endOfTrack) {
        return null;
    }
    
    // otherwise we're in the middle of this track
    return currentTrack;
}

function formatTime(time) {
    hours = Math.floor(time / 3600);
    minutes = Math.floor((time % 3600) / 60);
    seconds = Math.floor(time % 60);
    return padLeft(hours.toString(), 2, '0') + ':' + padLeft(minutes.toString(), 2, '0') + ':' + padLeft(seconds.toString(), 2, '0');
}

function padLeft(value, length, character) {
    while (value.length < length) {
        value = character + value;
    }
    return value;
}
