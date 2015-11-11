var pid = null;
var previousPosition = null;

initialiseOverlay();

function initialiseOverlay() {
    // try and get the pid
    console.log('Initialising current track overlay');
    pathnameMatch = window.location.pathname.match(/\/programmes\/(.{8})/);
    if (pathnameMatch == null) {
        console.log('Could not extract 8 character pid from pathname: ' + window.location.pathname);
        return;
    }
    pid = pathnameMatch[1];
    console.log('Identified pid: ' + pid);
    
    checkPositionPoll();
}

function checkPositionPoll() {
    //try {
        checkPosition();
    //}
    //catch (e) {
    //    console.log('ERROR: Problem while checking position: ' + e);
    //}
    setTimeout(checkPositionPoll, 1000);
}

function checkPosition() {
    // see if the cookie has a position
    var currentPosition = getCurrentPosition(pid);
    if (currentPosition == null) {
        console.log('No current position');
        return;
    }
    
    // TODO: check if this is a new position (may not yet be playing) or if it's a change of a non-null previous position
    console.log('currentPosition: ' + currentPosition + ' => ' + formatTime(currentPosition) + ' ' + (currentPosition != previousPosition ? 'NEW' : 'SAME'));
    previousPosition = currentPosition;
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

function getCurrentPosition(pid) {
    // get the position list cookie
    var cookies = getCookies();
    
    // check if the times cookie is present
    if (!'ckps_progs_player_resume' in cookies) {
        console.log('No ckps_progs_player_resume in cookies');
        return null;
    }
    
    // get the times cookie
    
    // first try using a direct property (this is how the page starts off)
    timesString = cookies.ckps_progs_player_resume;
    if (timesString == undefined) {
        // if it's not accessible by the property directly then try the string lookup (it has a leading space
        // when set dynamically by the page)
        timesString = cookies[" ckps_progs_player_resume"];
        if (timesString == undefined) {
            console.log('ckps_progs_player_resume cookie is not present');
            return null;
        }
    }
    
    // parse the times as json
    times = JSON.parse(timesString);
    if (times.constructor !== Array) {
        console.log('ckps_progs_player_resume did not parse as an array');
        return null;
    }
    
    // see if there's a position for this pid
    for (var i = 0; i < times.length; i++) {
        if (times[i].vpid == pid) {
            return times[i].time;
        }
    }
    
    console.log('No current position found for pid: ' + pid);
    return null;
}

function getCookies() {
    var pairs = document.cookie.split(";");
    var cookies = {};
    for (var i = 0; i < pairs.length; i++){
        var pair = pairs[i].split("=");
        cookies[pair[0]] = unescape(pair[1]);
    }
    return cookies;
}
