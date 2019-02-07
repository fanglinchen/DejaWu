
function highlightHandler(e)
{
    if (window.getSelection())
    {
        //Highlighted content;
        let content = window.getSelection().toString();
        //If no text has been selected, and mouseup was simply trigger by itself.
        if(content=="")
            return;
        var behaviorItem = {
        "type": e.type,
        "time": new Date(),
        "url":  document.location.href,
        "title": document.title,
        "data": content
        };
        chrome.runtime.sendMessage(behaviorItem, (response) => {
            console.log("");
        });
    }
}

function clipboardHandler(e)
{
    //Extra information to be appended to the highlighted behaviorItem. Include "copy"
    //event tag.
    let appendItem = {type:e.type};
    //A cursor that tracks the hierarchy of elements to see if a <code> tag is present.
    let cur = e.target;
    while(cur.tagName.toLowerCase()!=="code"&&(cur=cur.parentNode)!==document.body);
    //If the highest element tracked by the cursor can be ascribed to <code>.
    if(cur.tagName.toLowerCase()==="code")
    {
        //Add code indication to datatype.
        appendItem["datatype"] = "code";
        //Add random locations.

    }
    //Send message to the background with modification requirements. The time recorded
    //of the copy event would be that of the highlighted.
    chrome.runtime.sendMessage(appendItem, (response) => {
        console.log("");
    });
        // chrome.storage.sync.set({"code":window.getSelection().toString()},
        //         ()=>{console.log("Code Recorded!")});
}

//Sending a request succeeding a "copy" action on the current page.
document.addEventListener('copy', clipboardHandler);
document.addEventListener('mouseup', highlightHandler);


