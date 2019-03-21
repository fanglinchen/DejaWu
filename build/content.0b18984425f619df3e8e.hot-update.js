webpackHotUpdate("content",{

/***/ "./src/js/content.js":
/*!***************************!*\
  !*** ./src/js/content.js ***!
  \***************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var siphon_tools__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! siphon-tools */ \"./node_modules/siphon-tools/src/index.js\");\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jquery */ \"./node_modules/jquery/dist/jquery.js\");\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_1__);\n\n\n\nlet blueProgressBar = `<div class=\"ytp-play-progress ytp-swatch-background-color blueProgress\"></div>`;\n__webpack_require__(/*! arrive */ \"./node_modules/arrive/src/arrive.js\");\n\n\nlet videoObj, videoDuration, query, videoUrl;\nlet currentUrl = document.location.href;\nlet startTime = new Date().getTime();\nlet endTime = new Date().getTime();\nlet currentPosition,lastPosition,lastVideoTime, lastVideoSnippetStartTime = 0;\nconst LONG_ENOUGH_MS = 8000;\nlet ghostElement, startPos, startY;\nlet _cptrWindow;\nlet rect;//screen shot rect\nsiphon_tools__WEBPACK_IMPORTED_MODULE_0__[\"default\"].initializeSelectors([\n    Object(siphon_tools__WEBPACK_IMPORTED_MODULE_0__[\"SnippetSelector\"])({\n        onTrigger: (cptrWindow, e) => {\n            _cptrWindow = cptrWindow;\n            rect = cptrWindow.getBoundingClientRect();\n            console.log(rect);\n            let annotation = new siphon_tools__WEBPACK_IMPORTED_MODULE_0__[\"Snippet\"](rect);\n            console.log(annotation);\n\n            console.log(\"test keydown\"); \n            document.addEventListener('keydown', keyDownHandler, false);\n            document.addEventListener('mousedown', mouseDownHandler, false);\n            \n        }\n    })\n]);\n\nsiphon_tools__WEBPACK_IMPORTED_MODULE_0__[\"default\"].enable();\n\n// setTimeout(()=>{\n//     _cptrWindow.remove()\n// }, 5000)\n\nfunction isPlayingYoutubeAd(){\n    return jquery__WEBPACK_IMPORTED_MODULE_1___default()(\".ytp-play-progress\").css(\"background-color\") === \"rgb(255, 204, 0)\";\n}\n\n\n/**\n * handle pressing esc to quit screenshot\n * @param {*} e \n */\nfunction keyDownHandler(e) {\n    if ( e.key === 'Escape') {\n        e.preventDefault();\n        e.stopPropagation();\n        console.log(\"esc pressed\")\n        document.removeEventListener('mousedown', mouseDownHandler, false);\n        document.removeEventListener('keydown', keyDownHandler, false);\n        _cptrWindow.parentNode.removeChild(_cptrWindow)\n\n        // _cptrWindow.remove()\n        return false;\n    }\n}\n\n\n\nfunction removeMarkers(){\n    console.log(\"remove markers...\");\n    jquery__WEBPACK_IMPORTED_MODULE_1___default()('div.ytp-play-progress.ytp-swatch-background-color').remove('.blueProgress');\n}\n\n\nfunction isCode(e){\n    let cur = e.target;\n    while(cur.tagName.toLowerCase()!==\"code\" && (cur=cur.parentNode)!==document.body);\n    //If the highest element tracked by the cursor can be ascribed to <code>.\n    return cur.tagName.toLowerCase()===\"code\";\n}\n\nfunction fetchSectionId(e){\n    let cur = e?e.target:null;\n    if(cur)\n        while(!cur.hasAttribute(\"id\") && (cur=cur.parentNode)!==document.body);\n    return cur&&(cur.getAttribute(\"id\")||null);\n}\n\nfunction formatFileName(date) {\n    let year = date.getFullYear();\n    let _day = date.getDate();\n    let month = date.getMonth();\n    let hours = date.getHours();\n    let minutes = date.getMinutes();\n    let milliseconds = date.getMilliseconds();\n    let ampm = hours >= 12 ? 'pm' : 'am';\n    hours = hours % 12;\n    hours = hours ? hours : 12; // the hour '0' should be '12'\n    minutes = minutes < 10 ? '0'+ minutes : minutes;\n\n    return \"Screen Shot \" + year + \"-\" +\n        (month + 1) + \"-\" + _day + \" at \" + hours + '.' + minutes + '.' + milliseconds + \" \" + ampm + \".png\";\n}\n\n\nfunction goToPastPageSection(response) {\n    console.log(\"scrolling to \" + response);\n    window.scrollTo(0, response);//auto scroll function\n}\n\nfunction loadMarkers(start,end,duration) {\n    console.log(\"load markers.....\");\n    let $blueBar = jquery__WEBPACK_IMPORTED_MODULE_1___default()(blueProgressBar);\n    let ratio = end / duration - start / duration,\n        propValue = `scaleX(${ratio})`;\n    $blueBar.css('left', ((start / duration) * 100) + '%');\n    $blueBar.css('transform', propValue);\n    jquery__WEBPACK_IMPORTED_MODULE_1___default()('div.ytp-play-progress.ytp-swatch-background-color:not(.blueProgress)').after($blueBar);\n}\n\n\nfunction mouseUpHandler(e) {\n    e.preventDefault();\n\n    const diff = {x: Math.abs(parseInt(e.pageX)-parseInt(ghostElement.style.left)),\n        y: Math.abs(parseInt(e.pageY)-parseInt(ghostElement.style.top))};\n\n    //working with negative coordinates\n    let _w = diff.x;\n    let _h = diff.y;\n    let _x = startPos.x;\n    let _y = startY;\n\n    if(parseInt(e.pageY) < startPos.y){\n        //top right\n        _h = Math.abs(parseInt(e.pageY)-startPos.y);\n        _y -= _h;\n    }\n    if(parseInt(e.pageX) < startPos.x){\n        //left bottom\n        _w = Math.abs(parseInt(e.pageX)-startPos.x);\n        _x -= _w;\n    }\n\n    document.removeEventListener('mousemove', mouseMoveHandler, false);\n    document.removeEventListener('mouseup', mouseUpHandler, false);\n\n    ghostElement.parentNode.removeChild(ghostElement);\n    setTimeout(function() {\n        const coords = {\n            w: _w,\n            h: _h,\n            x: _x,\n            y: _y\n        };\n        endScreenshot(coords,false);\n    }, 50);\n\n    return false;\n}\n//quit screen shot\n// function keyDownHandler(e) {\n//     if ( e.key === 'Escape') {\n//         e.preventDefault();\n//         e.stopPropagation();\n//         endScreenshot(null, true);\n//         return false;\n//     }\n// }\n\n\n/**\n *\n * @param e\n * @returns {boolean}\n */\nfunction mouseMoveHandler(e) {\n    e.preventDefault();\n\n    const diff = {x: Math.abs(parseInt(e.pageX)-parseInt(ghostElement.style.left)),\n        y: Math.abs(parseInt(e.pageY)-parseInt(ghostElement.style.top))};\n\n    ghostElement.style.width = diff.x + 'px';\n    ghostElement.style.height = diff.y +'px';\n\n    //opposite drawing canvas (negative coords)\n    if(parseInt(e.pageY) < startPos.y){\n        ghostElement.style.top = e.pageY + 'px';\n        ghostElement.style.height = Math.abs(parseInt(e.pageY)-startPos.y)+'px';\n    }\n    if(parseInt(e.pageX) < startPos.x){\n        ghostElement.style.left = e.pageX+'px';\n        ghostElement.style.width = Math.abs(parseInt(e.pageX)-startPos.x)+'px';\n    }\n\n    return false;\n}\n\n/**\n *\n * @param e\n * @returns {boolean}\n */\nfunction mouseDownHandler(e) {\n    e.preventDefault();\n\n    // startPos = {x: e.pageX, y: e.pageY};\n    // startY = e.y;\n\n    // ghostElement = document.createElement('div');\n    // ghostElement.style.background = 'blue';\n    // ghostElement.style.opacity = '0.1';\n    // ghostElement.style.position = 'absolute';\n    // ghostElement.style.left = e.pageX + 'px';\n    // ghostElement.style.top = e.pageY + 'px';\n    // ghostElement.style.width = \"0px\";\n    // ghostElement.style.height = \"0px\";\n    // ghostElement.style.zIndex = \"1000000\";\n    // document.body.appendChild(ghostElement);\n\n    // document.addEventListener('mousemove', mouseMoveHandler, false);\n    // document.addEventListener('mouseup', mouseUpHandler, false);\n    var x = e.pageX;\n    var y = e.pageY;\n    var w = e.width\n    var h = e.height\n\n    if ((x > rect.x && y > rect.y)){\n        document.removeEventListener('mousedown', mouseDownHandler, false);\n        document.removeEventListener('keydown', keyDownHandler, false);\n        console();\n        _cptrWindow.remove()\n    }\n\n    if(w > rect.width){\n        document.removeEventListener('mousedown', mouseDownHandler, false);\n        document.removeEventListener('keydown', keyDownHandler, false);\n        _cptrWindow.remove()\n\n    }\n\n\n\n\n\n    return false;\n}\n\n/**\n * Save part of pages with long stay.\n */\nfunction scrollHandler() {\n    endTime = new Date().getTime();\n    if (endTime - startTime > LONG_ENOUGH_MS) {\n        chrome.runtime.sendMessage({\n                \"url\": currentUrl,\n                \"stay\": {\"position\": lastPosition,\n                    \"duration\": endTime - startTime,\n                    \"time\": [new Date()]}\n            },\n            function (response) {});\n    }\n    lastPosition = window.scrollY || window.pageYOffset\n        || document.body.scrollTop + (document.documentElement && document.documentElement.scrollTop || 0);\n    startTime = endTime;\n}\n\n/**\n * Data format:\n * <Url\n *          highlight:\n *          text\n *          section_id\n *          position\n *          time>\n */\nfunction saveHighlightedText(e)\n{\n    let content = extractSelectedText();\n    if(content!== \"\"){\n        console.log(\"currentUrl:\" + currentUrl);\n        console.log(\"currentPosition:\" + currentPosition);\n        chrome.runtime.sendMessage({\"url\": currentUrl,\n                \"highlight\":\n                    {\"text\": content,\n                        \"section_id\": fetchSectionId(e),\n                        \"position\": currentPosition,\n                        \"time\": [new Date()]}},\n            function(response) {});\n    }\n}\n\n/**\n * Data format:\n * <Url\n *          copy:\n *          text\n *          section_id\n *          is_code\n *          is_image_url\n *          time>\n */\nfunction saveCopiedText(e) {\n\n    let content = extractSelectedText();\n    if(content!== \"\"){\n        chrome.runtime.sendMessage({\"url\": currentUrl,\n                \"copy\": {\"text\": content,\n                    \"section_id\": fetchSectionId(e),\n                    \"is_code\" :  isCode(e),\n                    //\"is_image_url\": isImageUrl(content),\n                    \"time\": [new Date()]}},\n            function(response) {});\n    }\n    console.log(\"Sending!\");\n}\n\n/**\n * Extract selected text. Returns \"\" if no text selected.\n * @returns {string}\n */\nfunction extractSelectedText()\n{\n    let sel = window.getSelection();\n    if (sel) {\n        return sel.toString();\n    }\n}\n\n\n/**\n * Listen snippet data once a video element is created\n * Data format:\n * <Url\n *          snippet:\n *          start_time\n *          end_time\n *          time\n *  contains_video\n *  video_duration>\n */\ndocument.arrive('video', function (v) {\n    videoObj = v;\n    videoObj.ontimeupdate = function () {\n        if (!isPlayingYoutubeAd()) {\n            if (!isNaN(videoObj.duration)) {\n                videoDuration = videoObj.duration;\n            }\n            // if there is a big gap between the current play time and the last play time,\n            // the user has skipped/rewind the video\n            if (Math.abs(videoObj.currentTime - lastVideoTime) >= 10) {\n                console.log(\"snippet:\" + lastVideoSnippetStartTime + \" ---  \" + lastVideoTime);\n                if (lastVideoTime - lastVideoSnippetStartTime > 3) {\n                    chrome.runtime.sendMessage({\n                            \"url\": videoUrl,\n                            \"video_snippet\":\n                                {\n                                    \"start_time\": lastVideoSnippetStartTime,\n                                    \"end_time\": lastVideoTime,\n                                    \"duration\": videoDuration\n                                }\n                        },\n                        function (response) {\n                        });\n                }\n                lastVideoSnippetStartTime = videoObj.currentTime;\n                //TODO: handle rewind event.\n            }\n            lastVideoTime = videoObj.currentTime;\n        }\n    };\n\n    videoObj.onpause = function () {\n        console.log(\"paused\");\n    };\n\n    videoObj.onended = function () {\n        console.log(\"ended\");\n    };\n});\n\n\nfunction startScreenshot() {\n    console.log('start screenshot');\n    //change cursor\n    document.body.style.cursor = 'crosshair';\n    document.addEventListener('mousedown', mouseDownHandler, false);\n    //listener for quiting screenshot\n    document.addEventListener('keydown', keyDownHandler, false);\n}\n\nfunction endScreenshot(coords, quit) {\n    document.removeEventListener('mousedown', mouseDownHandler, false);\n    document.body.style.cursor = 'default';\n\n    if(quit){\n        //user pressed ESC quit screenshot. not sending any information.\n        document.removeEventListener('mousemove', mouseMoveHandler, false);\n        document.removeEventListener('mouseup', mouseUpHandler, false);\n\n        ghostElement.parentNode.removeChild(ghostElement);\n    }\n    else{\n\n        console.log('sending message with screenshoot');\n        chrome.runtime.sendMessage({\"url\": currentUrl,\n                \"screenshot\":{coordinates:coords, filename: formatFileName(new Date()), time: new Date()}},\n            function(response) {});\n\n    }\n\n}\n\n\n// Listening url changes for the current tab.\nchrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {\n    currentUrl=message.url;\n    if (message.type === \"new_url\"){\n        let videoResponse=message.video;\n        let stayResponse=message.position;\n        //if has code ,don't go page section;\n        if(!currentUrl.includes(\"#\")){\n            goToPastPageSection(stayResponse);\n        }\n        setTimeout(function () {\n            console.log(\"new url:\", message.url);\n            videoUrl = message.url;\n            query = message.query;\n            // to know Url has already changed\n            if (videoUrl === currentUrl) {\n                if (currentUrl.includes(\"youtube.com\")) {\n                    removeMarkers();\n                    loadMarkers(videoResponse.start_time,videoResponse.end_time,videoResponse.duration);\n                }\n            }\n        }, 2000);\n    }\n    else if (message.type === \"start_screenshots\"){\n        startScreenshot();\n    }\n});\n\n\n// When the web page is about to be unloaded.\nwindow.onbeforeunload = function () {\n    if (currentUrl.includes(\"youtube.com\")) {\n        chrome.runtime.sendMessage({\n                \"url\": videoUrl,\n                \"video_snippet\":\n                    {\n                        \"start_time\": lastVideoSnippetStartTime,\n                        \"end_time\": lastVideoTime,\n                        \"duration\": videoDuration\n                    }\n            },\n            function (response) {});\n    } else {\n        // only considers scrolling positions when the web page is not video\n        endTime = new Date().getTime();\n        if (endTime - startTime > LONG_ENOUGH_MS) {\n            chrome.runtime.sendMessage({\n                    \"url\": currentUrl,\n                    \"stay\": {\n                        \"position\": lastPosition,\n                        \"duration\": endTime - startTime,\n                        \"time\": [new Date()]\n                    }\n                },\n                function (response) {});\n        }\n    }\n};\n\ndocument.addEventListener('copy', saveCopiedText);\ndocument.addEventListener('mouseup', saveHighlightedText);\nwindow.addEventListener('scroll', scrollHandler);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvanMvY29udGVudC5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9qcy9jb250ZW50LmpzPzRmYWMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNpcGhvblRvb2xzIGZyb20gJ3NpcGhvbi10b29scydcbmltcG9ydCB7U25pcHBldFNlbGVjdG9yLCBTbmlwcGV0fSBmcm9tIFwic2lwaG9uLXRvb2xzXCJcblxubGV0IGJsdWVQcm9ncmVzc0JhciA9IGA8ZGl2IGNsYXNzPVwieXRwLXBsYXktcHJvZ3Jlc3MgeXRwLXN3YXRjaC1iYWNrZ3JvdW5kLWNvbG9yIGJsdWVQcm9ncmVzc1wiPjwvZGl2PmA7XG5yZXF1aXJlKFwiYXJyaXZlXCIpO1xuaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcblxubGV0IHZpZGVvT2JqLCB2aWRlb0R1cmF0aW9uLCBxdWVyeSwgdmlkZW9Vcmw7XG5sZXQgY3VycmVudFVybCA9IGRvY3VtZW50LmxvY2F0aW9uLmhyZWY7XG5sZXQgc3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5sZXQgZW5kVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xubGV0IGN1cnJlbnRQb3NpdGlvbixsYXN0UG9zaXRpb24sbGFzdFZpZGVvVGltZSwgbGFzdFZpZGVvU25pcHBldFN0YXJ0VGltZSA9IDA7XG5jb25zdCBMT05HX0VOT1VHSF9NUyA9IDgwMDA7XG5sZXQgZ2hvc3RFbGVtZW50LCBzdGFydFBvcywgc3RhcnRZO1xubGV0IF9jcHRyV2luZG93O1xubGV0IHJlY3Q7Ly9zY3JlZW4gc2hvdCByZWN0XG5TaXBob25Ub29scy5pbml0aWFsaXplU2VsZWN0b3JzKFtcbiAgICBTbmlwcGV0U2VsZWN0b3Ioe1xuICAgICAgICBvblRyaWdnZXI6IChjcHRyV2luZG93LCBlKSA9PiB7XG4gICAgICAgICAgICBfY3B0cldpbmRvdyA9IGNwdHJXaW5kb3c7XG4gICAgICAgICAgICByZWN0ID0gY3B0cldpbmRvdy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlY3QpO1xuICAgICAgICAgICAgbGV0IGFubm90YXRpb24gPSBuZXcgU25pcHBldChyZWN0KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGFubm90YXRpb24pO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInRlc3Qga2V5ZG93blwiKTsgXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywga2V5RG93bkhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG1vdXNlRG93bkhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgfSlcbl0pO1xuXG5TaXBob25Ub29scy5lbmFibGUoKTtcblxuLy8gc2V0VGltZW91dCgoKT0+e1xuLy8gICAgIF9jcHRyV2luZG93LnJlbW92ZSgpXG4vLyB9LCA1MDAwKVxuXG5mdW5jdGlvbiBpc1BsYXlpbmdZb3V0dWJlQWQoKXtcbiAgICByZXR1cm4gJChcIi55dHAtcGxheS1wcm9ncmVzc1wiKS5jc3MoXCJiYWNrZ3JvdW5kLWNvbG9yXCIpID09PSBcInJnYigyNTUsIDIwNCwgMClcIjtcbn1cblxuXG4vKipcbiAqIGhhbmRsZSBwcmVzc2luZyBlc2MgdG8gcXVpdCBzY3JlZW5zaG90XG4gKiBAcGFyYW0geyp9IGUgXG4gKi9cbmZ1bmN0aW9uIGtleURvd25IYW5kbGVyKGUpIHtcbiAgICBpZiAoIGUua2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiZXNjIHByZXNzZWRcIilcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgbW91c2VEb3duSGFuZGxlciwgZmFsc2UpO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywga2V5RG93bkhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgX2NwdHJXaW5kb3cucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChfY3B0cldpbmRvdylcblxuICAgICAgICAvLyBfY3B0cldpbmRvdy5yZW1vdmUoKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG5cblxuZnVuY3Rpb24gcmVtb3ZlTWFya2Vycygpe1xuICAgIGNvbnNvbGUubG9nKFwicmVtb3ZlIG1hcmtlcnMuLi5cIik7XG4gICAgJCgnZGl2Lnl0cC1wbGF5LXByb2dyZXNzLnl0cC1zd2F0Y2gtYmFja2dyb3VuZC1jb2xvcicpLnJlbW92ZSgnLmJsdWVQcm9ncmVzcycpO1xufVxuXG5cbmZ1bmN0aW9uIGlzQ29kZShlKXtcbiAgICBsZXQgY3VyID0gZS50YXJnZXQ7XG4gICAgd2hpbGUoY3VyLnRhZ05hbWUudG9Mb3dlckNhc2UoKSE9PVwiY29kZVwiICYmIChjdXI9Y3VyLnBhcmVudE5vZGUpIT09ZG9jdW1lbnQuYm9keSk7XG4gICAgLy9JZiB0aGUgaGlnaGVzdCBlbGVtZW50IHRyYWNrZWQgYnkgdGhlIGN1cnNvciBjYW4gYmUgYXNjcmliZWQgdG8gPGNvZGU+LlxuICAgIHJldHVybiBjdXIudGFnTmFtZS50b0xvd2VyQ2FzZSgpPT09XCJjb2RlXCI7XG59XG5cbmZ1bmN0aW9uIGZldGNoU2VjdGlvbklkKGUpe1xuICAgIGxldCBjdXIgPSBlP2UudGFyZ2V0Om51bGw7XG4gICAgaWYoY3VyKVxuICAgICAgICB3aGlsZSghY3VyLmhhc0F0dHJpYnV0ZShcImlkXCIpICYmIChjdXI9Y3VyLnBhcmVudE5vZGUpIT09ZG9jdW1lbnQuYm9keSk7XG4gICAgcmV0dXJuIGN1ciYmKGN1ci5nZXRBdHRyaWJ1dGUoXCJpZFwiKXx8bnVsbCk7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdEZpbGVOYW1lKGRhdGUpIHtcbiAgICBsZXQgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcbiAgICBsZXQgX2RheSA9IGRhdGUuZ2V0RGF0ZSgpO1xuICAgIGxldCBtb250aCA9IGRhdGUuZ2V0TW9udGgoKTtcbiAgICBsZXQgaG91cnMgPSBkYXRlLmdldEhvdXJzKCk7XG4gICAgbGV0IG1pbnV0ZXMgPSBkYXRlLmdldE1pbnV0ZXMoKTtcbiAgICBsZXQgbWlsbGlzZWNvbmRzID0gZGF0ZS5nZXRNaWxsaXNlY29uZHMoKTtcbiAgICBsZXQgYW1wbSA9IGhvdXJzID49IDEyID8gJ3BtJyA6ICdhbSc7XG4gICAgaG91cnMgPSBob3VycyAlIDEyO1xuICAgIGhvdXJzID0gaG91cnMgPyBob3VycyA6IDEyOyAvLyB0aGUgaG91ciAnMCcgc2hvdWxkIGJlICcxMidcbiAgICBtaW51dGVzID0gbWludXRlcyA8IDEwID8gJzAnKyBtaW51dGVzIDogbWludXRlcztcblxuICAgIHJldHVybiBcIlNjcmVlbiBTaG90IFwiICsgeWVhciArIFwiLVwiICtcbiAgICAgICAgKG1vbnRoICsgMSkgKyBcIi1cIiArIF9kYXkgKyBcIiBhdCBcIiArIGhvdXJzICsgJy4nICsgbWludXRlcyArICcuJyArIG1pbGxpc2Vjb25kcyArIFwiIFwiICsgYW1wbSArIFwiLnBuZ1wiO1xufVxuXG5cbmZ1bmN0aW9uIGdvVG9QYXN0UGFnZVNlY3Rpb24ocmVzcG9uc2UpIHtcbiAgICBjb25zb2xlLmxvZyhcInNjcm9sbGluZyB0byBcIiArIHJlc3BvbnNlKTtcbiAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgcmVzcG9uc2UpOy8vYXV0byBzY3JvbGwgZnVuY3Rpb25cbn1cblxuZnVuY3Rpb24gbG9hZE1hcmtlcnMoc3RhcnQsZW5kLGR1cmF0aW9uKSB7XG4gICAgY29uc29sZS5sb2coXCJsb2FkIG1hcmtlcnMuLi4uLlwiKTtcbiAgICBsZXQgJGJsdWVCYXIgPSAkKGJsdWVQcm9ncmVzc0Jhcik7XG4gICAgbGV0IHJhdGlvID0gZW5kIC8gZHVyYXRpb24gLSBzdGFydCAvIGR1cmF0aW9uLFxuICAgICAgICBwcm9wVmFsdWUgPSBgc2NhbGVYKCR7cmF0aW99KWA7XG4gICAgJGJsdWVCYXIuY3NzKCdsZWZ0JywgKChzdGFydCAvIGR1cmF0aW9uKSAqIDEwMCkgKyAnJScpO1xuICAgICRibHVlQmFyLmNzcygndHJhbnNmb3JtJywgcHJvcFZhbHVlKTtcbiAgICAkKCdkaXYueXRwLXBsYXktcHJvZ3Jlc3MueXRwLXN3YXRjaC1iYWNrZ3JvdW5kLWNvbG9yOm5vdCguYmx1ZVByb2dyZXNzKScpLmFmdGVyKCRibHVlQmFyKTtcbn1cblxuXG5mdW5jdGlvbiBtb3VzZVVwSGFuZGxlcihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgY29uc3QgZGlmZiA9IHt4OiBNYXRoLmFicyhwYXJzZUludChlLnBhZ2VYKS1wYXJzZUludChnaG9zdEVsZW1lbnQuc3R5bGUubGVmdCkpLFxuICAgICAgICB5OiBNYXRoLmFicyhwYXJzZUludChlLnBhZ2VZKS1wYXJzZUludChnaG9zdEVsZW1lbnQuc3R5bGUudG9wKSl9O1xuXG4gICAgLy93b3JraW5nIHdpdGggbmVnYXRpdmUgY29vcmRpbmF0ZXNcbiAgICBsZXQgX3cgPSBkaWZmLng7XG4gICAgbGV0IF9oID0gZGlmZi55O1xuICAgIGxldCBfeCA9IHN0YXJ0UG9zLng7XG4gICAgbGV0IF95ID0gc3RhcnRZO1xuXG4gICAgaWYocGFyc2VJbnQoZS5wYWdlWSkgPCBzdGFydFBvcy55KXtcbiAgICAgICAgLy90b3AgcmlnaHRcbiAgICAgICAgX2ggPSBNYXRoLmFicyhwYXJzZUludChlLnBhZ2VZKS1zdGFydFBvcy55KTtcbiAgICAgICAgX3kgLT0gX2g7XG4gICAgfVxuICAgIGlmKHBhcnNlSW50KGUucGFnZVgpIDwgc3RhcnRQb3MueCl7XG4gICAgICAgIC8vbGVmdCBib3R0b21cbiAgICAgICAgX3cgPSBNYXRoLmFicyhwYXJzZUludChlLnBhZ2VYKS1zdGFydFBvcy54KTtcbiAgICAgICAgX3ggLT0gX3c7XG4gICAgfVxuXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW91c2VNb3ZlSGFuZGxlciwgZmFsc2UpO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtb3VzZVVwSGFuZGxlciwgZmFsc2UpO1xuXG4gICAgZ2hvc3RFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZ2hvc3RFbGVtZW50KTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBjb29yZHMgPSB7XG4gICAgICAgICAgICB3OiBfdyxcbiAgICAgICAgICAgIGg6IF9oLFxuICAgICAgICAgICAgeDogX3gsXG4gICAgICAgICAgICB5OiBfeVxuICAgICAgICB9O1xuICAgICAgICBlbmRTY3JlZW5zaG90KGNvb3JkcyxmYWxzZSk7XG4gICAgfSwgNTApO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xufVxuLy9xdWl0IHNjcmVlbiBzaG90XG4vLyBmdW5jdGlvbiBrZXlEb3duSGFuZGxlcihlKSB7XG4vLyAgICAgaWYgKCBlLmtleSA9PT0gJ0VzY2FwZScpIHtcbi8vICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuLy8gICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuLy8gICAgICAgICBlbmRTY3JlZW5zaG90KG51bGwsIHRydWUpO1xuLy8gICAgICAgICByZXR1cm4gZmFsc2U7XG4vLyAgICAgfVxuLy8gfVxuXG5cbi8qKlxuICpcbiAqIEBwYXJhbSBlXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gbW91c2VNb3ZlSGFuZGxlcihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgY29uc3QgZGlmZiA9IHt4OiBNYXRoLmFicyhwYXJzZUludChlLnBhZ2VYKS1wYXJzZUludChnaG9zdEVsZW1lbnQuc3R5bGUubGVmdCkpLFxuICAgICAgICB5OiBNYXRoLmFicyhwYXJzZUludChlLnBhZ2VZKS1wYXJzZUludChnaG9zdEVsZW1lbnQuc3R5bGUudG9wKSl9O1xuXG4gICAgZ2hvc3RFbGVtZW50LnN0eWxlLndpZHRoID0gZGlmZi54ICsgJ3B4JztcbiAgICBnaG9zdEVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gZGlmZi55ICsncHgnO1xuXG4gICAgLy9vcHBvc2l0ZSBkcmF3aW5nIGNhbnZhcyAobmVnYXRpdmUgY29vcmRzKVxuICAgIGlmKHBhcnNlSW50KGUucGFnZVkpIDwgc3RhcnRQb3MueSl7XG4gICAgICAgIGdob3N0RWxlbWVudC5zdHlsZS50b3AgPSBlLnBhZ2VZICsgJ3B4JztcbiAgICAgICAgZ2hvc3RFbGVtZW50LnN0eWxlLmhlaWdodCA9IE1hdGguYWJzKHBhcnNlSW50KGUucGFnZVkpLXN0YXJ0UG9zLnkpKydweCc7XG4gICAgfVxuICAgIGlmKHBhcnNlSW50KGUucGFnZVgpIDwgc3RhcnRQb3MueCl7XG4gICAgICAgIGdob3N0RWxlbWVudC5zdHlsZS5sZWZ0ID0gZS5wYWdlWCsncHgnO1xuICAgICAgICBnaG9zdEVsZW1lbnQuc3R5bGUud2lkdGggPSBNYXRoLmFicyhwYXJzZUludChlLnBhZ2VYKS1zdGFydFBvcy54KSsncHgnO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIGVcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBtb3VzZURvd25IYW5kbGVyKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAvLyBzdGFydFBvcyA9IHt4OiBlLnBhZ2VYLCB5OiBlLnBhZ2VZfTtcbiAgICAvLyBzdGFydFkgPSBlLnk7XG5cbiAgICAvLyBnaG9zdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAvLyBnaG9zdEVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZCA9ICdibHVlJztcbiAgICAvLyBnaG9zdEVsZW1lbnQuc3R5bGUub3BhY2l0eSA9ICcwLjEnO1xuICAgIC8vIGdob3N0RWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgLy8gZ2hvc3RFbGVtZW50LnN0eWxlLmxlZnQgPSBlLnBhZ2VYICsgJ3B4JztcbiAgICAvLyBnaG9zdEVsZW1lbnQuc3R5bGUudG9wID0gZS5wYWdlWSArICdweCc7XG4gICAgLy8gZ2hvc3RFbGVtZW50LnN0eWxlLndpZHRoID0gXCIwcHhcIjtcbiAgICAvLyBnaG9zdEVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gXCIwcHhcIjtcbiAgICAvLyBnaG9zdEVsZW1lbnQuc3R5bGUuekluZGV4ID0gXCIxMDAwMDAwXCI7XG4gICAgLy8gZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChnaG9zdEVsZW1lbnQpO1xuXG4gICAgLy8gZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW91c2VNb3ZlSGFuZGxlciwgZmFsc2UpO1xuICAgIC8vIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtb3VzZVVwSGFuZGxlciwgZmFsc2UpO1xuICAgIHZhciB4ID0gZS5wYWdlWDtcbiAgICB2YXIgeSA9IGUucGFnZVk7XG4gICAgdmFyIHcgPSBlLndpZHRoXG4gICAgdmFyIGggPSBlLmhlaWdodFxuXG4gICAgaWYgKCh4ID4gcmVjdC54ICYmIHkgPiByZWN0LnkpKXtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgbW91c2VEb3duSGFuZGxlciwgZmFsc2UpO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywga2V5RG93bkhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgY29uc29sZSgpO1xuICAgICAgICBfY3B0cldpbmRvdy5yZW1vdmUoKVxuICAgIH1cblxuICAgIGlmKHcgPiByZWN0LndpZHRoKXtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgbW91c2VEb3duSGFuZGxlciwgZmFsc2UpO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywga2V5RG93bkhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgX2NwdHJXaW5kb3cucmVtb3ZlKClcblxuICAgIH1cblxuXG5cblxuXG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIFNhdmUgcGFydCBvZiBwYWdlcyB3aXRoIGxvbmcgc3RheS5cbiAqL1xuZnVuY3Rpb24gc2Nyb2xsSGFuZGxlcigpIHtcbiAgICBlbmRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgaWYgKGVuZFRpbWUgLSBzdGFydFRpbWUgPiBMT05HX0VOT1VHSF9NUykge1xuICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgXCJ1cmxcIjogY3VycmVudFVybCxcbiAgICAgICAgICAgICAgICBcInN0YXlcIjoge1wicG9zaXRpb25cIjogbGFzdFBvc2l0aW9uLFxuICAgICAgICAgICAgICAgICAgICBcImR1cmF0aW9uXCI6IGVuZFRpbWUgLSBzdGFydFRpbWUsXG4gICAgICAgICAgICAgICAgICAgIFwidGltZVwiOiBbbmV3IERhdGUoKV19XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3BvbnNlKSB7fSk7XG4gICAgfVxuICAgIGxhc3RQb3NpdGlvbiA9IHdpbmRvdy5zY3JvbGxZIHx8IHdpbmRvdy5wYWdlWU9mZnNldFxuICAgICAgICB8fCBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCArIChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCB8fCAwKTtcbiAgICBzdGFydFRpbWUgPSBlbmRUaW1lO1xufVxuXG4vKipcbiAqIERhdGEgZm9ybWF0OlxuICogPFVybFxuICogICAgICAgICAgaGlnaGxpZ2h0OlxuICogICAgICAgICAgdGV4dFxuICogICAgICAgICAgc2VjdGlvbl9pZFxuICogICAgICAgICAgcG9zaXRpb25cbiAqICAgICAgICAgIHRpbWU+XG4gKi9cbmZ1bmN0aW9uIHNhdmVIaWdobGlnaHRlZFRleHQoZSlcbntcbiAgICBsZXQgY29udGVudCA9IGV4dHJhY3RTZWxlY3RlZFRleHQoKTtcbiAgICBpZihjb250ZW50IT09IFwiXCIpe1xuICAgICAgICBjb25zb2xlLmxvZyhcImN1cnJlbnRVcmw6XCIgKyBjdXJyZW50VXJsKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJjdXJyZW50UG9zaXRpb246XCIgKyBjdXJyZW50UG9zaXRpb24pO1xuICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7XCJ1cmxcIjogY3VycmVudFVybCxcbiAgICAgICAgICAgICAgICBcImhpZ2hsaWdodFwiOlxuICAgICAgICAgICAgICAgICAgICB7XCJ0ZXh0XCI6IGNvbnRlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNlY3Rpb25faWRcIjogZmV0Y2hTZWN0aW9uSWQoZSksXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBvc2l0aW9uXCI6IGN1cnJlbnRQb3NpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGltZVwiOiBbbmV3IERhdGUoKV19fSxcbiAgICAgICAgICAgIGZ1bmN0aW9uKHJlc3BvbnNlKSB7fSk7XG4gICAgfVxufVxuXG4vKipcbiAqIERhdGEgZm9ybWF0OlxuICogPFVybFxuICogICAgICAgICAgY29weTpcbiAqICAgICAgICAgIHRleHRcbiAqICAgICAgICAgIHNlY3Rpb25faWRcbiAqICAgICAgICAgIGlzX2NvZGVcbiAqICAgICAgICAgIGlzX2ltYWdlX3VybFxuICogICAgICAgICAgdGltZT5cbiAqL1xuZnVuY3Rpb24gc2F2ZUNvcGllZFRleHQoZSkge1xuXG4gICAgbGV0IGNvbnRlbnQgPSBleHRyYWN0U2VsZWN0ZWRUZXh0KCk7XG4gICAgaWYoY29udGVudCE9PSBcIlwiKXtcbiAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1widXJsXCI6IGN1cnJlbnRVcmwsXG4gICAgICAgICAgICAgICAgXCJjb3B5XCI6IHtcInRleHRcIjogY29udGVudCxcbiAgICAgICAgICAgICAgICAgICAgXCJzZWN0aW9uX2lkXCI6IGZldGNoU2VjdGlvbklkKGUpLFxuICAgICAgICAgICAgICAgICAgICBcImlzX2NvZGVcIiA6ICBpc0NvZGUoZSksXG4gICAgICAgICAgICAgICAgICAgIC8vXCJpc19pbWFnZV91cmxcIjogaXNJbWFnZVVybChjb250ZW50KSxcbiAgICAgICAgICAgICAgICAgICAgXCJ0aW1lXCI6IFtuZXcgRGF0ZSgpXX19LFxuICAgICAgICAgICAgZnVuY3Rpb24ocmVzcG9uc2UpIHt9KTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coXCJTZW5kaW5nIVwiKTtcbn1cblxuLyoqXG4gKiBFeHRyYWN0IHNlbGVjdGVkIHRleHQuIFJldHVybnMgXCJcIiBpZiBubyB0ZXh0IHNlbGVjdGVkLlxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZXh0cmFjdFNlbGVjdGVkVGV4dCgpXG57XG4gICAgbGV0IHNlbCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcbiAgICBpZiAoc2VsKSB7XG4gICAgICAgIHJldHVybiBzZWwudG9TdHJpbmcoKTtcbiAgICB9XG59XG5cblxuLyoqXG4gKiBMaXN0ZW4gc25pcHBldCBkYXRhIG9uY2UgYSB2aWRlbyBlbGVtZW50IGlzIGNyZWF0ZWRcbiAqIERhdGEgZm9ybWF0OlxuICogPFVybFxuICogICAgICAgICAgc25pcHBldDpcbiAqICAgICAgICAgIHN0YXJ0X3RpbWVcbiAqICAgICAgICAgIGVuZF90aW1lXG4gKiAgICAgICAgICB0aW1lXG4gKiAgY29udGFpbnNfdmlkZW9cbiAqICB2aWRlb19kdXJhdGlvbj5cbiAqL1xuZG9jdW1lbnQuYXJyaXZlKCd2aWRlbycsIGZ1bmN0aW9uICh2KSB7XG4gICAgdmlkZW9PYmogPSB2O1xuICAgIHZpZGVvT2JqLm9udGltZXVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCFpc1BsYXlpbmdZb3V0dWJlQWQoKSkge1xuICAgICAgICAgICAgaWYgKCFpc05hTih2aWRlb09iai5kdXJhdGlvbikpIHtcbiAgICAgICAgICAgICAgICB2aWRlb0R1cmF0aW9uID0gdmlkZW9PYmouZHVyYXRpb247XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZiB0aGVyZSBpcyBhIGJpZyBnYXAgYmV0d2VlbiB0aGUgY3VycmVudCBwbGF5IHRpbWUgYW5kIHRoZSBsYXN0IHBsYXkgdGltZSxcbiAgICAgICAgICAgIC8vIHRoZSB1c2VyIGhhcyBza2lwcGVkL3Jld2luZCB0aGUgdmlkZW9cbiAgICAgICAgICAgIGlmIChNYXRoLmFicyh2aWRlb09iai5jdXJyZW50VGltZSAtIGxhc3RWaWRlb1RpbWUpID49IDEwKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzbmlwcGV0OlwiICsgbGFzdFZpZGVvU25pcHBldFN0YXJ0VGltZSArIFwiIC0tLSAgXCIgKyBsYXN0VmlkZW9UaW1lKTtcbiAgICAgICAgICAgICAgICBpZiAobGFzdFZpZGVvVGltZSAtIGxhc3RWaWRlb1NuaXBwZXRTdGFydFRpbWUgPiAzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInVybFwiOiB2aWRlb1VybCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInZpZGVvX3NuaXBwZXRcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdGFydF90aW1lXCI6IGxhc3RWaWRlb1NuaXBwZXRTdGFydFRpbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImVuZF90aW1lXCI6IGxhc3RWaWRlb1RpbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImR1cmF0aW9uXCI6IHZpZGVvRHVyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxhc3RWaWRlb1NuaXBwZXRTdGFydFRpbWUgPSB2aWRlb09iai5jdXJyZW50VGltZTtcbiAgICAgICAgICAgICAgICAvL1RPRE86IGhhbmRsZSByZXdpbmQgZXZlbnQuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsYXN0VmlkZW9UaW1lID0gdmlkZW9PYmouY3VycmVudFRpbWU7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdmlkZW9PYmoub25wYXVzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJwYXVzZWRcIik7XG4gICAgfTtcblxuICAgIHZpZGVvT2JqLm9uZW5kZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiZW5kZWRcIik7XG4gICAgfTtcbn0pO1xuXG5cbmZ1bmN0aW9uIHN0YXJ0U2NyZWVuc2hvdCgpIHtcbiAgICBjb25zb2xlLmxvZygnc3RhcnQgc2NyZWVuc2hvdCcpO1xuICAgIC8vY2hhbmdlIGN1cnNvclxuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuY3Vyc29yID0gJ2Nyb3NzaGFpcic7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgbW91c2VEb3duSGFuZGxlciwgZmFsc2UpO1xuICAgIC8vbGlzdGVuZXIgZm9yIHF1aXRpbmcgc2NyZWVuc2hvdFxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBrZXlEb3duSGFuZGxlciwgZmFsc2UpO1xufVxuXG5mdW5jdGlvbiBlbmRTY3JlZW5zaG90KGNvb3JkcywgcXVpdCkge1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG1vdXNlRG93bkhhbmRsZXIsIGZhbHNlKTtcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmN1cnNvciA9ICdkZWZhdWx0JztcblxuICAgIGlmKHF1aXQpe1xuICAgICAgICAvL3VzZXIgcHJlc3NlZCBFU0MgcXVpdCBzY3JlZW5zaG90LiBub3Qgc2VuZGluZyBhbnkgaW5mb3JtYXRpb24uXG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdXNlTW92ZUhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG1vdXNlVXBIYW5kbGVyLCBmYWxzZSk7XG5cbiAgICAgICAgZ2hvc3RFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZ2hvc3RFbGVtZW50KTtcbiAgICB9XG4gICAgZWxzZXtcblxuICAgICAgICBjb25zb2xlLmxvZygnc2VuZGluZyBtZXNzYWdlIHdpdGggc2NyZWVuc2hvb3QnKTtcbiAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1widXJsXCI6IGN1cnJlbnRVcmwsXG4gICAgICAgICAgICAgICAgXCJzY3JlZW5zaG90XCI6e2Nvb3JkaW5hdGVzOmNvb3JkcywgZmlsZW5hbWU6IGZvcm1hdEZpbGVOYW1lKG5ldyBEYXRlKCkpLCB0aW1lOiBuZXcgRGF0ZSgpfX0sXG4gICAgICAgICAgICBmdW5jdGlvbihyZXNwb25zZSkge30pO1xuXG4gICAgfVxuXG59XG5cblxuLy8gTGlzdGVuaW5nIHVybCBjaGFuZ2VzIGZvciB0aGUgY3VycmVudCB0YWIuXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoIChtZXNzYWdlLCBzZW5kZXIsIHNlbmRSZXNwb25zZSkgPT4ge1xuICAgIGN1cnJlbnRVcmw9bWVzc2FnZS51cmw7XG4gICAgaWYgKG1lc3NhZ2UudHlwZSA9PT0gXCJuZXdfdXJsXCIpe1xuICAgICAgICBsZXQgdmlkZW9SZXNwb25zZT1tZXNzYWdlLnZpZGVvO1xuICAgICAgICBsZXQgc3RheVJlc3BvbnNlPW1lc3NhZ2UucG9zaXRpb247XG4gICAgICAgIC8vaWYgaGFzIGNvZGUgLGRvbid0IGdvIHBhZ2Ugc2VjdGlvbjtcbiAgICAgICAgaWYoIWN1cnJlbnRVcmwuaW5jbHVkZXMoXCIjXCIpKXtcbiAgICAgICAgICAgIGdvVG9QYXN0UGFnZVNlY3Rpb24oc3RheVJlc3BvbnNlKTtcbiAgICAgICAgfVxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibmV3IHVybDpcIiwgbWVzc2FnZS51cmwpO1xuICAgICAgICAgICAgdmlkZW9VcmwgPSBtZXNzYWdlLnVybDtcbiAgICAgICAgICAgIHF1ZXJ5ID0gbWVzc2FnZS5xdWVyeTtcbiAgICAgICAgICAgIC8vIHRvIGtub3cgVXJsIGhhcyBhbHJlYWR5IGNoYW5nZWRcbiAgICAgICAgICAgIGlmICh2aWRlb1VybCA9PT0gY3VycmVudFVybCkge1xuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50VXJsLmluY2x1ZGVzKFwieW91dHViZS5jb21cIikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlTWFya2VycygpO1xuICAgICAgICAgICAgICAgICAgICBsb2FkTWFya2Vycyh2aWRlb1Jlc3BvbnNlLnN0YXJ0X3RpbWUsdmlkZW9SZXNwb25zZS5lbmRfdGltZSx2aWRlb1Jlc3BvbnNlLmR1cmF0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDIwMDApO1xuICAgIH1cbiAgICBlbHNlIGlmIChtZXNzYWdlLnR5cGUgPT09IFwic3RhcnRfc2NyZWVuc2hvdHNcIil7XG4gICAgICAgIHN0YXJ0U2NyZWVuc2hvdCgpO1xuICAgIH1cbn0pO1xuXG5cbi8vIFdoZW4gdGhlIHdlYiBwYWdlIGlzIGFib3V0IHRvIGJlIHVubG9hZGVkLlxud2luZG93Lm9uYmVmb3JldW5sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChjdXJyZW50VXJsLmluY2x1ZGVzKFwieW91dHViZS5jb21cIikpIHtcbiAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgIFwidXJsXCI6IHZpZGVvVXJsLFxuICAgICAgICAgICAgICAgIFwidmlkZW9fc25pcHBldFwiOlxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInN0YXJ0X3RpbWVcIjogbGFzdFZpZGVvU25pcHBldFN0YXJ0VGltZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZW5kX3RpbWVcIjogbGFzdFZpZGVvVGltZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZHVyYXRpb25cIjogdmlkZW9EdXJhdGlvblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3BvbnNlKSB7fSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gb25seSBjb25zaWRlcnMgc2Nyb2xsaW5nIHBvc2l0aW9ucyB3aGVuIHRoZSB3ZWIgcGFnZSBpcyBub3QgdmlkZW9cbiAgICAgICAgZW5kVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICBpZiAoZW5kVGltZSAtIHN0YXJ0VGltZSA+IExPTkdfRU5PVUdIX01TKSB7XG4gICAgICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgICAgIFwidXJsXCI6IGN1cnJlbnRVcmwsXG4gICAgICAgICAgICAgICAgICAgIFwic3RheVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInBvc2l0aW9uXCI6IGxhc3RQb3NpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZHVyYXRpb25cIjogZW5kVGltZSAtIHN0YXJ0VGltZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGltZVwiOiBbbmV3IERhdGUoKV1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3BvbnNlKSB7fSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjb3B5Jywgc2F2ZUNvcGllZFRleHQpO1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHNhdmVIaWdobGlnaHRlZFRleHQpO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHNjcm9sbEhhbmRsZXIpO1xuIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/js/content.js\n");

/***/ })

})