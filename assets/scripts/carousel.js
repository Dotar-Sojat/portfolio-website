import { getJSONData, setElAttributes, setElStyles } from './utilities.js';

function buildCarousel(caroEl, sourceJSON, categories = null) {
  let categoriesSet = categories !== null && Array.isArray(categories) ? true:false;

  const caroContainerDiv = document.getElementById(caroEl);
  
  const caroDisplayDiv = document.createElement('div');
  caroDisplayDiv.classList.add('caro-display-div');

  const caroSlidesDiv = document.createElement('div');
  caroSlidesDiv.classList.add('caro-slides-div');

  const caroLeftBut = document.createElement('button');
  caroLeftBut.addEventListener('click',selectSlide);
  const caroRightBut = document.createElement('button');
  caroRightBut.addEventListener('click',selectSlide);

  const caroDotsDiv = document.createElement('div');
  caroDotsDiv.classList.add('caro-dots-div');

  let categorizedItems = {'uncategorized' : []};

  if (categoriesSet) {
    categories.forEach(cat => {
      categorizedItems[cat] = [];
    });
  }

  caroLeftBut.classList.add('caro-dir-btn','caro-left');
  caroLeftBut.innerHTML='&#10096';
  setElAttributes(caroLeftBut,{ 'aria-label': 'Move slideshow left'});

  caroRightBut.classList.add('caro-dir-btn','caro-right');
  caroRightBut.innerHTML='&#10097';
  setElAttributes(caroRightBut,{ 'aria-label': 'Move slideshow right'});
 
  caroDisplayDiv.append(caroSlidesDiv);
  caroContainerDiv.append(caroDisplayDiv,caroLeftBut,caroRightBut,caroDotsDiv);

  getJSONData(sourceJSON)
    .then(jsonData => {
      jsonData.forEach(item => {
        let uncategorizedItem = true;
        for (let i=0; i<categories.length; ++i) {
            if (categories[i].toLowerCase() == item.category) {
              categorizedItems[categories[i]].push(item);
              uncategorizedItem = false;
              break;
            }
          }
        if (uncategorizedItem) categorizedItems['uncategorized'].push(item);
      });

      const slideItems = Object.values(categorizedItems).flat();

      if (categoriesSet) {
        const caroCategoriesDiv = document.createElement('div');
        caroCategoriesDiv.classList.add('caro-categories-div');
        caroContainerDiv.append(caroCategoriesDiv);
        let categoryIndexPosition = 0;
        categories.forEach(category => {
          let categoryBtn = document.createElement('button');
          categoryBtn.innerText = category;
          setElAttributes(categoryBtn, {  
            'id':'cat-' + category.toLowerCase(),
            'data-cat-start': categoryIndexPosition,
            'data-cat-end': categoryIndexPosition + categorizedItems[category].length -1,
            'class':'caro-category'
          });
          categoryBtn.addEventListener('click',selectSlide);
          caroCategoriesDiv.appendChild(categoryBtn);
          categoryIndexPosition = categoryIndexPosition + categorizedItems[category].length;
        });
      }
      
      let slideIndex = 0;

      slideItems.forEach(item => {
        let caroSlide = document.createElement('div');
        setElAttributes(caroSlide,{
            'data-slide-index':slideIndex,
            'class':'caro-slide'
        });
        if (slideIndex === 0) caroSlide.classList.add('active');

        let caroImage = document.createElement('img');
        setElAttributes(caroImage, {
            'src':item.url,
            'alt':item.image_description,
            'class':'caro-image'
        });

        let caroDescription = document.createElement('div');
        setElAttributes(caroDescription,{
          'data-slide-index':slideIndex,
          'class':'caro-description'
        });

        caroDescription.innerHTML = '<p>' + item.description + '</p>';
        let caroDescriptionBtn = document.createElement('button');
        setElAttributes(caroDescriptionBtn, {
            'class':'caro-description-btn',
            'aria-label': 'View information about slide ' + slideIndex + 1
        });
        caroDescriptionBtn.addEventListener('click',seeCaroDescription);    
        let caroDot = document.createElement('button');
        setElAttributes(caroDot, {
            'data-dot-index':slideIndex,
            'class':'caro-dot',
            'aria-label': 'View slide ' + slideIndex + 1
        });
        caroDot.addEventListener('click', (e) => {
          selectSlide(e.target,caroEl);
        });

        caroSlide.append(caroImage,caroDescriptionBtn,caroDescription);
        caroSlidesDiv.appendChild(caroSlide);
        caroDotsDiv.appendChild(caroDot);
        slideIndex++;
      });
        
    })
    .catch(error => {
      console.error('Error in buildCarousel:', error);
    });

    function toggleCaroDescription(slideIndex) {
      let slideInfoBtn = e.target;
      let slideDescription = slideInfoBtn.parentElement.querySelector('.caro-description');
      slideInfoBtn.classList.toggle('active');
      slideDescription.classList.toggle('active');
    }

    function getCaroInfo(caro) {
      let caroObject = {
        'slidesDiv': caro.querySelector('.caro-slides-div'),
        'slideCount': caro.querySelectorAll('.caro-slide').length,
        'slideWidth': caro.querySelector('.caro-display-div').offsetWidth,
        'activeSlide': caro.querySelector('.caro-slide.active').getAttribute('data-slide-index'),
        'activeDescription':caro.querySelector('.caro-description.active')
      }
      return caroObject;
    }

    function selectSlide(e) {
      let clickedEl = e.target;
      let thisCaro = getCaroInfo(clickedEl.closest('.carousel'));
      let newIndex;

      if (clickedEl.classList.contains('caro-dir-btn')) {
        if (clickedEl.classList.contains('caro-left')) {
          newIndex = thisCaro.activeSlide - 1 >= 0 ? thisCaro.activeSlide - 1 : thisCaro.slideCount -1;
        } else {
          newIndex = thisCaro.activeSlide + 1 <= thisCaro.slideCount - 1 ? thisCaro.activeSlide + 1 : 0;
        }
      } else if (clickedEl.classList.contains('caro-dot')) {
          newIndex = clickedEl.getAttribute('data-dot-index');
      } else if (clickedEl.classList.contains('caro-category')) {
          newIndex = clickedEl.getAttribute('data-cat-start'); 
      }
      moveCarousel(thisCaro,newIndex);
    }

    function moveCarousel(caro,destinationIndex) {

      let currentPosition = caro.activeSlide * caro.slideWidth;
      let newPosition = destinationIndex * caro.slideWidth;
      let slideMovement = currentPosition - newPosition;

      console.log('currentPosition: ' + currentPosition);
      console.log('newPosition: ' + newPosition);
      console.log('slideMovement: ' + slideMovement);
    
      setElStyles(caro.slidesDiv, {  
        'transform':'translateX(' + slideMovement + 'px)'
      });
    }

    function seeCaroDescription() {

    }

}


export { buildCarousel };