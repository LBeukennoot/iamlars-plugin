<?php
$skill            = $attributes['skill'] ?? '';
$rating           = max(0, min(5, (int) ($attributes['rating'] ?? 0)));
$url              = $attributes['url'] ?? '';
$opens_in_new_tab = !empty($attributes['opensInNewTab']);

if (empty($skill)) {
    return;
}

$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'flex items-center justify-between gap-4 w-full pb-2 max-w-sm mx-auto sm:ml-0!',
]);
?>

<div <?php echo $wrapper_attributes; ?>>
    <?php if (!empty($url)) : ?>
        <a
            href="<?php echo esc_url($url); ?>"
            <?php echo $opens_in_new_tab ? 'target="_blank" rel="noopener noreferrer"' : ''; ?>
            class="font-sans text-secondary! lowercase hover:text-primary transition-colors underline decoration-primary hover:decoration-primary underline-offset-4"
        >
            <?php echo esc_html($skill); ?>
        </a>
    <?php else : ?>
        <span class="font-sans text-secondary lowercase">
            <?php echo esc_html($skill); ?>
        </span>
    <?php endif; ?>

    <div
        class="flex items-center gap-1.5 shrink-0"
        role="img"
        aria-label="<?php echo esc_attr(sprintf('%d out of 5', $rating)); ?>"
    >
        <?php for ($i = 1; $i <= 5; $i++) : ?>
            <span
                aria-hidden="true"
                class="w-3.5 h-3.5 rounded-full <?php echo $i <= $rating ? 'bg-primary' : 'bg-slate-200'; ?>"
            ></span>
        <?php endfor; ?>
        <span class="sr-only"><?php echo esc_html(sprintf('%d out of 5', $rating)); ?></span>
    </div>
</div>