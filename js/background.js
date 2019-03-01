let storage = chrome.storage.local;
let video_url;//create to change the url of video snippet by ZZL
// related to the TODO in content.js @Derek, we don't need to remove the behaviorTypes in background, as in we can use them to screen invalid info.
let behaviorTypes = ["copy", "highlight", "video_snippet", "stay", "screenshot"];
chrome.omnibox.onInputChanged.addListener(omniboxHandler);
chrome.omnibox.onInputEntered.addListener(acceptInput);
chrome.runtime.onMessage.addListener(handleMessage);
chrome.runtime.onInstalled.addListener(function (details) {
    storage.clear(function () {
        const error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        }
    });
});

// Handling shortkey commands
chrome.commands.onCommand.addListener( function(command) {
    if(command === "screenshot_command"){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {type: "start_screenshots" });
        });
    }
});

// When a tab just got created.
chrome.tabs.onCreated.addListener(function(tab){
    let toSave = {};
    toSave[tab.id.toString()] = [];
    console.log("initializing .. for tab " + tab.id.toString());
    storage.set(toSave);
});

/**
 * When there is a changed url for some tab,
 * 1) fetch the the original query words for the url, assuming the url is redirected
 * from a previous search result page in the same tab
 * 2) save the url visit record - if no visit in the past, create a entry, if there is, update the visit time
 * 3) save the query to the record.
 * 4）let the content script know this url change, to update UI (draw markers, highlight texts, scroll, etc.)
 * 5) save this url history to tab.
 */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    valuableVideoUrl(tab.url);
    console.log("timeUrl:"+video_url);//test
    let tabUrl=getRealUrl(tab.url);
    if (changeInfo.status === "complete" && isValidUrl(tabUrl)){
        console.log("new url detected:" + tabUrl +" for tab " + tabId);
        let query = null;

        // look up url history for the current tab.
        storage.get({[tabId.toString()]:[]}, function (item) {
            let pastUrls = item[tabId.toString()];

            // Fetch query from the url history of the current tab
            if (pastUrls.length !== 0){
                let i= pastUrls.length -1;

                while(i>=0){
                    query = extractQueryFromUrl(pastUrls[i]);
                    if (query !== null){
                        break;
                    }
                    i--;
                }
            }

            /*Update the current url to the url's behavior item map, if there isn't one yet, create it at once.*/
            storage.get({[tabUrl]:{}}, function (item) {
                if(item === {}){
                    console.log("item{}", item);
                    saveUrlInfo(tabUrl, {visitTime: [new Date()], query: query})
                }
                else{
                    console.log("item n{}", item);
                    let visitTimes = item.visitTime;
                    visitTimes.push(new Date());
                    saveUrlInfo(tabUrl, {visitTime:visitTimes, query: query})
                }
            });

            //chrome.tabs.sendMessage(tabId, {url: tabUrl}, function(response) {});
            pastUrls.push(tabUrl);
            saveUrlsToTab(pastUrls, tabId);
        });
        storage.get(tabUrl, function (result) {
            let videoSnippet={};
            let rightPosition=0;
            let existingBehaviors = result[tabUrl];
            if (existingBehaviors) {
                if(existingBehaviors["video_snippet"]){
                    videoSnippet = getMostValuableVideo(existingBehaviors["video_snippet"]);
                    console.log(videoSnippet);
                }
                if(existingBehaviors["stay"]){
                    rightPosition = selectMostValuableStay(existingBehaviors["stay"]);
                }
            }
            chrome.tabs.sendMessage(tabId, {
                url: tabUrl,
                "type":"new_url",
                "video": videoSnippet,
                "position": rightPosition
            }, function (response) {});
        });
    }
});

/**
 * Extract keys from an object, non-recursive
 * @param obj
 * @returns {Array}
 */

/**
 * Extract query given a url
 * TODO: support more url pattern to extract queries
 * @param url
 * @returns {*} the extracted query
 */
//Modified by ZZL
function extractQueryFromUrl(url){
    if (url.includes("google.com")) {
        const regex = /(?<=q=).*?(?=&)/s;
        if (url.match(regex) !== null) {
            return url.match(regex)[0].replace(/\+/g, ' ');
        }
    }
    if(url.includes(".amazon.com")){
        const regex = /(?<=k=).*?(?=&)/s;
        if (url.match(regex) !== null) {
            return url.match(regex)[0].replace(/\+/g, ' ');
        }
    }
    if(url.includes(".yelp.com")){
        const regex = /(?<=find_desc=).*?(?=&)/s;
        if (url.match(regex) !== null) {
            return url.match(regex)[0].replace(/\+/g, ' ');
        }
    }
    if(url.includes(".linkedin.com")){
        const regex = /(?<=keywords=).*?(?=&)/s;
        if (url.match(regex) !== null) {
            return url.match(regex)[0].replace(/\+/g, ' ');
        }
    }
    if(url.includes(".youtube.com")){
        const regex = /search_query=(.*)/;
        if (url.match(regex)[1]!== null) {
            return url.match(regex)[1];
        }
    }
    if(url.includes(".github.com"||".stackoverflow.com"||".bbc.co.uk"||".ted.com")){
        const regex = /q=(.*)/;
        if (url.match(regex)[1]!== null) {
            return url.match(regex)[1];
        }
    }
    if(url.includes(".wikipedia.org")){
        const regex = /wiki\/(.*)/;
        if (url.match(regex)[1]!== null) {
            return url.match(regex)[1];
        }
    }
    return null;
}

/**
 * Save info to a url item.
 * @param url
 * @param info
 */
function saveUrlInfo(url, info){
    storage.set({[url]: info});
}

/**
 * Save a list of url as history for a tab
 * TODO: derek - add visit time information for each url.
 * @param urls
 * @param tabId
 */
function saveUrlsToTab(urls, tabId){
    console.log("save urls to tab "+ tabId);
    let toSave = {};
    toSave[tabId.toString()] =  urls;
    storage.set(toSave);
}

/**
 *
 * @param str
 * @param coords
 * @param callback
 */
function cropData(str, coords, callback) {
    let img = new Image();

    img.onload = function() {
        let canvas = document.createElement('canvas');
        canvas.width = coords.w;
        canvas.height = coords.h;

        canvas.getContext('2d').drawImage(img, coords.x*window.devicePixelRatio, coords.y*window.devicePixelRatio, coords.w*window.devicePixelRatio, coords.h*window.devicePixelRatio, 0, 0, coords.w, coords.h);

        callback({dataUri: canvas.toDataURL()});
    };

    img.src = str;
}


/**
 *
 * @param _screenshotObj
 */
function capture(_screenshotObj) {
    chrome.tabs.captureVisibleTab(null, {format: "png"}, function(data) {

        cropData(data, _screenshotObj.coordinates, function(data) {
            saveFile(data.dataUri, _screenshotObj.filename);

        });
    });
}


/**
 * Update, or add, a behavior item on the given web page. Each url corresponds with
 * a map that contains different behavior codes as keys and an array that contains
 * all behavioral information of this type of behavior. For certain information, as
 * title, which does not really account for a behavior that can occur more than once,
 * their corresponding value may be a single value.
 * @param url The url associated with this information.
 * @param behaviorType The type of behavior, as delineated in the behavior code container.
 * @param behavior The actual bundle of behavioral information to be stored.
 */
function update(url, behaviorType, behavior)
{
    //If no previous storage of behavior exists under this url, result would be {}.
    storage.get(url, function (result)
    {
        // If there are no existing behaviors stored yet to this url,
        // provide a container.
        let existingBehaviors;
        if(!result[url])
            existingBehaviors = {};
        else
            existingBehaviors = result[url];
        // Append the new behavior to the end of the list of this type of behavior
        if(!result[url] || !existingBehaviors[behaviorType])
            existingBehaviors[behaviorType] = [];
        existingBehaviors[behaviorType].push(behavior);
        //The url-associated behavior record.
        let toSave = {};
        toSave[url] = existingBehaviors;
        console.log(existingBehaviors);
        storage.set(toSave);
    });
}

/**
 * Selecting a most probable stay users would like to revisit
 * TODO: @ZZL - Consider stay frequency
 * @param array
 * @returns {*}
 */
function selectMostValuableStay(array){
    let stayPosition;
    let longestTime=0;
    for (let i = 0; i <= array.length - 1; i++) {
        if (array[i].duration > longestTime) {
            longestTime = array[i].duration;
            stayPosition=array[i].position;
        }

    }
    return stayPosition;
}

function getMostValuableVideo(array) {
    let longestTime=0;
    let valuableSnippet;
    for (let i = 0; i <= array.length - 1; i++) {
        let snippet=array[i].end_time-array[i].start_time;
        if(snippet>longestTime){
            valuableSnippet=array[i];
            longestTime=snippet;
        }
    }
    return valuableSnippet;
}
//get most valuable video snippet's url and value gives to video_url
function valuableVideoUrl(vUrl) {
    storage.get(vUrl, function (result) {
        let videoSnippet = {};
        let existingBehaviors = result[vUrl];
        if (existingBehaviors) {
            if (existingBehaviors["video_snippet"]) {
                videoSnippet = getMostValuableVideo(existingBehaviors["video_snippet"]);
                let uString = '&feature=youtu.be&t=' +Math.floor(videoSnippet.start_time);
                video_url = vUrl.concat(uString);
            }
        }
    });
}

function getRealUrl(rUrl){
    if(rUrl.includes("&feature=youtu.be&t=")){
        rUrl=rUrl.split("&feature=youtu.be&t=")[0];
    }
    if(rUrl.includes("#")){
        rUrl=rUrl.split("#")[0];
    }
    return rUrl;
}

/**
 * Handling messages from content script.
 * @param request
 * @param sender
 * @param sendResponse
 * @returns {boolean}
 */
function handleMessage(request, sender, sendResponse)
{
    //Sift the event type from the allowed list of behaviors.
    let etype;
    //Keys for the message, one of them being a behavior type.
    let keys = Object.keys(request);
    for(let index in keys)
        if(behaviorTypes.includes(keys[index])){
            etype = keys[index];
            if (keys[index] === "screenshot")
                capture(request.screenshot);
        }

    //Invalid message if no event type is given.
    if(!etype)
    {
        console.error("No Event Types Given! ", request);
        return false;
    }
    if (behaviorTypes.includes(etype))
    {
        //Record this behavior.
        update(request.url, etype, request[etype]);
    }
    return true;
}


//Code segments extracted as suggestions. By storing them in this array,
//when one is potentially adopted by the user, the choices need only be
//checked from this list.
let codeSnippets;

/**
 * Handling text inputs from the omnibox and generate suggestions
 * @param text The current text typed by the user, autofill not counter.
 * @param suggest A function for populating suggestions.
 */

function omniboxHandler(text, suggest)
{
    //Select code segments.
    storage.get(null,
        //All the behaviors organized by their urls as keys.
        function (bhvItems) {
            //Code copied items and the titles of the site they are under.
            codeSnippets = [];
            for(let bhvItmKey in bhvItems)
            {
                //The bundled information to this url.
                let bhvItm = bhvItems[bhvItmKey];
                //The title of this page.
                let title = bhvItm.title;
                //The previously copied information from this page.
                let copy = bhvItm.copy;
                //If no copied content is contained in this site, pass.
                if(!copy)
                    continue;
                //Loop through the possible different code segments contained
                //in this site.
                for(let j = 0; j < copy.length; j++)
                    if(copy[j].is_code)
                        codeSnippets.push({url: bhvItmKey, title: title,
                            content: copy[j]});
            }
            let suggestions = [];
            //A holder for segments of code retrieved.
            let code;
            //Push suggestions.
            for (let i = 0; i < codeSnippets.length; i++)
            {
                code = codeSnippets[i].content.text;
                //If the current sequence typed is included in a code segment.
                if (code.indexOf(text) !== -1)
                //Content is that filled when selected, description that appears.
                    suggestions.push({
                        content: code,
                        description: code
                    });
                //Or if the text matches the title above that recorded code.
                else if (codeSnippets[i].title.indexOf(text) !== -1)
                    suggestions.push({
                        content: code,
                        description: code
                    });
            }
            suggest(suggestions);
        });
}

/**
 *
 * @param text
 * @param disposition
 */
function acceptInput(text, disposition) {
    // disposition: "currentTab", "newForegroundTab", or "newBackgroundTab"
    //If previously extracted code segments match the current text, direct to them.
    if (!isValidUrl(text) && !codeSnippets) {
        return;
    }
    switch (disposition) {
        case "currentTab": {
            //Default link using text.
            let link = text;
            // TODO: @derek rename variables because this is not specific to code
            //If a code snippet should be redirected.
            for(let index in codeSnippets)
            {
                //Snippet of title-bundled copied behavior.
                let snippet = codeSnippets[index];
                if (snippet.content.text.trim() === text)
                {
                    link = snippet.url;
                    link = snippet.url.concat(snippet.content.section_id?
                        ("#"+snippet.content.section_id):"");
                    break;
                }
            }
            chrome.tabs.update({url: link});
            break;
        }
        case "newForegroundTab": {
            chrome.tabs.create({url: text});
            break;
        }
        case "newBackgroundTab": {
            chrome.tabs.create({url: text, active: false});
            break;
        }
    }
}