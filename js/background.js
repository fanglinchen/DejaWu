let storage = chrome.storage.local;
let scrollArray=[];
let longestTime = 0;
let rightPosition =0; //get the most probable position in array.
let videoDuration;

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

        storage.get({[tabId.toString()]:[]}, function (item) {
            let array = item[tabId.toString()];
            // Fetch query
            if (array.length !== 0){
                let i= array.length -1;
                let query = null;
                while(i>=0){
                    query = extractQueryFromUrl(array[i]);
                    if (query !== null){
                        break;
                    }
                    i--;
                }
            }

            // Check url history
            storage.get({[tab.url]:{}}, function (item) {
                if(item === {}){
                    saveUrlInfo(tab.url, {visitTime: [new Date()], query: query})
                }
                else{
                    let visitTimes = info.visitTime;
                    visitTimes.push(new Date());
                    saveUrlInfo(tab.url, {visitTime:visitTimes, query: query})
                }
            });

            chrome.tabs.sendMessage(tabId, {url: tab.url}, function(response) {});
            array.push(tab.url);

            saveUrlsToTab(array, tabId);
        });
    }
});





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
            //If a code snippet should be redirected.
            for (let index in codeSnippets)
            {
                let snippet = codeSnippets[index];
                if (snippet.data.trim() === text)
                {
                    link = snippet.url.concat(snippet.section_id?
                        ("#"+snippet.section_id):"");
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

/**
 * update a locally stored item with the latest list of values
 * @param key: the key to the item
 * @param array
 */
function update(key, array)
{
    console.log("Updated? ", array);
    //then call the set to update with modified value
    storage.set({[key]: array});
}


/**
 * Handling messages from content script.
 * @param request
 * @param sender
 * @param sendResponse
 * @returns {boolean}
 */

function handleMessage(request, sender, sendResponse) {
    let behaviorCodes = ["copy", "select", "search"];
    if (behaviorCodes.includes(request.eventtype)) {
        storage.get(
            ['behaviorItems'],// get the data whose key =behaviorItems
            function (result) {
                let bhvItems = result.behaviorItems;
                if (!Array.isArray(bhvItems)) {
                    update('behaviorItems',[]);
                } else {
                    console.log("request: ", request);
                    bhvItems.push(request);
                    update('behaviorItems',bhvItems);
                    console.log(bhvItems);
                }
            });
    }
    if (request.eventtype === 'video') {
        storage.get(
            ["snippets"],
            function (result) {
                console.log(result);
                let videoSnippets = result.snippets;
                if (!Array.isArray(videoSnippets)) {
                    update("snippets", []);
                } else {
                    videoSnippets.push(request);
                    update("snippets",videoSnippets);
                }
            }
        )
    }
    if (request.eventtype === "video_play") {
        storage.get(
            ["snippets"],
            function (result) {
                console.log(result);
                let videoSnippets = result.snippets;
                if (!Array.isArray(videoSnippets)) {
                    update("snippets",[]);
                    sendResponse(null);
                } else {
                    console.log(request);
                    let videoSnippetsArray = [];//define an Array to send
                    for (let i = 0; i < videoSnippets.length; i++) {
                        // TODO: handle same video with different parameters
                        // TODO: handle visualization of multiple snippets
                        if (videoSnippets[i].data.split(":")[0] !== videoSnippets[i].data.split(":")[1]) {
                            if (videoSnippets[i].url === request.url) {
                                videoSnippetsArray.push(videoSnippets[i].data);
                            }
                        }
                    }
                    sendResponse(videoSnippetsArray);
                }
            }
        )
    }

    if (request.eventtpye === "scroll") {
        chrome.storage.local.get(
            ['scrollinfo'],
            function (result) {
                if (!Array.isArray(result.scrollinfo)) {
                    update("scrollinfo",[]);
                } else {
                    console.log(request);
                    result.scrollinfo.push(request);
                    update("scrollinfo",result.scrollinfo);
                    console.log(result.scrollinfo);
                }
            });
        sendResponse("stored");
    }
    if (request.eventtpye === "onload") {
        chrome.storage.local.get(
            ['scrollinfo'],
            function (result) {
                scrollArray = result.scrollinfo;
                if (!Array.isArray(scrollArray)) {
                    update('scrollinfo',[]);
                    sendResponse(null);
                } else {
                    console.log(scrollArray);

                    for (let i = 0; i <= scrollArray.length - 1; i++) {
                        if (scrollArray[i].url === request.url) {
                            if (scrollArray[i].duration > longestTime) {
                                longestTime = scrollArray[i].duration;
                                rightPosition = scrollArray[i].position;
                            }
                        }
                    }
                    console.log(rightPosition);
                    console.log(longestTime);
                    sendResponse(rightPosition);
                }
            });
    }
    return true;
}

//Code segments extracted as suggestions. By storing them in this array,
//when one is potentially adopted by the user, the choices need only be
//checked from this list.
let codeSnippets;

/**
 * Handling text inputs from the omnibox and generate suggestions 
 * @param text
 * @param suggest
 */

function omniboxHandler(text, suggest) {
    //Select code segments.
    storage.get(
        ['behaviorItems'],
        function (result) {
            //All processing must be included in this callback.
            let bhvItems = result.behaviorItems;
            //Holder for behavior items that contained copied code segments.
            codeSnippets = [];
            for (let i = 0; i < bhvItems.length; i++) {
                if (bhvItems[i].datatype === "code") {
                    codeSnippets.push(bhvItems[i]);
                    console.log("Behave! ", bhvItems[i]);
                }
            }
            let suggestions = [];
            //Push suggestions.
            for (let i = 0; i < codeSnippets.length; i++) {
                //If the current sequence typed is included in a code segment.
                if (codeSnippets[i].data.indexOf(text) !== -1)
                //Content is that filled when selected, description that appears.
                    suggestions.push({
                        content: codeSnippets[i].data,
                        description: codeSnippets[i].data
                    });
                //Or if the text matches the title above that recorded code.
                else if (codeSnippets[i].title.indexOf(text) !== -1)
                    suggestions.push({
                        content: codeSnippets[i].data,
                        description: codeSnippets[i].data
                    });
            }
            suggest(suggestions);
        });
}
