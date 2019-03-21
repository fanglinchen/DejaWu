webpackHotUpdate("content",{

/***/ "./src/js/content.js":
/*!***************************!*\
  !*** ./src/js/content.js ***!
  \***************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var siphon_tools__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! siphon-tools */ \"./node_modules/siphon-tools/src/index.js\");\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jquery */ \"./node_modules/jquery/dist/jquery.js\");\n/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_1__);\n\n\n\nlet blueProgressBar = `<div class=\"ytp-play-progress ytp-swatch-background-color blueProgress\"></div>`;\n__webpack_require__(/*! arrive */ \"./node_modules/arrive/src/arrive.js\");\n\n\nlet videoObj, videoDuration, query, videoUrl;\nlet currentUrl = document.location.href;\nlet startTime = new Date().getTime();\nlet endTime = new Date().getTime();\nlet currentPosition,lastPosition,lastVideoTime, lastVideoSnippetStartTime = 0;\nconst LONG_ENOUGH_MS = 8000;\nlet ghostElement, startPos, startY;\nlet _cptrWindow;\nsiphon_tools__WEBPACK_IMPORTED_MODULE_0__[\"default\"].initializeSelectors([\n    Object(siphon_tools__WEBPACK_IMPORTED_MODULE_0__[\"SnippetSelector\"])({\n        onTrigger: (cptrWindow, e) => {\n            _cptrWindow = cptrWindow;\n            let rect = cptrWindow.getBoundingClientRect();\n            console.log(rect);\n            let annotation = new siphon_tools__WEBPACK_IMPORTED_MODULE_0__[\"Snippet\"](rect);\n            console.log(annotation);\n\n            console.log(\"test keydown\"); \n            document.addEventListener('keydown', keyDownHandler, false);\n            \n        }\n    })\n]);\n\nsiphon_tools__WEBPACK_IMPORTED_MODULE_0__[\"default\"].enable();\n\n// setTimeout(()=>{\n//     _cptrWindow.remove()\n// }, 5000)\n\nfunction isPlayingYoutubeAd(){\n    return jquery__WEBPACK_IMPORTED_MODULE_1___default()(\".ytp-play-progress\").css(\"background-color\") === \"rgb(255, 204, 0)\";\n}\n\n\n/**\n * handle pressing esc to quit screenshot\n * @param {*} e \n */\nfunction keyDownHandler(e) {\n    if ( e.key === 'Escape') {\n        e.preventDefault();\n        e.stopPropagation();\n        console.log(\"esc pressed\")\n        _cptrWindow.remove()\n        \n        \n        return false;\n    }\n}\n\n\n\nfunction removeMarkers(){\n    console.log(\"remove markers...\");\n    jquery__WEBPACK_IMPORTED_MODULE_1___default()('div.ytp-play-progress.ytp-swatch-background-color').remove('.blueProgress');\n}\n\n\nfunction isCode(e){\n    let cur = e.target;\n    while(cur.tagName.toLowerCase()!==\"code\" && (cur=cur.parentNode)!==document.body);\n    //If the highest element tracked by the cursor can be ascribed to <code>.\n    return cur.tagName.toLowerCase()===\"code\";\n}\n\nfunction fetchSectionId(e){\n    let cur = e?e.target:null;\n    if(cur)\n        while(!cur.hasAttribute(\"id\") && (cur=cur.parentNode)!==document.body);\n    return cur&&(cur.getAttribute(\"id\")||null);\n}\n\nfunction formatFileName(date) {\n    let year = date.getFullYear();\n    let _day = date.getDate();\n    let month = date.getMonth();\n    let hours = date.getHours();\n    let minutes = date.getMinutes();\n    let milliseconds = date.getMilliseconds();\n    let ampm = hours >= 12 ? 'pm' : 'am';\n    hours = hours % 12;\n    hours = hours ? hours : 12; // the hour '0' should be '12'\n    minutes = minutes < 10 ? '0'+ minutes : minutes;\n\n    return \"Screen Shot \" + year + \"-\" +\n        (month + 1) + \"-\" + _day + \" at \" + hours + '.' + minutes + '.' + milliseconds + \" \" + ampm + \".png\";\n}\n\n\nfunction goToPastPageSection(response) {\n    console.log(\"scrolling to \" + response);\n    window.scrollTo(0, response);//auto scroll function\n}\n\nfunction loadMarkers(start,end,duration) {\n    console.log(\"load markers.....\");\n    let $blueBar = jquery__WEBPACK_IMPORTED_MODULE_1___default()(blueProgressBar);\n    let ratio = end / duration - start / duration,\n        propValue = `scaleX(${ratio})`;\n    $blueBar.css('left', ((start / duration) * 100) + '%');\n    $blueBar.css('transform', propValue);\n    jquery__WEBPACK_IMPORTED_MODULE_1___default()('div.ytp-play-progress.ytp-swatch-background-color:not(.blueProgress)').after($blueBar);\n}\n\n\nfunction mouseUpHandler(e) {\n    e.preventDefault();\n\n    const diff = {x: Math.abs(parseInt(e.pageX)-parseInt(ghostElement.style.left)),\n        y: Math.abs(parseInt(e.pageY)-parseInt(ghostElement.style.top))};\n\n    //working with negative coordinates\n    let _w = diff.x;\n    let _h = diff.y;\n    let _x = startPos.x;\n    let _y = startY;\n\n    if(parseInt(e.pageY) < startPos.y){\n        //top right\n        _h = Math.abs(parseInt(e.pageY)-startPos.y);\n        _y -= _h;\n    }\n    if(parseInt(e.pageX) < startPos.x){\n        //left bottom\n        _w = Math.abs(parseInt(e.pageX)-startPos.x);\n        _x -= _w;\n    }\n\n    document.removeEventListener('mousemove', mouseMoveHandler, false);\n    document.removeEventListener('mouseup', mouseUpHandler, false);\n\n    ghostElement.parentNode.removeChild(ghostElement);\n    setTimeout(function() {\n        const coords = {\n            w: _w,\n            h: _h,\n            x: _x,\n            y: _y\n        };\n        endScreenshot(coords,false);\n    }, 50);\n\n    return false;\n}\n//quit screen shot\n// function keyDownHandler(e) {\n//     if ( e.key === 'Escape') {\n//         e.preventDefault();\n//         e.stopPropagation();\n//         endScreenshot(null, true);\n//         return false;\n//     }\n// }\n\n\n/**\n *\n * @param e\n * @returns {boolean}\n */\nfunction mouseMoveHandler(e) {\n    e.preventDefault();\n\n    const diff = {x: Math.abs(parseInt(e.pageX)-parseInt(ghostElement.style.left)),\n        y: Math.abs(parseInt(e.pageY)-parseInt(ghostElement.style.top))};\n\n    ghostElement.style.width = diff.x + 'px';\n    ghostElement.style.height = diff.y +'px';\n\n    //opposite drawing canvas (negative coords)\n    if(parseInt(e.pageY) < startPos.y){\n        ghostElement.style.top = e.pageY + 'px';\n        ghostElement.style.height = Math.abs(parseInt(e.pageY)-startPos.y)+'px';\n    }\n    if(parseInt(e.pageX) < startPos.x){\n        ghostElement.style.left = e.pageX+'px';\n        ghostElement.style.width = Math.abs(parseInt(e.pageX)-startPos.x)+'px';\n    }\n\n    return false;\n}\n\n/**\n *\n * @param e\n * @returns {boolean}\n */\nfunction mouseDownHandler(e) {\n    e.preventDefault();\n\n    // startPos = {x: e.pageX, y: e.pageY};\n    // startY = e.y;\n\n    // ghostElement = document.createElement('div');\n    // ghostElement.style.background = 'blue';\n    // ghostElement.style.opacity = '0.1';\n    // ghostElement.style.position = 'absolute';\n    // ghostElement.style.left = e.pageX + 'px';\n    // ghostElement.style.top = e.pageY + 'px';\n    // ghostElement.style.width = \"0px\";\n    // ghostElement.style.height = \"0px\";\n    // ghostElement.style.zIndex = \"1000000\";\n    // document.body.appendChild(ghostElement);\n\n    // document.addEventListener('mousemove', mouseMoveHandler, false);\n    // document.addEventListener('mouseup', mouseUpHandler, false);\n    var x = e.pageX;\n    var y = e.pageY;\n\n    return false;\n}\n\n/**\n * Save part of pages with long stay.\n */\nfunction scrollHandler() {\n    endTime = new Date().getTime();\n    if (endTime - startTime > LONG_ENOUGH_MS) {\n        chrome.runtime.sendMessage({\n                \"url\": currentUrl,\n                \"stay\": {\"position\": lastPosition,\n                    \"duration\": endTime - startTime,\n                    \"time\": [new Date()]}\n            },\n            function (response) {});\n    }\n    lastPosition = window.scrollY || window.pageYOffset\n        || document.body.scrollTop + (document.documentElement && document.documentElement.scrollTop || 0);\n    startTime = endTime;\n}\n\n/**\n * Data format:\n * <Url\n *          highlight:\n *          text\n *          section_id\n *          position\n *          time>\n */\nfunction saveHighlightedText(e)\n{\n    let content = extractSelectedText();\n    if(content!== \"\"){\n        console.log(\"currentUrl:\" + currentUrl);\n        console.log(\"currentPosition:\" + currentPosition);\n        chrome.runtime.sendMessage({\"url\": currentUrl,\n                \"highlight\":\n                    {\"text\": content,\n                        \"section_id\": fetchSectionId(e),\n                        \"position\": currentPosition,\n                        \"time\": [new Date()]}},\n            function(response) {});\n    }\n}\n\n/**\n * Data format:\n * <Url\n *          copy:\n *          text\n *          section_id\n *          is_code\n *          is_image_url\n *          time>\n */\nfunction saveCopiedText(e) {\n\n    let content = extractSelectedText();\n    if(content!== \"\"){\n        chrome.runtime.sendMessage({\"url\": currentUrl,\n                \"copy\": {\"text\": content,\n                    \"section_id\": fetchSectionId(e),\n                    \"is_code\" :  isCode(e),\n                    //\"is_image_url\": isImageUrl(content),\n                    \"time\": [new Date()]}},\n            function(response) {});\n    }\n    console.log(\"Sending!\");\n}\n\n/**\n * Extract selected text. Returns \"\" if no text selected.\n * @returns {string}\n */\nfunction extractSelectedText()\n{\n    let sel = window.getSelection();\n    if (sel) {\n        return sel.toString();\n    }\n}\n\n\n/**\n * Listen snippet data once a video element is created\n * Data format:\n * <Url\n *          snippet:\n *          start_time\n *          end_time\n *          time\n *  contains_video\n *  video_duration>\n */\ndocument.arrive('video', function (v) {\n    videoObj = v;\n    videoObj.ontimeupdate = function () {\n        if (!isPlayingYoutubeAd()) {\n            if (!isNaN(videoObj.duration)) {\n                videoDuration = videoObj.duration;\n            }\n            // if there is a big gap between the current play time and the last play time,\n            // the user has skipped/rewind the video\n            if (Math.abs(videoObj.currentTime - lastVideoTime) >= 10) {\n                console.log(\"snippet:\" + lastVideoSnippetStartTime + \" ---  \" + lastVideoTime);\n                if (lastVideoTime - lastVideoSnippetStartTime > 3) {\n                    chrome.runtime.sendMessage({\n                            \"url\": videoUrl,\n                            \"video_snippet\":\n                                {\n                                    \"start_time\": lastVideoSnippetStartTime,\n                                    \"end_time\": lastVideoTime,\n                                    \"duration\": videoDuration\n                                }\n                        },\n                        function (response) {\n                        });\n                }\n                lastVideoSnippetStartTime = videoObj.currentTime;\n                //TODO: handle rewind event.\n            }\n            lastVideoTime = videoObj.currentTime;\n        }\n    };\n\n    videoObj.onpause = function () {\n        console.log(\"paused\");\n    };\n\n    videoObj.onended = function () {\n        console.log(\"ended\");\n    };\n});\n\n\nfunction startScreenshot() {\n    console.log('start screenshot');\n    //change cursor\n    document.body.style.cursor = 'crosshair';\n    document.addEventListener('mousedown', mouseDownHandler, false);\n    //listener for quiting screenshot\n    document.addEventListener('keydown', keyDownHandler, false);\n}\n\nfunction endScreenshot(coords, quit) {\n    document.removeEventListener('mousedown', mouseDownHandler, false);\n    document.body.style.cursor = 'default';\n\n    if(quit){\n        //user pressed ESC quit screenshot. not sending any information.\n        document.removeEventListener('mousemove', mouseMoveHandler, false);\n        document.removeEventListener('mouseup', mouseUpHandler, false);\n\n        ghostElement.parentNode.removeChild(ghostElement);\n    }\n    else{\n\n        console.log('sending message with screenshoot');\n        chrome.runtime.sendMessage({\"url\": currentUrl,\n                \"screenshot\":{coordinates:coords, filename: formatFileName(new Date()), time: new Date()}},\n            function(response) {});\n\n    }\n\n}\n\n\n// Listening url changes for the current tab.\nchrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {\n    currentUrl=message.url;\n    if (message.type === \"new_url\"){\n        let videoResponse=message.video;\n        let stayResponse=message.position;\n        //if has code ,don't go page section;\n        if(!currentUrl.includes(\"#\")){\n            goToPastPageSection(stayResponse);\n        }\n        setTimeout(function () {\n            console.log(\"new url:\", message.url);\n            videoUrl = message.url;\n            query = message.query;\n            // to know Url has already changed\n            if (videoUrl === currentUrl) {\n                if (currentUrl.includes(\"youtube.com\")) {\n                    removeMarkers();\n                    loadMarkers(videoResponse.start_time,videoResponse.end_time,videoResponse.duration);\n                }\n            }\n        }, 2000);\n    }\n    else if (message.type === \"start_screenshots\"){\n        startScreenshot();\n    }\n});\n\n\n// When the web page is about to be unloaded.\nwindow.onbeforeunload = function () {\n    if (currentUrl.includes(\"youtube.com\")) {\n        chrome.runtime.sendMessage({\n                \"url\": videoUrl,\n                \"video_snippet\":\n                    {\n                        \"start_time\": lastVideoSnippetStartTime,\n                        \"end_time\": lastVideoTime,\n                        \"duration\": videoDuration\n                    }\n            },\n            function (response) {});\n    } else {\n        // only considers scrolling positions when the web page is not video\n        endTime = new Date().getTime();\n        if (endTime - startTime > LONG_ENOUGH_MS) {\n            chrome.runtime.sendMessage({\n                    \"url\": currentUrl,\n                    \"stay\": {\n                        \"position\": lastPosition,\n                        \"duration\": endTime - startTime,\n                        \"time\": [new Date()]\n                    }\n                },\n                function (response) {});\n        }\n    }\n};\n\ndocument.addEventListener('copy', saveCopiedText);\ndocument.addEventListener('mouseup', saveHighlightedText);\nwindow.addEventListener('scroll', scrollHandler);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvanMvY29udGVudC5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9qcy9jb250ZW50LmpzPzRmYWMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNpcGhvblRvb2xzIGZyb20gJ3NpcGhvbi10b29scydcbmltcG9ydCB7U25pcHBldFNlbGVjdG9yLCBTbmlwcGV0fSBmcm9tIFwic2lwaG9uLXRvb2xzXCJcblxubGV0IGJsdWVQcm9ncmVzc0JhciA9IGA8ZGl2IGNsYXNzPVwieXRwLXBsYXktcHJvZ3Jlc3MgeXRwLXN3YXRjaC1iYWNrZ3JvdW5kLWNvbG9yIGJsdWVQcm9ncmVzc1wiPjwvZGl2PmA7XG5yZXF1aXJlKFwiYXJyaXZlXCIpO1xuaW1wb3J0ICQgZnJvbSAnanF1ZXJ5JztcblxubGV0IHZpZGVvT2JqLCB2aWRlb0R1cmF0aW9uLCBxdWVyeSwgdmlkZW9Vcmw7XG5sZXQgY3VycmVudFVybCA9IGRvY3VtZW50LmxvY2F0aW9uLmhyZWY7XG5sZXQgc3RhcnRUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5sZXQgZW5kVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xubGV0IGN1cnJlbnRQb3NpdGlvbixsYXN0UG9zaXRpb24sbGFzdFZpZGVvVGltZSwgbGFzdFZpZGVvU25pcHBldFN0YXJ0VGltZSA9IDA7XG5jb25zdCBMT05HX0VOT1VHSF9NUyA9IDgwMDA7XG5sZXQgZ2hvc3RFbGVtZW50LCBzdGFydFBvcywgc3RhcnRZO1xubGV0IF9jcHRyV2luZG93O1xuU2lwaG9uVG9vbHMuaW5pdGlhbGl6ZVNlbGVjdG9ycyhbXG4gICAgU25pcHBldFNlbGVjdG9yKHtcbiAgICAgICAgb25UcmlnZ2VyOiAoY3B0cldpbmRvdywgZSkgPT4ge1xuICAgICAgICAgICAgX2NwdHJXaW5kb3cgPSBjcHRyV2luZG93O1xuICAgICAgICAgICAgbGV0IHJlY3QgPSBjcHRyV2luZG93LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVjdCk7XG4gICAgICAgICAgICBsZXQgYW5ub3RhdGlvbiA9IG5ldyBTbmlwcGV0KHJlY3QpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coYW5ub3RhdGlvbik7XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidGVzdCBrZXlkb3duXCIpOyBcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBrZXlEb3duSGFuZGxlciwgZmFsc2UpO1xuICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICB9KVxuXSk7XG5cblNpcGhvblRvb2xzLmVuYWJsZSgpO1xuXG4vLyBzZXRUaW1lb3V0KCgpPT57XG4vLyAgICAgX2NwdHJXaW5kb3cucmVtb3ZlKClcbi8vIH0sIDUwMDApXG5cbmZ1bmN0aW9uIGlzUGxheWluZ1lvdXR1YmVBZCgpe1xuICAgIHJldHVybiAkKFwiLnl0cC1wbGF5LXByb2dyZXNzXCIpLmNzcyhcImJhY2tncm91bmQtY29sb3JcIikgPT09IFwicmdiKDI1NSwgMjA0LCAwKVwiO1xufVxuXG5cbi8qKlxuICogaGFuZGxlIHByZXNzaW5nIGVzYyB0byBxdWl0IHNjcmVlbnNob3RcbiAqIEBwYXJhbSB7Kn0gZSBcbiAqL1xuZnVuY3Rpb24ga2V5RG93bkhhbmRsZXIoZSkge1xuICAgIGlmICggZS5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJlc2MgcHJlc3NlZFwiKVxuICAgICAgICBfY3B0cldpbmRvdy5yZW1vdmUoKVxuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5cblxuXG5mdW5jdGlvbiByZW1vdmVNYXJrZXJzKCl7XG4gICAgY29uc29sZS5sb2coXCJyZW1vdmUgbWFya2Vycy4uLlwiKTtcbiAgICAkKCdkaXYueXRwLXBsYXktcHJvZ3Jlc3MueXRwLXN3YXRjaC1iYWNrZ3JvdW5kLWNvbG9yJykucmVtb3ZlKCcuYmx1ZVByb2dyZXNzJyk7XG59XG5cblxuZnVuY3Rpb24gaXNDb2RlKGUpe1xuICAgIGxldCBjdXIgPSBlLnRhcmdldDtcbiAgICB3aGlsZShjdXIudGFnTmFtZS50b0xvd2VyQ2FzZSgpIT09XCJjb2RlXCIgJiYgKGN1cj1jdXIucGFyZW50Tm9kZSkhPT1kb2N1bWVudC5ib2R5KTtcbiAgICAvL0lmIHRoZSBoaWdoZXN0IGVsZW1lbnQgdHJhY2tlZCBieSB0aGUgY3Vyc29yIGNhbiBiZSBhc2NyaWJlZCB0byA8Y29kZT4uXG4gICAgcmV0dXJuIGN1ci50YWdOYW1lLnRvTG93ZXJDYXNlKCk9PT1cImNvZGVcIjtcbn1cblxuZnVuY3Rpb24gZmV0Y2hTZWN0aW9uSWQoZSl7XG4gICAgbGV0IGN1ciA9IGU/ZS50YXJnZXQ6bnVsbDtcbiAgICBpZihjdXIpXG4gICAgICAgIHdoaWxlKCFjdXIuaGFzQXR0cmlidXRlKFwiaWRcIikgJiYgKGN1cj1jdXIucGFyZW50Tm9kZSkhPT1kb2N1bWVudC5ib2R5KTtcbiAgICByZXR1cm4gY3VyJiYoY3VyLmdldEF0dHJpYnV0ZShcImlkXCIpfHxudWxsKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0RmlsZU5hbWUoZGF0ZSkge1xuICAgIGxldCB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgIGxldCBfZGF5ID0gZGF0ZS5nZXREYXRlKCk7XG4gICAgbGV0IG1vbnRoID0gZGF0ZS5nZXRNb250aCgpO1xuICAgIGxldCBob3VycyA9IGRhdGUuZ2V0SG91cnMoKTtcbiAgICBsZXQgbWludXRlcyA9IGRhdGUuZ2V0TWludXRlcygpO1xuICAgIGxldCBtaWxsaXNlY29uZHMgPSBkYXRlLmdldE1pbGxpc2Vjb25kcygpO1xuICAgIGxldCBhbXBtID0gaG91cnMgPj0gMTIgPyAncG0nIDogJ2FtJztcbiAgICBob3VycyA9IGhvdXJzICUgMTI7XG4gICAgaG91cnMgPSBob3VycyA/IGhvdXJzIDogMTI7IC8vIHRoZSBob3VyICcwJyBzaG91bGQgYmUgJzEyJ1xuICAgIG1pbnV0ZXMgPSBtaW51dGVzIDwgMTAgPyAnMCcrIG1pbnV0ZXMgOiBtaW51dGVzO1xuXG4gICAgcmV0dXJuIFwiU2NyZWVuIFNob3QgXCIgKyB5ZWFyICsgXCItXCIgK1xuICAgICAgICAobW9udGggKyAxKSArIFwiLVwiICsgX2RheSArIFwiIGF0IFwiICsgaG91cnMgKyAnLicgKyBtaW51dGVzICsgJy4nICsgbWlsbGlzZWNvbmRzICsgXCIgXCIgKyBhbXBtICsgXCIucG5nXCI7XG59XG5cblxuZnVuY3Rpb24gZ29Ub1Bhc3RQYWdlU2VjdGlvbihyZXNwb25zZSkge1xuICAgIGNvbnNvbGUubG9nKFwic2Nyb2xsaW5nIHRvIFwiICsgcmVzcG9uc2UpO1xuICAgIHdpbmRvdy5zY3JvbGxUbygwLCByZXNwb25zZSk7Ly9hdXRvIHNjcm9sbCBmdW5jdGlvblxufVxuXG5mdW5jdGlvbiBsb2FkTWFya2VycyhzdGFydCxlbmQsZHVyYXRpb24pIHtcbiAgICBjb25zb2xlLmxvZyhcImxvYWQgbWFya2Vycy4uLi4uXCIpO1xuICAgIGxldCAkYmx1ZUJhciA9ICQoYmx1ZVByb2dyZXNzQmFyKTtcbiAgICBsZXQgcmF0aW8gPSBlbmQgLyBkdXJhdGlvbiAtIHN0YXJ0IC8gZHVyYXRpb24sXG4gICAgICAgIHByb3BWYWx1ZSA9IGBzY2FsZVgoJHtyYXRpb30pYDtcbiAgICAkYmx1ZUJhci5jc3MoJ2xlZnQnLCAoKHN0YXJ0IC8gZHVyYXRpb24pICogMTAwKSArICclJyk7XG4gICAgJGJsdWVCYXIuY3NzKCd0cmFuc2Zvcm0nLCBwcm9wVmFsdWUpO1xuICAgICQoJ2Rpdi55dHAtcGxheS1wcm9ncmVzcy55dHAtc3dhdGNoLWJhY2tncm91bmQtY29sb3I6bm90KC5ibHVlUHJvZ3Jlc3MpJykuYWZ0ZXIoJGJsdWVCYXIpO1xufVxuXG5cbmZ1bmN0aW9uIG1vdXNlVXBIYW5kbGVyKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBjb25zdCBkaWZmID0ge3g6IE1hdGguYWJzKHBhcnNlSW50KGUucGFnZVgpLXBhcnNlSW50KGdob3N0RWxlbWVudC5zdHlsZS5sZWZ0KSksXG4gICAgICAgIHk6IE1hdGguYWJzKHBhcnNlSW50KGUucGFnZVkpLXBhcnNlSW50KGdob3N0RWxlbWVudC5zdHlsZS50b3ApKX07XG5cbiAgICAvL3dvcmtpbmcgd2l0aCBuZWdhdGl2ZSBjb29yZGluYXRlc1xuICAgIGxldCBfdyA9IGRpZmYueDtcbiAgICBsZXQgX2ggPSBkaWZmLnk7XG4gICAgbGV0IF94ID0gc3RhcnRQb3MueDtcbiAgICBsZXQgX3kgPSBzdGFydFk7XG5cbiAgICBpZihwYXJzZUludChlLnBhZ2VZKSA8IHN0YXJ0UG9zLnkpe1xuICAgICAgICAvL3RvcCByaWdodFxuICAgICAgICBfaCA9IE1hdGguYWJzKHBhcnNlSW50KGUucGFnZVkpLXN0YXJ0UG9zLnkpO1xuICAgICAgICBfeSAtPSBfaDtcbiAgICB9XG4gICAgaWYocGFyc2VJbnQoZS5wYWdlWCkgPCBzdGFydFBvcy54KXtcbiAgICAgICAgLy9sZWZ0IGJvdHRvbVxuICAgICAgICBfdyA9IE1hdGguYWJzKHBhcnNlSW50KGUucGFnZVgpLXN0YXJ0UG9zLngpO1xuICAgICAgICBfeCAtPSBfdztcbiAgICB9XG5cbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3VzZU1vdmVIYW5kbGVyLCBmYWxzZSk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG1vdXNlVXBIYW5kbGVyLCBmYWxzZSk7XG5cbiAgICBnaG9zdEVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChnaG9zdEVsZW1lbnQpO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IGNvb3JkcyA9IHtcbiAgICAgICAgICAgIHc6IF93LFxuICAgICAgICAgICAgaDogX2gsXG4gICAgICAgICAgICB4OiBfeCxcbiAgICAgICAgICAgIHk6IF95XG4gICAgICAgIH07XG4gICAgICAgIGVuZFNjcmVlbnNob3QoY29vcmRzLGZhbHNlKTtcbiAgICB9LCA1MCk7XG5cbiAgICByZXR1cm4gZmFsc2U7XG59XG4vL3F1aXQgc2NyZWVuIHNob3Rcbi8vIGZ1bmN0aW9uIGtleURvd25IYW5kbGVyKGUpIHtcbi8vICAgICBpZiAoIGUua2V5ID09PSAnRXNjYXBlJykge1xuLy8gICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4vLyAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4vLyAgICAgICAgIGVuZFNjcmVlbnNob3QobnVsbCwgdHJ1ZSk7XG4vLyAgICAgICAgIHJldHVybiBmYWxzZTtcbi8vICAgICB9XG4vLyB9XG5cblxuLyoqXG4gKlxuICogQHBhcmFtIGVcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBtb3VzZU1vdmVIYW5kbGVyKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBjb25zdCBkaWZmID0ge3g6IE1hdGguYWJzKHBhcnNlSW50KGUucGFnZVgpLXBhcnNlSW50KGdob3N0RWxlbWVudC5zdHlsZS5sZWZ0KSksXG4gICAgICAgIHk6IE1hdGguYWJzKHBhcnNlSW50KGUucGFnZVkpLXBhcnNlSW50KGdob3N0RWxlbWVudC5zdHlsZS50b3ApKX07XG5cbiAgICBnaG9zdEVsZW1lbnQuc3R5bGUud2lkdGggPSBkaWZmLnggKyAncHgnO1xuICAgIGdob3N0RWxlbWVudC5zdHlsZS5oZWlnaHQgPSBkaWZmLnkgKydweCc7XG5cbiAgICAvL29wcG9zaXRlIGRyYXdpbmcgY2FudmFzIChuZWdhdGl2ZSBjb29yZHMpXG4gICAgaWYocGFyc2VJbnQoZS5wYWdlWSkgPCBzdGFydFBvcy55KXtcbiAgICAgICAgZ2hvc3RFbGVtZW50LnN0eWxlLnRvcCA9IGUucGFnZVkgKyAncHgnO1xuICAgICAgICBnaG9zdEVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gTWF0aC5hYnMocGFyc2VJbnQoZS5wYWdlWSktc3RhcnRQb3MueSkrJ3B4JztcbiAgICB9XG4gICAgaWYocGFyc2VJbnQoZS5wYWdlWCkgPCBzdGFydFBvcy54KXtcbiAgICAgICAgZ2hvc3RFbGVtZW50LnN0eWxlLmxlZnQgPSBlLnBhZ2VYKydweCc7XG4gICAgICAgIGdob3N0RWxlbWVudC5zdHlsZS53aWR0aCA9IE1hdGguYWJzKHBhcnNlSW50KGUucGFnZVgpLXN0YXJ0UG9zLngpKydweCc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0gZVxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIG1vdXNlRG93bkhhbmRsZXIoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIC8vIHN0YXJ0UG9zID0ge3g6IGUucGFnZVgsIHk6IGUucGFnZVl9O1xuICAgIC8vIHN0YXJ0WSA9IGUueTtcblxuICAgIC8vIGdob3N0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIC8vIGdob3N0RWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kID0gJ2JsdWUnO1xuICAgIC8vIGdob3N0RWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gJzAuMSc7XG4gICAgLy8gZ2hvc3RFbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAvLyBnaG9zdEVsZW1lbnQuc3R5bGUubGVmdCA9IGUucGFnZVggKyAncHgnO1xuICAgIC8vIGdob3N0RWxlbWVudC5zdHlsZS50b3AgPSBlLnBhZ2VZICsgJ3B4JztcbiAgICAvLyBnaG9zdEVsZW1lbnQuc3R5bGUud2lkdGggPSBcIjBweFwiO1xuICAgIC8vIGdob3N0RWxlbWVudC5zdHlsZS5oZWlnaHQgPSBcIjBweFwiO1xuICAgIC8vIGdob3N0RWxlbWVudC5zdHlsZS56SW5kZXggPSBcIjEwMDAwMDBcIjtcbiAgICAvLyBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGdob3N0RWxlbWVudCk7XG5cbiAgICAvLyBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3VzZU1vdmVIYW5kbGVyLCBmYWxzZSk7XG4gICAgLy8gZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG1vdXNlVXBIYW5kbGVyLCBmYWxzZSk7XG4gICAgdmFyIHggPSBlLnBhZ2VYO1xuICAgIHZhciB5ID0gZS5wYWdlWTtcblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBTYXZlIHBhcnQgb2YgcGFnZXMgd2l0aCBsb25nIHN0YXkuXG4gKi9cbmZ1bmN0aW9uIHNjcm9sbEhhbmRsZXIoKSB7XG4gICAgZW5kVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIGlmIChlbmRUaW1lIC0gc3RhcnRUaW1lID4gTE9OR19FTk9VR0hfTVMpIHtcbiAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgIFwidXJsXCI6IGN1cnJlbnRVcmwsXG4gICAgICAgICAgICAgICAgXCJzdGF5XCI6IHtcInBvc2l0aW9uXCI6IGxhc3RQb3NpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgXCJkdXJhdGlvblwiOiBlbmRUaW1lIC0gc3RhcnRUaW1lLFxuICAgICAgICAgICAgICAgICAgICBcInRpbWVcIjogW25ldyBEYXRlKCldfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChyZXNwb25zZSkge30pO1xuICAgIH1cbiAgICBsYXN0UG9zaXRpb24gPSB3aW5kb3cuc2Nyb2xsWSB8fCB3aW5kb3cucGFnZVlPZmZzZXRcbiAgICAgICAgfHwgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgKyAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AgfHwgMCk7XG4gICAgc3RhcnRUaW1lID0gZW5kVGltZTtcbn1cblxuLyoqXG4gKiBEYXRhIGZvcm1hdDpcbiAqIDxVcmxcbiAqICAgICAgICAgIGhpZ2hsaWdodDpcbiAqICAgICAgICAgIHRleHRcbiAqICAgICAgICAgIHNlY3Rpb25faWRcbiAqICAgICAgICAgIHBvc2l0aW9uXG4gKiAgICAgICAgICB0aW1lPlxuICovXG5mdW5jdGlvbiBzYXZlSGlnaGxpZ2h0ZWRUZXh0KGUpXG57XG4gICAgbGV0IGNvbnRlbnQgPSBleHRyYWN0U2VsZWN0ZWRUZXh0KCk7XG4gICAgaWYoY29udGVudCE9PSBcIlwiKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJjdXJyZW50VXJsOlwiICsgY3VycmVudFVybCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiY3VycmVudFBvc2l0aW9uOlwiICsgY3VycmVudFBvc2l0aW9uKTtcbiAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1widXJsXCI6IGN1cnJlbnRVcmwsXG4gICAgICAgICAgICAgICAgXCJoaWdobGlnaHRcIjpcbiAgICAgICAgICAgICAgICAgICAge1widGV4dFwiOiBjb250ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzZWN0aW9uX2lkXCI6IGZldGNoU2VjdGlvbklkKGUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwb3NpdGlvblwiOiBjdXJyZW50UG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRpbWVcIjogW25ldyBEYXRlKCldfX0sXG4gICAgICAgICAgICBmdW5jdGlvbihyZXNwb25zZSkge30pO1xuICAgIH1cbn1cblxuLyoqXG4gKiBEYXRhIGZvcm1hdDpcbiAqIDxVcmxcbiAqICAgICAgICAgIGNvcHk6XG4gKiAgICAgICAgICB0ZXh0XG4gKiAgICAgICAgICBzZWN0aW9uX2lkXG4gKiAgICAgICAgICBpc19jb2RlXG4gKiAgICAgICAgICBpc19pbWFnZV91cmxcbiAqICAgICAgICAgIHRpbWU+XG4gKi9cbmZ1bmN0aW9uIHNhdmVDb3BpZWRUZXh0KGUpIHtcblxuICAgIGxldCBjb250ZW50ID0gZXh0cmFjdFNlbGVjdGVkVGV4dCgpO1xuICAgIGlmKGNvbnRlbnQhPT0gXCJcIil7XG4gICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHtcInVybFwiOiBjdXJyZW50VXJsLFxuICAgICAgICAgICAgICAgIFwiY29weVwiOiB7XCJ0ZXh0XCI6IGNvbnRlbnQsXG4gICAgICAgICAgICAgICAgICAgIFwic2VjdGlvbl9pZFwiOiBmZXRjaFNlY3Rpb25JZChlKSxcbiAgICAgICAgICAgICAgICAgICAgXCJpc19jb2RlXCIgOiAgaXNDb2RlKGUpLFxuICAgICAgICAgICAgICAgICAgICAvL1wiaXNfaW1hZ2VfdXJsXCI6IGlzSW1hZ2VVcmwoY29udGVudCksXG4gICAgICAgICAgICAgICAgICAgIFwidGltZVwiOiBbbmV3IERhdGUoKV19fSxcbiAgICAgICAgICAgIGZ1bmN0aW9uKHJlc3BvbnNlKSB7fSk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKFwiU2VuZGluZyFcIik7XG59XG5cbi8qKlxuICogRXh0cmFjdCBzZWxlY3RlZCB0ZXh0LiBSZXR1cm5zIFwiXCIgaWYgbm8gdGV4dCBzZWxlY3RlZC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGV4dHJhY3RTZWxlY3RlZFRleHQoKVxue1xuICAgIGxldCBzZWwgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XG4gICAgaWYgKHNlbCkge1xuICAgICAgICByZXR1cm4gc2VsLnRvU3RyaW5nKCk7XG4gICAgfVxufVxuXG5cbi8qKlxuICogTGlzdGVuIHNuaXBwZXQgZGF0YSBvbmNlIGEgdmlkZW8gZWxlbWVudCBpcyBjcmVhdGVkXG4gKiBEYXRhIGZvcm1hdDpcbiAqIDxVcmxcbiAqICAgICAgICAgIHNuaXBwZXQ6XG4gKiAgICAgICAgICBzdGFydF90aW1lXG4gKiAgICAgICAgICBlbmRfdGltZVxuICogICAgICAgICAgdGltZVxuICogIGNvbnRhaW5zX3ZpZGVvXG4gKiAgdmlkZW9fZHVyYXRpb24+XG4gKi9cbmRvY3VtZW50LmFycml2ZSgndmlkZW8nLCBmdW5jdGlvbiAodikge1xuICAgIHZpZGVvT2JqID0gdjtcbiAgICB2aWRlb09iai5vbnRpbWV1cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghaXNQbGF5aW5nWW91dHViZUFkKCkpIHtcbiAgICAgICAgICAgIGlmICghaXNOYU4odmlkZW9PYmouZHVyYXRpb24pKSB7XG4gICAgICAgICAgICAgICAgdmlkZW9EdXJhdGlvbiA9IHZpZGVvT2JqLmR1cmF0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXMgYSBiaWcgZ2FwIGJldHdlZW4gdGhlIGN1cnJlbnQgcGxheSB0aW1lIGFuZCB0aGUgbGFzdCBwbGF5IHRpbWUsXG4gICAgICAgICAgICAvLyB0aGUgdXNlciBoYXMgc2tpcHBlZC9yZXdpbmQgdGhlIHZpZGVvXG4gICAgICAgICAgICBpZiAoTWF0aC5hYnModmlkZW9PYmouY3VycmVudFRpbWUgLSBsYXN0VmlkZW9UaW1lKSA+PSAxMCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic25pcHBldDpcIiArIGxhc3RWaWRlb1NuaXBwZXRTdGFydFRpbWUgKyBcIiAtLS0gIFwiICsgbGFzdFZpZGVvVGltZSk7XG4gICAgICAgICAgICAgICAgaWYgKGxhc3RWaWRlb1RpbWUgLSBsYXN0VmlkZW9TbmlwcGV0U3RhcnRUaW1lID4gMykge1xuICAgICAgICAgICAgICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ1cmxcIjogdmlkZW9VcmwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ2aWRlb19zbmlwcGV0XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RhcnRfdGltZVwiOiBsYXN0VmlkZW9TbmlwcGV0U3RhcnRUaW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlbmRfdGltZVwiOiBsYXN0VmlkZW9UaW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkdXJhdGlvblwiOiB2aWRlb0R1cmF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsYXN0VmlkZW9TbmlwcGV0U3RhcnRUaW1lID0gdmlkZW9PYmouY3VycmVudFRpbWU7XG4gICAgICAgICAgICAgICAgLy9UT0RPOiBoYW5kbGUgcmV3aW5kIGV2ZW50LlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGFzdFZpZGVvVGltZSA9IHZpZGVvT2JqLmN1cnJlbnRUaW1lO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZpZGVvT2JqLm9ucGF1c2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwicGF1c2VkXCIpO1xuICAgIH07XG5cbiAgICB2aWRlb09iai5vbmVuZGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcImVuZGVkXCIpO1xuICAgIH07XG59KTtcblxuXG5mdW5jdGlvbiBzdGFydFNjcmVlbnNob3QoKSB7XG4gICAgY29uc29sZS5sb2coJ3N0YXJ0IHNjcmVlbnNob3QnKTtcbiAgICAvL2NoYW5nZSBjdXJzb3JcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmN1cnNvciA9ICdjcm9zc2hhaXInO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG1vdXNlRG93bkhhbmRsZXIsIGZhbHNlKTtcbiAgICAvL2xpc3RlbmVyIGZvciBxdWl0aW5nIHNjcmVlbnNob3RcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywga2V5RG93bkhhbmRsZXIsIGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gZW5kU2NyZWVuc2hvdChjb29yZHMsIHF1aXQpIHtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBtb3VzZURvd25IYW5kbGVyLCBmYWxzZSk7XG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5jdXJzb3IgPSAnZGVmYXVsdCc7XG5cbiAgICBpZihxdWl0KXtcbiAgICAgICAgLy91c2VyIHByZXNzZWQgRVNDIHF1aXQgc2NyZWVuc2hvdC4gbm90IHNlbmRpbmcgYW55IGluZm9ybWF0aW9uLlxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3VzZU1vdmVIYW5kbGVyLCBmYWxzZSk7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtb3VzZVVwSGFuZGxlciwgZmFsc2UpO1xuXG4gICAgICAgIGdob3N0RWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGdob3N0RWxlbWVudCk7XG4gICAgfVxuICAgIGVsc2V7XG5cbiAgICAgICAgY29uc29sZS5sb2coJ3NlbmRpbmcgbWVzc2FnZSB3aXRoIHNjcmVlbnNob290Jyk7XG4gICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHtcInVybFwiOiBjdXJyZW50VXJsLFxuICAgICAgICAgICAgICAgIFwic2NyZWVuc2hvdFwiOntjb29yZGluYXRlczpjb29yZHMsIGZpbGVuYW1lOiBmb3JtYXRGaWxlTmFtZShuZXcgRGF0ZSgpKSwgdGltZTogbmV3IERhdGUoKX19LFxuICAgICAgICAgICAgZnVuY3Rpb24ocmVzcG9uc2UpIHt9KTtcblxuICAgIH1cblxufVxuXG5cbi8vIExpc3RlbmluZyB1cmwgY2hhbmdlcyBmb3IgdGhlIGN1cnJlbnQgdGFiLlxuY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKCAobWVzc2FnZSwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcbiAgICBjdXJyZW50VXJsPW1lc3NhZ2UudXJsO1xuICAgIGlmIChtZXNzYWdlLnR5cGUgPT09IFwibmV3X3VybFwiKXtcbiAgICAgICAgbGV0IHZpZGVvUmVzcG9uc2U9bWVzc2FnZS52aWRlbztcbiAgICAgICAgbGV0IHN0YXlSZXNwb25zZT1tZXNzYWdlLnBvc2l0aW9uO1xuICAgICAgICAvL2lmIGhhcyBjb2RlICxkb24ndCBnbyBwYWdlIHNlY3Rpb247XG4gICAgICAgIGlmKCFjdXJyZW50VXJsLmluY2x1ZGVzKFwiI1wiKSl7XG4gICAgICAgICAgICBnb1RvUGFzdFBhZ2VTZWN0aW9uKHN0YXlSZXNwb25zZSk7XG4gICAgICAgIH1cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5ldyB1cmw6XCIsIG1lc3NhZ2UudXJsKTtcbiAgICAgICAgICAgIHZpZGVvVXJsID0gbWVzc2FnZS51cmw7XG4gICAgICAgICAgICBxdWVyeSA9IG1lc3NhZ2UucXVlcnk7XG4gICAgICAgICAgICAvLyB0byBrbm93IFVybCBoYXMgYWxyZWFkeSBjaGFuZ2VkXG4gICAgICAgICAgICBpZiAodmlkZW9VcmwgPT09IGN1cnJlbnRVcmwpIHtcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFVybC5pbmNsdWRlcyhcInlvdXR1YmUuY29tXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZU1hcmtlcnMoKTtcbiAgICAgICAgICAgICAgICAgICAgbG9hZE1hcmtlcnModmlkZW9SZXNwb25zZS5zdGFydF90aW1lLHZpZGVvUmVzcG9uc2UuZW5kX3RpbWUsdmlkZW9SZXNwb25zZS5kdXJhdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCAyMDAwKTtcbiAgICB9XG4gICAgZWxzZSBpZiAobWVzc2FnZS50eXBlID09PSBcInN0YXJ0X3NjcmVlbnNob3RzXCIpe1xuICAgICAgICBzdGFydFNjcmVlbnNob3QoKTtcbiAgICB9XG59KTtcblxuXG4vLyBXaGVuIHRoZSB3ZWIgcGFnZSBpcyBhYm91dCB0byBiZSB1bmxvYWRlZC5cbndpbmRvdy5vbmJlZm9yZXVubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoY3VycmVudFVybC5pbmNsdWRlcyhcInlvdXR1YmUuY29tXCIpKSB7XG4gICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICBcInVybFwiOiB2aWRlb1VybCxcbiAgICAgICAgICAgICAgICBcInZpZGVvX3NuaXBwZXRcIjpcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdGFydF90aW1lXCI6IGxhc3RWaWRlb1NuaXBwZXRTdGFydFRpbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImVuZF90aW1lXCI6IGxhc3RWaWRlb1RpbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImR1cmF0aW9uXCI6IHZpZGVvRHVyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChyZXNwb25zZSkge30pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIG9ubHkgY29uc2lkZXJzIHNjcm9sbGluZyBwb3NpdGlvbnMgd2hlbiB0aGUgd2ViIHBhZ2UgaXMgbm90IHZpZGVvXG4gICAgICAgIGVuZFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgaWYgKGVuZFRpbWUgLSBzdGFydFRpbWUgPiBMT05HX0VOT1VHSF9NUykge1xuICAgICAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICBcInVybFwiOiBjdXJyZW50VXJsLFxuICAgICAgICAgICAgICAgICAgICBcInN0YXlcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJwb3NpdGlvblwiOiBsYXN0UG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBcImR1cmF0aW9uXCI6IGVuZFRpbWUgLSBzdGFydFRpbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRpbWVcIjogW25ldyBEYXRlKCldXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXNwb25zZSkge30pO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY29weScsIHNhdmVDb3BpZWRUZXh0KTtcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBzYXZlSGlnaGxpZ2h0ZWRUZXh0KTtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBzY3JvbGxIYW5kbGVyKTtcbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTsiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/js/content.js\n");

/***/ })

})