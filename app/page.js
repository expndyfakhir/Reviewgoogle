'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaStar, FaCalendarAlt, FaArrowRight, FaMapMarkerAlt, FaRegLightbulb, FaCog, FaCode, FaChevronRight, FaShieldAlt, FaCheck } from 'react-icons/fa';

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [place, setPlace] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterRating, setFilterRating] = useState(0);
  const [sortByDate, setSortByDate] = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setPlace(null);
    setReviews([]);

    try {
      const searchResponse = await axios.get('/api/places/search', {
        params: { query }
      });

      if (searchResponse.data.places && searchResponse.data.places.length > 0) {
        const placeId = searchResponse.data.places[0].place_id;
        const placeName = searchResponse.data.places[0].name;
        
        const detailsResponse = await axios.get('/api/places/details', {
          params: { placeId }
        });

        setPlace({
          id: placeId,
          name: placeName,
          ...detailsResponse.data.place
        });
        
        if (detailsResponse.data.place.reviews) {
          setReviews(detailsResponse.data.place.reviews);
        }
      } else {
        setError('No places found matching your search.');
      }
    } catch (err) {
      console.error('Error fetching place data:', err);
      if (err.response && err.response.data && err.response.data.error) {
        if (err.response.data.error.includes('Google Places API error: REQUEST_DENIED') || 
            err.response.data.error.includes('disabled')) {
          setError('The Google Places API key has been disabled. Please contact the administrator to resolve this issue.');
        } else {
          setError(err.response.data.error || 'Failed to fetch place data. Please try again.');
        }
      } else {
        setError('Failed to fetch place data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWidget = () => {
    if (place && place.id) {
      router.push(`/widget?placeId=${place.id}`);
    }
  };

  const filteredReviews = reviews
    .filter(review => filterRating === 0 || review.rating >= filterRating)
    .sort((a, b) => {
      if (sortByDate) {
        return new Date(b.time * 1000) - new Date(a.time * 1000);
      }
      return 0;
    });

  return (
    <div className="min-h-screen">
      {/* Hero Section with Enhanced Design */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-blue-700 py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="absolute -bottom-24 right-0 w-96 h-96 bg-indigo-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -top-24 -left-20 w-80 h-80 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Showcase Your <span className="text-yellow-300">Google Reviews</span> <br className="hidden md:block" />
              With a Beautiful Widget
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 max-w-3xl mx-auto">
              Easily embed Google reviews on your website with our customizable widget. 
              Boost credibility and convert more visitors into customers.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white dark:bg-gray-800 p-2 rounded-xl shadow-2xl">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                    placeholder="Search for your business or any place..."
                    className="block w-full pl-10 pr-3 py-3 border-0 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className={`mt-2 sm:mt-0 sm:ml-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:from-indigo-700 hover:to-blue-700 hover:shadow-lg'}`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <FaSearch className="mr-2" />
                  )}
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </form>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm flex items-start"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="h-4 w-4 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-2">{error}</div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Why Choose Our Google Reviews Widget?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">Designed to help businesses showcase their reputation and build trust with potential customers.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card p-6 transition-transform duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4">
                <FaCog className="text-indigo-600 dark:text-indigo-400 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Fully Customizable</h3>
              <p className="text-gray-600 dark:text-gray-400">Adjust colors, layouts, and styles to perfectly match your website's design and branding.</p>
            </div>

            {/* Feature 2 */}
            <div className="card p-6 transition-transform duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <FaShieldAlt className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Authentic Reviews</h3>
              <p className="text-gray-600 dark:text-gray-400">Display real Google reviews that build trust and credibility with your website visitors.</p>
            </div>

            {/* Feature 3 */}
            <div className="card p-6 transition-transform duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <FaCode className="text-green-600 dark:text-green-400 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Easy Integration</h3>
              <p className="text-gray-600 dark:text-gray-400">Simple embed options for any website platform, including WordPress, Shopify, and custom sites.</p>
            </div>

            {/* Feature 4 */}
            <div className="card p-6 transition-transform duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <FaRegLightbulb className="text-purple-600 dark:text-purple-400 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Smart Filtering</h3>
              <p className="text-gray-600 dark:text-gray-400">Show only your best reviews or filter by rating to highlight the feedback that matters most.</p>
            </div>

            {/* Feature 5 */}
            <div className="card p-6 transition-transform duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center mb-4">
                <FaStar className="text-yellow-600 dark:text-yellow-400 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Rating Highlights</h3>
              <p className="text-gray-600 dark:text-gray-400">Showcase your average rating and star distribution to emphasize your overall reputation.</p>
            </div>

            {/* Feature 6 */}
            <div className="card p-6 transition-transform duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-4">
                <FaCheck className="text-red-600 dark:text-red-400 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Responsive Design</h3>
              <p className="text-gray-600 dark:text-gray-400">Looks great on all devices, from desktop computers to mobile phones and tablets.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Showcase Your Google Reviews?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">Start building trust and credibility with your website visitors today.</p>
          <a href="/widget" className="inline-flex items-center px-8 py-4 bg-white text-indigo-700 font-bold rounded-lg shadow-lg hover:bg-gray-100 transition-colors duration-200 text-lg">
            Create Your Widget
            <FaChevronRight className="ml-2" />
          </a>
        </div>
      </section>

      {/* Results Preview Section */}
      {place && (
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Preview for {place.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">We found {reviews.length} reviews for this place. Create a widget to display them on your website.</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg mr-4">
                    <FaMapMarkerAlt className="text-blue-600 dark:text-blue-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{place.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{place.formatted_address}</p>
                  </div>
                </div>
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
                  <div className="flex mr-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < Math.round(place.rating || 0) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'} />
                    ))}
                  </div>
                  <span className="font-semibold">{place.rating?.toFixed(1) || 'N/A'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredReviews.slice(0, 3).map((review, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center mb-3">
                      {review.profile_photo_url ? (
                        <img src={review.profile_photo_url} alt={review.author_name} className="w-10 h-10 rounded-full mr-3" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mr-3">
                          <FaUser className="text-gray-500 dark:text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{review.author_name}</p>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <FaCalendarAlt className="mr-1 text-xs" />
                          {new Date(review.time * 1000).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'} />
                      ))}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">{review.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={handleCreateWidget}
                  className="btn-primary inline-flex items-center"
                >
                  Create Widget for {place.name}
                  <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}