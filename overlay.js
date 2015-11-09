
initialiseOverlay();

function initialiseOverlay() {
    // DONE: parse url and determine if it's a programme
    // - check if the page has a track list
    // - if looks likely then setup a poll on the cookie containing the current position.
    //    - could do intervals to suspected track positions but it won't pick up manual moves
    // - poll
    //    - if the time is moving then display the overlay if it's not displayed already
    //    - update the overlay current position details:
    //       - current time
    //       - current track details
    
    console.log('initialising current track overlay');
    
    // try and get the pid
    var pid = window.location.pathname.match(/\/programmes\/(.{8})/);
    if (pid == null) {
        console.log('Could not extract 8 character pid from pathname: ' + window.location.pathname);
        return;
    }
    pid = pid[1];
    console.log('pid: ' + pid);
    
    // see if the cookie has a position
    // TODO: set up poll to check the current position. if moving => display overlay
    var currentPosition = getCurrentPosition(pid);
    console.log('currentPosition: ' + currentPosition);
}

function getCurrentPosition(pid) {
    // get the position list cookie
    var cookies = getCookies();
    
    // check if the times cookie is present
    if (!'ckps_progs_player_resume' in cookies) {
        console.log('No ckps_progs_player_resume in cookies');
        return null;
    }
    
    // get the times
    console.log('ckps_progs_player_resume cookie is present');
    timesString = cookies.ckps_progs_player_resume;
    
    // parse the times as json
    times = JSON.parse(timesString);
    console.log(times);
    
    // see if there's a position for this pid
    // TODO: iterate over each one
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
