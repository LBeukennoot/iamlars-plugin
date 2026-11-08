<?php
/**
 * Plugin Name: iamlars-plugin
 * Description: Custom blocks built with Vite and Tailwind v4.
 * Version: 1.0.0
 * Author: LBeukennoot
 */

if (!defined('ABSPATH')) {
    exit;
}

// 1. Initialize Plugin Update Checker
require_once __DIR__ . '/vendor/plugin-update-checker/plugin-update-checker.php';
use YahnisElsts\PluginUpdateChecker\v5\PucFactory;

$myUpdateChecker = PucFactory::buildUpdateChecker(
    'https://github.com/LBeukennoot/iamlars-plugin', // Replace with your actual GitHub repo URL
    __FILE__,
    'iamlars-plugin'
);

// Tells PUC to look for release ZIP assets rather than the raw repository source code
$myUpdateChecker->getVcsApi()->enableReleaseAssets();

// If your GitHub repository is PRIVATE, generate a personal access token (classic or fine-grained)
// with 'Contents: Read' permissions and uncomment the line below:
// $myUpdateChecker->setAuthentication('YOUR_GITHUB_PERSONAL_ACCESS_TOKEN');

if (!defined('ABSPATH')) {
    exit;
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

    // 2. Register script
    if (file_exists($dir . 'dist/blocks.js')) {
        wp_register_script(
            'iamlars-blocks-script',
            $url . 'dist/blocks.js',
            ['wp-blocks', 'wp-element', 'wp-block-editor'],
            filemtime($dir . 'dist/blocks.js'),
            true
        );
    }

    // 3. Register the block metadata
    register_block_type($dir . 'src/blocks/image-comparison/block.json', [
        'editor_script' => 'iamlars-blocks-script',
        'editor_style'  => 'iamlars-blocks-style',
        'style'         => 'iamlars-blocks-style',
    ]);
    register_block_type($dir . 'src/blocks/carousel-gallery/block.json', [
        'editor_script' => 'iamlars-blocks-script',
        'editor_style'  => 'iamlars-blocks-style',
        'style'         => 'iamlars-blocks-style',
        'view_script'   => 'iamlars-blocks-script', // <-- REQUIRED for front-end Alpine/JS
    ]);
});

// Explicitly ensure the editor loads your bundled assets
add_action('enqueue_block_editor_assets', function () {
    wp_enqueue_script('iamlars-blocks-script');
    wp_enqueue_style('iamlars-blocks-style');
});

// Add type="module" so the browser executes the ES output
add_filter('script_loader_tag', function ($tag, $handle, $src) {
    if (in_array($handle, ['iamlars-blocks-script', 'iamlars-view-comparison'], true)) {
        return '<script type="module" src="' . esc_url($src) . '"></script>';
    }
    return $tag;
}, 10, 3);

// In iamlars-plugin.php
add_action('wp_enqueue_scripts', function () {
    $dir = plugin_dir_path(__FILE__);
    $url = plugin_dir_url(__FILE__);

    if (file_exists($dir . 'dist/blocks.js')) {
        wp_enqueue_script(
            'iamlars-blocks-script',
            $url . 'dist/blocks.js',
            [],
            filemtime($dir . 'dist/blocks.js'),
            false // Load in <head> or before the theme's main.js
        );
    }
}, 5); // Priority 5 so it executes before standard scripts (priority 10)
