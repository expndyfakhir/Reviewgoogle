'use client';

export default function EmbedLayout({ children }) {
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