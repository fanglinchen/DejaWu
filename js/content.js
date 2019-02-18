let lastVideoTime = 0;
let lastVideoSnippetStartTime = 0;
let videoObj;
let currentUrl;

function highlightHandler(e)
{
    //Get selected text.
    let content = extractSelectedText();
    //If no content has been selected, ignore.
    if(content==="")
        return;
    let bhvItm = makeBehaviorItem("select", content, e);
    chrome.runtime.sendMessage(bhvItm, (response) => {
        console.log("Message Response: ", response); //Response is undefined.
    });
}

function clipboardHandler(e)
{
    //Check for text selection.
    let content = extractSelectedText();
    if(content==="")
        return;
    //Store the behavior duplicate in the content of the text selected.
    let behaviorItem = makeBehaviorItem("copy", content, e);
    /*
        The superceding section concerns the detection of a html code element.
     */
    // A cursor that tracks the hierarchy of elements to see if a <code> tag is present.
    let cur = e.target;
    while(cur.tagName.toLowerCase()!=="code" && (cur=cur.parentNode)!==document.body);
    //If the highest element tracked by the cursor can be ascribed to <code>.
    if(cur.tagName.toLowerCase()==="code")
    {
        //Add code indication to datatype.
        behaviorItem["datatype"] = "code";
        console.log("Sent?");
    }
    //TODO: add case for image url
    //Send message to the background with modification requirements. The time recorded
    //of the copy event would be that of the highlighted.
    chrome.runtime.sendMessage(behaviorItem, (response) => {
        console.log("Message Response: ", response); //Response is undefined.
    });
}

/**
 * Extract selected text. Returns "" if no text selected.
 * @returns {string}
 */
function extractSelectedText()
{
    //Text selected.

    let sel = window.getSelection();
    if (sel)
    {
        //Highlighted content;
        //If no text has been selected, and mouseup was simply trigger by itself.
        return sel.toString();
    }
}

/**
 * This function makes a customary representation of a user's browsing behavior.
 * It is a map with the keys "type", the type of browsing event, "data", the content
 * correlated with the event, "time", time of this event, "title", the title of the
 * page, and "url", the hyperlink to that site.
 * @param event_type event type
 * @param content The content associated with this event.
 * @returns {{data: *, time: Date, type: *, title: string, url: string}}
 */
function makeBehaviorItem(event_type, content, e)
{
    console.log("Entered!");
    //Attempt to retrieve an id corresponding to the nearest parent node.
    let cur = e?e.target:null;
    //If an event is given.
    if(cur)
        while(!cur.hasAttribute("id") && (cur=cur.parentNode)!==document.body);
    return {
        "eventtype": event_type,
        "time": new Date(),
        "url": currentUrl,
        "title": document.title,
        "data": content,
        //The id if present, null otherwise.
        "section_id": cur&&(cur.getAttribute("id")||null)
    };
}


function drawMarker(time_pair, duration) {
    let $blueBar = $(blueProgressBar);
    let ratio = time_pair[1] / duration - time_pair[0] / duration,
        propValue = `scaleX(${ratio})`;
    $blueBar.css('left', ((time_pair[0] / duration) * 100) + '%');
    $blueBar.css('transform', propValue);
    $('div.ytp-play-progress.ytp-swatch-background-color:not(.blueProgress)').before($blueBar);
}

function removeMarkers(){
    console.log("remove markers...");
    $('div.ytp-play-progress.ytp-swatch-background-color').remove('.blueProgress');
}

function loadMarkers(){
    console.log("load markers...");
    let behaviorItem;
    behaviorItem = makeBehaviorItem("video_play");
    chrome.runtime.sendMessage(behaviorItem, (response) => {
        for (let i = 0; i <= response.length - 1; i++) {
            console.log("Message Response: ", response[i]);
            drawMarker(response[i].split(":"), videoObj.duration);
        }
    });
}

function saveQuery(){
    let query;
    if (currentUrl.includes("google.com")) {
        const regex = /(?<=q=).*?(?=&)/s;
        if (currentUrl.match(regex) !== null) {
            query = currentUrl.match(regex)[0].replace(/\+/g, ' ');
            let behaviorItem = makeBehaviorItem("search", query);
            chrome.runtime.sendMessage(behaviorItem, (response) => {
                console.log("Message Response: ", response); //Response is undefined.
            });
        }
    }
}

$(document).arrive('video', {existing: true}, function (v) {
    videoObj = v;
    console.log("arrive");
    videoObj.ontimeupdate = function () {
        // if there is a big gap between the current play time and the last play time,
        // the user has skipped/rewind the video
        if (!isPlayingYoutubeAd()) {
            if (Math.abs(videoObj.currentTime - lastVideoTime) > 5) {
                console.log("snippet:" + lastVideoSnippetStartTime + " ---  " + lastVideoTime);
                behaviorItem = makeBehaviorItem("video", lastVideoSnippetStartTime + ":" + lastVideoTime)
                lastVideoSnippetStartTime = videoObj.currentTime;
                chrome.runtime.sendMessage(behaviorItem, (response) => {
                    console.log("Message Response: ", response); //Response is undefined.
                });
                //TODO: handle rewind event.
            }
            lastVideoTime = videoObj.currentTime;//
        }
    };

    videoObj.onpause = function () {
        console.log("paused");
    };

    videoObj.onended = function () {
        console.log("ended");
    };

    window.onbeforeunload = function () {
        console.log("closed");
        behaviorItem = makeBehaviorItem("video", lastVideoSnippetStartTime + ":" + lastVideoTime);
        chrome.runtime.sendMessage(behaviorItem, (response) => {
            console.log("Message Response: ", response); //Response is undefined.
        });
    }
});


function isPlayingYoutubeAd(){
  return $(".ytp-play-progress").css("background-color") === "rgb(255, 204, 0)";
}

// Listening url changes for the current tab.
chrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {

    currentUrl = message.url;
    console.log("currentUrl: "+ currentUrl);
    removeMarkers();
    loadMarkers();
    saveQuery();
    //TODO: collect url history here.

} );



document.addEventListener('copy', clipboardHandler);
document.addEventListener('mouseup', highlightHandler);