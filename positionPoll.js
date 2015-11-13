var pid = null;
var renderCallback = null;
var previousPosition = null;

function startPositionPoll(requestedPid, callback) {
    pid = requestedPid;
    renderCallback = callback;
    
    console.log('Setting position poll up: ' + pid);
    setPositionPoll();
}

function setPositionPoll() {
    try {
        checkPosition();
    }
    catch (e) {
        console.log('ERROR: Problem while checking position: ' + e);
    }
    setTimeout(setPositionPoll, 1000);
}

function checkPosition() {
    // see if the cookie has a position
    var currentPosition = getCurrentPosition(pid);
    if (currentPosition == null) {
        console.log('No current position');
        return;
    }
    
    // if the position has actually moved then render
    if (previousPosition != null && currentPosition != previousPosition) {
        // position has moved
        renderCallback(currentPosition);
    }
    
    previousPosition = currentPosition;
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
