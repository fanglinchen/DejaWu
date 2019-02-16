/**
 * @return {boolean}
 */
function isValidUrl(text) {
    const valid = /((https?):\/\/)?(([w|W]{3}\.)+)?[a-zA-Z0-9\-\.]{3,}\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?/;
    return valid.test(text);
}

chrome.omnibox.onInputChanged.addListener(omnibarHandler);
chrome.omnibox.onInputEntered.addListener(acceptInput);
chrome.runtime.onMessage.addListener(handleMessage);
chrome.runtime.onInstalled.addListener(function (details) {
    chrome.storage.local.clear(function () {
        const error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        }
    });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

    if (changeInfo.status === "complete"){
        console.log("new url detected:" + tab.url);
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {url: tab.url}, function(response) {});
        });
    }
});


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
                if (codeSnippets[index].data.trim() === text) {
                    link = codeSnippets[index].url;
                    break;
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

function updateVideos(array)
{
    chrome.storage.local.set({
        snippets:array//The item named behaviorItems in storage that corresponds to the items.
    }, function() {
        console.log("local storage updated");
        console.log("number of items: " + array.length);
    });
}

function update(array)//array = behaviorItem in content.js
{
    console.log("Updated? ", array);
    //then call the set to update with modified value
    chrome.storage.local.set({
        behaviorItems: array//The item named behaviorItems in storage that corresponds to the items.
    }, function () {
        console.log("local storage updated");
        console.log("number of items: " + array.length);
    });
}


//request is behaviorItem in content.js
function handleMessage(request, sender, sendResponse) {
    let behaviorCodes = ["copy", "select", "search"];
    if (behaviorCodes.includes(request.eventtype)) {
        chrome.storage.local.get(
            ['behaviorItems'],// get the data whose key =behaviorItems
            function (result) {
                let bhvItems = result.behaviorItems;
                if (!Array.isArray(bhvItems)) {
                    update([]);//without this push is undefined?
                } else {
                    console.log("request: ", request);
                    bhvItems.push(request);
                    update(bhvItems);
                    console.log(bhvItems);
                }
            });
    }
    if (request.eventtype === 'video') {
        chrome.storage.local.get(
            ["snippets"],
            function (result) {
                console.log(result);
                let videoSnippets = result.snippets;
                if (!Array.isArray(videoSnippets)) {
                    updateVideos([]);
                } else {
                    videoSnippets.push(request);
                    updateVideos(videoSnippets);
                }
            }
        )
    }
    if (request.eventtype === "video_play") {
        chrome.storage.local.get(
            ["snippets"],
            function (result) {
                console.log(result);
                let videoSnippets = result.snippets;
                if (!Array.isArray(videoSnippets)) {
                    updateVideos([]);
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
    return true;
}

//Code segments extracted as suggestions. By storing them in this array,
//when one is potentially adopted by the user, the choices need only be
//checked from this list.
let codeSnippets;

function omnibarHandler(text, suggest) {
    //Select code segments.
    chrome.storage.local.get(
        ['behaviorItems'],
        function (result) {
            //All processing must be included in this callback.
            let bhvItems = result.behaviorItems;
            //Holder for behavior items that contained copied code segments.
            codeSnippets = [];
            for (let i = 0; i < bhvItems.length; i++) {
                if (bhvItems[i].datatype === "code") {
                    codeSnippets.push(bhvItems[i]);
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
