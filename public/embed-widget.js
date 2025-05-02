/**
 * Google Reviews Widget Embed Script
 * This script allows embedding the Google Reviews Widget on any website
 * without showing any headers or footers from the original site
 */

(function() {
  // Main initialization function
  window.initGoogleReviewsWidget = function(config) {
    if (!config || !config.containerId || !config.placeId) {
      console.error('Google Reviews Widget: Missing required configuration');
      return;
    }

    const container = document.getElementById(config.containerId);
    if (!container) {
      console.error(`Google Reviews Widget: Container element with ID '${config.containerId}' not found`);
      return;
    }

    // Build query parameters from config
    const params = new URLSearchParams();
    params.append('placeId', config.placeId);
    params.append('embedOnly', 'true'); // Always set embed-only mode
    
    // Add all other settings
    Object.keys(config).forEach(key => {
      if (key !== 'containerId' && key !== 'placeId' && key !== 'apiUrl') {
        // Handle objects like slidesPerView by stringifying them
        if (typeof config[key] === 'object') {
          params.append(key, JSON.stringify(config[key]));
        } else {
          params.append(key, config[key]);
        }
      }
    });

    // Create iframe
    const iframe = document.createElement('iframe');
    const apiUrl = config.apiUrl || window.location.origin;
    iframe.src = `${apiUrl}/embed?${params.toString()}`;
    iframe.width = '100%';
    iframe.height = '600px';
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.style.margin = '0';
    iframe.style.padding = '0';
    iframe.style.display = 'block';
    iframe.scrolling = 'no';
    iframe.title = 'Google Reviews Widget';
    iframe.frameBorder = '0';
    
    // Add iframe to container
    container.innerHTML = '';
    container.appendChild(iframe);

    // Handle responsive height
    const resizeObserver = new ResizeObserver(() => {
      // Adjust container height if needed
      if (iframe.contentWindow) {
        try {
          // This might fail due to cross-origin restrictions
          const height = iframe.contentWindow.document.body.scrollHeight;
          if (height > 0) {
            iframe.height = `${height}px`;
          }
        } catch (e) {
          // Ignore cross-origin errors
        }
      }
    });

    // Observe the iframe for size changes
    resizeObserver.observe(iframe);

    // Return public API
    return {
      refresh: function() {
        // Reload the iframe
        iframe.src = iframe.src;
      },
      updateConfig: function(newConfig) {
        // Merge new config with existing and reinitialize
        const mergedConfig = {...config, ...newConfig};
        return window.initGoogleReviewsWidget(mergedConfig);
      }
    };
  };
})();