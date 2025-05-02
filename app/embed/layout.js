'use client';

import { useSearchParams } from 'next/navigation';

export default function EmbedLayout({ children }) {
  // Get search params to check if this is an embed-only view
  let embedOnly = false;
  
  // This is a client component, so we need to check if window is defined
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    embedOnly = params.get('embedOnly') === 'true';
  }

  // If this is an embed-only view, we need to completely override the main layout
  if (embedOnly) {
    return (
      <html lang="en" data-embed-only="true">
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
          <style dangerouslySetInnerHTML={{ __html: `
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              overflow: hidden !important;
              height: auto !important;
              width: auto !important;
              background: transparent !important;
            }
            /* Remove any potential headers, footers or navigation */
            header, footer, nav, .footer, .header, .navigation {
              display: none !important;
            }
            /* Remove any margins that might create extra space */
            * {
              margin-bottom: 0 !important;
            }
          `}} />
        </head>
        <body style={{ margin: 0, padding: 0, background: 'transparent' }} className="embed-mode">
          {children}
        </body>
      </html>
    );
  }

  // Regular layout for non-embed view
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-['Inter',sans-serif]">
        {children}
      </body>
    </html>
  );
}