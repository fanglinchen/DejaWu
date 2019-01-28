var highlightHandler = function(e){
    if (window.getSelection())
    {
        var behaviorItem = {
        "type": e.type,
        "time": new Date(),
        "url":  document.location.href,
        "title": document.title,
        "data": window.getSelection().toString()
        };
        chrome.runtime.sendMessage(behaviorItem, (response) => {
            console.log(response);
        });
    }
};

//Sending a request succeeding a "copy" action on the current page.
document.addEventListener('copy', highlightHandler);
document.addEventListener('mouseup', highlightHandler);


