<?php

/**
 * Dynamic Render for Two Images Comparison Block (Alpine.js)
 */
$image_a_url = $attributes['imageAUrl'] ?? '';
$image_a_alt = $attributes['imageAAlt'] ?? '';
$image_a_tag = $attributes['imageATag'] ?? '';
$image_b_url = $attributes['imageBUrl'] ?? '';
$image_b_alt = $attributes['imageBAlt'] ?? '';
$image_b_tag = $attributes['imageBTag'] ?? '';

if (empty($image_a_url) && empty($image_b_url)) {
  return;
}

// Fallback if only one image exists
if (empty($image_a_url) || empty($image_b_url)) {
  $fallback_url = $image_a_url ?: $image_b_url;
  $fallback_alt = $image_a_url ? $image_a_alt : $image_b_alt;
  $wrapper = get_block_wrapper_attributes(['class' => 'h-full max-w-4xl aspect-video overflow-hidden rounded-3xl select-none']);
?>
  <div <?php echo $wrapper; ?>>
    <img src="<?php echo esc_url($fallback_url); ?>" alt="<?php echo esc_attr($fallback_alt); ?>" class="w-full h-auto object-cover block" />
  </div>
<?php
  return;
}

$wrapper = get_block_wrapper_attributes([
  'class' => 'relative h-full max-w-4xl aspect-video overflow-hidden rounded-3xl select-none',
]);
?>

<div <?php echo $wrapper; ?>
  x-data="{ pos: 50 }">
  <img
    src="<?php echo esc_url($image_b_url); ?>"
    alt="<?php echo esc_attr($image_b_alt); ?>"
    class="absolute inset-0 w-full h-full object-cover pointer-events-none" />
  <?php if (!empty($image_b_tag)) : ?>
    <span class="absolute bottom-3 right-3 z-0 px-2 pb-0.5 bg-white text-secondary text-sm font-display font-medium rounded-full shadow-sm pointer-events-none">
      <?php echo esc_html($image_b_tag); ?>
    </span>
  <?php endif; ?>

  <div
    class="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
    :style="`clip-path: inset(0 ${100 - pos}% 0 0);`"
    style="clip-path: inset(0 50% 0 0);">
    <img
      src="<?php echo esc_url($image_a_url); ?>"
      alt="<?php echo esc_attr($image_a_alt); ?>"
      class="absolute inset-0 w-full h-full object-cover" />

    <?php if (!empty($image_a_tag)) : ?>
      <span class="absolute bottom-3 left-3 z-10 px-2 pb-0.5 bg-white text-secondary text-sm font-display font-medium rounded-full shadow-sm pointer-events-none">
        <?php echo esc_html($image_a_tag); ?>
      </span>
    <?php endif; ?>
  </div>

  <div
    class="absolute top-0 bottom-0 w-1 bg-primary pointer-events-none flex items-center justify-center -translate-x-1/2"
    :style="`left: ${pos}%;`"
    style="left: 50%;">
    <div class="absolute w-8 h-8 bg-white rounded-full flex items-center justify-center text-xs font-bold border-4 border-primary">
    </div>
  </div>

  <input
    type="range"
    min="0"
    max="100"
    x-model="pos"
    aria-label="Compare images"
    class="absolute inset-0 w-full h-full opacity-0 cursor-grab z-10" />
</div>