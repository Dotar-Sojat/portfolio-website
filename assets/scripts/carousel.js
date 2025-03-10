import { getJSONData, setElAttributes, setElStyles, configureOverlay } from './utilities.js';

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

  let itemDescriptions = false;
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
            if (!itemDescriptions) {
              itemDescriptions = (item.description) ? true:false;
            } 
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
        caroContainerDiv.appendChild(caroCategoriesDiv);
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
          if (categoryIndexPosition === 0) categoryBtn.classList.add('active');
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

        let caroSlideContent = document.createElement('div');
        setElAttributes(caroSlideContent,{
            'class':'caro-slide-content'
        });

        let caroImage = document.createElement('img');
        setElAttributes(caroImage, {
            'src':item.url,
            'alt':item.image_description,
            'class':'caro-image'
        });

        if (itemDescriptions) {

          if (!document.getElementById('mobile-description-btn')) configureMobileOverlay();
 
          let caroDescription = document.createElement('div');
          setElAttributes(caroDescription,{
            'data-slide-index':slideIndex,
            'class':'caro-description'
          });

          caroDescription.innerHTML = '<p>' + item.description + '</p>';
          let caroDescriptionBtn = document.createElement('button');
          setElAttributes(caroDescriptionBtn, {
              'class':'caro-description-btn',
              'aria-label': 'View information about slide ' + Number(slideIndex + 1)
          });
          caroDescriptionBtn.addEventListener('click',toggleCaroDescription);

          caroSlideContent.append(caroDescriptionBtn,caroDescription);
          
        } 

        let caroDot = document.createElement('button');
        setElAttributes(caroDot, {
            'data-dot-index':slideIndex,
            'class':'caro-dot',
            'aria-label': 'View slide ' + Number(slideIndex + 1)
        });
        if (slideIndex === 0) caroDot.classList.add('active');

        caroDot.addEventListener('click',selectSlide);

        caroSlideContent.appendChild(caroImage);
        caroSlide.appendChild(caroSlideContent);
        caroSlidesDiv.appendChild(caroSlide);
        caroDotsDiv.appendChild(caroDot);
        slideIndex++;
      });
        
    })
    .catch(error => {
      console.error('Error in buildCarousel:', error);
    });

    function configureMobileOverlay() {
      let pageOverlay = configureOverlay();
      let overlayDescription = document.createElement('div');
      setElAttributes(overlayDescription,{
        'class':'mobile-description'
      });
      pageOverlay.appendChild(overlayDescription);

      let mobileDescriptionBtn = document.createElement('button');
      setElAttributes(mobileDescriptionBtn,{
        'id':'mobile-description-btn',
        'class':'simple-button'
      });
      mobileDescriptionBtn.addEventListener('click', (e) => {
        overlayDescription.innerHTML = '';
        let targetCarousel = e.target.closest('.carousel');
        let caroInfo = getCaroInfo(targetCarousel);
        let slideDescriptions = targetCarousel.querySelectorAll('.caro-description');
        slideDescriptions.forEach(desc => {
          if (desc.getAttribute('data-slide-index') == caroInfo.activeSlide) {
            overlayDescription.innerHTML = desc.innerHTML;
          }
        });
        document.body.classList.toggle('locked');
        pageOverlay.classList.toggle('active');
      });
      caroContainerDiv.appendChild(mobileDescriptionBtn);
    }

    function toggleCaroDescription(e) {
      let slideInfoBtn = e.target;
      let slideDescription = slideInfoBtn.parentElement.querySelector('.caro-description');
      slideInfoBtn.classList.toggle('active');
      slideDescription.classList.toggle('active');
    }

    function getCaroInfo(caro) {
      let caroObject = {
        'caroCategories': caro.querySelector('.caro-categories-div'),
        'slidesDiv': caro.querySelector('.caro-slides-div'),
        'slides': caro.querySelectorAll('.caro-slide'),
        'slideWidth': caro.querySelector('.caro-display-div').offsetWidth,
        'activeSlide': parseInt(caro.querySelector('.caro-slide.active').getAttribute('data-slide-index'))
      }
      return caroObject;
    }

    function selectSlide(e) {
      let clickedEl = e.target;
      let thisCaro = getCaroInfo(clickedEl.closest('.carousel'));
      let newIndex;

      if (clickedEl.classList.contains('caro-dir-btn')) {
        if (clickedEl.classList.contains('caro-left')) {
          newIndex = thisCaro.activeSlide - 1 >= 0 ? thisCaro.activeSlide - 1 : thisCaro.slides.length - 1;
        } else {
          newIndex = thisCaro.activeSlide + 1 <= thisCaro.slides.length - 1 ? thisCaro.activeSlide + 1 : 0;
        }
      } else if (clickedEl.classList.contains('caro-dot')) {
          newIndex = clickedEl.getAttribute('data-dot-index');
      } else if (clickedEl.classList.contains('caro-category')) {
          newIndex = clickedEl.getAttribute('data-cat-start'); 
      }
      moveCarousel(thisCaro,newIndex);
    }

    function moveCarousel(caro,destinationIndex,normalTransition = true) {

      let currentSlide = caro.slides[caro.activeSlide];
      let destinationSlide = caro.slides[destinationIndex];

      if (normalTransition) {
        caroSlidesDiv.classList.remove('inactive');
      } else {
        caroSlidesDiv.classList.add('inactive');
      }

      setElStyles(caro.slidesDiv, {  
        'transform':'translateX(' + destinationSlide.offsetLeft * -1 + 'px)'
      });

      currentSlide.classList.remove('active');
      if (currentSlide.querySelector('.caro-description').classList.contains('active')) {
        currentSlide.querySelector('.caro-description').classList.remove('active');
        currentSlide.querySelector('.caro-description-btn').classList.remove('active');
      }
      destinationSlide.classList.add('active');

      caroDotsDiv.querySelectorAll('.caro-dot').forEach(dot => {
        dot.classList.remove('active');
        if (destinationIndex == dot.getAttribute('data-dot-index')) dot.classList.add('active');
      });

      if (caro.caroCategories !== null) {
        caro.caroCategories.querySelectorAll('.caro-category').forEach(cat => {
          cat.classList.remove('active');
          if (destinationIndex >= cat.getAttribute('data-cat-start') && destinationIndex <= cat.getAttribute('data-cat-end')) cat.classList.add('active');
        });
      }
    }

    window.addEventListener("resize", () => {
      let carousels = document.querySelectorAll('.carousel');
      carousels.forEach(carousel => {
        let caroInfo = getCaroInfo(carousel);
        moveCarousel(caroInfo,caroInfo.activeSlide,false);
      });
    });

}

export { buildCarousel };