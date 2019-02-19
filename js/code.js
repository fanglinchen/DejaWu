function isCode(e){
    let cur = e.target;
    while(cur.tagName.toLowerCase()!=="code" && (cur=cur.parentNode)!==document.body);
    //If the highest element tracked by the cursor can be ascribed to <code>.
    return cur.tagName.toLowerCase()==="code";
}

function fetchSectionId(e){
    let cur = e?e.target:null;
    if(cur)
        while(!cur.hasAttribute("id") && (cur=cur.parentNode)!==document.body);
    return cur&&(cur.getAttribute("id")||null);
}