/* global chrome*/
let behaviorTypes = ["copy", "highlight", "video_snippet", "stay", "screenshot"];
//The characters that have associated meanings in xml of suggestions that
//need to be replaced. The replacement characters are contained as values
//to the keys.
let xmlChars = {"&": "&amp;"};

require("downloadjs");

function isValidUrl(text) {
    const valid = /((https?):\/\/)?(([w|W]{3}\.)+)?[a-zA-Z0-9\-\.]{3,}\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?/;
    return valid.test(text);
}


function getRootUrl(rUrl){
    if(rUrl.includes("&feature=youtu.be&t=")){
        rUrl=rUrl.split("&feature=youtu.be&t=")[0];
    }

    if(rUrl.includes("#")){
        rUrl=rUrl.split("#")[0];
    }
    return rUrl;
}
/**
 * A list of suggestions with common fields "url", "title", and "query". Each
 * suggestion corresponds to one past behavior of the user that is prompted by
 * the present text input given by the user in the omnibox.
 *
 * The matching mechanism is defined in the js/background.behaviorMatchesInput
 * method, which offers specific matching other than that of title and past
 * queries.
 *
 * Once a behavior matches the current input, js/background.storeSuggestionSnippet
 * function will be invoked to properly store this suggestion. A prototype holder
 * that contains the basic entries--url, title, query--will be passed in as a
 * parameter in case this information is necessary for specific storage. The storage
 * of this particular suggestion-behavior must also fill the "content" field of
 * the snippet. The processing is done by the modification of the passed in
 * prototype snippet, as aforementioned.
 *
 * Succeeding this, the suggestion snippet, the holder of the relevant information
 * of the past behavior to be prompted as a suggestion in the omnibox is stored
 * in this container, which will modified each time the input changes.
 *
 * As the selection of any suggestion, or in general the ascertainment of an
 * input in the omnibox must supercede some change in input, which triggers the
 * proper processing and population of this holder, all the behaviors that can
 * elicit a special direction, i.e. to a specific site, is properly stored in
 * this holder before js/background.acceptInput is invoked, which checks if
 * the input matches any suggestion in this container.
 */
let suggestionHolder;
chrome.omnibox.onInputChanged.addListener(omniboxHandler);
chrome.omnibox.onInputEntered.addListener(acceptInput);
chrome.runtime.onMessage.addListener(handleMessage);
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.local.clear(function () {
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
    chrome.storage.local.set(toSave);
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
    let tabUrl = getRootUrl(tab.url);
    if (changeInfo.status === "complete" && isValidUrl(tabUrl)){
        console.log("new url detected:" + tabUrl +" for tab " + tabId);
        let query = null;
        //Look up url history for the current tab.
        chrome.storage.local.get({[tabId.toString()]:[]}, function (item) {
            let pastUrls = item[tabId.toString()];
            // Fetch query from the url history of the current tab
            if (pastUrls.length !== 0)
            {
                let i = pastUrls.length;
                //Try get the most recent query.
                while(--i>=0)
                {
                    try
                    {
                        //Attempt to extract query.
                        query = extractQueryFromUrl(pastUrls[i]);
                    }
                    catch(exc)
                    {
                        //Skip.
                        continue;
                    }
                    //Query extracted must be a string.
                    if(query !== null && typeof query === "string")
                        break;
                }
            }
            //Update the current url to the url's behavior item map, if there isn't
            //one yet, create it.
            chrome.storage.local.get(tabUrl, function (urlEntry) {
                //If this url has not been previously stored.
                if(!urlEntry[tabUrl])
                {
                    console.log("Url of this tab has not been previously stored!", urlEntry);
                    saveUrlInfo(tabUrl, {visit:[{visitTime: new Date(), query: query}],
                        title: tab.title})
                }
                else
                {
                    console.log("Url previously visited!", urlEntry);
                    //The previous behavioral information garnered.
                    let behavior = urlEntry[tabUrl];
                    console.log("Behavior ", behavior);
                    //Add the current time and associated query to this url.
                    let visits = behavior["visit"];
                    visits.push({visitTime: new Date(), query: query});
                    saveUrlInfo(tabUrl, behavior)
                }
            });
            //chrome.tabs.sendMessage(tabId, {url: tab.url}, function(response) {});
            pastUrls.push(tabUrl);
            saveUrlsToTab(pastUrls, tabId);
        });
        chrome.storage.local.get(tabUrl, function (result) {
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
    chrome.storage.local.set({[url]: info});
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
    chrome.storage.local.set(toSave);
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
            download(data.dataUri, _screenshotObj.filename, "image/plain");
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
    chrome.storage.local.get(url, function (result)
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
        chrome.storage.local.set(toSave);
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
function valuableVideoUrl(vUrl, videoSnippets)
{
    if(!videoSnippets)
    {
        console.log("No Video Snippets at this Url: Wrong Passing!");
        return;
    }
    let videoSnippet = getMostValuableVideo(videoSnippets);
    let uString = '&feature=youtu.be&t=' +Math.floor(videoSnippet.start_time);
    return vUrl.concat(uString);
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
    if(!etype) {
        console.error("No Event Types Given! ", request);
        return false;
    }

    if (behaviorTypes.includes(etype)) {
        update(request.url, etype, request[etype]);
    }
    return true;
}



/**
 *
 * @param type
 * @param bhv
 * @param omniboxInput
 * @returns {String} The specific type of behavior the input matches.
 */
function behaviorMatchesInput(type, bhv, omniboxInput) {
    if(type === "copy")
    {
        //If a code segment is encountered.
        if(bhv.is_code)
            if(bhv.text.indexOf(omniboxInput) !== -1)
                return "code";
    }
    if (bhv.title.toString().toLowerCase().includes(omniboxInput.toString().toLowerCase())){
        // @Derek: I merge the title matching here to simplify the code. For default value, the
        // subsequent html suggestion shouldn't do anything special, would be great to load the original site logo.
        return "default";
    }
}


//The snippet that contains the site-general information is passed in as
//the third parameter, which is modified by this method.
function storeSuggestionSnippet(bhvType, bhv, snippet)
{
    //The portable data carrier for omnibox suggestion to be returned.
    let suggestBehavior = snippet;
    if(bhvType === "copy") {
        if(bhv.is_code) {
            //Store the behavior-specific fields.
            suggestBehavior["content"] = bhv.text;
            suggestBehavior["type"] = "code";
        }
    }
    else if(bhvType === "video_snippet") {
        suggestBehavior["content"] = suggestBehavior["title"];
        suggestBehavior["type"] = "video_snippet";
        suggestBehavior["url"] = bhv;
    }
    //Add common quantities as section_id to the suggestion carrier.
    //These are confined to those contained in the behavior itself, not the url,
    //title, or query, which must be appended in background.omniboxHandler.
    suggestBehavior["section_id"] = bhv.section_id;
}

function makeSuggestionHTML(suggest)
{
    console.log("Suggestion Holder", suggestionHolder);

    let suggestions = [];
    for(let i=0; i<suggestionHolder.length; i++) {

        let suggestion = suggestionHolder[i];
        let formattedSuggestion;
        if(suggestion.type === "code")
            formattedSuggestion = {
                content: suggestion.content,
                description: (suggestion.query.length===0?"":
                    suggestion.query.toString() + ": ") + suggestion.content
            };
        else if(suggestion.type === "video_snippet")
            formattedSuggestion =
                {
                    content: suggestion.content,
                    description: (suggestion.query.length===0?"":
                        suggestion.query.toString() + ": ") + suggestion.content
                };

        //Check if xml specific strings are encountered in the description.
        for(let xmlChar in xmlChars)
            if(formattedSuggestion.description.indexOf(xmlChar) !== -1)
                formattedSuggestion.description =
                    formattedSuggestion.description.split(xmlChar).join(xmlChars[xmlChar]);

        suggestions.push(formattedSuggestion);
    }
    suggest(suggestions);
}

/**
 * Handling text inputs from the omnibox and generate suggestions
 *
 * For those types of behaviors that have no detailed content for matching, other
 * than the general title and the past queries of the site, their checking part
 * may be foregone in the background.behaviorMatchesInput method, but should
 * instead be recorded in the background.storeSuggestionSnippet method.
 * @param omniboxText The current text typed by the user in the omnibox.
 * @param suggest A function for populating suggestions.
 */

function omniboxHandler(omniboxText, suggest)
{
    chrome.storage.local.get(null,
        //All the behaviors organized by their urls as keys.
        function (bhvItems) {
            //A holder for any kind of previous behavior that may prompt a useful
            //suggestion.
            suggestionHolder = [];
            //Loop through each url and examine if any of its behaviors matches the
            //input given presently in the omnibox by the user.
            for (let url in bhvItems) {
                console.log("hey:" + url);
                //Behaviors contained under this url. All behaviors wished to be
                //processed to prompt a suggestion individually should be
                //included in this container.
                let bhvs = {};
                let bhvItm = bhvItems[url];
                //The previously copied information from this page.
                if (bhvItm.copy)
                    bhvs["copy"] = bhvItm.copy;

                if(bhvItm.video_snippet) {
                    console.log("video snippet");
                    console.log(valuableVideoUrl(url, bhvItm.video_snippet));
                    //Select the video snippet to direct unto.
                    bhvs["video_snippet"] = ({url: valuableVideoUrl(url, bhvItm.video_snippet)});
                }

                //Extract the queries and title that may be used for matching.
                //A list of associated query for this code snippet. The queries
                //in this array must match the current omnibox input.
                let queries = [];
                //Check if this url, and hence this behavior, is
                //associated with a query.
                for (let idx in bhvItm.visit) {
                    let visit = bhvItm.visit[idx];
                    if (visit["query"] !== null && query.toString().toLowerCase().includes(omniboxText.toString().toLowerCase()))
                        queries.push(visit["query"]);
                }


                for (let each_type in bhvs) {
                    let behaviors = bhvs[each_type];
                    //Determine for each behavior of this type if it matches
                    //the current input given by the user.
                    for (let bhvIndex in behaviors) {
                        let bhv = behaviors[bhvIndex];
                        //The specific type of behavior the input triggers. This
                        //may modify the behavior type stored to one more specific,
                        //like copy to code.

                        if(behaviorMatchesInput(each_type, bhv, omniboxText)
                            || queries.length !== 0) {
                            console.log("Ready to Store!");

                            let snippet = {
                                "title": bhvItm.title,
                                "url": url,
                                "query": queries
                            };

                            //Store this behavior accordingly. First specifically,
                            //then add the common attributes.
                            storeSuggestionSnippet(each_type, bhv, snippet);

                            //Add this snippet for suggestion.
                            suggestionHolder.push(snippet);
                        }

                    }
                }
            }
            makeSuggestionHTML(suggest);
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
    if (!isValidUrl(text) && !suggestionHolder) {
        return;
    }
    switch (disposition) {
        case "currentTab": {
            //Default link using text.
            let link = text;

            for(let index in suggestionHolder)
            {
                //Snippet of title-bundled copied behavior.
                let snippet = suggestionHolder[index];
                console.log(snippet);
                if(snippet.content.trim() === text)
                {
                    link = snippet.url;
                    link = snippet.url.concat(snippet.section_id?
                        ("#"+snippet.section_id):"");
                    console.log("link ", link);
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