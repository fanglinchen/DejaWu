function isValidUrl(text) {
    const valid = /((https?):\/\/)?(([w|W]{3}\.)+)?[a-zA-Z0-9\-\.]{3,}\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?/;
    return valid.test(text);
}

function isImageUrl(text){
    const regex = /(https?:\/\/.*\.(?:png|jpg))/i;
    if (isValidUrl(text))
        return text.match(regex) !== null;
    return false;
}
