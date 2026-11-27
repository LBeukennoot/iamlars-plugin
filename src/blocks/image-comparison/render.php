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

$aspect_ratio = $attributes['aspectRatio'] ?? '';

if (empty($image_a_url) && empty($image_b_url)) {
  return;
}

// Fallback if only one image exists
if (empty($image_a_url) || empty($image_b_url)) {
  $fallback_url = $image_a_url ?: $image_b_url;
  $fallback_alt = $image_a_url ? $image_a_alt : $image_b_alt;
  $wrapper = get_block_wrapper_attributes([
    'class' => "h-full max-h-2xl min-w-4xl {$aspect_ratio} overflow-hidden rounded-3xl select-none",
  ]);
?>
  <div <?php echo $wrapper; ?>>
    <img src="<?php echo esc_url($fallback_url); ?>" alt="<?php echo esc_attr($fallback_alt); ?>" class="w-full h-full object-cover block" />
  </div>
<?php
  return;
}

$wrapper = get_block_wrapper_attributes([
  'class' => "relative w-full overflow-hidden rounded-3xl select-none font-sans",
  'style' => 'aspect-ratio: ' . esc_attr($aspect_ratio) . ';'
]);
?>

<!-- <div <?php echo $wrapper; ?> -->

<div class="flex flex-col gap-5">
  <div
    class="relative w-full h-max rounded-3xl select-none group"
    style="aspect-ratio: <?php echo $aspect_ratio ?>"
    x-data="{ pos: 50 }">
    <img
      src="<?php echo esc_url($image_b_url); ?>"
      alt="<?php echo esc_attr($image_b_alt); ?>"
      class="absolute inset-0 w-full h-full object-cover pointer-events-none" />

    <div
      class="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
      :style="`clip-path: inset(0 ${100 - pos}% 0 0);`"
      style="clip-path: inset(0 50% 0 0);">
      <img
        src="<?php echo esc_url($image_a_url); ?>"
        alt="<?php echo esc_attr($image_a_alt); ?>"
        class="absolute inset-0 w-full h-full object-cover" />


    </div>

    <div
      class="absolute top-0 bottom-0 w-1 bg-primary pointer-events-none flex items-center justify-center -translate-x-1/2"
      :style="`left: ${pos}%;`"
      style="left: 50%;">
      <div class="absolute group-hover:scale-95 group-active:scale-90 w-8 h-8 bg-white rounded-full flex items-center justify-center text-xs font-bold border-4 border-primary">
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

  <div class="flex justify-between gap-2">
    <?php if (!empty($image_a_tag)) : ?>
      <span class="z-10 pointer-events-none pill-tag bg-primary text-white truncate max-w-70">
        <?php echo esc_html($image_a_tag); ?>
      </span>
    <?php endif; ?>
    <?php if (!empty($image_b_tag)) : ?>
      <span class="z-0 pointer-events-none pill-tag bg-primary text-white truncate max-w-70">
        <?php echo esc_html($image_b_tag); ?>
      </span>
    <?php endif; ?>
  </div>
</div>