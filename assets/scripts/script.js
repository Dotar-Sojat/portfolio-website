import { setElAttributes } from './utilities.js';
import { organizePortfolioItems } from './portfolio.js';
import { buildCarousel } from './carousel.js';

window.addEventListener('load', () => {

    buildCarousel('portfolio-carousel',organizePortfolioItems(['Websites','WordPress','Other']));

    const anchorTags = document.querySelectorAll('a');

    anchorTags.forEach(anchorTag => {
        anchorTag.addEventListener('click', (e) => {
            if (anchorTag.getAttribute('href').includes("#")) {
                e.preventDefault();
                let scrollEl = document.querySelector(anchorTag.getAttribute('href'));
                scrollEl.scrollIntoView({behavior: "smooth", block: "start"});
            }
        });
    });

});