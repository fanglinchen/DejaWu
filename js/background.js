Array.max = function( array ){
    return Math.max.apply(Math,array);
};

function ValidURL(text) {
    var valid = /((https?):\/\/)?(([w|W]{3}\.)+)?[a-zA-Z0-9\-\.]{3,}\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?/
    return valid.test(text);
}

chrome.omnibox.onInputChanged.addListener(omnibarHandler);
chrome.omnibox.onInputEntered.addListener(acceptInput);
chrome.runtime.onMessage.addListener(handleMessage);
chrome.runtime.onInstalled.addListener(function(details){
chrome.storage.local.clear(function() {
        var error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        }
    });
});//parameter details has no use

function acceptInput(text, disposition) {
    console.log("Input given!");
    // disposition: "currentTab", "newForegroundTab", or "newBackgroundTab"
    if (!ValidURL(text)) {
        return;
    }
    switch (disposition) {
    case "currentTab":
        chrome.tabs.update({url: text});
        break;
    case "newForegroundTab":
        chrome.tabs.create({url: text});
        break;
    case "newBackgroundTab":
        chrome.tabs.create({url: text, active: false});
        break;
    }
}

function update(array)//array = behaviorItem in content.js
{
    console.log("Updated? ",array);
    //then call the set to update with modified value
    chrome.storage.local.set({
        behaviorItems:array//The item named behaviorItems in storage that corresponds to the items.
    }, function() {
        console.log("local storage updated");
        console.log("number of items: " + array.length);
    });
}

//request is behaviorItem in content.js
function handleMessage(request, sender, sendResponse) {
    let behaviorCodes = ["copy", "select"];
    if (behaviorCodes.includes(request.eventtype)) {
        chrome.storage.local.get(
            ['behaviorItems'],// get the data whose key =behaviorItems
            function(result){
              let bhvItems = result.behaviorItems;
              if (!Array.isArray(bhvItems))
              {
                  update([]);//without this push is undefined?
              }
              else{
                  console.log("request: ", request);
                  bhvItems.push(request);
                  update(bhvItems);
                  console.log(bhvItems);
              }
        });
 }
}

function omnibarHandler(text, suggest)
{
    //Holder for behavior items that contained copied code segments.
    let codeSegs = [];
    //Select code segments.
    chrome.storage.local.get(
        ['behaviorItems'],
        function(result) {
            //All processing must be included in this callback.
            let bhvItems = result.behaviorItems;
            for(let i=0; i<bhvItems.length; i++)
            {
                if(bhvItems[i].datatype==="code")
                {
                    codeSegs.push(bhvItems[i]);
                }
            }
            let suggestions = [];
            //Push suggestions.
            for(let i=0; i<codeSegs.length; i++)
            {
                //If the current sequence typed is included in a code segment.
                if(codeSegs[i].data.indexOf(text)!==-1)
                {
                    //Content is that filled when selected, description that appears.
                    suggestions.push({content:codeSegs[i].data,
                                        description:codeSegs[i].data});
                }
                //Or if the text matches the title above that recorded code.
                else if(codeSegs[i].title.indexOf(text!==-1))
                    suggestions.push({content:codeSegs[i].data,
                        description:codeSegs[i].data});
            }
            suggest(suggestions);
                });
    //dispatchSuggestions(text, suggestionsComplete, suggest);
}
