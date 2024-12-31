import { loadPortfolioItems } from './portfolio.js';

window.addEventListener('load', () => {
    const mainElement = document.querySelector('main.portfolio-page');
    loadPortfolioItems();
});