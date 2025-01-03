import { loadPortfolioItems } from './portfolio.js';

window.addEventListener('load', () => {
    loadPortfolioItems();

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