<?php
$images = $attributes['images'] ?? [];

if (empty($images)) {
  return;
}

$total_images = count($images);
$has_lightbox = wp_get_theme()->get_stylesheet() === 'iamlars-theme';

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
    class="w-full"
    <?php if ($total_images > 1) : ?>
    :class="isDragging ? 'cursor-grabbing' : 'cursor-grab'"
    <?php endif; ?>>
    <div
      x-ref="track"
      class="flex gap-3 will-change-transform items-center"
      :style="`transform: translate3d(${offset}px, 0px, 0px);`">
      <?php foreach ($images as $index => $image) : ?>
        <div class="relative group shrink-0 h-72 sm:h-80 md:h-96 w-full flex justify-center rounded-2xl overflow-hidden bg-transparent">
          <!-- image   -->
          <img
            src="<?php echo esc_url($image['url'] ?? ''); ?>"
            alt="<?php echo esc_attr($image['alt'] ?? ''); ?>"
            class="h-full w-auto max-w-none object-contain pointer-events-none rounded-2xl"
            loading="lazy" />

          <!-- tag -->
          <?php if (!empty($image['tag'])) : ?>
            <span class="absolute bottom-3 left-3 z-10 pointer-events-none pill-tag bg-white text-secondary shadow-md! truncate max-w-100">
              <?php echo esc_html($image['tag']); ?>
            </span>
          <?php endif; ?>

          <!-- zoom button -->
          <?php if ($has_lightbox) : ?>
            <button
              type="button"
              @mousedown.stop
              @touchstart.stop
              aria-label="Expand image"
              class="wp-block-image absolute bottom-3 right-3 z-10 p-2 rounded-full bg-white text-secondary shadow-md clickable block sm:hidden! group-hover:block">
              <img
                src="<?php echo esc_url($image['url'] ?? ''); ?>"
                alt="<?php echo esc_attr($image['tag'] ?? ''); ?>"
                class="hidden" />
              <?php if (!empty($image['tag'])) : ?>
                <figcaption class="hidden!"><?php echo esc_html($image['tag']); ?></figcaption>
              <?php endif; ?>
              <svg class="w-4 h-4 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </button>
          <?php endif; ?>
        </div>
      <?php endforeach; ?>
    </div>
  </div>

  <!-- Navigation Dots & Prev/Next Controls -->
  <?php if ($total_images > 1) : ?>
    <div class="grid grid-cols-[1fr_auto_1fr] items-center w-full mt-3 z-10">
      <!-- Empty Left Spacer (keeps dots dead-center) -->
      <div></div>

      <!-- Centered Dots -->
      <div class="flex items-center justify-center gap-2">
        <template x-for="(dot, i) in Array.from({ length: totalImages })" :key="i">
          <button
            type="button"
            @click="goTo(i)"
            class="h-2 rounded-full transition-all duration-300"
            :class="getActiveIndex() === i ? 'w-6 bg-secondary' : 'w-2 bg-primary hover:bg-secondary cursor-pointer'"
            :aria-label="`Go to slide ${i + 1}`"></button>
        </template>
      </div>

      <!-- Prev / Next Buttons Stuck to the Right -->
      <div class="flex items-center justify-end gap-2">
        <button
          type="button"
          @mousedown.stop
          @touchstart.stop
          @click="prev()"
          :disabled="getActiveIndex() === 0"
          :class="getActiveIndex() === 0 ? 'opacity-0' : 'clickable'"
          aria-label="Previous slide"
          class="p-2 rounded-full bg-primary text-white">
          <svg class="w-4 h-4 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <button
          type="button"
          @mousedown.stop
          @touchstart.stop
          @click="next()"
          :disabled="getActiveIndex() === totalImages - 1"
          :class="getActiveIndex() === totalImages - 1 ? 'opacity-0' : 'clickable'"
          aria-label="Next slide"
          class="p-2 rounded-full bg-primary text-white">
          <svg class="w-4 h-4 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  <?php endif; ?>
</div>