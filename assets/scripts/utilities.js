function setElAttributes(el, attributes) {
    for (let key in attributes) {
        el.setAttribute(key, attributes[key]);
    }
}

export { setElAttributes };