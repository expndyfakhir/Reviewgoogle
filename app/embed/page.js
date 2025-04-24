'use client';

import { useSearchParams } from 'next/navigation';
import ReviewWidget from '../components/ReviewWidget';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaStar, FaExternalLinkAlt } from 'react-icons/fa';

export default function EmbedPage() {
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
    animationStyle: searchParams.get('animationStyle') || 'fade'
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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-6xl mx-auto"
    >
      {place && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{place.name}</h1>
            {place.formatted_address && (
              <p className="text-gray-600 dark:text-gray-300 mt-1">{place.formatted_address}</p>
            )}
          </div>
          <a 
            href={`/widget?placeId=${placeId}`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors self-start"
          >
            <span>Customize Widget</span>
            <FaExternalLinkAlt className="ml-2 w-3 h-3" />
          </a>
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <ReviewWidget
          place={place}
          reviews={place?.reviews || []}
          {...settings}
        />
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>This widget is embedded using the Google Reviews Widget tool.</p>
        <p>© {new Date().getFullYear()} Google Reviews Widget</p>
      </div>
    </motion.div>
  );
}