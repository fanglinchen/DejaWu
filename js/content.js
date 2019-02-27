let lastVideoTime = 0;
let lastVideoSnippetStartTime = 0;
let videoObj, query;
let currentUrl = document.location.href;
let startTime = new Date().getTime();
let endTime = new Date().getTime();
let currentPosition = 0;
const LONG_ENOUGH_MS = 8000;
let videoDuration;
let ghostElement, startPos, startY;


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

function mouseUpHandler(e) {
    e.preventDefault();

    const nowPos = {x: e.pageX, y: e.pageY};
    const diff = {x: nowPos.x - startPos.x, y: nowPos.y - startPos.y};

    document.removeEventListener('mousemove', mouseMoveHandler, false);
    document.removeEventListener('mouseup', mouseUpHandler, false);

    ghostElement.parentNode.removeChild(ghostElement);

    setTimeout(function() {
        const coords = {
            w: diff.x,
            h: diff.y,
            x: startPos.x,
            y: startY
        };
        endScreenshot(coords,false);
    }, 50);

    return false;
}
//quit screen shot
function keyDown(e) {
	var keyCode = e.keyCode;

	// Hit: ESC
	if ( keyCode == '27') {
		e.preventDefault();
		e.stopPropagation();

        // endScreenshot();
        console.log("ESC pressed");
        endScreenshot(null, true);

		return false;
	}
}

/**
 *
 * @param e
 * @returns {boolean}
 */
function mouseMoveHandler(e) {
    e.preventDefault();

    const nowPos = {x: e.pageX, y: e.pageY};
    const diff = {x: nowPos.x - startPos.x, y: nowPos.y - startPos.y};

    ghostElement.style.width = diff.x + 'px';
    ghostElement.style.height = diff.y + 'px';

    return false;
}

/**
 *
 * @param e
 * @returns {boolean}
 */
function mouseDownHandler(e) {
    e.preventDefault();

    startPos = {x: e.pageX, y: e.pageY};
    startY = e.y;

    ghostElement = document.createElement('div');
    ghostElement.style.background = 'blue';
    ghostElement.style.opacity = '0.1';
    ghostElement.style.position = 'absolute';
    ghostElement.style.left = e.pageX + 'px';
    ghostElement.style.top = e.pageY + 'px';
    ghostElement.style.width = "0px";
    ghostElement.style.height = "0px";
    ghostElement.style.zIndex = "1000000";
    document.body.appendChild(ghostElement);

    document.addEventListener('mousemove', mouseMoveHandler, false);
    document.addEventListener('mouseup', mouseUpHandler, false);

    return false;
}

/**
 * Save part of pages with long stay.
 */
function scrollHandler(){
    endTime = new Date().getTime();
    currentPosition = window.scrollY || window.pageYOffset
        || document.body.scrollTop + (document.documentElement && document.documentElement.scrollTop || 0);

    if (endTime - startTime > LONG_ENOUGH_MS) {
        chrome.runtime.sendMessage({"url": currentUrl, "stay": {"position": currentPosition,"duration": endTime-startTime, "time": new Date()}},
            function(response) {});
    }

    startTime = endTime;
}

/**
 * Data format:
 * <Url
 *          highlight:
 *          text
 *          section_id
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
    //TODO: @Derek - remove event type and title in behavior messages in the hackathon. In the background, the message handler should scan the
    // key of the map first, and just decides on its own whether to append item to list or not. We don't need to save title because it is already saved
    // in the background in the tab listener.

    let content = extractSelectedText();
    let contains_code = false;
    if(content!== ""){
        chrome.runtime.sendMessage({"url": currentUrl,
                "title": document.title,
                "event_type": "copy",
                "copy": {"text": content,
                    "section_id": fetchSectionId(e),
                    "is_code" : contains_code = isCode(e),
                    //"is_image_url": isImageUrl(content),
                    "time": new Date()},
                "contains_code": contains_code},
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
 *  contains_video
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
                        "video_snippet": {"start_time": lastVideoSnippetStartTime, "end_time": lastVideoTime, "time": new Date()},
                        "contains_video": true,
                        "video_duration": videoObj.duration
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


function startScreenshot() { console.log('start screenshot');
    //change cursor
    document.body.style.cursor = 'crosshair';
    document.addEventListener('mousedown', mouseDownHandler, false);
    //listener for quiting screenshot
    document.addEventListener('keydown', keyDown, false);
}

function endScreenshot(coords, quit) {
    if(quit){
        //user pressed ESC quit screenshot. not sending any information.
        document.removeEventListener('mousedown', mouseDownHandler, false);
        document.removeEventListener('mousemove', mouseMoveHandler, false);
        document.removeEventListener('mouseup', mouseUpHandler, false);
        document.body.style.cursor = 'default';
        ghostElement.parentNode.removeChild(ghostElement);    
    }
    else{
        document.removeEventListener('mousedown', mouseDownHandler, false);
        document.body.style.cursor = 'default';
        console.log('sending message with screenshoot');  
        // TODO: @yusen change this message to contain url and a screenshot obj with the {coordinates: "", filename: "", time: ""} where the path is something like Screen Shot 2019-02-26 at 8.17.42 PM + ".png"
        chrome.runtime.sendMessage({type: 'coords', coords: coords}, function(response) {});
    }
    
}


// Listening url changes for the current tab.
chrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {
    //TODO: @Zhilin add a message field "type", for new url update: type = new_url
    if (message.type === "new_url"){
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
    }
    else if (message.type === "start_screenshots"){
        startScreenshot();
    }

});


// When the web page is about to be unloaded.
window.onbeforeunload = function () {

    if (currentUrl.includes("youtube.com")){

        chrome.runtime.sendMessage({"url": currentUrl,
            "video_snippet": {"start_time": lastVideoSnippetStartTime, "end_time": lastVideoTime, "time": new Date()},
            "contains_video": true,
            "video_duration": videoObj.duration}, function(response) {});
    }
    else{
        // only considers scrolling positions when the web page is not video
        endTime = new Date().getTime();
        if (endTime - startTime > LONG_ENOUGH_MS) {
            chrome.runtime.sendMessage({"url": currentUrl,
                "stay": {"position": currentPosition,
                    "duration": endTime-startTime,
                    "time": new Date()}}, function(response) {});
        }
    }
};

document.addEventListener('copy', saveCopiedText);
document.addEventListener('mouseup', saveHighlightedText);
window.addEventListener('scroll', scrollHandler);