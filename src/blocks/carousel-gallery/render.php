<?php

/**
 * Dynamic Render for Carousel Gallery Block (Alpine.js)
 */
$images = $attributes['images'] ?? [];

if (empty($images)) {
  return;
}

$total_images = count($images);
$wrapper = get_block_wrapper_attributes([
  'class' => 'relative w-full h-full select-none flex flex-col',
]);
?>

<div
  <?php echo $wrapper; ?>
  x-data="carouselGallery({
    totalImages: <?php echo (int) $total_images; ?>
  })"
  x-init="init()"
  @mousedown="onDragStart($event)"
  @mousemove.window="isDragging && onDragMove($event)"
  @mouseup.window="isDragging && onDragEnd()"
  @touchstart="onTouchStart($event)"
  @touchmove.window="isDragging && onTouchMove($event)"
  @touchend.window="isDragging && onDragEnd()">
<!-- Linear Horizontal Viewport -->
  <div
    class="w-full overflow-hidden"
    :class="isDragging ? 'cursor-grabbing' : 'cursor-grab'">
    <div
      x-ref="track"
      class="flex gap-3 will-change-transform items-center"
      :style="`transform: translate3d(${offset}px, 0px, 0px);`">
      <?php foreach ($images as $index => $image) : ?>
        <div
          class="shrink-0 h-72 sm:h-80 md:h-96 w-full rounded-2xl overflow-hidden bg-transparent">
          <img
            src="<?php echo esc_url($image['url'] ?? ''); ?>"
            alt="<?php echo esc_attr($image['alt'] ?? ''); ?>"
            class="h-full w-auto max-w-none object-contain pointer-events-none rounded-2xl"
            loading="lazy" />
        </div>
      <?php endforeach; ?>
    </div>
  </div>

  <!-- Navigation Dots Indicator -->
  <div class="flex items-center justify-center gap-2 mt-3 z-10">
    <template x-for="(dot, i) in Array.from({ length: totalImages })" :key="i">
      <button
        type="button"
        @click="goTo(i)"
        class="h-2 rounded-full transition-all duration-300"
        :class="getActiveIndex() === i ? 'w-6 bg-secondary' : 'w-2 bg-primary hover:bg-secondary cursor-pointer'"
        :aria-label="`Go to slide ${i + 1}`"></button>
    </template>
  </div>
</div>