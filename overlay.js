
initialiseOverlay();

function initialiseOverlay() {
    // - parse url and determine if it's a programme
    // - check if the page has a track list
    // - if looks likely then setup a poll on the cookie containing the current position.
    //    - could do intervals to suspected track positions but it won't pick up manual moves
    // - poll
    //    - if the time is moving then display the overlay if it's not displayed already
    //    - update the overlay current position details:
    //       - current time
    //       - current track details
    console.log('+initialiseOverlay');
    console.log('-initialiseOverlay');
}
