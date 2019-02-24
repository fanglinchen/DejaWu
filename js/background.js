let storage = chrome.storage.local;
let behaviorCodes = ["copy", "highlight"];
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
 * Update, or add, a behavior item on the given web page. Each url corresponds with
 * a map that contains different behavior codes as keys and an array that contains
 * all behavioral information of this type of behavior. For certain information, as
 * title, which does not really account for a behavior that can occur more than once,
 * their corresponding value may be a single value.
 * @param url The url associated with this information.
 * @param bhvCode The type of behavior, as delineated in the behavior code container.
 * @param bhv The actual bundle of behavioral information to be stored.
 * @param title The title of the page.
 */
function update(url, bhvCode, bhv, title)
{
    //If no previous storage of behavior exists under this url, result would be {}.
    storage.get(url, function (result)
    {
        //Previously associated behaviors with this url.
        let previousBhvs;
        //If this url does not have stored behaviors yet, provide for a container.
        //Presently we assume that an url has a corresponding title.
        if(!result[url])
            previousBhvs = {title: title};
        //Else retrieve the previously stored information.
        else
            previousBhvs = result[url];
        //Now descend into the level for this behavior code.
        //If this url does not already have a behavior of this type.
        if(!result[url] || !previousBhvs[bhvCode])
            previousBhvs[bhvCode] = [];
        //Append this new behavior.
        previousBhvs[bhvCode].push(bhv);
        //The behavior items that contains the url as key and the behaviors as value.
        let bhvItms = {};
        bhvItms[url] = previousBhvs;
        //Send to be storage to be stored.
        storage.set(bhvItms);
    });
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
    //The given type of behavior of the message.
    let etype = request.event_type;
    if (behaviorCodes.includes(etype))
    {
        //Record this behavior.
        update(request.url, etype, request[etype], request.title);
    }
    //Modified up to here. All below untouched.
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
