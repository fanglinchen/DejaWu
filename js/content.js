
function highlightHandler(e)
{
    //Get selected text.
    let content = extractSelectionText();
    //If no content has been selected, ignore.
    if(content==="")
        return;
    let bhvItm = makeBehaviorItem(e,content);
    //Modify event type to text-selection.
    bhvItm["eventtype"] = "select";
    chrome.runtime.sendMessage(bhvItm, (response) => {
        console.log("Message Response: ", response); //Response is undefined.
    });
}

function clipboardHandler(e)
{
    //Check for text selection.
    let content = extractSelectionText();
    if(content==="")
        return;
    //Store the behavior duplicate in the content of the text selected.
    let behaviorItem = makeBehaviorItem(e, content);
    /*
        The superceding section concerns the detection of a html code element.
     */
    //A cursor that tracks the hierarchy of elements to see if a <code> tag is present.
    let cur = e.target;
    while(cur.tagName.toLowerCase()!=="code"&&(cur=cur.parentNode)!==document.body);
    //If the highest element tracked by the cursor can be ascribed to <code>.
    if(cur.tagName.toLowerCase()==="code")
    {
        //Add code indication to datatype.
        behaviorItem["datatype"] = "code";
    }
    //Send message to the background with modification requirements. The time recorded
    //of the copy event would be that of the highlighted.
    chrome.runtime.sendMessage(behaviorItem, (response) => {
        console.log("Message Response: ", response); //Response is undefined.
    });
}

/**
 * This function makes a customary representation of a user's browsing behavior.
 * It is a map with the keys "type", the type of browsing event, "data", the content
 * correlated with the event, "time", time of this event, "title", the title of the
 * page, and "url", the hyperlink to that site.
 * @param event The event triggered.
 * @param content The content associated with this event.
 * @returns {{data: *, time: Date, type: *, title: string, url: string}}
 */
function makeBehaviorItem(event, content)
{
    return {
        "eventtype": event.type,
        "time": new Date(),
        "url": document.location.href,
        "title": document.title,
        "data": content,
    };
}

/**
 * Extract selected text. Returns "" if no text selected.
 * @returns {string}
 */
function extractSelectionText()
{
    //Text selected.
    let sel = window.getSelection();
    if (sel)
    {
        //Highlighted content;
        let content = sel.toString();
        //If no text has been selected, and mouseup was simply trigger by itself.
        return content;
    }
}

//Sending a request succeeding a "copy" action on the current page.
document.addEventListener('copy', clipboardHandler);
document.addEventListener('mouseup', highlightHandler);