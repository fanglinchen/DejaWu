let storage = chrome.storage.local;
// related to the TODO in content.js @Derek, we don't need to remove the behaviorTypes in background, as in we can use them to screen invalid info.
let behaviorTypes = ["copy", "highlight", "video_snippet", "stay", "screenshot"];
let pageLoadingBehaviorTypes = ["stay", "video_snippet"];
//used specifically for Retina screen to get the image's correct size



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
    if (changeInfo.status === "complete" && isValidUrl(tab.url)){
        console.log("new url detected:" + tab.url +" for tab " + tabId);
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
            storage.get({[tab.url]:{}}, function (item) {
                if(item === {}){
                    console.log("item{}", item);
                    saveUrlInfo(tab.url, {visitTime: [new Date()], query: query})
                }
                else{
                    console.log("item n{}", item);
                    let visitTimes = item.visitTime;
                    visitTimes.push(new Date());
                    saveUrlInfo(tab.url, {visitTime:visitTimes, query: query})
                }
            });

            chrome.tabs.sendMessage(tabId, {url: tab.url}, function(response) {});
            pastUrls.push(tab.url);

            saveUrlsToTab(pastUrls, tabId);
        });
    }
});

/**
 * Extract keys from an object, non-recursive
 * @param obj
 * @returns {Array}
 */
function getKeys(obj){
    let keys = [];
    for (let key in obj){
        keys.push(key);
    }
    return keys;
    // recursive - Object.keys(obj).find(key => obj[key] === value)
}

/**
 * Extract query given a url
 * TODO: support more url pattern to extract queries
 * @param url
 * @returns {*} the extracted query
 */
function extractQueryFromUrl(url){
    if (url.includes("google.com")) {
        const regex = /(?<=q=).*?(?=&)/s;
        if (url.match(regex) !== null) {
            return url.match(regex)[0].replace(/\+/g, ' ');
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
 * @param dataURI
 */
function saveFile(dataURI) {
    download(dataURI, "Screenshot " + new Date().toDateString() + ".png", "image/plain");
}

/**
 *
 * @param coords
 */
function capture(coords) {
    chrome.tabs.captureVisibleTab(null, {format: "png"}, function(data) {
        cropData(data, coords, function(data) {
            console.log("Done");
            saveFile(data.dataUri);
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
 * @param title The title of the page.
 */
function update(url, behaviorType, behavior, title)
{
    //If no previous storage of behavior exists under this url, result would be {}.
    storage.get(url, function (result)
    {
        // If there are no existing behaviors stored yet to this url, initialize it using the title.
        let existingBehaviors;
        if(!result[url])
            existingBehaviors = {title: title};
        else
            existingBehaviors = result[url];

        // Append the new behavior to the end of the list of this type of behavior
        if(!result[url] || !existingBehaviors[behaviorType])
            existingBehaviors[behaviorType] = [];
        existingBehaviors[behaviorType].push(behavior);

        let toSave = {};
        toSave[url] = existingBehaviors;
        storage.set(toSave);
    });
}

/**
 * TODO: @zhilin add a reasonable algorithm to tell the most valuable stay here
 * @param array
 * @returns {*}
 */
function selectMostValuableStay(array){
    return array[0];
}

// Handling shortkey commands
chrome.commands.onCommand.addListener( function(command) {
    if(command === "screenshot_command"){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {type: "start_screenshots" });
        });
    }
});

/**
 * Handling messages from content script.
 * @param request
 * @param sender
 * @param sendResponse
 * @returns {boolean}
 */
function handleMessage(request, sender, sendResponse)
{
    if (request.type === "coords")
        capture(request.coords);

    let keys = getKeys(request);
    // Case 1: saved content retrieval based on a single URL
    if (keys.length === 1){
        let url = request.url;
        if (isValidUrl(url)){
            storage.get(url, function (result)
            {

                let existingBehaviors = result[url];
                if(existingBehaviors){
                    let toSend = {};
                    for (let key in pageLoadingBehaviorTypes){
                        if (key in getKeys(existingBehaviors)){
                            if (key === "video_snippet")
                                toSend[key] = existingBehaviors[key];
                            else if (key === "stay")
                                toSend[key] = selectMostValuableStay(existingBehaviors[key]);
                        }
                    }
                    sendResponse(toSend);
                }

            });
        }
    }
    // Case 2: update
    else{
        let etype = request.event_type;
        if (behaviorTypes.includes(etype))
        {
            //Record this behavior.
            update(request.url, etype, request[etype], request.title);
        }
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
