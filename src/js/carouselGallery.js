// src/js/carouselGallery.js
function carouselGallery(config = {}) {
  return {
    totalImages: config.totalImages || 0,
    springForce: 0.12,
    dampingFactor: 0.5,

    // Layout metrics (measured dynamically per card)
    snapOffsets: [],
    minBoundary: 0,
    maxBoundary: 0,

    // Position tracking (in pixels)
    offset: 0,
    velocity: 0,
    isDragging: false,
    startX: 0,
    lastX: 0,
    lastTime: 0,
    dragDistance: 0,
    animId: null,

    get minOffset() {
      // Furthest left scroll position (centering the last card)
      return this.minBoundary;
    },

    get maxOffset() {
      // Furthest right scroll position (centering the first card)
      return this.maxBoundary;
    },

    clamp(val, min, max) {
      return Math.max(min, Math.min(max, val));
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
            img.addEventListener('load', () => {
              this.updateMeasurements();
              this.goTo(this.getActiveIndex());
            }, { once: true });
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
        return (viewportWidth / 2) - cardCenter;
      });

      // First card centered is maxOffset; last card centered is minOffset
      this.maxBoundary = this.snapOffsets[0] || 0;
      this.minBoundary = this.snapOffsets[this.snapOffsets.length - 1] || 0;
    },

    onDragStart(e) {
      if (this.totalImages <= 1) return;
      this.isDragging = true;
      this.startX = e.clientX;
      this.lastX = e.clientX;
      this.dragDistance = 0;
      this.lastTime = performance.now();
      this.velocity = 0;
      if (this.animId) cancelAnimationFrame(this.animId);
    },

    onDragMove(e) {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.lastX;
      const now = performance.now();
      const dt = Math.max(now - this.lastTime, 16);

      // Light velocity tracker for flick gestures
      this.velocity = (deltaX / dt) * 16;
      this.dragDistance += Math.abs(deltaX);

      // Rubber-band dampening when dragging beyond endpoints
      if (this.offset > this.maxOffset || this.offset < this.minOffset) {
        this.offset += deltaX * 0.35;
      } else {
        this.offset += deltaX;
      }

      this.lastX = e.clientX;
      this.lastTime = now;
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
      this.settleToTarget();
    },

    settleToTarget() {
      if (!this.snapOffsets || !this.snapOffsets.length) return;

      let targetIndex = 0;
      let closestDist = Infinity;

      // Find the card whose snap position is closest to current offset
      this.snapOffsets.forEach((snapPos, idx) => {
        const dist = Math.abs(snapPos - this.offset);
        if (dist < closestDist) {
          closestDist = dist;
          targetIndex = idx;
        }
      });

      // If flicked with sufficient velocity, increment or decrement by 1 card
      if (Math.abs(this.velocity) > 4) {
        if (this.velocity < 0) {
          targetIndex = Math.min(this.totalImages - 1, targetIndex + 1);
        } else {
          targetIndex = Math.max(0, targetIndex - 1);
        }
      }

      this.goTo(targetIndex);
    },

    goTo(index) {
      if (!this.snapOffsets || this.snapOffsets[index] === undefined) return;
      const targetOffset = this.snapOffsets[index];

      if (this.animId) cancelAnimationFrame(this.animId);

      const springLoop = () => {
        if (this.isDragging) return;

        const distance = targetOffset - this.offset;
        const spring = distance * this.springForce;

        this.velocity += spring;
        this.velocity *= this.dampingFactor;
        this.offset += this.velocity;

        // Settle when close enough to eliminate jitter
        if (Math.abs(distance) > 0.5 || Math.abs(this.velocity) > 0.5) {
          this.animId = requestAnimationFrame(springLoop);
        } else {
          this.offset = targetOffset;
          this.velocity = 0;
        }
      };

      this.animId = requestAnimationFrame(springLoop);
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