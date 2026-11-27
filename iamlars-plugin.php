<?php

/**
 * Plugin Name: iamlars
 * Description: Adding custom blocks for a personal portfolio website.
 * Version:     1.2.1
 * Author URI:  https://iamlars.nl/
 * Author:      LBeukennoot
 * Text Domain: iamlars-plugin
 */

if (!defined('ABSPATH')) {
    exit;
}

// 1. Always use absolute paths with __DIR__ to prevent path resolution crashes
$puc_file = __DIR__ . '/vendor/plugin-update-checker/plugin-update-checker.php';

if (file_exists($puc_file)) {
    require_once $puc_file;

    // 2. Build the update checker
    $myUpdateChecker = \YahnisElsts\PluginUpdateChecker\v6\PucFactory::buildUpdateChecker(
        'https://github.com/LBeukennoot/iamlars-plugin/',
        __FILE__,
        'iamlars-plugin'
    );

    // Set the stable branch
    $myUpdateChecker->setBranch('main');

    // 3. Type-hint to satisfy the IDE and guard against null VCS API
    /** @var \YahnisElsts\PluginUpdateChecker\v6\Vcs\GitHubApi|null $vcsApi */
    $vcsApi = method_exists($myUpdateChecker, 'getVcsApi') ? $myUpdateChecker->getVcsApi() : null;

    if ($vcsApi && method_exists($vcsApi, 'enableReleaseAssets')) {
        $vcsApi->enableReleaseAssets();
    }
}

add_action('init', function () {
    $dir = plugin_dir_path(__FILE__);
    $url = plugin_dir_url(__FILE__);

    // 1. Register style
    if (file_exists($dir . 'dist/blocks.css')) {
        wp_register_style(
            'iamlars-blocks-style',
            $url . 'dist/blocks.css',
            [],
            filemtime($dir . 'dist/blocks.css')
        );
    }

    // 2. Register separate handles for the editor (needs wp-* globals) and frontend (no wp-* globals)
    if (file_exists($dir . 'dist/blocks.js')) {
        wp_register_script(
            'iamlars-blocks-editor-script',
            $url . 'dist/blocks.js',
            ['wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components'],
            filemtime($dir . 'dist/blocks.js'),
            true
        );

        wp_register_script(
            'iamlars-blocks-view-script',
            $url . 'dist/blocks.js',
            [],
            filemtime($dir . 'dist/blocks.js'),
            true
        );
    }

    // 3. Register the block metadata
    register_block_type($dir . 'src/blocks/image-comparison/block.json', [
        'editor_script' => 'iamlars-blocks-editor-script',
        'editor_style'  => 'iamlars-blocks-style',
        'style'         => 'iamlars-blocks-style',
    ]);
    register_block_type($dir . 'src/blocks/carousel-gallery/block.json', [
        'editor_script' => 'iamlars-blocks-editor-script',
        'editor_style'  => 'iamlars-blocks-style',
        'style'         => 'iamlars-blocks-style',
        'view_script'   => 'iamlars-blocks-view-script',
    ]);
    register_block_type($dir . 'src/blocks/skill-rating/block.json', [
        'editor_script' => 'iamlars-blocks-editor-script',
        'editor_style'  => 'iamlars-blocks-style',
        'style'         => 'iamlars-blocks-style',
    ]);
});

// Explicitly ensure the editor loads your bundled assets
add_action('enqueue_block_editor_assets', function () {
    wp_enqueue_script('iamlars-blocks-editor-script');
    wp_enqueue_style('iamlars-blocks-style');
});

// Enqueue frontend script site-wide at priority 5 so Alpine & carouselGallery register before theme scripts
// add_action('wp_enqueue_scripts', function () {
//     wp_enqueue_script('iamlars-blocks-view-script');
// }, 5);

add_filter('block_categories_all', function ($categories) {
    array_unshift($categories, [
        'slug'  => 'iamlars',
        'title' => 'iamlars',
        'icon'  => null,
    ]);

    return $categories;
});