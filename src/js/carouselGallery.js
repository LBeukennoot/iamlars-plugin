// src/js/carouselGallery.js
function carouselGallery(config = {}) {
  return {
    totalImages: config.totalImages || 0,
    ease: 0.18, // Smooth glide speed (0.1 = slower, 0.3 = snappier, no bounce)

    // Layout metrics (measured dynamically per card)
    snapOffsets: [],
    minBoundary: 0,
    maxBoundary: 0,

    // Position tracking (in pixels)
    offset: 0,
    isDragging: false,
    lastX: 0,
    animId: null,

    get minOffset() {
      // Furthest left scroll position (centering the last card)
      return this.minBoundary;
    },

    get maxOffset() {
      // Furthest right scroll position (centering the first card)
      return this.maxBoundary;
    },

    init() {
      // 1. Initial measurement
      this.updateMeasurements();

      // 2. Recalculate once images finish loading and have actual widths
      this.$nextTick(() => {
        this.updateMeasurements();
        const imgs = this.$refs.track ? this.$refs.track.querySelectorAll('img') : [];
        imgs.forEach((img) => {
          if (!img.complete) {
            img.addEventListener(
              'load',
              () => {
                this.updateMeasurements();
                this.goTo(this.getActiveIndex());
              },
              { once: true }
            );
          }
        });
      });

      // 3. Recalculate on window resize
      window.addEventListener('resize', () => {
        this.updateMeasurements();
        this.goTo(this.getActiveIndex());
      });

      // Start centered on the first image
      this.$nextTick(() => {
        this.goTo(0);
      });
    },

    updateMeasurements() {
      if (!this.$refs.track) return;

      const track = this.$refs.track;
      const viewport = track.parentElement;
      const viewportWidth = viewport ? viewport.offsetWidth : window.innerWidth;
      const cards = Array.from(track.children);

      if (!cards.length) return;

      // Calculate the offset required to center each card
      this.snapOffsets = cards.map((card) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        return viewportWidth / 2 - cardCenter;
      });

      // First card centered is maxOffset; last card centered is minOffset
      this.maxBoundary = this.snapOffsets[0] || 0;
      this.minBoundary = this.snapOffsets[this.snapOffsets.length - 1] || 0;
    },

    onDragStart(e) {
      if (this.totalImages <= 1) return;
      this.isDragging = true;
      this.lastX = e.clientX;
      if (this.animId) cancelAnimationFrame(this.animId);
    },

    onDragMove(e) {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.lastX;

      // Light resistance past the first/last card
      if (this.offset > this.maxOffset || this.offset < this.minOffset) {
        this.offset += deltaX * 0.35;
      } else {
        this.offset += deltaX;
      }

      this.lastX = e.clientX;
    },

    onTouchStart(e) {
      if (e.touches.length !== 1) return;
      this.onDragStart(e.touches[0]);
    },

    onTouchMove(e) {
      if (!this.isDragging || e.touches.length !== 1) return;
      this.onDragMove(e.touches[0]);
    },

    onDragEnd() {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.goTo(this.getActiveIndex());
    },

    goTo(index) {
      if (!this.snapOffsets || this.snapOffsets[index] === undefined) return;
      const targetOffset = this.snapOffsets[index];

      if (this.animId) cancelAnimationFrame(this.animId);

      const glideLoop = () => {
        if (this.isDragging) return;

        const distance = targetOffset - this.offset;

        if (Math.abs(distance) > 0.5) {
          this.offset += distance * this.ease;
          this.animId = requestAnimationFrame(glideLoop);
        } else {
          this.offset = targetOffset;
        }
      };

      this.animId = requestAnimationFrame(glideLoop);
    },

    prev() {
      const current = this.getActiveIndex();
      if (current > 0) {
        this.goTo(current - 1);
      }
    },

    next() {
      const current = this.getActiveIndex();
      if (current < this.totalImages - 1) {
        this.goTo(current + 1);
      }
    },

    getActiveIndex() {
      if (!this.snapOffsets || !this.snapOffsets.length) return 0;
      let active = 0;
      let closest = Infinity;
      this.snapOffsets.forEach((snapPos, idx) => {
        const dist = Math.abs(snapPos - this.offset);
        if (dist < closest) {
          closest = dist;
          active = idx;
        }
      });
      return active;
    }
  };
}

// Attach directly to window and Alpine
window.carouselGallery = carouselGallery;

if (window.Alpine) {
  window.Alpine.data('carouselGallery', carouselGallery);
}
document.addEventListener('alpine:init', () => {
  window.Alpine.data('carouselGallery', carouselGallery);
});

export default carouselGallery;