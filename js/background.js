Array.max = function( array ){
    return Math.max.apply(Math,array);
};

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
chrome.runtime.onInstalled.addListener(function(details){
chrome.storage.local.clear(function() {
    const error = chrome.runtime.lastError;
    if (error) {
            console.error(error);
        }
    });
});//parameter details has no use


function acceptInput(text, disposition) {
    console.log("Input given!");
    // disposition: "currentTab", "newForegroundTab", or "newBackgroundTab"
    if (!isValidUrl(text)) {
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

chrome.contextMenus.removeAll(function () {
    console.log("contextMenus.removeAll callback");
    chrome.contextMenus.create(
        {
            "title": type,
            "contexts": ["selection"],
            "onclick": function (info, tab) {
                alert(1);
            }
        },
        function () {
            console.log("ContextMenu.create callback! Error? " + chrome.extension.lastError);
        });
});

function updateVideos(array)
{
    chrome.storage.local.set({
        snippets:array//The item named behaviorItems in storage that corresponds to the items.
    }, function() {
        console.log("local storage updated");
        console.log("number of items: " + array.length);
    });
}

//request is behaviorItem in content.js
function handleMessage(request, sender, sendResponse) {
    let behaviorCodes = ["copy", "select", 'search'];
    if (behaviorCodes.includes(request.eventtype)) {
        // get the stored behaviorItems
        chrome.storage.local.get(
            ['behaviorItems'],
            function(result){
              let bhvItems = result.behaviorItems;

              // Initialize the items if nothing stored yet
              if (!Array.isArray(bhvItems))
              {
                  update('behaviorItems',[]);
              }
              // Update the array with the latest item.
              else{
                  console.log("request: ", request);
                  bhvItems.push(request);
                  update('behaviorItems', bhvItems);
                  console.log(bhvItems);
              }
        });
    }
    if (request.eventtype === 'video'){
        console.log("videoooo");
        chrome.storage.local.get(
            ["snippets"],
            function(result){
                console.log(result);
                let videoSnippets = result.snippets;
                if (!Array.isArray(videoSnippets))
                {
                    console.log("heyyy", "heyy");
                    updateVideos([]);
                }
                else{
                    console.log(request);
                    videoSnippets.push(request);
                    updateVideos( videoSnippets);
                }
            }
        )
    }
    if (request.eventtype ==="video_play"){
        chrome.storage.local.get(
            ["snippets"],
            function(result){
                console.log(result);
                let videoSnippets = result.snippets;
                if (!Array.isArray(videoSnippets))
                {
                    console.log("heyyy", "heyy");
                    updateVideos([]);
                    sendResponse(null);
                }
                else{
                    console.log(request);
                    let videoSnippetsArray=[];//define an Array to send
                    for (let i=0; i<videoSnippets.length; i++)
                    {
                        // TODO: handle same video with different parameters
                        // TODO: handle visualization of multiple snippets
                        //console.log(videoSnippets[i].url);
                        //console.log(request.url);
                        if(videoSnippets[i].data.split(":")[0] !== videoSnippets[i].data.split(":")[1]){
                          if (videoSnippets[i].url === request.url){
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

function omnibarHandler(text, suggest)
{
    // Holder for behavior items that contained copied code snippets.
    let codeSnippets = [];
    chrome.storage.local.get(
        ['behaviorItems'],
        function(result) {
            //All processing must be included in this callback.
            let bhvItems = result.behaviorItems;
            for(let i=0; i<bhvItems.length; i++)
            {
                if(bhvItems[i].datatype==="code")
                {
                    codeSnippets.push(bhvItems[i]);
                }
            }
            let suggestions = [];
            //Push suggestions.
            for(let i=0; i<codeSnippets.length; i++)
            {
                //If the current sequence typed is included in a code snippet.
                if(codeSnippets[i].data.indexOf(text)!==-1)
                {
                    //Content is that filled when selected, description that appears.
                    suggestions.push({content:codeSnippets[i].data,
                                        description:codeSnippets[i].data});
                }
                //Or if the text matches the title above that recorded code.
                else if(codeSnippets[i].title.indexOf(text!==-1))
                    suggestions.push({content:codeSnippets[i].data,
                        description:codeSnippets[i].data});
            }
            suggest(suggestions);
        });

}
