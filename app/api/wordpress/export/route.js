import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get('placeId');
  const settings = JSON.parse(searchParams.get('settings') || '{}');

  if (!placeId) {
    return NextResponse.json({ error: 'Place ID parameter is required' }, { status: 400 });
  }

  // Generate WordPress shortcode
  const shortcode = `[google_reviews_widget place_id="${placeId}"
    theme="${settings.theme || 'light'}"
    filter_rating="${settings.filterRating || 0}"
    sort_by_date="${settings.sortByDate || false}"
    sort_direction="${settings.sortDirection || 'desc'}"
    show_photos="${settings.showPhotos || true}"
    compact_view="${settings.compactView || false}"
    max_reviews="${settings.maxReviews || 5}"
    layout="${settings.layout || 'grid'}"
    spacing="${settings.spacing || 6}"
    card_width="${settings.cardWidth || 400}"]`;

  // Generate PHP code for WordPress plugin
  const phpCode = `<?php
/*
Plugin Name: Google Reviews Widget
Description: Display Google Reviews with customizable layout
Version: 1.0
Author: Your Name
*/

function google_reviews_widget_shortcode($atts) {
    $defaults = array(
        'place_id' => '',
        'theme' => 'light',
        'filter_rating' => 0,
        'sort_by_date' => false,
        'sort_direction' => 'desc',
        'show_photos' => true,
        'compact_view' => false,
        'max_reviews' => 5,
        'layout' => 'grid',
        'spacing' => 6,
        'card_width' => 400
    );
    
    $atts = shortcode_atts($defaults, $atts, 'google_reviews_widget');
    
    // Enqueue necessary styles and scripts
    wp_enqueue_style('google-reviews-widget-style', plugin_dir_url(__FILE__) . 'css/style.css');
    wp_enqueue_script('google-reviews-widget-script', plugin_dir_url(__FILE__) . 'js/widget.js', array('jquery'), '1.0', true);
    
    // Pass attributes to JavaScript
    wp_localize_script('google-reviews-widget-script', 'googleReviewsWidgetSettings', $atts);
    
    // Return widget container
    return '<div id="google-reviews-widget" data-settings="' . esc_attr(json_encode($atts)) . '"></div>';
}
add_shortcode('google_reviews_widget', 'google_reviews_widget_shortcode');
?>`;

  // Generate installation instructions
  const instructions = {
    steps: [
      '1. Create a new plugin in WordPress by adding a new directory in wp-content/plugins/',
      '2. Create a new file named google-reviews-widget.php and paste the PHP code provided above',
      '3. Create css and js directories in your plugin folder',
      '4. Add your custom CSS and JavaScript files',
      '5. Activate the plugin in WordPress admin panel',
      '6. Use the shortcode provided below to embed the widget in your posts or pages'
    ],
    shortcode,
    phpCode
  };

  return NextResponse.json(instructions);
}