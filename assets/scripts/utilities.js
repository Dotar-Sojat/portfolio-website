function setElAttributes(el, attributes) {
    for (let key in attributes) {
        el.setAttribute(key, attributes[key]);
    }
}

function setElStyles(el, styles) {
  for (let key in styles) {
      el.style[key] = [styles[key]];
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

function configureOverlay() {
  if (!document.getElementById('page-overlay')) {
    let pageOverlay = document.createElement('div');
    setElAttributes(pageOverlay, {
      'id':'page-overlay',
      'class': 'overlay'
    });
    let pageOverlayBtn = document.createElement('button');
    setElAttributes(pageOverlayBtn, {
      'id':'page-overlay-btn',
    });
    pageOverlayBtn.addEventListener('click', () => {
      pageOverlay.classList.toggle('active');
      document.body.classList.toggle('locked');
    });
    pageOverlay.appendChild(pageOverlayBtn);
    document.body.appendChild(pageOverlay);
  }
  return document.getElementById('page-overlay');
}

export { setElAttributes, setElStyles, configureOverlay, getJSONData };