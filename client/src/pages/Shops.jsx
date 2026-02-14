import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MapPinIcon, PhoneIcon, ClockIcon, StarIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const Shops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState({ lat: 12.9716, lng: 77.5946 });
  
  const { user } = useAuth();

  useEffect(() => {
    fetchNearbyShops();
  }, []);

  const fetchNearbyShops = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5001/api/shops/nearby?lat=${userLocation.lat}&lng=${userLocation.lng}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        setShops(data.shops);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch shops');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          fetchNearbyShops();
        },
        (error) => {
          setError('Location access denied. Using default location.');
        }
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Finding nearby shops...</div>
          <div className="text-gray-500 mt-2">Discovering the best local stores around you</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              🏪 Local Shops Near You
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8">
              Discover amazing local stores within 200 meters of your location
            </p>
            
            <button
              onClick={getCurrentLocation}
              className="bg-white text-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold hover:bg-blue-50 transition-all duration-200 inline-flex items-center space-x-2 shadow-lg text-sm sm:text-base"
            >
              <MapPinIcon className="h-4 w-4" />
              <span>📍 Use My Current Location</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {shops.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <ShoppingBagIcon className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No shops found nearby</h3>
            <p className="text-gray-500">Try changing your location or check back later</p>
          </div>
        ) : (
          <>
            {/* Results Summary */}
            <div className="mb-8 text-center">
              <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Found {shops.length} shops near you
              </span>
            </div>

            {/* Shops Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {shops.map((shop) => (
                <div key={shop._id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100">
                  {/* Shop Header */}
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base sm:text-lg font-bold text-white line-clamp-1">
                        {shop.name}
                      </h3>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-400 text-white shadow-sm">
                        Open Now
                      </span>
                    </div>
                    <div className="flex items-center mt-1 sm:mt-2 text-indigo-100 text-xs sm:text-sm">
                      <MapPinIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Within 200m
                    </div>
                  </div>
                  
                  {/* Shop Body */}
                  <div className="p-4 sm:p-6">
                    <div className="space-y-3 sm:space-y-4">
                      {/* Category Badge */}
                      <div>
                        <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {shop.category}
                        </span>
                      </div>

                      {/* Shop Details */}
                      <div className="space-y-2 sm:space-y-3">
                        {shop.address?.street && (
                          <div className="flex items-start">
                            <MapPinIcon className="h-4 w-4 text-gray-400 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                              {shop.address.street}, {shop.address.city}
                            </span>
                          </div>
                        )}
                        
                        {shop.contact?.phone && (
                          <div className="flex items-center">
                            <PhoneIcon className="h-4 w-4 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
                            <span className="text-xs sm:text-sm text-gray-600">{shop.contact.phone}</span>
                          </div>
                        )}
                        
                        {shop.timings && (
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
                            <span className="text-xs sm:text-sm text-gray-600">
                              {shop.timings.open} - {shop.timings.close}
                            </span>
                          </div>
                        )}

                        {/* Rating */}
                        <div className="flex items-center">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <StarIconSolid
                                key={i}
                                className={`h-3 w-3 sm:h-4 sm:w-4 ${
                                  i < Math.floor(shop.rating || 0)
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-xs sm:text-sm text-gray-600">
                            {shop.rating || '4.5'} ({Math.floor(Math.random() * 50) + 10} reviews)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                      <button 
                        onClick={() => window.location.href = `/products/${shop._id}`}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base shadow-md hover:shadow-lg"
                      >
                        <ShoppingBagIcon className="h-4 w-4" />
                        <span>View Products</span>
                      </button>
                      <button className="w-full border border-gray-300 text-gray-700 px-3 sm:px-4 py-2 sm:py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base shadow-sm hover:shadow-md">
                        <MapPinIcon className="h-4 w-4" />
                        <span>Get Directions</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Shops;
