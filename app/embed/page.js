'use client';

import { useSearchParams } from 'next/navigation';
import ReviewWidget from '../components/ReviewWidget';
import { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaStar, FaExternalLinkAlt } from 'react-icons/fa';

export const dynamic = 'force-dynamic';

function EmbedPageContent() {
  const searchParams = useSearchParams();
  const placeId = searchParams.get('placeId');
  const [place, setPlace] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Parse widget settings from URL parameters
  const settings = {
    theme: searchParams.get('theme') || 'light',
    accentColor: searchParams.get('accentColor') || '#4F46E5',
    filterRating: parseInt(searchParams.get('filterRating') || '0'),
    sortByDate: searchParams.get('sortByDate') === 'true',
    sortDirection: searchParams.get('sortDirection') || 'desc',
    showPhotos: searchParams.get('showPhotos') === 'true',
    compactView: searchParams.get('compactView') === 'true',
    maxReviews: parseInt(searchParams.get('maxReviews') || '5'),
    layout: searchParams.get('layout') || 'grid',
    spacing: parseInt(searchParams.get('spacing') || '6'),
    cardWidth: parseInt(searchParams.get('cardWidth') || '400'),
    showVerifiedBadge: searchParams.get('showVerifiedBadge') === 'true',
    animationStyle: searchParams.get('animationStyle') || 'fade',
    enableSlider: searchParams.get('enableSlider') === 'true',
    slidesPerView: JSON.parse(searchParams.get('slidesPerView') || '{"mobile":1,"tablet":2,"desktop":3}'),
    borderRadius: parseInt(searchParams.get('borderRadius') || '12'),
    customFont: searchParams.get('customFont') || 'inherit',
    borderWidth: parseInt(searchParams.get('borderWidth') || '1'),
    borderColor: searchParams.get('borderColor') || '#e5e7eb',
    shadowSize: searchParams.get('shadowSize') || 'md',
    hoverEffect: searchParams.get('hoverEffect') || 'none',
    customCSS: searchParams.get('customCSS') || ''
  };

  useEffect(() => {
    if (!placeId) {
      setError('Place ID is required');
      setLoading(false);
      return;
    }

    const fetchPlaceDetails = async () => {
      try {
        const response = await axios.get('/api/places/details', {
          params: { placeId }
        });
        setPlace({ id: placeId, ...response.data.place });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching place details:', err);
        setError('Failed to load place details');
        setLoading(false);
      }
    };

    fetchPlaceDetails();
  }, [placeId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading widget...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-md w-full border border-red-200 dark:border-red-900">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30">
            <FaStar className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-2">Error</h2>
          <p className="text-center text-red-600 dark:text-red-400">{error}</p>
          <div className="mt-6 text-center">
            <a 
              href="/"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Return to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Check if this is an embed-only view (for external websites)
  const embedOnly = searchParams.get('embedOnly') === 'true';

  return (
    <div className={`h-full w-full ${embedOnly ? 'embed-only' : ''}`} style={{ margin: 0, padding: 0 }}>
      <ReviewWidget
        place={place}
        reviews={place?.reviews || []}
        {...settings}
      />
      {/* Add custom styles for embed-only mode */}
      {embedOnly && (
        <style jsx global>{`
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            background: transparent !important;
          }
          .embed-only {
            border: none !important;
            box-shadow: none !important;
          }
          /* Hide any footer, header or navigation elements */
          footer, header, nav, .footer, .header, .navigation {
            display: none !important;
          }
          /* Remove any margins that might create extra space */
          * {
            margin-bottom: 0 !important;
          }
        `}</style>
      )}
    </div>
  );
}

export default function EmbedPage() {
  // Get search params to check if this is an embed-only view
  let embedOnly = false;
  
  // This is a client component, so we need to check if window is defined
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    embedOnly = params.get('embedOnly') === 'true';
  }

  return (
    <Suspense fallback={
      <div className={`flex items-center justify-center ${embedOnly ? 'bg-transparent' : 'min-h-screen bg-gray-50 dark:bg-gray-900'}`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className={`mt-4 ${embedOnly ? 'text-gray-600' : 'text-gray-600 dark:text-gray-300'}`}>Loading widget...</p>
        </div>
      </div>
    }>
      <EmbedPageContent />
    </Suspense>
  );
}