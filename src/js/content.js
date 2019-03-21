import SiphonTools from 'siphon-tools'
import {SnippetSelector, Snippet} from "siphon-tools"

let blueProgressBar = `<div class="ytp-play-progress ytp-swatch-background-color blueProgress"></div>`;
require("arrive");
import $ from 'jquery';

let videoObj, videoDuration, query, videoUrl;
let currentUrl = document.location.href;
let startTime = new Date().getTime();
let endTime = new Date().getTime();
let currentPosition,lastPosition,lastVideoTime, lastVideoSnippetStartTime = 0;
const LONG_ENOUGH_MS = 8000;
let ghostElement, startPos, startY;
let _cptrWindow;
let rect;//screen shot rect
SiphonTools.initializeSelectors([
    SnippetSelector({
        onTrigger: (cptrWindow, e) => {
            _cptrWindow = cptrWindow;
            rect = cptrWindow.getBoundingClientRect();
            console.log(rect);
            let annotation = new Snippet(rect);
            console.log(annotation);

            console.log("test keydown"); 
            document.addEventListener('keydown', keyDownHandler, false);
            document.addEventListener('mousedown', mouseDownHandler, false);
            
        }
    })
]);

SiphonTools.enable();

// setTimeout(()=>{
//     _cptrWindow.remove()
// }, 5000)

function isPlayingYoutubeAd(){
    return $(".ytp-play-progress").css("background-color") === "rgb(255, 204, 0)";
}


/**
 * handle pressing esc to quit screenshot
 * @param {*} e 
 */
function keyDownHandler(e) {
    if ( e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        console.log("esc pressed")
        document.removeEventListener('mousedown', mouseDownHandler, false);
        document.removeEventListener('keydown', keyDownHandler, false);
        _cptrWindow.parentNode.removeChild(_cptrWindow)
        // _cptrWindow.remove()
        
        return false;
    }
}



function removeMarkers(){
    console.log("remove markers...");
    $('div.ytp-play-progress.ytp-swatch-background-color').remove('.blueProgress');
}


function isCode(e){
    let cur = e.target;
    while(cur.tagName.toLowerCase()!=="code" && (cur=cur.parentNode)!==document.body);
    //If the highest element tracked by the cursor can be ascribed to <code>.
    return cur.tagName.toLowerCase()==="code";
}

function fetchSectionId(e){
    let cur = e?e.target:null;
    if(cur)
        while(!cur.hasAttribute("id") && (cur=cur.parentNode)!==document.body);
    return cur&&(cur.getAttribute("id")||null);
}

function formatFileName(date) {
    let year = date.getFullYear();
    let _day = date.getDate();
    let month = date.getMonth();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let milliseconds = date.getMilliseconds();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+ minutes : minutes;

    return "Screen Shot " + year + "-" +
        (month + 1) + "-" + _day + " at " + hours + '.' + minutes + '.' + milliseconds + " " + ampm + ".png";
}


function goToPastPageSection(response) {
    console.log("scrolling to " + response);
    window.scrollTo(0, response);//auto scroll function
}

function loadMarkers(start,end,duration) {
    console.log("load markers.....");
    let $blueBar = $(blueProgressBar);
    let ratio = end / duration - start / duration,
        propValue = `scaleX(${ratio})`;
    $blueBar.css('left', ((start / duration) * 100) + '%');
    $blueBar.css('transform', propValue);
    $('div.ytp-play-progress.ytp-swatch-background-color:not(.blueProgress)').after($blueBar);
}


function mouseUpHandler(e) {
    e.preventDefault();

    const diff = {x: Math.abs(parseInt(e.pageX)-parseInt(ghostElement.style.left)),
        y: Math.abs(parseInt(e.pageY)-parseInt(ghostElement.style.top))};

    //working with negative coordinates
    let _w = diff.x;
    let _h = diff.y;
    let _x = startPos.x;
    let _y = startY;

    if(parseInt(e.pageY) < startPos.y){
        //top right
        _h = Math.abs(parseInt(e.pageY)-startPos.y);
        _y -= _h;
    }
    if(parseInt(e.pageX) < startPos.x){
        //left bottom
        _w = Math.abs(parseInt(e.pageX)-startPos.x);
        _x -= _w;
    }

    document.removeEventListener('mousemove', mouseMoveHandler, false);
    document.removeEventListener('mouseup', mouseUpHandler, false);

    ghostElement.parentNode.removeChild(ghostElement);
    setTimeout(function() {
        const coords = {
            w: _w,
            h: _h,
            x: _x,
            y: _y
        };
        endScreenshot(coords,false);
    }, 50);

    return false;
}
//quit screen shot
// function keyDownHandler(e) {
//     if ( e.key === 'Escape') {
//         e.preventDefault();
//         e.stopPropagation();
//         endScreenshot(null, true);
//         return false;
//     }
// }


/**
 *
 * @param e
 * @returns {boolean}
 */
function mouseMoveHandler(e) {
    e.preventDefault();

    const diff = {x: Math.abs(parseInt(e.pageX)-parseInt(ghostElement.style.left)),
        y: Math.abs(parseInt(e.pageY)-parseInt(ghostElement.style.top))};

    ghostElement.style.width = diff.x + 'px';
    ghostElement.style.height = diff.y +'px';

    //opposite drawing canvas (negative coords)
    if(parseInt(e.pageY) < startPos.y){
        ghostElement.style.top = e.pageY + 'px';
        ghostElement.style.height = Math.abs(parseInt(e.pageY)-startPos.y)+'px';
    }
    if(parseInt(e.pageX) < startPos.x){
        ghostElement.style.left = e.pageX+'px';
        ghostElement.style.width = Math.abs(parseInt(e.pageX)-startPos.x)+'px';
    }

    return false;
}

/**
 *
 * @param e
 * @returns {boolean}
 */
function mouseDownHandler(e) {
    e.preventDefault();

    // startPos = {x: e.pageX, y: e.pageY};
    // startY = e.y;

    // ghostElement = document.createElement('div');
    // ghostElement.style.background = 'blue';
    // ghostElement.style.opacity = '0.1';
    // ghostElement.style.position = 'absolute';
    // ghostElement.style.left = e.pageX + 'px';
    // ghostElement.style.top = e.pageY + 'px';
    // ghostElement.style.width = "0px";
    // ghostElement.style.height = "0px";
    // ghostElement.style.zIndex = "1000000";
    // document.body.appendChild(ghostElement);

    // document.addEventListener('mousemove', mouseMoveHandler, false);
    // document.addEventListener('mouseup', mouseUpHandler, false);
    var x = e.pageX;
    var y = e.pageY;
    var w = e.width
    var h = e.height

    if (!(x < rect.x && y < rect.y  && w < rect.width && h < rect.height)){
        // mouse is not in rect.
        document.removeEventListener('mousedown', mouseDownHandler, false);
        document.removeEventListener('keydown', keyDownHandler, false);
        console.log("remove frome first");
        _cptrWindow.remove()
    }

    return false;
}

/**
 * Save part of pages with long stay.
 */
function scrollHandler() {
    endTime = new Date().getTime();
    if (endTime - startTime > LONG_ENOUGH_MS) {
        chrome.runtime.sendMessage({
                "url": currentUrl,
                "stay": {"position": lastPosition,
                    "duration": endTime - startTime,
                    "time": [new Date()]}
            },
            function (response) {});
    }
    lastPosition = window.scrollY || window.pageYOffset
        || document.body.scrollTop + (document.documentElement && document.documentElement.scrollTop || 0);
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
    if(content!== ""){
        console.log("currentUrl:" + currentUrl);
        console.log("currentPosition:" + currentPosition);
        chrome.runtime.sendMessage({"url": currentUrl,
                "highlight":
                    {"text": content,
                        "section_id": fetchSectionId(e),
                        "position": currentPosition,
                        "time": [new Date()]}},
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
function saveCopiedText(e) {

    let content = extractSelectedText();
    if(content!== ""){
        chrome.runtime.sendMessage({"url": currentUrl,
                "copy": {"text": content,
                    "section_id": fetchSectionId(e),
                    "is_code" :  isCode(e),
                    //"is_image_url": isImageUrl(content),
                    "time": [new Date()]}},
            function(response) {});
    }
    console.log("Sending!");
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
document.arrive('video', function (v) {
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
                            "url": videoUrl,
                            "video_snippet":
                                {
                                    "start_time": lastVideoSnippetStartTime,
                                    "end_time": lastVideoTime,
                                    "duration": videoDuration
                                }
                        },
                        function (response) {
                        });
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


function startScreenshot() {
    console.log('start screenshot');
    //change cursor
    document.body.style.cursor = 'crosshair';
    document.addEventListener('mousedown', mouseDownHandler, false);
    //listener for quiting screenshot
    document.addEventListener('keydown', keyDownHandler, false);
}

function endScreenshot(coords, quit) {
    document.removeEventListener('mousedown', mouseDownHandler, false);
    document.body.style.cursor = 'default';

    if(quit){
        //user pressed ESC quit screenshot. not sending any information.
        document.removeEventListener('mousemove', mouseMoveHandler, false);
        document.removeEventListener('mouseup', mouseUpHandler, false);

        ghostElement.parentNode.removeChild(ghostElement);
    }
    else{

        console.log('sending message with screenshoot');
        chrome.runtime.sendMessage({"url": currentUrl,
                "screenshot":{coordinates:coords, filename: formatFileName(new Date()), time: new Date()}},
            function(response) {});

    }

}


// Listening url changes for the current tab.
chrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {
    currentUrl=message.url;
    if (message.type === "new_url"){
        let videoResponse=message.video;
        let stayResponse=message.position;
        //if has code ,don't go page section;
        if(!currentUrl.includes("#")){
            goToPastPageSection(stayResponse);
        }
        setTimeout(function () {
            console.log("new url:", message.url);
            videoUrl = message.url;
            query = message.query;
            // to know Url has already changed
            if (videoUrl === currentUrl) {
                if (currentUrl.includes("youtube.com")) {
                    removeMarkers();
                    loadMarkers(videoResponse.start_time,videoResponse.end_time,videoResponse.duration);
                }
            }
        }, 2000);
    }
    else if (message.type === "start_screenshots"){
        startScreenshot();
    }
});


// When the web page is about to be unloaded.
window.onbeforeunload = function () {
    if (currentUrl.includes("youtube.com")) {
        chrome.runtime.sendMessage({
                "url": videoUrl,
                "video_snippet":
                    {
                        "start_time": lastVideoSnippetStartTime,
                        "end_time": lastVideoTime,
                        "duration": videoDuration
                    }
            },
            function (response) {});
    } else {
        // only considers scrolling positions when the web page is not video
        endTime = new Date().getTime();
        if (endTime - startTime > LONG_ENOUGH_MS) {
            chrome.runtime.sendMessage({
                    "url": currentUrl,
                    "stay": {
                        "position": lastPosition,
                        "duration": endTime - startTime,
                        "time": [new Date()]
                    }
                },
                function (response) {});
        }
    }
};

document.addEventListener('copy', saveCopiedText);
document.addEventListener('mouseup', saveHighlightedText);
window.addEventListener('scroll', scrollHandler);
