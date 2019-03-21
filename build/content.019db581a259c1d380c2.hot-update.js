webpackHotUpdate("content",{

/***/ "./src/js/content.js":
/*!***************************!*\
  !*** ./src/js/content.js ***!
  \***************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var siphon_tools__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! siphon-tools */ \"./node_modules/siphon-tools/src/index.js\");\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jquery */ \"./node_modules/jquery/dist/jquery.js\");\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_1__);\n\n\n\nlet blueProgressBar = `<div class=\"ytp-play-progress ytp-swatch-background-color blueProgress\"></div>`;\n__webpack_require__(/*! arrive */ \"./node_modules/arrive/src/arrive.js\");\n\n\nlet videoObj, videoDuration, query, videoUrl;\nlet currentUrl = document.location.href;\nlet startTime = new Date().getTime();\nlet endTime = new Date().getTime();\nlet currentPosition,lastPosition,lastVideoTime, lastVideoSnippetStartTime = 0;\nconst LONG_ENOUGH_MS = 8000;\nlet ghostElement, startPos, startY;\nlet _cptrWindow;\nlet rect;//screen shot rect\nsiphon_tools__WEBPACK_IMPORTED_MODULE_0__[\"default\"].initializeSelectors([\n    Object(siphon_tools__WEBPACK_IMPORTED_MODULE_0__[\"SnippetSelector\"])({\n        onTrigger: (cptrWindow, e) => {\n            _cptrWindow = cptrWindow;\n            rect = cptrWindow.getBoundingClientRect();\n            console.log(rect);\n            let annotation = new siphon_tools__WEBPACK_IMPORTED_MODULE_0__[\"Snippet\"](rect);\n            console.log(annotation);\n\n            console.log(\"test keydown\"); \n            document.addEventListener('keydown', keyDownHandler, false);\n            document.addEventListener('mousedown', mouseDownHandler, false);\n            \n        }\n    })\n]);\n\nsiphon_tools__WEBPACK_IMPORTED_MODULE_0__[\"default\"].enable();\n\n// setTimeout(()=>{\n//     _cptrWindow.remove()\n// }, 5000)\n\nfunction isPlayingYoutubeAd(){\n    return jquery__WEBPACK_IMPORTED_MODULE_1___default()(\".ytp-play-progress\").css(\"background-color\") === \"rgb(255, 204, 0)\";\n}\n\n\n/**\n * handle pressing esc to quit screenshot\n * @param {*} e \n */\nfunction keyDownHandler(e) {\n    if ( e.key === 'Escape') {\n        e.preventDefault();\n        e.stopPropagation();\n        console.log(\"esc pressed\")\n        document.removeEventListener('mousedown', mouseDownHandler, false);\n        document.removeEventListener('keydown', keyDownHandler, false);\n        _cptrWindow.parentNode.removeChild(_cptrWindow)\n\n        // _cptrWindow.remove()\n        return false;\n    }\n}\n\n\n\nfunction removeMarkers(){\n    console.log(\"remove markers...\");\n    jquery__WEBPACK_IMPORTED_MODULE_1___default()('div.ytp-play-progress.ytp-swatch-background-color').remove('.blueProgress');\n}\n\n\nfunction isCode(e){\n    let cur = e.target;\n    while(cur.tagName.toLowerCase()!==\"code\" && (cur=cur.parentNode)!==document.body);\n    //If the highest element tracked by the cursor can be ascribed to <code>.\n    return cur.tagName.toLowerCase()===\"code\";\n}\n\nfunction fetchSectionId(e){\n    let cur = e?e.target:null;\n    if(cur)\n        while(!cur.hasAttribute(\"id\") && (cur=cur.parentNode)!==document.body);\n    return cur&&(cur.getAttribute(\"id\")||null);\n}\n\nfunction formatFileName(date) {\n    let year = date.getFullYear();\n    let _day = date.getDate();\n    let month = date.getMonth();\n    let hours = date.getHours();\n    let minutes = date.getMinutes();\n    let milliseconds = date.getMilliseconds();\n    let ampm = hours >= 12 ? 'pm' : 'am';\n    hours = hours % 12;\n    hours = hours ? hours : 12; // the hour '0' should be '12'\n    minutes = minutes < 10 ? '0'+ minutes : minutes;\n\n    return \"Screen Shot \" + year + \"-\" +\n        (month + 1) + \"-\" + _day + \" at \" + hours + '.' + minutes + '.' + milliseconds + \" \" + ampm + \".png\";\n}\n\n\nfunction goToPastPageSection(response) {\n    console.log(\"scrolling to \" + response);\n    window.scrollTo(0, response);//auto scroll function\n}\n\nfunction loadMarkers(start,end,duration) {\n    console.log(\"load markers.....\");\n    let $blueBar = jquery__WEBPACK_IMPORTED_MODULE_1___default()(blueProgressBar);\n    let ratio = end / duration - start / duration,\n        propValue = `scaleX(${ratio})`;\n    $blueBar.css('left', ((start / duration) * 100) + '%');\n    $blueBar.css('transform', propValue);\n    jquery__WEBPACK_IMPORTED_MODULE_1___default()('div.ytp-play-progress.ytp-swatch-background-color:not(.blueProgress)').after($blueBar);\n}\n\n\nfunction mouseUpHandler(e) {\n    e.preventDefault();\n\n    const diff = {x: Math.abs(parseInt(e.pageX)-parseInt(ghostElement.style.left)),\n        y: Math.abs(parseInt(e.pageY)-parseInt(ghostElement.style.top))};\n\n    //working with negative coordinates\n    let _w = diff.x;\n    let _h = diff.y;\n    let _x = startPos.x;\n    let _y = startY;\n\n    if(parseInt(e.pageY) < startPos.y){\n        //top right\n        _h = Math.abs(parseInt(e.pageY)-startPos.y);\n        _y -= _h;\n    }\n    if(parseInt(e.pageX) < startPos.x){\n        //left bottom\n        _w = Math.abs(parseInt(e.pageX)-startPos.x);\n        _x -= _w;\n    }\n\n    document.removeEventListener('mousemove', mouseMoveHandler, false);\n    document.removeEventListener('mouseup', mouseUpHandler, false);\n\n    ghostElement.parentNode.removeChild(ghostElement);\n    setTimeout(function() {\n        const coords = {\n            w: _w,\n            h: _h,\n            x: _x,\n            y: _y\n        };\n        endScreenshot(coords,false);\n    }, 50);\n\n    return false;\n}\n//quit screen shot\n// function keyDownHandler(e) {\n//     if ( e.key === 'Escape') {\n//         e.preventDefault();\n//         e.stopPropagation();\n//         endScreenshot(null, true);\n//         return false;\n//     }\n// }\n\n\n/**\n *\n * @param e\n * @returns {boolean}\n */\nfunction mouseMoveHandler(e) {\n    e.preventDefault();\n\n    const diff = {x: Math.abs(parseInt(e.pageX)-parseInt(ghostElement.style.left)),\n        y: Math.abs(parseInt(e.pageY)-parseInt(ghostElement.style.top))};\n\n    ghostElement.style.width = diff.x + 'px';\n    ghostElement.style.height = diff.y +'px';\n\n    //opposite drawing canvas (negative coords)\n    if(parseInt(e.pageY) < startPos.y){\n        ghostElement.style.top = e.pageY + 'px';\n        ghostElement.style.height = Math.abs(parseInt(e.pageY)-startPos.y)+'px';\n    }\n    if(parseInt(e.pageX) < startPos.x){\n        ghostElement.style.left = e.pageX+'px';\n        ghostElement.style.width = Math.abs(parseInt(e.pageX)-startPos.x)+'px';\n    }\n\n    return false;\n}\n\n/**\n *\n * @param e\n * @returns {boolean}\n */\nfunction mouseDownHandler(e) {\n    e.preventDefault();\n\n    // startPos = {x: e.pageX, y: e.pageY};\n    // startY = e.y;\n\n    // ghostElement = document.createElement('div');\n    // ghostElement.style.background = 'blue';\n    // ghostElement.style.opacity = '0.1';\n    // ghostElement.style.position = 'absolute';\n    // ghostElement.style.left = e.pageX + 'px';\n    // ghostElement.style.top = e.pageY + 'px';\n    // ghostElement.style.width = \"0px\";\n    // ghostElement.style.height = \"0px\";\n    // ghostElement.style.zIndex = \"1000000\";\n    // document.body.appendChild(ghostElement);\n\n    // document.addEventListener('mousemove', mouseMoveHandler, false);\n    // document.addEventListener('mouseup', mouseUpHandler, false);\n    var x = e.pageX;\n    var y = e.pageY;\n    var w = e.width\n    var h = e.height\n\n    if (!(x < rect.x && y < rect.y  && w < rect.width && h < rect.height)){\n        // mouse is not in rect.\n        document.removeEventListener('mousedown', mouseDownHandler, false);\n        document.removeEventListener('keydown', keyDownHandler, false);\n        console.log(\"remove frome first\");\n        _cptrWindow.remove()\n    }\n\n\n\n\n\n\n\n    return false;\n}\n\n/**\n * Save part of pages with long stay.\n */\nfunction scrollHandler() {\n    endTime = new Date().getTime();\n    if (endTime - startTime > LONG_ENOUGH_MS) {\n        chrome.runtime.sendMessage({\n                \"url\": currentUrl,\n                \"stay\": {\"position\": lastPosition,\n                    \"duration\": endTime - startTime,\n                    \"time\": [new Date()]}\n            },\n            function (response) {});\n    }\n    lastPosition = window.scrollY || window.pageYOffset\n        || document.body.scrollTop + (document.documentElement && document.documentElement.scrollTop || 0);\n    startTime = endTime;\n}\n\n/**\n * Data format:\n * <Url\n *          highlight:\n *          text\n *          section_id\n *          position\n *          time>\n */\nfunction saveHighlightedText(e)\n{\n    let content = extractSelectedText();\n    if(content!== \"\"){\n        console.log(\"currentUrl:\" + currentUrl);\n        console.log(\"currentPosition:\" + currentPosition);\n        chrome.runtime.sendMessage({\"url\": currentUrl,\n                \"highlight\":\n                    {\"text\": content,\n                        \"section_id\": fetchSectionId(e),\n                        \"position\": currentPosition,\n                        \"time\": [new Date()]}},\n            function(response) {});\n    }\n}\n\n/**\n * Data format:\n * <Url\n *          copy:\n *          text\n *          section_id\n *          is_code\n *          is_image_url\n *          time>\n */\nfunction saveCopiedText(e) {\n\n    let content = extractSelectedText();\n    if(content!== \"\"){\n        chrome.runtime.sendMessage({\"url\": currentUrl,\n                \"copy\": {\"text\": content,\n                    \"section_id\": fetchSectionId(e),\n                    \"is_code\" :  isCode(e),\n                    //\"is_image_url\": isImageUrl(content),\n                    \"time\": [new Date()]}},\n            function(response) {});\n    }\n    console.log(\"Sending!\");\n}\n\n/**\n * Extract selected text. Returns \"\" if no text selected.\n * @returns {string}\n */\nfunction extractSelectedText()\n{\n    let sel = window.getSelection();\n    if (sel) {\n        return sel.toString();\n    }\n}\n\n\n/**\n * Listen snippet data once a video element is created\n * Data format:\n * <Url\n *          snippet:\n *          start_time\n *          end_time\n *          time\n *  contains_video\n *  video_duration>\n */\ndocument.arrive('video', function (v) {\n    videoObj = v;\n    videoObj.ontimeupdate = function () {\n        if (!isPlayingYoutubeAd()) {\n            if (!isNaN(videoObj.duration)) {\n                videoDuration = videoObj.duration;\n            }\n            // if there is a big gap between the current play time and the last play time,\n            // the user has skipped/rewind the video\n            if (Math.abs(videoObj.currentTime - lastVideoTime) >= 10) {\n                console.log(\"snippet:\" + lastVideoSnippetStartTime + \" ---  \" + lastVideoTime);\n                if (lastVideoTime - lastVideoSnippetStartTime > 3) {\n                    chrome.runtime.sendMessage({\n                            \"url\": videoUrl,\n                            \"video_snippet\":\n                                {\n                                    \"start_time\": lastVideoSnippetStartTime,\n                                    \"end_time\": lastVideoTime,\n                                    \"duration\": videoDuration\n                                }\n                        },\n                        function (response) {\n                        });\n                }\n                lastVideoSnippetStartTime = videoObj.currentTime;\n                //TODO: handle rewind event.\n            }\n            lastVideoTime = videoObj.currentTime;\n        }\n    };\n\n    videoObj.onpause = function () {\n        console.log(\"paused\");\n    };\n\n    videoObj.onended = function () {\n        console.log(\"ended\");\n    };\n});\n\n\nfunction startScreenshot() {\n    console.log('start screenshot');\n    //change cursor\n    document.body.style.cursor = 'crosshair';\n    document.addEventListener('mousedown', mouseDownHandler, false);\n    //listener for quiting screenshot\n    document.addEventListener('keydown', keyDownHandler, false);\n}\n\nfunction endScreenshot(coords, quit) {\n    document.removeEventListener('mousedown', mouseDownHandler, false);\n    document.body.style.cursor = 'default';\n\n    if(quit){\n        //user pressed ESC quit screenshot. not sending any information.\n        document.removeEventListener('mousemove', mouseMoveHandler, false);\n        document.removeEventListener('mouseup', mouseUpHandler, false);\n\n        ghostElement.parentNode.removeChild(ghostElement);\n    }\n    else{\n\n        console.log('sending message with screenshoot');\n        chrome.runtime.sendMessage({\"url\": currentUrl,\n                \"screenshot\":{coordinates:coords, filename: formatFileName(new Date()), time: new Date()}},\n            function(response) {});\n\n    }\n\n}\n\n\n// Listening url changes for the current tab.\nchrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {\n    currentUrl=message.url;\n    if (message.type === \"new_url\"){\n        let videoResponse=message.video;\n        let stayResponse=message.position;\n        //if has code ,don't go page section;\n        if(!currentUrl.includes(\"#\")){\n            goToPastPageSection(stayResponse);\n        }\n        setTimeout(function () {\n            console.log(\"new url:\", message.url);\n            videoUrl = message.url;\n            query = message.query;\n            // to know Url has already changed\n            if (videoUrl === currentUrl) {\n                if (currentUrl.includes(\"youtube.com\")) {\n                    removeMarkers();\n                    loadMarkers(videoResponse.start_time,videoResponse.end_time,videoResponse.duration);\n                }\n            }\n        }, 2000);\n    }\n    else if (message.type === \"start_screenshots\"){\n        startScreenshot();\n    }\n});\n\n\n// When the web page is about to be unloaded.\nwindow.onbeforeunload = function () {\n    if (currentUrl.includes(\"youtube.com\")) {\n        chrome.runtime.sendMessage({\n                \"url\": videoUrl,\n                \"video_snippet\":\n                    {\n                        \"start_time\": lastVideoSnippetStartTime,\n                        \"end_time\": lastVideoTime,\n                        \"duration\": videoDuration\n                    }\n            },\n            function (response) {});\n    } else {\n        // only considers scrolling positions when the web page is not video\n        endTime = new Date().getTime();\n        if (endTime - startTime > LONG_ENOUGH_MS) {\n            chrome.runtime.sendMessage({\n                    \"url\": currentUrl,\n                    \"stay\": {\n                        \"position\": lastPosition,\n                        \"duration\": endTime - startTime,\n                        \"time\": [new Date()]\n                    }\n                },\n                function (response) {});\n        }\n    }\n};\n\ndocument.addEventListener('copy', saveCopiedText);\ndocument.addEventListener('mouseup', saveHighlightedText);\nwindow.addEventListener('scroll', scrollHandler);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvanMvY29udGVudC5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9qcy9jb250ZW50LmpzPzRmYWMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNpcGhvblRvb2xzIGZyb20gJ3NpcGhvbi10b29scydcbmltcG9ydCB7U25pcHBldFNlbGVjdG9yLCBTbmlwcGV0fSBmcm9tIFwic2lwaG9uLXRvb2xzXCJcblxubGV0IGJsdWVQcm9ncmVzc0JhciA9IGA8ZGl2IGNsYXNzPVwieXRwLXBsYXktcHJvZ3Jlc3MgeXRwLXN3YXRjaC1iYWNrZ3JvdW5kLWNvbG9yIGJsdWVQcm9ncmVzc1wiPjwvZGl2PmA7XG5yZXF1aXJlKFwiYXJyaXZlXCIpO1xuaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcblxubGV0IHZpZGVvT2JqLCB2aWRlb0R1cmF0aW9uLCBxdWVyeSwgdmlkZW9Vcmw7XG5sZXQgY3VycmVudFVybCA9IGRvY3VtZW50LmxvY2F0aW9uLmhyZWY7XG5sZXQgc3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5sZXQgZW5kVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xubGV0IGN1cnJlbnRQb3NpdGlvbixsYXN0UG9zaXRpb24sbGFzdFZpZGVvVGltZSwgbGFzdFZpZGVvU25pcHBldFN0YXJ0VGltZSA9IDA7XG5jb25zdCBMT05HX0VOT1VHSF9NUyA9IDgwMDA7XG5sZXQgZ2hvc3RFbGVtZW50LCBzdGFydFBvcywgc3RhcnRZO1xubGV0IF9jcHRyV2luZG93O1xubGV0IHJlY3Q7Ly9zY3JlZW4gc2hvdCByZWN0XG5TaXBob25Ub29scy5pbml0aWFsaXplU2VsZWN0b3JzKFtcbiAgICBTbmlwcGV0U2VsZWN0b3Ioe1xuICAgICAgICBvblRyaWdnZXI6IChjcHRyV2luZG93LCBlKSA9PiB7XG4gICAgICAgICAgICBfY3B0cldpbmRvdyA9IGNwdHJXaW5kb3c7XG4gICAgICAgICAgICByZWN0ID0gY3B0cldpbmRvdy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlY3QpO1xuICAgICAgICAgICAgbGV0IGFubm90YXRpb24gPSBuZXcgU25pcHBldChyZWN0KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGFubm90YXRpb24pO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInRlc3Qga2V5ZG93blwiKTsgXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywga2V5RG93bkhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG1vdXNlRG93bkhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgfSlcbl0pO1xuXG5TaXBob25Ub29scy5lbmFibGUoKTtcblxuLy8gc2V0VGltZW91dCgoKT0+e1xuLy8gICAgIF9jcHRyV2luZG93LnJlbW92ZSgpXG4vLyB9LCA1MDAwKVxuXG5mdW5jdGlvbiBpc1BsYXlpbmdZb3V0dWJlQWQoKXtcbiAgICByZXR1cm4gJChcIi55dHAtcGxheS1wcm9ncmVzc1wiKS5jc3MoXCJiYWNrZ3JvdW5kLWNvbG9yXCIpID09PSBcInJnYigyNTUsIDIwNCwgMClcIjtcbn1cblxuXG4vKipcbiAqIGhhbmRsZSBwcmVzc2luZyBlc2MgdG8gcXVpdCBzY3JlZW5zaG90XG4gKiBAcGFyYW0geyp9IGUgXG4gKi9cbmZ1bmN0aW9uIGtleURvd25IYW5kbGVyKGUpIHtcbiAgICBpZiAoIGUua2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiZXNjIHByZXNzZWRcIilcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgbW91c2VEb3duSGFuZGxlciwgZmFsc2UpO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywga2V5RG93bkhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgX2NwdHJXaW5kb3cucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChfY3B0cldpbmRvdylcblxuICAgICAgICAvLyBfY3B0cldpbmRvdy5yZW1vdmUoKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG5cblxuZnVuY3Rpb24gcmVtb3ZlTWFya2Vycygpe1xuICAgIGNvbnNvbGUubG9nKFwicmVtb3ZlIG1hcmtlcnMuLi5cIik7XG4gICAgJCgnZGl2Lnl0cC1wbGF5LXByb2dyZXNzLnl0cC1zd2F0Y2gtYmFja2dyb3VuZC1jb2xvcicpLnJlbW92ZSgnLmJsdWVQcm9ncmVzcycpO1xufVxuXG5cbmZ1bmN0aW9uIGlzQ29kZShlKXtcbiAgICBsZXQgY3VyID0gZS50YXJnZXQ7XG4gICAgd2hpbGUoY3VyLnRhZ05hbWUudG9Mb3dlckNhc2UoKSE9PVwiY29kZVwiICYmIChjdXI9Y3VyLnBhcmVudE5vZGUpIT09ZG9jdW1lbnQuYm9keSk7XG4gICAgLy9JZiB0aGUgaGlnaGVzdCBlbGVtZW50IHRyYWNrZWQgYnkgdGhlIGN1cnNvciBjYW4gYmUgYXNjcmliZWQgdG8gPGNvZGU+LlxuICAgIHJldHVybiBjdXIudGFnTmFtZS50b0xvd2VyQ2FzZSgpPT09XCJjb2RlXCI7XG59XG5cbmZ1bmN0aW9uIGZldGNoU2VjdGlvbklkKGUpe1xuICAgIGxldCBjdXIgPSBlP2UudGFyZ2V0Om51bGw7XG4gICAgaWYoY3VyKVxuICAgICAgICB3aGlsZSghY3VyLmhhc0F0dHJpYnV0ZShcImlkXCIpICYmIChjdXI9Y3VyLnBhcmVudE5vZGUpIT09ZG9jdW1lbnQuYm9keSk7XG4gICAgcmV0dXJuIGN1ciYmKGN1ci5nZXRBdHRyaWJ1dGUoXCJpZFwiKXx8bnVsbCk7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdEZpbGVOYW1lKGRhdGUpIHtcbiAgICBsZXQgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcbiAgICBsZXQgX2RheSA9IGRhdGUuZ2V0RGF0ZSgpO1xuICAgIGxldCBtb250aCA9IGRhdGUuZ2V0TW9udGgoKTtcbiAgICBsZXQgaG91cnMgPSBkYXRlLmdldEhvdXJzKCk7XG4gICAgbGV0IG1pbnV0ZXMgPSBkYXRlLmdldE1pbnV0ZXMoKTtcbiAgICBsZXQgbWlsbGlzZWNvbmRzID0gZGF0ZS5nZXRNaWxsaXNlY29uZHMoKTtcbiAgICBsZXQgYW1wbSA9IGhvdXJzID49IDEyID8gJ3BtJyA6ICdhbSc7XG4gICAgaG91cnMgPSBob3VycyAlIDEyO1xuICAgIGhvdXJzID0gaG91cnMgPyBob3VycyA6IDEyOyAvLyB0aGUgaG91ciAnMCcgc2hvdWxkIGJlICcxMidcbiAgICBtaW51dGVzID0gbWludXRlcyA8IDEwID8gJzAnKyBtaW51dGVzIDogbWludXRlcztcblxuICAgIHJldHVybiBcIlNjcmVlbiBTaG90IFwiICsgeWVhciArIFwiLVwiICtcbiAgICAgICAgKG1vbnRoICsgMSkgKyBcIi1cIiArIF9kYXkgKyBcIiBhdCBcIiArIGhvdXJzICsgJy4nICsgbWludXRlcyArICcuJyArIG1pbGxpc2Vjb25kcyArIFwiIFwiICsgYW1wbSArIFwiLnBuZ1wiO1xufVxuXG5cbmZ1bmN0aW9uIGdvVG9QYXN0UGFnZVNlY3Rpb24ocmVzcG9uc2UpIHtcbiAgICBjb25zb2xlLmxvZyhcInNjcm9sbGluZyB0byBcIiArIHJlc3BvbnNlKTtcbiAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgcmVzcG9uc2UpOy8vYXV0byBzY3JvbGwgZnVuY3Rpb25cbn1cblxuZnVuY3Rpb24gbG9hZE1hcmtlcnMoc3RhcnQsZW5kLGR1cmF0aW9uKSB7XG4gICAgY29uc29sZS5sb2coXCJsb2FkIG1hcmtlcnMuLi4uLlwiKTtcbiAgICBsZXQgJGJsdWVCYXIgPSAkKGJsdWVQcm9ncmVzc0Jhcik7XG4gICAgbGV0IHJhdGlvID0gZW5kIC8gZHVyYXRpb24gLSBzdGFydCAvIGR1cmF0aW9uLFxuICAgICAgICBwcm9wVmFsdWUgPSBgc2NhbGVYKCR7cmF0aW99KWA7XG4gICAgJGJsdWVCYXIuY3NzKCdsZWZ0JywgKChzdGFydCAvIGR1cmF0aW9uKSAqIDEwMCkgKyAnJScpO1xuICAgICRibHVlQmFyLmNzcygndHJhbnNmb3JtJywgcHJvcFZhbHVlKTtcbiAgICAkKCdkaXYueXRwLXBsYXktcHJvZ3Jlc3MueXRwLXN3YXRjaC1iYWNrZ3JvdW5kLWNvbG9yOm5vdCguYmx1ZVByb2dyZXNzKScpLmFmdGVyKCRibHVlQmFyKTtcbn1cblxuXG5mdW5jdGlvbiBtb3VzZVVwSGFuZGxlcihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgY29uc3QgZGlmZiA9IHt4OiBNYXRoLmFicyhwYXJzZUludChlLnBhZ2VYKS1wYXJzZUludChnaG9zdEVsZW1lbnQuc3R5bGUubGVmdCkpLFxuICAgICAgICB5OiBNYXRoLmFicyhwYXJzZUludChlLnBhZ2VZKS1wYXJzZUludChnaG9zdEVsZW1lbnQuc3R5bGUudG9wKSl9O1xuXG4gICAgLy93b3JraW5nIHdpdGggbmVnYXRpdmUgY29vcmRpbmF0ZXNcbiAgICBsZXQgX3cgPSBkaWZmLng7XG4gICAgbGV0IF9oID0gZGlmZi55O1xuICAgIGxldCBfeCA9IHN0YXJ0UG9zLng7XG4gICAgbGV0IF95ID0gc3RhcnRZO1xuXG4gICAgaWYocGFyc2VJbnQoZS5wYWdlWSkgPCBzdGFydFBvcy55KXtcbiAgICAgICAgLy90b3AgcmlnaHRcbiAgICAgICAgX2ggPSBNYXRoLmFicyhwYXJzZUludChlLnBhZ2VZKS1zdGFydFBvcy55KTtcbiAgICAgICAgX3kgLT0gX2g7XG4gICAgfVxuICAgIGlmKHBhcnNlSW50KGUucGFnZVgpIDwgc3RhcnRQb3MueCl7XG4gICAgICAgIC8vbGVmdCBib3R0b21cbiAgICAgICAgX3cgPSBNYXRoLmFicyhwYXJzZUludChlLnBhZ2VYKS1zdGFydFBvcy54KTtcbiAgICAgICAgX3ggLT0gX3c7XG4gICAgfVxuXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW91c2VNb3ZlSGFuZGxlciwgZmFsc2UpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtb3VzZVVwSGFuZGxlciwgZmFsc2UpO1xuXG4gICAgZ2hvc3RFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZ2hvc3RFbGVtZW50KTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBjb29yZHMgPSB7XG4gICAgICAgICAgICB3OiBfdyxcbiAgICAgICAgICAgIGg6IF9oLFxuICAgICAgICAgICAgeDogX3gsXG4gICAgICAgICAgICB5OiBfeVxuICAgICAgICB9O1xuICAgICAgICBlbmRTY3JlZW5zaG90KGNvb3JkcyxmYWxzZSk7XG4gICAgfSwgNTApO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xufVxuLy9xdWl0IHNjcmVlbiBzaG90XG4vLyBmdW5jdGlvbiBrZXlEb3duSGFuZGxlcihlKSB7XG4vLyAgICAgaWYgKCBlLmtleSA9PT0gJ0VzY2FwZScpIHtcbi8vICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuLy8gICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuLy8gICAgICAgICBlbmRTY3JlZW5zaG90KG51bGwsIHRydWUpO1xuLy8gICAgICAgICByZXR1cm4gZmFsc2U7XG4vLyAgICAgfVxuLy8gfVxuXG5cbi8qKlxuICpcbiAqIEBwYXJhbSBlXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gbW91c2VNb3ZlSGFuZGxlcihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgY29uc3QgZGlmZiA9IHt4OiBNYXRoLmFicyhwYXJzZUludChlLnBhZ2VYKS1wYXJzZUludChnaG9zdEVsZW1lbnQuc3R5bGUubGVmdCkpLFxuICAgICAgICB5OiBNYXRoLmFicyhwYXJzZUludChlLnBhZ2VZKS1wYXJzZUludChnaG9zdEVsZW1lbnQuc3R5bGUudG9wKSl9O1xuXG4gICAgZ2hvc3RFbGVtZW50LnN0eWxlLndpZHRoID0gZGlmZi54ICsgJ3B4JztcbiAgICBnaG9zdEVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gZGlmZi55ICsncHgnO1xuXG4gICAgLy9vcHBvc2l0ZSBkcmF3aW5nIGNhbnZhcyAobmVnYXRpdmUgY29vcmRzKVxuICAgIGlmKHBhcnNlSW50KGUucGFnZVkpIDwgc3RhcnRQb3MueSl7XG4gICAgICAgIGdob3N0RWxlbWVudC5zdHlsZS50b3AgPSBlLnBhZ2VZICsgJ3B4JztcbiAgICAgICAgZ2hvc3RFbGVtZW50LnN0eWxlLmhlaWdodCA9IE1hdGguYWJzKHBhcnNlSW50KGUucGFnZVkpLXN0YXJ0UG9zLnkpKydweCc7XG4gICAgfVxuICAgIGlmKHBhcnNlSW50KGUucGFnZVgpIDwgc3RhcnRQb3MueCl7XG4gICAgICAgIGdob3N0RWxlbWVudC5zdHlsZS5sZWZ0ID0gZS5wYWdlWCsncHgnO1xuICAgICAgICBnaG9zdEVsZW1lbnQuc3R5bGUud2lkdGggPSBNYXRoLmFicyhwYXJzZUludChlLnBhZ2VYKS1zdGFydFBvcy54KSsncHgnO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIGVcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBtb3VzZURvd25IYW5kbGVyKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAvLyBzdGFydFBvcyA9IHt4OiBlLnBhZ2VYLCB5OiBlLnBhZ2VZfTtcbiAgICAvLyBzdGFydFkgPSBlLnk7XG5cbiAgICAvLyBnaG9zdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAvLyBnaG9zdEVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZCA9ICdibHVlJztcbiAgICAvLyBnaG9zdEVsZW1lbnQuc3R5bGUub3BhY2l0eSA9ICcwLjEnO1xuICAgIC8vIGdob3N0RWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgLy8gZ2hvc3RFbGVtZW50LnN0eWxlLmxlZnQgPSBlLnBhZ2VYICsgJ3B4JztcbiAgICAvLyBnaG9zdEVsZW1lbnQuc3R5bGUudG9wID0gZS5wYWdlWSArICdweCc7XG4gICAgLy8gZ2hvc3RFbGVtZW50LnN0eWxlLndpZHRoID0gXCIwcHhcIjtcbiAgICAvLyBnaG9zdEVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gXCIwcHhcIjtcbiAgICAvLyBnaG9zdEVsZW1lbnQuc3R5bGUuekluZGV4ID0gXCIxMDAwMDAwXCI7XG4gICAgLy8gZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChnaG9zdEVsZW1lbnQpO1xuXG4gICAgLy8gZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW91c2VNb3ZlSGFuZGxlciwgZmFsc2UpO1xuICAgIC8vIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtb3VzZVVwSGFuZGxlciwgZmFsc2UpO1xuICAgIHZhciB4ID0gZS5wYWdlWDtcbiAgICB2YXIgeSA9IGUucGFnZVk7XG4gICAgdmFyIHcgPSBlLndpZHRoXG4gICAgdmFyIGggPSBlLmhlaWdodFxuXG4gICAgaWYgKCEoeCA8IHJlY3QueCAmJiB5IDwgcmVjdC55ICAmJiB3IDwgcmVjdC53aWR0aCAmJiBoIDwgcmVjdC5oZWlnaHQpKXtcbiAgICAgICAgLy8gbW91c2UgaXMgbm90IGluIHJlY3QuXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG1vdXNlRG93bkhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGtleURvd25IYW5kbGVyLCBmYWxzZSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwicmVtb3ZlIGZyb21lIGZpcnN0XCIpO1xuICAgICAgICBfY3B0cldpbmRvdy5yZW1vdmUoKVxuICAgIH1cblxuXG5cblxuXG5cblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBTYXZlIHBhcnQgb2YgcGFnZXMgd2l0aCBsb25nIHN0YXkuXG4gKi9cbmZ1bmN0aW9uIHNjcm9sbEhhbmRsZXIoKSB7XG4gICAgZW5kVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIGlmIChlbmRUaW1lIC0gc3RhcnRUaW1lID4gTE9OR19FTk9VR0hfTVMpIHtcbiAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgIFwidXJsXCI6IGN1cnJlbnRVcmwsXG4gICAgICAgICAgICAgICAgXCJzdGF5XCI6IHtcInBvc2l0aW9uXCI6IGxhc3RQb3NpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgXCJkdXJhdGlvblwiOiBlbmRUaW1lIC0gc3RhcnRUaW1lLFxuICAgICAgICAgICAgICAgICAgICBcInRpbWVcIjogW25ldyBEYXRlKCldfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChyZXNwb25zZSkge30pO1xuICAgIH1cbiAgICBsYXN0UG9zaXRpb24gPSB3aW5kb3cuc2Nyb2xsWSB8fCB3aW5kb3cucGFnZVlPZmZzZXRcbiAgICAgICAgfHwgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgKyAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AgfHwgMCk7XG4gICAgc3RhcnRUaW1lID0gZW5kVGltZTtcbn1cblxuLyoqXG4gKiBEYXRhIGZvcm1hdDpcbiAqIDxVcmxcbiAqICAgICAgICAgIGhpZ2hsaWdodDpcbiAqICAgICAgICAgIHRleHRcbiAqICAgICAgICAgIHNlY3Rpb25faWRcbiAqICAgICAgICAgIHBvc2l0aW9uXG4gKiAgICAgICAgICB0aW1lPlxuICovXG5mdW5jdGlvbiBzYXZlSGlnaGxpZ2h0ZWRUZXh0KGUpXG57XG4gICAgbGV0IGNvbnRlbnQgPSBleHRyYWN0U2VsZWN0ZWRUZXh0KCk7XG4gICAgaWYoY29udGVudCE9PSBcIlwiKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJjdXJyZW50VXJsOlwiICsgY3VycmVudFVybCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiY3VycmVudFBvc2l0aW9uOlwiICsgY3VycmVudFBvc2l0aW9uKTtcbiAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1widXJsXCI6IGN1cnJlbnRVcmwsXG4gICAgICAgICAgICAgICAgXCJoaWdobGlnaHRcIjpcbiAgICAgICAgICAgICAgICAgICAge1widGV4dFwiOiBjb250ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzZWN0aW9uX2lkXCI6IGZldGNoU2VjdGlvbklkKGUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwb3NpdGlvblwiOiBjdXJyZW50UG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRpbWVcIjogW25ldyBEYXRlKCldfX0sXG4gICAgICAgICAgICBmdW5jdGlvbihyZXNwb25zZSkge30pO1xuICAgIH1cbn1cblxuLyoqXG4gKiBEYXRhIGZvcm1hdDpcbiAqIDxVcmxcbiAqICAgICAgICAgIGNvcHk6XG4gKiAgICAgICAgICB0ZXh0XG4gKiAgICAgICAgICBzZWN0aW9uX2lkXG4gKiAgICAgICAgICBpc19jb2RlXG4gKiAgICAgICAgICBpc19pbWFnZV91cmxcbiAqICAgICAgICAgIHRpbWU+XG4gKi9cbmZ1bmN0aW9uIHNhdmVDb3BpZWRUZXh0KGUpIHtcblxuICAgIGxldCBjb250ZW50ID0gZXh0cmFjdFNlbGVjdGVkVGV4dCgpO1xuICAgIGlmKGNvbnRlbnQhPT0gXCJcIil7XG4gICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHtcInVybFwiOiBjdXJyZW50VXJsLFxuICAgICAgICAgICAgICAgIFwiY29weVwiOiB7XCJ0ZXh0XCI6IGNvbnRlbnQsXG4gICAgICAgICAgICAgICAgICAgIFwic2VjdGlvbl9pZFwiOiBmZXRjaFNlY3Rpb25JZChlKSxcbiAgICAgICAgICAgICAgICAgICAgXCJpc19jb2RlXCIgOiAgaXNDb2RlKGUpLFxuICAgICAgICAgICAgICAgICAgICAvL1wiaXNfaW1hZ2VfdXJsXCI6IGlzSW1hZ2VVcmwoY29udGVudCksXG4gICAgICAgICAgICAgICAgICAgIFwidGltZVwiOiBbbmV3IERhdGUoKV19fSxcbiAgICAgICAgICAgIGZ1bmN0aW9uKHJlc3BvbnNlKSB7fSk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKFwiU2VuZGluZyFcIik7XG59XG5cbi8qKlxuICogRXh0cmFjdCBzZWxlY3RlZCB0ZXh0LiBSZXR1cm5zIFwiXCIgaWYgbm8gdGV4dCBzZWxlY3RlZC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGV4dHJhY3RTZWxlY3RlZFRleHQoKVxue1xuICAgIGxldCBzZWwgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XG4gICAgaWYgKHNlbCkge1xuICAgICAgICByZXR1cm4gc2VsLnRvU3RyaW5nKCk7XG4gICAgfVxufVxuXG5cbi8qKlxuICogTGlzdGVuIHNuaXBwZXQgZGF0YSBvbmNlIGEgdmlkZW8gZWxlbWVudCBpcyBjcmVhdGVkXG4gKiBEYXRhIGZvcm1hdDpcbiAqIDxVcmxcbiAqICAgICAgICAgIHNuaXBwZXQ6XG4gKiAgICAgICAgICBzdGFydF90aW1lXG4gKiAgICAgICAgICBlbmRfdGltZVxuICogICAgICAgICAgdGltZVxuICogIGNvbnRhaW5zX3ZpZGVvXG4gKiAgdmlkZW9fZHVyYXRpb24+XG4gKi9cbmRvY3VtZW50LmFycml2ZSgndmlkZW8nLCBmdW5jdGlvbiAodikge1xuICAgIHZpZGVvT2JqID0gdjtcbiAgICB2aWRlb09iai5vbnRpbWV1cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghaXNQbGF5aW5nWW91dHViZUFkKCkpIHtcbiAgICAgICAgICAgIGlmICghaXNOYU4odmlkZW9PYmouZHVyYXRpb24pKSB7XG4gICAgICAgICAgICAgICAgdmlkZW9EdXJhdGlvbiA9IHZpZGVvT2JqLmR1cmF0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXMgYSBiaWcgZ2FwIGJldHdlZW4gdGhlIGN1cnJlbnQgcGxheSB0aW1lIGFuZCB0aGUgbGFzdCBwbGF5IHRpbWUsXG4gICAgICAgICAgICAvLyB0aGUgdXNlciBoYXMgc2tpcHBlZC9yZXdpbmQgdGhlIHZpZGVvXG4gICAgICAgICAgICBpZiAoTWF0aC5hYnModmlkZW9PYmouY3VycmVudFRpbWUgLSBsYXN0VmlkZW9UaW1lKSA+PSAxMCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic25pcHBldDpcIiArIGxhc3RWaWRlb1NuaXBwZXRTdGFydFRpbWUgKyBcIiAtLS0gIFwiICsgbGFzdFZpZGVvVGltZSk7XG4gICAgICAgICAgICAgICAgaWYgKGxhc3RWaWRlb1RpbWUgLSBsYXN0VmlkZW9TbmlwcGV0U3RhcnRUaW1lID4gMykge1xuICAgICAgICAgICAgICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ1cmxcIjogdmlkZW9VcmwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ2aWRlb19zbmlwcGV0XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RhcnRfdGltZVwiOiBsYXN0VmlkZW9TbmlwcGV0U3RhcnRUaW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlbmRfdGltZVwiOiBsYXN0VmlkZW9UaW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkdXJhdGlvblwiOiB2aWRlb0R1cmF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsYXN0VmlkZW9TbmlwcGV0U3RhcnRUaW1lID0gdmlkZW9PYmouY3VycmVudFRpbWU7XG4gICAgICAgICAgICAgICAgLy9UT0RPOiBoYW5kbGUgcmV3aW5kIGV2ZW50LlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGFzdFZpZGVvVGltZSA9IHZpZGVvT2JqLmN1cnJlbnRUaW1lO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZpZGVvT2JqLm9ucGF1c2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwicGF1c2VkXCIpO1xuICAgIH07XG5cbiAgICB2aWRlb09iai5vbmVuZGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcImVuZGVkXCIpO1xuICAgIH07XG59KTtcblxuXG5mdW5jdGlvbiBzdGFydFNjcmVlbnNob3QoKSB7XG4gICAgY29uc29sZS5sb2coJ3N0YXJ0IHNjcmVlbnNob3QnKTtcbiAgICAvL2NoYW5nZSBjdXJzb3JcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmN1cnNvciA9ICdjcm9zc2hhaXInO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG1vdXNlRG93bkhhbmRsZXIsIGZhbHNlKTtcbiAgICAvL2xpc3RlbmVyIGZvciBxdWl0aW5nIHNjcmVlbnNob3RcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywga2V5RG93bkhhbmRsZXIsIGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gZW5kU2NyZWVuc2hvdChjb29yZHMsIHF1aXQpIHtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBtb3VzZURvd25IYW5kbGVyLCBmYWxzZSk7XG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5jdXJzb3IgPSAnZGVmYXVsdCc7XG5cbiAgICBpZihxdWl0KXtcbiAgICAgICAgLy91c2VyIHByZXNzZWQgRVNDIHF1aXQgc2NyZWVuc2hvdC4gbm90IHNlbmRpbmcgYW55IGluZm9ybWF0aW9uLlxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3VzZU1vdmVIYW5kbGVyLCBmYWxzZSk7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtb3VzZVVwSGFuZGxlciwgZmFsc2UpO1xuXG4gICAgICAgIGdob3N0RWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGdob3N0RWxlbWVudCk7XG4gICAgfVxuICAgIGVsc2V7XG5cbiAgICAgICAgY29uc29sZS5sb2coJ3NlbmRpbmcgbWVzc2FnZSB3aXRoIHNjcmVlbnNob290Jyk7XG4gICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHtcInVybFwiOiBjdXJyZW50VXJsLFxuICAgICAgICAgICAgICAgIFwic2NyZWVuc2hvdFwiOntjb29yZGluYXRlczpjb29yZHMsIGZpbGVuYW1lOiBmb3JtYXRGaWxlTmFtZShuZXcgRGF0ZSgpKSwgdGltZTogbmV3IERhdGUoKX19LFxuICAgICAgICAgICAgZnVuY3Rpb24ocmVzcG9uc2UpIHt9KTtcblxuICAgIH1cblxufVxuXG5cbi8vIExpc3RlbmluZyB1cmwgY2hhbmdlcyBmb3IgdGhlIGN1cnJlbnQgdGFiLlxuY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKCAobWVzc2FnZSwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcbiAgICBjdXJyZW50VXJsPW1lc3NhZ2UudXJsO1xuICAgIGlmIChtZXNzYWdlLnR5cGUgPT09IFwibmV3X3VybFwiKXtcbiAgICAgICAgbGV0IHZpZGVvUmVzcG9uc2U9bWVzc2FnZS52aWRlbztcbiAgICAgICAgbGV0IHN0YXlSZXNwb25zZT1tZXNzYWdlLnBvc2l0aW9uO1xuICAgICAgICAvL2lmIGhhcyBjb2RlICxkb24ndCBnbyBwYWdlIHNlY3Rpb247XG4gICAgICAgIGlmKCFjdXJyZW50VXJsLmluY2x1ZGVzKFwiI1wiKSl7XG4gICAgICAgICAgICBnb1RvUGFzdFBhZ2VTZWN0aW9uKHN0YXlSZXNwb25zZSk7XG4gICAgICAgIH1cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5ldyB1cmw6XCIsIG1lc3NhZ2UudXJsKTtcbiAgICAgICAgICAgIHZpZGVvVXJsID0gbWVzc2FnZS51cmw7XG4gICAgICAgICAgICBxdWVyeSA9IG1lc3NhZ2UucXVlcnk7XG4gICAgICAgICAgICAvLyB0byBrbm93IFVybCBoYXMgYWxyZWFkeSBjaGFuZ2VkXG4gICAgICAgICAgICBpZiAodmlkZW9VcmwgPT09IGN1cnJlbnRVcmwpIHtcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFVybC5pbmNsdWRlcyhcInlvdXR1YmUuY29tXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZU1hcmtlcnMoKTtcbiAgICAgICAgICAgICAgICAgICAgbG9hZE1hcmtlcnModmlkZW9SZXNwb25zZS5zdGFydF90aW1lLHZpZGVvUmVzcG9uc2UuZW5kX3RpbWUsdmlkZW9SZXNwb25zZS5kdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCAyMDAwKTtcbiAgICB9XG4gICAgZWxzZSBpZiAobWVzc2FnZS50eXBlID09PSBcInN0YXJ0X3NjcmVlbnNob3RzXCIpe1xuICAgICAgICBzdGFydFNjcmVlbnNob3QoKTtcbiAgICB9XG59KTtcblxuXG4vLyBXaGVuIHRoZSB3ZWIgcGFnZSBpcyBhYm91dCB0byBiZSB1bmxvYWRlZC5cbndpbmRvdy5vbmJlZm9yZXVubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoY3VycmVudFVybC5pbmNsdWRlcyhcInlvdXR1YmUuY29tXCIpKSB7XG4gICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICBcInVybFwiOiB2aWRlb1VybCxcbiAgICAgICAgICAgICAgICBcInZpZGVvX3NuaXBwZXRcIjpcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdGFydF90aW1lXCI6IGxhc3RWaWRlb1NuaXBwZXRTdGFydFRpbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImVuZF90aW1lXCI6IGxhc3RWaWRlb1RpbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImR1cmF0aW9uXCI6IHZpZGVvRHVyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChyZXNwb25zZSkge30pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIG9ubHkgY29uc2lkZXJzIHNjcm9sbGluZyBwb3NpdGlvbnMgd2hlbiB0aGUgd2ViIHBhZ2UgaXMgbm90IHZpZGVvXG4gICAgICAgIGVuZFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgaWYgKGVuZFRpbWUgLSBzdGFydFRpbWUgPiBMT05HX0VOT1VHSF9NUykge1xuICAgICAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICBcInVybFwiOiBjdXJyZW50VXJsLFxuICAgICAgICAgICAgICAgICAgICBcInN0YXlcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJwb3NpdGlvblwiOiBsYXN0UG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBcImR1cmF0aW9uXCI6IGVuZFRpbWUgLSBzdGFydFRpbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRpbWVcIjogW25ldyBEYXRlKCldXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXNwb25zZSkge30pO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY29weScsIHNhdmVDb3BpZWRUZXh0KTtcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBzYXZlSGlnaGxpZ2h0ZWRUZXh0KTtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBzY3JvbGxIYW5kbGVyKTtcbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Iiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/js/content.js\n");

/***/ })

})