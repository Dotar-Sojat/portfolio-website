import { getJSONData, setElAttributes } from './utilities.js';

function buildCarousel(caroEl, sourceJSON, categories = null) {
  let categoriesSet = categories !== null && Array.isArray(categories) ? true:false;

  const caroContainerDiv = document.getElementById(caroEl);
  const caroDisplayDiv = document.createElement('div');
  const caroLeftBut = document.createElement('button');
  const caroRightBut = document.createElement('button');
  const caroDotsDiv = document.createElement('div');

  let categorizedItems = {'uncategorized' : []};

  if (categoriesSet) {
    categories.forEach(cat => {
      categorizedItems[cat] = [];
    });
  }

  caroLeftBut.classList.add('caro-dir-but','caro-left');
  caroRightBut.classList.add('caro-dir-but','caro-right');
  caroDotsDiv.classList.add('caro-dots-div');
  caroDisplayDiv.classList.add('caro-display-div');
  
  caroDisplayDiv.append(caroLeftBut,caroRightBut,caroDotsDiv);
  caroContainerDiv.append(caroDisplayDiv);

  getJSONData(sourceJSON)
    .then(jsonData => {
      jsonData.forEach(item => {
        let uncategorizedItem = false;
        for (let i=0; i<categories.length; ++i) {
            if (categories[i].toLowerCase() == item.category) {
              categorizedItems[categories[i]].push(item);
              uncategorizedItem = true;
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
        let caroImage = document.createElement('img');
        setElAttributes(caroImage, {
            'src':item.url,
            'alt':item.image_description,
            'class':'caro-image'
        })
        let caroDot = document.createElement('button');
        setElAttributes(caroDot, {
            'data-dot-index':slideIndex,
            'class':'caro-dot'
        });
        caroSlide.appendChild(caroImage);
        caroDisplayDiv.appendChild(caroSlide);
        caroDotsDiv.appendChild(caroDot);
        slideIndex++;
      });
        
    })
    .catch(error => {
      console.error('Error in buildCarousel:', error);
    });
}

export { buildCarousel };