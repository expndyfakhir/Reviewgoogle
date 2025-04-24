(function() {
  // Find the widget container
  const widgetContainer = document.getElementById('google-review-widget');
  if (!widgetContainer) return;
  
  // Get the widget data from the data-widget attribute
  const encodedData = widgetContainer.getAttribute('data-widget');
  if (!encodedData) return;
  
  try {
    // Decode the base64 encoded data
    const decodedData = atob(encodedData);
    const widgetData = JSON.parse(decodedData);
    
    // Extract data
    const { place, reviews, settings } = widgetData;
    
    // Create widget HTML
    const widgetHTML = `
      <div class="grw-container" style="
        width: ${settings.width}px; 
        height: ${settings.height}px; 
        border-radius: ${settings.borderRadius}px;
        background-color: ${settings.theme === 'light' ? '#ffffff' : '#1f2937'};
        color: ${settings.theme === 'light' ? '#000000' : '#ffffff'};
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        overflow: hidden;
        border: 1px solid ${settings.theme === 'light' ? '#e5e7eb' : '#374151'};
      ">
        <div style="padding: 16px;">
          <h3 style="
            margin: 0 0 8px 0; 
            font-size: 18px; 
            font-weight: 600;
          ">${place.name}</h3>
          
          ${place.formatted_address ? `
            <p style="
              margin: 0 0 12px 0; 
              font-size: 14px; 
              color: ${settings.theme === 'light' ? '#6b7280' : '#d1d5db'};
            ">${place.formatted_address}</p>
          ` : ''}
          
          ${settings.showRating && place.rating ? `
            <div style="display: flex; align-items: center; margin-bottom: 16px;">
              <div style="display: flex;">
                ${Array(5).fill().map((_, i) => `
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                    style="color: ${i < Math.round(place.rating) ? '#facc15' : settings.theme === 'light' ? '#d1d5db' : '#4b5563'};"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                `).join('')}
              </div>
              <span style="
                margin-left: 8px; 
                font-size: 14px; 
                color: ${settings.theme === 'light' ? '#6b7280' : '#d1d5db'};
              ">${place.rating} (${place.user_ratings_total} reviews)</span>
            </div>
          ` : ''}
          
          <div style="
            overflow-y: auto; 
            max-height: ${settings.height - 120}px;
          ">
            ${reviews.map(review => `
              <div style="
                padding: 12px; 
                margin-bottom: 12px; 
                border-radius: 8px; 
                background-color: ${settings.theme === 'light' ? '#f9fafb' : '#374151'};
              ">
                <div style="display: flex; align-items: flex-start;">
                  ${review.profile_photo_url ? `
                    <img 
                      src="${review.profile_photo_url}" 
                      alt="${review.author_name}'s profile" 
                      style="width: 32px; height: 32px; border-radius: 50%; margin-right: 8px;"
                    />
                  ` : ''}
                  <div>
                    <h4 style="
                      margin: 0 0 4px 0; 
                      font-size: 14px; 
                      font-weight: 600;
                    ">${review.author_name}</h4>
                    
                    ${settings.showRating ? `
                      <div style="display: flex; align-items: center; margin-bottom: 4px;">
                        <div style="display: flex;">
                          ${Array(5).fill().map((_, i) => `
                            <svg 
                              width="12" 
                              height="12" 
                              viewBox="0 0 20 20" 
                              fill="currentColor"
                              style="color: ${i < review.rating ? '#facc15' : settings.theme === 'light' ? '#d1d5db' : '#4b5563'};"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          `).join('')}
                        </div>
                        
                        ${settings.showDate ? `
                          <span style="
                            margin-left: 8px; 
                            font-size: 12px; 
                            color: ${settings.theme === 'light' ? '#6b7280' : '#9ca3af'};
                          ">
                            ${new Date(review.time * 1000).toLocaleDateString()}
                          </span>
                        ` : ''}
                      </div>
                    ` : ''}
                    
                    <p style="
                      margin: 0; 
                      font-size: 13px; 
                      color: ${settings.theme === 'light' ? '#374151' : '#e5e7eb'};
                    ">
                      ${review.text.length > 150 ? `${review.text.substring(0, 150)}...` : review.text}
                    </p>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
          
          <div style="
            margin-top: 12px; 
            text-align: center; 
            font-size: 12px;
          ">
            <a 
              href="https://maps.google.com/?cid=${place.id}" 
              style="
                color: ${settings.theme === 'light' ? '#2563eb' : '#60a5fa'}; 
                text-decoration: none;
              "
              target="_blank"
              rel="noopener noreferrer"
            >
              Powered by Google Places Review Widget
            </a>
          </div>
        </div>
      </div>
    `;
    
    // Set the widget HTML
    widgetContainer.innerHTML = widgetHTML;
    
  } catch (error) {
    console.error('Error rendering Google Places Review Widget:', error);
    widgetContainer.innerHTML = `<div style="padding: 16px; color: #ef4444;">Error loading review widget</div>`;
  }
})();