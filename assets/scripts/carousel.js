  // function loadPortfolioItems() {
  //   fetch('/assets/json/portfolio-items.json')
  //     .then(response => response.json())
  //     .then(data => {
  //       const portfolioItems = document.getElementById('portfolio-items');
  //       data.portfolio_samples.forEach(item => {
  //           const portfolioSection = document.createElement('div');
  //           const portfolioItemsWrapper = document.createElement('div');
  //           portfolioSection.classList.add('portfolio-section');
  //           portfolioItemsWrapper.classList.add('portfolio-items'); 
  //           portfolioSection.innerHTML = `
  //             <h3 id="${item.category}">${item.category}</h3>
  //             <p>${item.description}</p>`;
  //           item.samples.forEach(sample => {
  //             const portfolioItem = document.createElement('div'); 
  //             portfolioItem.classList.add('portfolio-item');
  //             portfolioItem.innerHTML = `
  //               <div class="portfolio-item-image">
  //                 <img src="${sample.file}" alt="${sample.name}">
  //               </div>
  //               <div class="portfolio-item-content">
  //                 <h4 id="${sample.name}">${sample.title}</h4>
  //                 <p>${sample.description}</p>
  //                 <a href="${sample.link}">View Link</a>
  //               </div>
  //             `;
  //             portfolioItemsWrapper.appendChild(portfolioItem); 
  //           });
  //           portfolioSection.appendChild(portfolioItemsWrapper); 
  //           portfolioItems.appendChild(portfolioSection); 
  //       });

  //     })
  //     .catch(error => {
  //       console.error('Error fetching portfolio data:', error);
  //     });
  // }

  function buildCarousel(caroEl,caroContent) {

    const caroCategories =  Object.keys(caroContent);
    const caroContainerDiv = document.getElementById(caroEl);
    const caroCategoriesDiv = document.createElement('div');
    const caroDisplayDiv = document.createElement('div');
    const caroLeftBut = document.createElement('button');
    const caroRightBut = document.createElement('button');
    const caroDotsDiv = document.createElement('div');

    caroCategories.forEach(cat => {
        let catLink = document.createElement('button');
        
    })

//     let caroIndex = 0;
//     caroContent.forEach(cat => {
//         let caroDot = document.createElement('button');
//         caroDot.setAttribute('data-index',caroIndex);
//         caroButtons.appendChild(caroDot);
//         caroIndex++;
//     });
//     caroArrowLeft.classList.add('caro-arrow-left');
//     caroArrowRight.classList.add('caro-arrow-right');
//     caroContainer.appendChild(caroArrowLeft,caroArrowRight,caroDisplay,caroButtons);
  }

  export { buildCarousel };