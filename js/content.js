let lastVideoTime = 0;
let lastVideoSnippetStartTime = 0;
let videoObj, query;
let currentUrl = document.location.href;
let startTime = new Date().getTime();
let endTime = new Date().getTime();
let currentPosition = 0;
const LONG_ENOUGH_MS = 8000;
let videoDuration;

function goToPastPageSection(){
    chrome.runtime.sendMessage({"url": currentUrl}, (response) => {
        console.log("scrolling to " + response);
        window.scrollTo(0, response);//auto scroll function
    });
}

function loadMarkers(){
    chrome.runtime.sendMessage({"url": currentUrl}, (response) => {
        videoDuration = response.duration;
        let snippets = response.snippets;
        for (let i = 0; i <= snippets.length - 1; i++) {
            console.log("video snippet: ", snippets[i]);
            let ratio = snippets[i].end_time / videoDuration - snippets[i].start_time / videoDuration;
            let propValue = `scaleX(${ratio})`;
            $blueProgressBar.css('left', ((snippets[i].start_time / videoDuration) * 100) + '%');
            $blueProgressBar.css('transform', propValue);
            $('div.ytp-play-progress.ytp-swatch-background-color:not(.blueProgress)').after($blueProgressBar);
        }
    });
}

/**
 * Save part of pages with long stay.
 */
function scrollHandler(){
    endTime = new Date().getTime();
    currentPosition = window.scrollY || window.pageYOffset
        || document.body.scrollTop + (document.documentElement && document.documentElement.scrollTop || 0);

    if (endTime - startTime > LONG_ENOUGH_MS) {
        chrome.runtime.sendMessage({"url": currentUrl, "scroll": {"position": currentPosition,"duration": endTime-startTime, "time": new Date()}},
            function(response) {});
    }

    startTime = endTime;
}

/**
 * Data format:
 * <Url
 *          highlight:
 *          text
 *          position
 *          time>
 */
function saveHighlightedText(e)
{
    let content = extractSelectedText();
    console.log("currentUrl:" + currentUrl);
    console.log("currentPosition:" + currentPosition);
    if(content!== ""){
        console.log("Sending!");
        chrome.runtime.sendMessage({"url": currentUrl,
                "title": document.title,
                "event_type": "highlight",
                "highlight":
                    {"text": content,
                     "section_id": fetchSectionId(e),
                     "position": currentPosition,
                     "time": new Date()}},
            function(response) {});
    }
}

/**
 * Data format:
 * <Url
 *          copy:
 *          text
 *          section_id
 *          is_code
 *          is_image_url
 *          time>
 */
function saveCopiedText(e)
{
    //Check for text selection.
    let content = extractSelectedText();
    //Whether this segment of text contains code.
    let iscode = false;
    if(content!== ""){
        chrome.runtime.sendMessage({"url": currentUrl,
                    "title": document.title,
                    "event_type": "copy",
                    "copy": {"text": content,
                    "section_id": fetchSectionId(e),
                    "is_code" : iscode = isCode(e),
                    //"is_image_url": isImageUrl(content),
                    "time": new Date()},
                "is_code": iscode},
            function(response) {});
    }

}

/**
 * Extract selected text. Returns "" if no text selected.
 * @returns {string}
 */
function extractSelectedText()
{
    let sel = window.getSelection();
    if (sel) {
        return sel.toString();
    }
}


/**
 * Listen snippet data once a video element is created
 * Data format:
 * <Url
 *          snippet:
 *          start_time
 *          end_time
 *          time
 *  is_video
 *  video_duration>
 */
$(document).arrive('video',function (v) {
    videoObj = v;
    videoObj.ontimeupdate = function () {
        if (!isPlayingYoutubeAd()) {
            if (!isNaN(videoObj.duration)) {
                videoDuration = videoObj.duration;
            }
            // if there is a big gap between the current play time and the last play time,
            // the user has skipped/rewind the video
            if (Math.abs(videoObj.currentTime - lastVideoTime) >= 10) {
                console.log("snippet:" + lastVideoSnippetStartTime + " ---  " + lastVideoTime);
                if (lastVideoTime - lastVideoSnippetStartTime > 3) {
                    chrome.runtime.sendMessage({
                        "url": currentUrl,
                        "snippet": {"start_time": lastVideoSnippetStartTime, "end_time": lastVideoTime, "time": new Date()},
                        "is_video": true, "video_duration": videoObj.duration
                    }, function (response) {});
                }
                lastVideoSnippetStartTime = videoObj.currentTime;
                //TODO: handle rewind event.
            }
            lastVideoTime = videoObj.currentTime;
        }
    };

    videoObj.onpause = function () {
        console.log("paused");
    };

    videoObj.onended = function () {
        console.log("ended");
    };
});


// Listening url changes for the current tab.
chrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {
    setTimeout(function () {
        console.log("new url:", currentUrl);
        currentUrl = message.url;
        query = message.query;
        if (currentUrl === document.location.href) {
            if (currentUrl.includes("youtube.com")){
                removeMarkers();
                loadMarkers();
            }
            else{
                goToPastPageSection();
            }
        }
    }, 3000);
});

// When the web page is about to be unloaded.
window.onbeforeunload = function () {

    if (currentUrl.includes("youtube.com")){

        chrome.runtime.sendMessage({"url": currentUrl,
            "snippet": {"start_time": lastVideoSnippetStartTime, "end_time": lastVideoTime, "time": new Date()},
            "is_video": true,
            "video_duration": videoObj.duration}, function(response) {});
    }
    else{
        // only considers scrolling positions when the web page is not video
        endTime = new Date().getTime();
        if (endTime - startTime > LONG_ENOUGH_MS) {
            chrome.runtime.sendMessage({"url": currentUrl,
                "scroll": {"position": currentPosition,
                    "duration": endTime-startTime,
                    "time": new Date()}}, function(response) {});
        }
    }
};

document.addEventListener('copy', saveCopiedText);
document.addEventListener('mouseup', saveHighlightedText);
window.addEventListener('scroll', scrollHandler);