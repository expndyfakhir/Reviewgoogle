import { createRoot } from 'https://cdn.skypack.dev/react@18.2.0';
import { useState, useEffect } from 'https://cdn.skypack.dev/react@18.2.0';
import { motion, AnimatePresence } from 'https://cdn.skypack.dev/framer-motion@12.6.3';
import { FaStar, FaUser, FaCalendarAlt, FaQuoteLeft, FaCheck, FaShieldAlt } from 'https://cdn.skypack.dev/react-icons/fa@5.5.0';

// Set global flag for embed-only mode
const EMBED_ONLY = true;

const ReviewWidget = ({ 
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
  animationStyle = 'fade'
}) => {
  const [hoveredReview, setHoveredReview] = useState(null);
  const [displayedReviews, setDisplayedReviews] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

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
        className={`${layout === 'grid' 
          ? `grid grid-cols-1 gap-${spacing} w-full` 
          : layout === 'row'
          ? 'flex flex-row flex-wrap gap-4 w-full'
          : 'flex flex-col gap-4 w-full'}`}
        style={{
          gridTemplateColumns: layout === 'grid' ? `repeat(auto-fill, minmax(${cardWidth}px, 1fr))` : '',
        }}
      >
        {displayedReviews.map((review, index) => (
          <motion.div
            key={index}
            variants={reviewVariants}
            onMouseEnter={() => setHoveredReview(index)}
            onMouseLeave={() => setHoveredReview(null)}
            className={`relative ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md overflow-hidden
              ${hoveredReview === index ? 'ring-2 ring-offset-2 ring-offset-transparent' : ''}
              ${compactView ? 'p-4' : 'p-6'}`}
            style={{
              boxShadow: hoveredReview === index 
                ? `0 4px 20px -2px ${getAccentColor()}30` 
                : '',
              borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
              borderWidth: '1px',
              maxWidth: layout !== 'grid' ? `${cardWidth}px` : '100%',
              transform: hoveredReview === index ? 'translateY(-2px)' : 'none',
              transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s'
            }}
          >
            <div className="flex items-start">
              {/* Author Image */}
              {showPhotos && (
                <div className="mr-4 flex-shrink-0">
                  {review.profile_photo_url ? (
                    <img 
                      src={review.profile_photo_url} 
                      alt={review.author_name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <FaUser className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                    </div>
                  )}
                </div>
              )}
              
              {/* Review Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-semibold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {review.author_name}
                    {showVerifiedBadge && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <FaShieldAlt className="w-3 h-3 mr-1" />
                        Verified
                      </span>
                    )}
                  </h3>
                </div>
                
                <div className="flex items-center mb-2">
                  <div className="flex mr-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                      />
                    ))}
                  </div>
                  <time className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} flex items-center`}>
                    <FaCalendarAlt className="w-3 h-3 mr-1" />
                    {formatDate(review.time)}
                  </time>
                </div>
                
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} ${compactView ? 'line-clamp-3' : ''}`}>
                  {review.text}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

window.initGoogleReviewsWidget = (config) => {
  const root = createRoot(document.getElementById(config.containerId));
  
  const WidgetContainer = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await fetch(
            `${config.apiUrl}/api/places/details?placeId=${config.placeId}`
          );
          
          if (!response.ok) {
            throw new Error('Failed to fetch review data');
          }
          
          const { place } = await response.json();
          setData(place);
        } catch (err) {
          console.error('Error loading widget data:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, []);

    if (loading) {
      return (
        <div className={`p-6 text-center ${config.theme === 'dark' ? 'text-gray-400 bg-gray-800' : 'text-gray-500 bg-white'} rounded-xl`}>
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading reviews...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className={`p-6 text-center ${config.theme === 'dark' ? 'text-gray-400 bg-gray-800' : 'text-gray-500 bg-white'} rounded-xl`}>
          <FaQuoteLeft className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="text-lg">Failed to load reviews</p>
          <p className="text-sm mt-2 opacity-70">{error}</p>
        </div>
      );
    }

    return data ? (
      <ReviewWidget
        place={data}
        reviews={data.reviews || []}
        theme={config.theme || 'light'}
        accentColor={config.accentColor || '#4F46E5'}
        filterRating={config.filterRating || 0}
        sortByDate={config.sortByDate !== undefined ? config.sortByDate : true}
        sortDirection={config.sortDirection || 'desc'}
        showPhotos={config.showPhotos !== undefined ? config.showPhotos : true}
        compactView={config.compactView || false}
        maxReviews={config.maxReviews || 5}
        layout={config.layout || 'grid'}
        spacing={config.spacing || 6}
        cardWidth={config.cardWidth || 400}
        showVerifiedBadge={config.showVerifiedBadge !== undefined ? config.showVerifiedBadge : true}
        animationStyle={config.animationStyle || 'fade'}
      />
    ) : null;
  };

  root.render(
    <WidgetContainer />
  );
};