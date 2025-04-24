'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import ReviewWidget from '../components/ReviewWidget';
import { 
  FaStar, FaCode, FaPalette, FaCheck, FaCog, FaEye, 
  FaImage, FaColumns, FaDesktop, FaTabletAlt, FaMobile,
  FaSort, FaFilter, FaBrush, FaLayerGroup, FaCopy,
  FaChevronDown, FaChevronUp, FaArrowLeft, FaSave,
  FaWordpress, FaHtml5, FaInfoCircle, FaAngleRight,
  FaTachometerAlt, FaSliders, FaThLarge, FaShareAlt,
  FaExpand
} from 'react-icons/fa';
import { HexColorPicker } from 'react-colorful';

export const dynamic = 'force-dynamic';

const defaultSettings = {
  theme: 'light',
  accentColor: '#4F46E5',
  filterRating: 0,
  sortByDate: true,
  sortDirection: 'desc',
  showPhotos: true,
  compactView: false,
  maxReviews: 5,
  layout: 'grid',
  spacing: 6,
  cardWidth: 400,
  showVerifiedBadge: true,
  animationStyle: 'fade',
  enableSlider: false,
  slidesPerView: { mobile: 1, tablet: 2, desktop: 3 }
};

const presetThemes = {
  light: {
    theme: 'light',
    accentColor: '#4F46E5'
  },
  dark: {
    theme: 'dark',
    accentColor: '#10B981'
  },
  modern: {
    theme: 'light',
    accentColor: '#6366F1'
  },
  classic: {
    theme: 'light',
    accentColor: '#D97706'
  }
};

function WidgetPageContent() {
  const searchParams = useSearchParams();
  const placeId = searchParams.get('placeId');

  const [place, setPlace] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('appearance');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [copied, setCopied] = useState({ iframe: false, wordpress: false });
  const [settings, setSettings] = useState(defaultSettings);
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    appearance: true,
    layout: true,
    content: true,
    animation: true
  });

  useEffect(() => {
    if (!placeId) {
      setError('No place selected. Please search for a place first.');
      setLoading(false);
      return;
    }
    fetchPlaceDetails();
  }, [placeId]);

  const fetchPlaceDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/places/details', {
        params: { placeId }
      });
      setPlace({ id: placeId, ...response.data.place });
      setReviews(response.data.place.reviews || []);
    } catch (err) {
      console.error('Error fetching place details:', err);
      setError('Failed to load place details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    showToastNotification(`Updated: ${key}`);
  };

  const applyTheme = (theme) => {
    setSettings(prev => ({ ...prev, ...presetThemes[theme] }));
    showToastNotification(`Applied ${theme} theme`);
  };

  const showToastNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const generateEmbedCode = () => {
    const params = new URLSearchParams({
      placeId,
      ...settings
    }).toString();

    const iframeCode = `<iframe 
  src="${window.location.origin}/embed?${params}" 
  width="100%" 
  height="600" 
  frameborder="0"
  title="Google Reviews Widget">
</iframe>`;

    const wpCode = `<script src="${window.location.origin}/widget-bundle.js"></script>
<script>
  window.initGoogleReviewsWidget({
    containerId: 'google-reviews-widget',
    placeId: '${placeId}',
    apiUrl: '${window.location.origin}',
    ...${JSON.stringify(settings, null, 2)}
  });
</script>
<div id="google-reviews-widget"></div>`;

    return { iframeCode, wpCode };
  };

  const handleCopy = async (type) => {
    try {
      const codes = generateEmbedCode();
      await navigator.clipboard.writeText(type === 'iframe' ? codes.iframeCode : codes.wpCode);
      setCopied(prev => ({ ...prev, [type]: true }));
      showToastNotification(`${type === 'iframe' ? 'iFrame' : 'WordPress'} code copied!`);
      setTimeout(() => setCopied(prev => ({ ...prev, [type]: false })), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      showToastNotification('Failed to copy. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading widget configuration...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
            <div className="text-red-500 text-2xl">⚠️</div>
          </div>
          <h2 className="text-2xl font-bold mb-4 dark:text-white">{error}</h2>
          <p className="text-gray-600 dark:text-gray-400">Please try searching for a different place or check your connection.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Settings Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold dark:text-white">Widget Settings</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab('appearance')}
                    className={`p-2 rounded-lg transition-colors ${activeTab === 'appearance' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                    <FaPalette className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveTab('code')}
                    className={`p-2 rounded-lg transition-colors ${activeTab === 'code' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                    <FaCode className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  {/* Theme Presets */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme Presets</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(presetThemes).map(([name, theme]) => (
                        <button
                          key={name}
                          onClick={() => applyTheme(name)}
                          className="flex items-center justify-center px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: theme.accentColor }}></div>
                          <span className="capitalize text-sm text-gray-700 dark:text-gray-300">{name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Appearance Settings */}
                  <div>
                    <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => toggleSection('appearance')}>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Appearance</h3>
                      {expandedSections.appearance ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
                    </div>

                    {expandedSections.appearance && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Theme</label>
                          <div className="flex space-x-3">
                            {['light', 'dark'].map(theme => (
                              <button
                                key={theme}
                                onClick={() => updateSettings('theme', theme)}
                                className={`flex-1 px-3 py-2 rounded-lg border ${settings.theme === theme ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                              >
                                <span className="capitalize text-sm">{theme}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Accent Color</label>
                          <div className="relative">
                            <button
                              onClick={() => setShowColorPicker(!showColorPicker)}
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between"
                            >
                              <div className="flex items-center">
                                <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: settings.accentColor }}></div>
                                <span className="text-sm">{settings.accentColor}</span>
                              </div>
                              <FaPalette className="text-gray-500" />
                            </button>

                            {showColorPicker && (
                              <div className="absolute z-10 mt-2">
                                <HexColorPicker
                                  color={settings.accentColor}
                                  onChange={color => updateSettings('accentColor', color)}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Layout Settings */}
                  <div>
                    <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => toggleSection('layout')}>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Layout</h3>
                      {expandedSections.layout ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
                    </div>

                    {expandedSections.layout && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Layout Style</label>
                          <div className="grid grid-cols-2 gap-3">
                            {['grid', 'column'].map(layout => (
                              <button
                                key={layout}
                                onClick={() => updateSettings('layout', layout)}
                                className={`px-3 py-2 rounded-lg border ${settings.layout === layout ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                              >
                                <span className="capitalize text-sm">{layout}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Spacing</label>
                          <input
                            type="range"
                            min="2"
                            max="8"
                            value={settings.spacing}
                            onChange={(e) => updateSettings('spacing', parseInt(e.target.value))}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Compact</span>
                            <span>Spacious</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Card Width</label>
                          <input
                            type="range"
                            min="300"
                            max="600"
                            step="50"
                            value={settings.cardWidth}
                            onChange={(e) => updateSettings('cardWidth', parseInt(e.target.value))}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>300px</span>
                            <span>600px</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content Settings */}
                  <div>
                    <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => toggleSection('content')}>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Content</h3>
                      {expandedSections.content ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
                    </div>

                    {expandedSections.content && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Filter Rating</label>
                          <div className="flex items-center space-x-2">
                            {[0, 3, 4, 5].map(rating => (
                              <button
                                key={rating}
                                onClick={() => updateSettings('filterRating', rating)}
                                className={`flex-1 px-3 py-2 rounded-lg border ${settings.filterRating === rating ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                              >
                                <span className="text-sm">{rating === 0 ? 'All' : `${rating}+★`}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Sort Direction</label>
                          <div className="flex space-x-3">
                            <button
                              onClick={() => updateSettings('sortDirection', 'desc')}
                              className={`flex-1 px-3 py-2 rounded-lg border ${settings.sortDirection === 'desc' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                            >
                              <span className="text-sm">Newest First</span>
                            </button>
                            <button
                              onClick={() => updateSettings('sortDirection', 'asc')}
                              className={`flex-1 px-3 py-2 rounded-lg border ${settings.sortDirection === 'asc' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                            >
                              <span className="text-sm">Oldest First</span>
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Max Reviews</label>
                          <input
                            type="range"
                            min="3"
                            max="10"
                            value={settings.maxReviews}
                            onChange={(e) => updateSettings('maxReviews', parseInt(e.target.value))}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>3</span>
                            <span>10</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <label className="text-sm text-gray-600 dark:text-gray-400">Show Photos</label>
                          <button
                            onClick={() => updateSettings('showPhotos', !settings.showPhotos)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.showPhotos ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.showPhotos ? 'translate-x-6' : 'translate-x-1'}`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <label className="text-sm text-gray-600 dark:text-gray-400">Compact View</label>
                          <button
                            onClick={() => updateSettings('compactView', !settings.compactView)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.compactView ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.compactView ? 'translate-x-6' : 'translate-x-1'}`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <label className="text-sm text-gray-600 dark:text-gray-400">Show Verified Badge</label>
                          <button
                            onClick={() => updateSettings('showVerifiedBadge', !settings.showVerifiedBadge)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.showVerifiedBadge ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.showVerifiedBadge ? 'translate-x-6' : 'translate-x-1'}`}
                            />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Animation Settings */}
                  <div>
                    <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => toggleSection('animation')}>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Animation</h3>
                      {expandedSections.animation ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
                    </div>

                    {expandedSections.animation && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Animation Style</label>
                          <div className="grid grid-cols-3 gap-3">
                            {['fade', 'scale', 'slide'].map(style => (
                              <button
                                key={style}
                                onClick={() => updateSettings('animationStyle', style)}
                                className={`px-3 py-2 rounded-lg border ${settings.animationStyle === style ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                              >
                                <span className="capitalize text-sm">{style}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'code' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Embed Options</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm text-gray-600 dark:text-gray-400">iFrame Embed</label>
                          <button
                            onClick={() => handleCopy('iframe')}
                            className="text-blue-500 hover:text-blue-600 text-sm flex items-center"
                          >
                            <FaCopy className="mr-1" />
                            {copied.iframe ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                        <pre className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg text-xs overflow-x-auto">
                          {generateEmbedCode().iframeCode}
                        </pre>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm text-gray-600 dark:text-gray-400">WordPress Embed</label>
                          <button
                            onClick={() => handleCopy('wordpress')}
                            className="text-blue-500 hover:text-blue-600 text-sm flex items-center"
                          >
                            <FaCopy className="mr-1" />
                            {copied.wordpress ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                        <pre className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg text-xs overflow-x-auto">
                          {generateEmbedCode().wpCode}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold dark:text-white">Preview</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-2 rounded-lg transition-colors ${previewDevice === 'desktop' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                    <FaDesktop className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice('tablet')}
                    className={`p-2 rounded-lg transition-colors ${previewDevice === 'tablet' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                    <FaTabletAlt className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-2 rounded-lg transition-colors ${previewDevice === 'mobile' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                    <FaMobile className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice(previewDevice === 'desktop-full' ? 'desktop' : 'desktop-full')}
                    className={`p-2 rounded-lg transition-colors ${previewDevice === 'desktop-full' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                    <FaExpand className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className={`border border-gray-200 dark:border-gray-700 rounded-xl overflow-auto transition-all duration-300 ${previewDevice === 'mobile' ? 'max-w-sm' : previewDevice === 'tablet' ? 'max-w-2xl' : previewDevice === 'desktop-full' ? 'fixed inset-0 w-full h-full z-[9999] bg-white dark:bg-gray-800 p-4 overflow-y-auto' : ''}`}>
                <ReviewWidget
                  place={place}
                  reviews={reviews}
                  {...settings}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <div className={`fixed bottom-4 right-4 transition-transform duration-300 transform ${showToast ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
          <FaCheck className="mr-2" />
          {toastMessage}
        </div>
      </div>
    </div>
  );
}

export default function WidgetPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading widget configuration...</p>
      </div>
    </div>}>
      <WidgetPageContent />
    </Suspense>
  );
}