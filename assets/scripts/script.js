import { buildCarousel } from './carousel.js';

buildCarousel('portfolio-carousel', 'portfolio-items', ['Websites','WordPress','Other']);

window.addEventListener('load', () => {

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