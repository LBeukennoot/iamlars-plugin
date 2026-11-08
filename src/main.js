// src/main.js
import './style.css';
import Alpine from 'alpinejs';
import './js/carouselGallery.js';

// Attach Alpine to window if not already present
if (!window.Alpine) {
  window.Alpine = Alpine;
}

// Block registrations for Gutenberg editor
import './blocks/image-comparison';
import './blocks/carousel-gallery';