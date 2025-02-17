function setElAttributes(el, attributes) {
    for (let key in attributes) {
        el.setAttribute(key, attributes[key]);
    }
}

function getJSONData(sourcefile) {
    return fetch('/assets/json/'+sourcefile+'.json')
      .then(response => response.json())
      .catch(error => {
        console.error('Error fetching JSON data:', error);
        throw error;
      });
  }

export { setElAttributes,getJSONData };