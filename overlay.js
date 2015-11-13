
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
    
    // get the tracklist
    loadTrackList(pid, function(tracks) {
        console.log('Loaded ' + tracks.length + ' tracks');
        // start the current position poll
        startPositionPoll(pid, function(position) {
            renderPosition(tracks, position);
        });
    });
}
