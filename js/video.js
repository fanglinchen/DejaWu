function isPlayingYoutubeAd(){
    return $(".ytp-play-progress").css("background-color") === "rgb(255, 204, 0)";
}

function removeMarkers(){
    console.log("remove markers...");
    $('div.ytp-play-progress.ytp-swatch-background-color').remove('.blueProgress');
}
