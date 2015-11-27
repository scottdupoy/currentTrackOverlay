
var builtOverlay = false;
var displayedOverlay = false;

//
// the renderPosition function is only called if there has been a _change_ in position.
// these are likely to only be every 5 seconds but we won't the timers to appear to run a 
// little more smoothly than that. therefore we set a 1s timer and update the current
// ourselves but only do this 4 times and expect the next message to come in on the 5th.
//

// TODO: cache position, cache iteration count so we only do it 4 times, cache timeoutId

function renderPosition(tracks, position) {
    // getTrack may return null but this is handled correctly
    displayOverlay(position, getTrack(tracks, position));
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

function buildOverlayIfNecessary() {
    if (builtOverlay) {
        return;
    }
    buildOverlay();
    builtOverlay = true;
}

function displayOverlay(currentPosition, track) {
    buildOverlayIfNecessary();
    setOverlayText(currentPosition, track);
    displayOverlayIfNecessary();
}

function displayOverlayIfNecessary() {
    if (displayedOverlay) {
        return;
    }
    fadeIn(document.getElementById('trackOverlay'));
    displayedOverlay = true;
}

function buildOverlay() {
    // build the text div for the overlay
    var overlayText = document.createElement('div');
    overlayText.id = 'trackOverlayText';
    overlayText.innerHTML = '';
    overlayText.style.cssText = 'margin:0 20px 0 0;';

    // build the close button
    var overlayClose = document.createElement('div');
    overlayClose.innerHTML = '&times;';
    overlayClose.style.cssText = 'text-align:right;position:absolute;right:0px;top:0px;padding:0 6px 0 6px;font-size:24px;cursor:pointer;';
    overlayClose.addEventListener('click', closeOverlay, false);

    // build the main div and attach its elements
    var overlay = document.createElement('div');
    overlay.id = 'trackOverlay';
    overlay.style.cssText = 'display:none;font-family:Helvetica,Arial,sans-serif;font-size:16px;position:fixed;top:10px;right:10px;min-width:240px;opacity:0.9;z-index:1031;background:#337ab7;border:5px solid #2e6da4;padding:8px;color:#fff;border-radius:8px;';
    overlay.appendChild(overlayText);
    overlay.appendChild(overlayClose);

    // attach to the main body
    document.body.appendChild(overlay);
}

function setOverlayText(currentPosition, track) {
    var spanWidthPercentage = 60;
    var text = '<span style="display:inline-block;width:' + spanWidthPercentage + '%;">Current position:</span> ' + formatTime(currentPosition) + '<br/>';
    if (track == null) {
        text += '<br/>No track for this position';
    }
    else {
        var trackPosition = currentPosition - track.start;
        trackPosition = trackPosition < 0 ? 0 : trackPosition;
        text += '<span style="display:inline-block;width:' + spanWidthPercentage + '%;">Track position:</span> ' + formatTime(trackPosition) + '<br/><br/>';
        text += '<strong>' + track.artist + '</strong><br/>' + track.title;
    }
    document.getElementById('trackOverlayText').innerHTML = text;
}

function closeOverlay() {
    document.getElementById('trackOverlay').style.display = 'none';
}

//http://youmightnotneedjquery.com/#fade_in
function fadeIn(el) {
    el.style.opacity = 0;
    el.style.display = '';
    var last = +new Date();
    var tick = function() {
        el.style.opacity = +el.style.opacity + (new Date() - last) / 50;
        last = +new Date();
        if (+el.style.opacity < 1) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
        }
    };
    tick();
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
