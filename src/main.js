import Alpine from 'alpinejs';
import carouselGallery from './js/carouselGallery.js';
import './style.css';

// Reuse the theme's Alpine instance if it loaded first, otherwise attach this one
window.Alpine = window.Alpine || Alpine;
window.Alpine.data('carouselGallery', carouselGallery);
window.carouselGallery = carouselGallery;

// Boot Alpine once on DOMContentLoaded (after both theme & plugin have registered their data)
document.addEventListener('DOMContentLoaded', () => {
  if (!window.__alpineStarted) {
    window.__alpineStarted = true;
    window.Alpine.start();
  }
});

// Block registrations for Gutenberg editor
import './blocks/image-comparison';
import './blocks/carousel-gallery';
import './blocks/skill-rating';