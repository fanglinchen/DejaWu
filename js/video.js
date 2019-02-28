function isPlayingYoutubeAd(){
    return $(".ytp-play-progress").css("background-color") === "rgb(255, 204, 0)";
}

function removeMarkers(){
    console.log("remove markers...");
    $('div.ytp-play-progress.ytp-swatch-background-color').remove('.blueProgress');
}

// add drawMarker by ZZL
function drawMarker(start,end,duration) {
    console.log("draw");
    let $blueBar = $(blueProgressBar);
    let ratio = end / duration - start / duration,
        propValue = `scaleX(${ratio})`;
    $blueBar.css('left', ((start / duration) * 100) + '%');
    $blueBar.css('transform', propValue);
    $('div.ytp-play-progress.ytp-swatch-background-color:not(.blueProgress)').after($blueBar);
}