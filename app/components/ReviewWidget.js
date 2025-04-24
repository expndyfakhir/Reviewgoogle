'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaUser, FaCalendarAlt, FaQuoteLeft, FaCheck, FaShieldAlt } from 'react-icons/fa';

export default function ReviewWidget({ 
  place, 
  reviews, 
  filterRating = 0, 
  sortByDate = true, 
  sortDirection = 'desc', 
  showPhotos = true, 
  compactView = false, 
  maxReviews = 5, 
  layout = 'grid', 
  spacing = 6, 
  cardWidth = 400, 
  theme = 'light',
  accentColor = '#4F46E5',
  showVerifiedBadge = true,
  animationStyle = 'fade',
  enableSlider = false,
  slidesPerView = { mobile: 1, tablet: 2, desktop: 3 }
}) {
  const [hoveredReview, setHoveredReview] = useState(null);
  const [displayedReviews, setDisplayedReviews] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Handle responsive breakpoints
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle touch events for slider
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left
      setCurrentSlide(prev => Math.min(prev + 1, displayedReviews.length - getSlidesPerView()));
    }
    if (touchStart - touchEnd < -75) {
      // Swipe right
      setCurrentSlide(prev => Math.max(prev - 1, 0));
    }
  };

  const getSlidesPerView = () => {
    if (isMobile) return slidesPerView.mobile;
    if (isTablet) return slidesPerView.tablet;
    return slidesPerView.desktop;
  };

  // Process reviews whenever inputs change
  useEffect(() => {
    if (!reviews?.length) return;
    
    const processed = reviews
      .filter(review => filterRating === 0 || review.rating >= filterRating)
      .sort((a, b) => {
        if (sortByDate) {
          return sortDirection === 'desc'
            ? new Date(b.time * 1000) - new Date(a.time * 1000)
            : new Date(a.time * 1000) - new Date(b.time * 1000);
        }
        // Could add more sorting options here
        return 0;
      })
      .slice(0, maxReviews);
    
    setDisplayedReviews(processed);
    
    // Add slight delay for animation
    setTimeout(() => setIsLoaded(true), 300);
  }, [reviews, filterRating, sortByDate, sortDirection, maxReviews]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const reviewVariants = {
    fade: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
    },
    slide: {
      hidden: { opacity: 0, x: -30 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
    }
  }[animationStyle || 'fade'];

  // Style based on theme and accent color
  const getStarColor = (active) => {
    if (active) return '#FFC107'; // Always yellow for consistency
    return theme === 'dark' ? '#4B5563' : '#E5E7EB';
  };

  // Adjust accent color for dark theme
  const getAccentColor = () => {
    return theme === 'dark' 
      ? accentColor 
      : accentColor;
  };

  if (!place || !reviews?.length) {
    return (
      <div className={`p-6 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl`}>
        <FaQuoteLeft className="w-12 h-12 mx-auto mb-4 opacity-20" />
        <p className="text-lg">No reviews available</p>
        <p className="text-sm mt-2 opacity-70">Please check back later or try a different place.</p>
      </div>
    );
  }

  // Average rating calculation
  const avgRating = place.rating || 
    (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length);

  // Count ratings by star level
  const ratingCounts = [5, 4, 3, 2, 1].map(stars => {
    return {
      stars,
      count: reviews.filter(review => Math.round(review.rating) === stars).length
    };
  });

  return (
    <div className={`review-widget ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Place Header with Enhanced Design */}
      <div 
        className={`text-center p-6 rounded-xl mb-6 ${theme === 'dark' 
          ? 'bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg' 
          : 'bg-gradient-to-b from-gray-50 to-white shadow-sm border border-gray-100'}`}
        style={{
          background: theme === 'dark' 
            ? `linear-gradient(to bottom, ${getAccentColor()}15, ${theme === 'dark' ? '#1F2937' : '#ffffff'})` 
            : `linear-gradient(to bottom, ${getAccentColor()}10, ${theme === 'dark' ? '#1F2937' : '#ffffff'})`
        }}
      >
        <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {place.name}
        </h2>
        
        {place.formatted_address && (
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
            {place.formatted_address}
          </p>
        )}
        
        <div className="flex items-center justify-center mb-4">
          <div className="flex mr-3">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`w-5 h-5`}
                style={{ 
                  color: i < Math.round(avgRating) ? getStarColor(true) : getStarColor(false)
                }}
              />
            ))}
          </div>
          <span className={`font-semibold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {avgRating?.toFixed(1)}
          </span>
          <span className={`mx-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>•</span>
          <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {place.user_ratings_total?.toLocaleString() || reviews.length} reviews
          </span>
        </div>
        
        {/* Rating distribution bars */}
        <div className="max-w-sm mx-auto">
          {ratingCounts.map(({stars, count}) => {
            const percentage = reviews.length ? (count / reviews.length) * 100 : 0;
            return (
              <div key={stars} className="flex items-center mb-1 text-sm">
                <div className="w-12 text-right mr-2">
                  {stars} <FaStar className="w-3 h-3 inline-block mb-0.5" style={{ color: getStarColor(true) }} />
                </div>
                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full" 
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: getAccentColor()
                    }}></div>
                </div>
                <div className="w-12 ml-2 text-left text-gray-500 dark:text-gray-400">
                  {count}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews Layout with Enhanced Motion */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        className={`${enableSlider 
          ? 'relative overflow-hidden touch-pan-y' 
          : layout === 'grid'
          ? `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-${spacing} w-full`
          : layout === 'row'
          ? 'flex flex-row flex-wrap gap-4 w-full'
          : 'flex flex-col gap-4 w-full'}`}
        onTouchStart={enableSlider ? handleTouchStart : undefined}
        onTouchMove={enableSlider ? handleTouchMove : undefined}
        onTouchEnd={enableSlider ? handleTouchEnd : undefined}
        style={{
          ...(enableSlider && {
            display: 'flex',
            transition: 'transform 0.3s ease-in-out',
            transform: `translateX(-${currentSlide * (100 / getSlidesPerView())}%)`,
          }),
          maxWidth: '100%',
          margin: '0 auto'
        }}
      >
        <AnimatePresence>
          {displayedReviews.map((review, index) => (
            <motion.div
              key={review.time}
              variants={reviewVariants}
              onMouseEnter={() => setHoveredReview(review.time)}
              onMouseLeave={() => setHoveredReview(null)}
              className={`relative p-6 rounded-xl transition-all duration-300 ${
                hoveredReview === review.time ? 'transform scale-[1.02] shadow-md' : 'shadow-sm'
              } ${
                theme === 'dark' 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-white border border-gray-100'
              } ${
                layout === 'row' ? '' : 'w-full'
              }`}
              style={{
                ...(layout === 'row' ? { 
                  flex: '0 0 auto',
                  width: `${cardWidth}px` 
                } : {})
              }}
            >
              <div className="flex items-start space-x-4">
                {/* Author photo/icon */}
                {showPhotos && review.profile_photo_url ? (
                  <div className="relative">
                    <img
                      src={review.profile_photo_url}
                      alt={review.author_name}
                      className="w-12 h-12 rounded-full object-cover border-2"
                      style={{ borderColor: getAccentColor() }}
                    />
                    {showVerifiedBadge && (
                      <div 
                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: getAccentColor() }}
                      >
                        <FaCheck className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: theme === 'dark' ? '#374151' : '#F3F4F6' }}
                  >
                    <FaUser className={`w-6 h-6 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                )}
                
                {/* Review content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-lg font-semibold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {review.author_name}
                    </h3>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className="w-4 h-4"
                          style={{ 
                            color: i < review.rating ? getStarColor(true) : getStarColor(false)
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className={`flex items-center text-sm mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    <FaCalendarAlt className="w-4 h-4 mr-2" />
                    {formatDate(review.time)}
                    
                    {review.relative_time_description && (
                      <>
                        <span className="mx-1">•</span>
                        {review.relative_time_description}
                      </>
                    )}
                  </div>
                  
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} ${
                    compactView ? 'line-clamp-3 hover:line-clamp-none transition-all duration-300' : ''
                  }`}>
                    {review.text || "(This reviewer didn't write a review)"}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Footer */}
      <div className={`text-center text-sm pt-4 mt-6 border-t ${
        theme === 'dark' ? 'text-gray-400 border-gray-700' : 'text-gray-500 border-gray-200'
      }`}>
        <div className="flex items-center justify-center">
          <FaShieldAlt className="w-4 h-4 mr-2" style={{ color: getAccentColor() }} />
          Powered by Google Places
        </div>
      </div>
    </div>
  );
}