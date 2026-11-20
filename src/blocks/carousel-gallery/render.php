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
    class="w-full overflow-hidden"
    <?php if ($total_images > 1) : ?>
    :class="isDragging ? 'cursor-grabbing' : 'cursor-grab'"
    <?php endif; ?>>
    <div
      x-ref="track"
      class="flex gap-3 will-change-transform items-center"
      :style="`transform: translate3d(${offset}px, 0px, 0px);`">
      <?php foreach ($images as $index => $image) : ?>
        <div class="relative shrink-0 h-72 sm:h-80 md:h-96 w-full flex justify-center rounded-2xl overflow-hidden bg-transparent">
          <img
            src="<?php echo esc_url($image['url'] ?? ''); ?>"
            alt="<?php echo esc_attr($image['alt'] ?? ''); ?>"
            class="h-full w-auto max-w-none object-contain pointer-events-none rounded-2xl"
            loading="lazy" />

          <?php if (!empty($image['tag'])) : ?>
            <span class="absolute bottom-3 left-3 z-10 pointer-events-none pill-tag bg-white text-secondary shadow-md! truncate max-w-100">
              <?php echo esc_html($image['tag']); ?>
            </span>
          <?php endif; ?>

          <?php if ($has_lightbox) : ?>
            <button
              type="button"
              @mousedown.stop
              @touchstart.stop
              aria-label="Expand image"
              class="wp-block-image absolute bottom-3 right-3 z-10 p-2 rounded-full bg-white text-secondary shadow-md clickable">
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

  <!-- Navigation Dots Indicator -->
  <?php if ($total_images > 1) : ?>
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
  <?php endif; ?>
</div>