// src/main.js
import './style.css';
import Alpine from 'alpinejs';
import './js/carouselGallery.js';

window.Alpine = window.Alpine || Alpine;

// Register component
window.Alpine.data('carouselGallery', carouselGallery);
window.carouselGallery = carouselGallery;

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