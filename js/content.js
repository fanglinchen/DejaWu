let lastVideoTime = 0;
let lastVideoSnippetStartTime = 0;

function newUrlHandler()
{
    let url = document.location.href;
    let query;
    if (url.includes("google.com")) {
        const regex = /(?<=q=).*?(?=&)/s;
        if (url.match(regex) !== null) {
            query = url.match(regex)[0].replace(/\+/g, ' ');
            let behaviorItem = makeBehaviorItem("search", query);
            chrome.runtime.sendMessage(behaviorItem, (response) => {
                console.log("Message Response: ", response); //Response is undefined.
            });
        }
    }
    //TODO: collect url history here.
}

function highlightHandler(e)
{
    //Get selected text.
    let content = extractSelectionText();
    //If no content has been selected, ignore.
    if(content==="")
        return;
    let bhvItm = makeBehaviorItem("select",content);
    chrome.runtime.sendMessage(bhvItm, (response) => {
        console.log("Message Response: ", response); //Response is undefined.
    });
}

function clipboardHandler(e)
{
    //Check for text selection.
    let content = extractSelectionText();
    if(content==="")
        return;
    //Store the behavior duplicate in the content of the text selected.
    let behaviorItem = makeBehaviorItem("copy", content);
    /*
        The superceding section concerns the detection of a html code element.
     */
    //A cursor that tracks the hierarchy of elements to see if a <code> tag is present.
    let cur = e.target;
    while(cur.tagName.toLowerCase()!=="code" && (cur=cur.parentNode)!==document.body);
    //If the highest element tracked by the cursor can be ascribed to <code>.
    if(cur.tagName.toLowerCase()==="code")
    {
        //Add code indication to datatype.
        behaviorItem["datatype"] = "code";
    }
    //TODO: add case for image url
    //Send message to the background with modification requirements. The time recorded
    //of the copy event would be that of the highlighted.
    chrome.runtime.sendMessage(behaviorItem, (response) => {
        console.log("Message Response: ", response); //Response is undefined.
    });
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
function makeBehaviorItem(event_type, content)
{
    return {
        "eventtype": event_type,
        "time": new Date(),
        "url": document.location.href,
        "title": document.title,
        "data": content,
    };
}

/**
 * Extract selected text. Returns "" if no text selected.
 * @returns {string}
 */
function extractSelectionText()
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

function drawMarker(time_pair,duration){

    let $orangeBar =$(orangeProgressBar);
    let ratio = time_pair[1]/duration-time_pair[0]/duration,
        propValue= `scaleX(${ratio})`;
    $orangeBar.css('left',((time_pair[0]/duration)*100)+'%');
    $orangeBar.css('transform',propValue);
    $('div.ytp-play-progress.ytp-swatch-background-color:not(.orangeProgress)').before($orangeBar);
}


$(document).arrive('video', {existing:true}, function(v){
    let videoObj = v;
    let behaviorItem;
    behaviorItem = makeBehaviorItem("video_play");
    chrome.runtime.sendMessage(behaviorItem, (response) => {
        console.log("Message Response: ", response);
        console.log("Message Response: ", response.data); //Response is undefined.
        drawMarker(response.data.split(":"), videoObj.duration);
    });

    videoObj.ontimeupdate = function(){

        // if there is a big gap between the current play time and the last play time,
        // the user has skipped/rewind the video
        if (Math.abs(videoObj.currentTime - lastVideoTime) > 5) {
            console.log("snippet:" + lastVideoSnippetStartTime + " ---  " + lastVideoTime);
            behaviorItem = makeBehaviorItem("video", lastVideoSnippetStartTime + ":" + lastVideoTime)
            lastVideoSnippetStartTime = videoObj.currentTime;
            chrome.runtime.sendMessage(behaviorItem, (response) => {
                console.log("Message Response: ", response); //Response is undefined.
            });

            //TODO: handle rewind event.
        }
        lastVideoTime = videoObj.currentTime;
    };

    videoObj.onpause=function(){
        console.log("paused");
    };

    videoObj.onended= function () {
        console.log("ended");
    }
});

document.addEventListener('copy', clipboardHandler);
document.addEventListener('mouseup', highlightHandler);
window.addEventListener("load", newUrlHandler);