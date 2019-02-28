let storage = chrome.storage.local;
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
    if (changeInfo.status === "complete" && isValidUrl(tab.url)){
        console.log("url for tab updated:" + tab.url +" for tab " + tabId);
        let query = null;
        //Look up url history for the current tab.
        storage.get({[tabId.toString()]:[]}, function (item) {
            let pastUrls = item[tabId.toString()];
            // Fetch query from the url history of the current tab
            if (pastUrls.length !== 0)
            {
                console.log("past us", pastUrls);
                let i = pastUrls.length;
                //Try get the most recent query.
                while(--i>=0)
                {
                    console.log("i", i);
                    if((query = extractQueryFromUrl(pastUrls[i]))!==null)
                        break;
                }
            }
            //Update the current url to the url's behavior item map, if there isn't
            //one yet, create it.
            storage.get(tab.url, function (urlEntry) {
                //If this url has not been previously stored.
                if(!urlEntry[tab.url])
                {
                    console.log("Url of this tab has not been previously stored!", urlEntry);
                    saveUrlInfo(tab.url, {visit:[{visitTime: new Date(), query: query}]})
                }
                else
                {
                    console.log("Url previously visited!", urlEntry);
                    //The previous behavioral information garnered.
                    let behavior = urlEntry[tab.url];
                    console.log("Behavior ", behavior);
                    //Add the current time and associated query to this url.
                    let visits = behavior["visit"];
                    visits.push({visitTime: new Date(), query: query});
                    saveUrlInfo(tab.url, behavior)
                }
            });
            //chrome.tabs.sendMessage(tabId, {url: tab.url}, function(response) {});
            pastUrls.push(tab.url);
            saveUrlsToTab(pastUrls, tabId);
        });
        storage.get(tab.url, function (result) {
            let videoSnippets=[];
            let rightPosition=0;
            let existingBehaviors = result[tab.url];
            if (existingBehaviors) {
                if(existingBehaviors["video_snippet"]){
                    videoSnippets = getVideoText( existingBehaviors["video_snippet"]);
                }
                console.log(videoSnippets);
                if(existingBehaviors["stay"]){
                    rightPosition = selectMostValuableStay(existingBehaviors["stay"]);
                }
            }
                chrome.tabs.sendMessage(tabId, {
                    url: tab.url,
                    "type":"new_url",
                    "video": videoSnippets,
                    "position": rightPosition
                }, function (response) {console.log(response);});
        });
    }
});

/**
 * Compare if two objects have identical fields and identical corresponding values.
 * The field "time" is not compared.
 * At present, comparing two behaviors is restricted to their actual information,
 * so if the difference is only in event_type, like "copy" and "highlight", while
 * their content object is the same, the result of comparison will be true.
 * @param obj1
 * @param obj2
 * @returns {boolean}
 */
function compare(obj1, obj2)
{
    //Fields of both objects
    let keys1 = Object.keys(obj1);
    let keys2 = Object.keys(obj2);
    //Sort the arrays for comparison.
    keys1.sort();
    keys2.sort();
    console.log("keys ", keys1, keys2);
    //If the two objects no not even have the same number of keys.
    if(keys1.length !== keys2.length)
        return false;
    //Compare per field; spare the "time" field.
    for(let index in keys1)
    {
        console.log(keys1[index], keys2[index], obj1[keys1[index], obj2[keys2[index]]]);
        //If the field name is not identical.
        if(keys1[index] !== keys2[index])
            return false;
        //If the value is not. Spare "time".
        else if(keys1[index] !== "time" && obj1[keys1[index]] !== obj2[keys1[index]])
            return false;
    }
    return true;
}

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
 * Initializes or modifies the namespace for an url of its corresponding visit
 * information, which is an array of objects with keys "visitTime", and "query";
 * the latter may be null. This method is invoked when a tab is newly loaded.
 * The info parameter must be the entire map of behavioral information associated
 * with this url.
 * @param url The url whose corresponding behavioral information is to be modified.
 * @param info The entire map of behavioral information associated.
 */
function saveUrlInfo(url, info)
{
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
 * @param coords
 */
function capture(coords) {
    chrome.tabs.captureVisibleTab(null, {format: "png"}, function(data) {
        cropData(data, coords, function(data) {
            console.log("Done");
            saveFile(data.dataUri, "Screenshot " + new Date().toDateString() + ".png");
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
        //All previous behaviors of this category.
        let bhvs;
        //Whether the current behavior is a duplicate in content of one recorded
        //before.
        let isDuplicate = false;
        // Append the new behavior to the end of the list of this type of behavior
        if(!result[url] || !existingBehaviors[behaviorType])
            existingBehaviors[behaviorType] = [];
        else
        {
            bhvs = existingBehaviors[behaviorType];
            //Check if a duplicate behavior of a different access time is encountered.
            for(let index in bhvs)
            {
                if(compare(bhvs[index], behavior))
                {
                    if(isDuplicate)
                        bhvs[index].time.push(behavior.time[0]);
                    isDuplicate = true;
                }
            }
        }
        bhvs = existingBehaviors[behaviorType];
        if(!isDuplicate)
            //Append this behavior as new behavior if none with the same content
            //is found.
            bhvs.push(behavior);
        //The url-associated behavior record.
        let toSave = {};
        toSave[url] = existingBehaviors;
        console.log(existingBehaviors);
        console.log("Behavior Stored ", toSave);
        storage.set(toSave);
    });
}

/**
 * TODO: @zhilin add a reasonable algorithm to tell the most valuable stay here
 * @param array
 * @returns {*}
 */
//Modified by ZZL
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

function getVideoText(array) {
    let videoTextSnippet=[];
    for (let i = 0; i <= array.length - 1; i++) {
        videoTextSnippet.push(array[i].text);
    }
    return videoTextSnippet;
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
    if (request.type === "coords")
        capture(request.coords);
    // Case 2: update
    else
    {
        //Sift the event type from the allowed list of behaviors.
        let etype;
        //Keys for the message, one of them being a behavior type.
        let keys = Object.keys(request);
        for(let index in keys)
            if(behaviorTypes.includes(keys[index]))
                etype = keys[index];
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
