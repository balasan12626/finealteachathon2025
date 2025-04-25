import React, { useState, useEffect, useLayoutEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { realtimeDb } from '../firebase';
import { City } from '../types';
import { Search, MapPin, Navigation, Map } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const Cities: React.FC = () => {  
  const [cities, setCities] = useState<City[]>([]); // Initialize cities as an empty array
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyCities, setNearbyCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const detectLocation = () => {
    setIsLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });

          const nearby = cities
            .map(city => ({
              ...city,
              distance: calculateDistance(latitude, longitude, city.lat, city.lng)
            }))
            .filter(city => city.distance <= 50)
            .sort((a, b) => a.distance - b.distance);

          setNearbyCities(nearby);
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoading(false);
        }
      );
    } else {
      console.error("Geolocation is not supported");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const cityRef = ref(realtimeDb, '/c'); // Change the path to '/'
    onValue(cityRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Data from Realtime Database:", data);
      if (data) {
        // The data is now an object with city names as keys
        const loadedCities = Object.entries(data).map(([name, details]: [string, any]) => ({
          name,
          ...details,
        }));
        setCities(loadedCities);
        setFilteredCities(loadedCities);
      } else {
        console.log("No data found at the root");
      }
      setLoading(false);
    });
  }, []);

    useEffect(() => {
    if (searchTerm === '') {
      setFilteredCities(cities);
    } else {
      const filtered = cities.filter(city =>
        city.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  }, [searchTerm, cities]);

    const handleCityClick = (cityName: string) => {
    navigate(`/heritage/${cityName}`);
  };

   useLayoutEffect(() => {
    const cityCards = document.querySelectorAll('.city-card');
    gsap.fromTo(
      cityCards,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
      }
    );
    }, [filteredCities]);

    const handleCardHover = (event: React.MouseEvent<HTMLDivElement>) => {
        gsap.to(event.currentTarget, { scale: 1.05, duration: 0.3, ease: 'power2.out' });
    };

    const handleCardHoverOut = (event: React.MouseEvent<HTMLDivElement>) => {
        gsap.to(event.currentTarget, { scale: 1, duration: 0.3, ease: 'power2.out' });
    };

        const handleButtonHover = (event: React.MouseEvent<HTMLButtonElement>) => {
        gsap.to(event.currentTarget, { scale: 1.05, backgroundColor: '#F56565', duration: 0.3, ease: 'power2.out' });
    };

    const handleButtonHoverOut = (event: React.MouseEvent<HTMLButtonElement>) => {
        gsap.to(event.currentTarget, { scale: 1, backgroundColor: '#991b1b', duration: 0.3, ease: 'power2.out' });
    };


  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-800"></div>
      <span className="ml-3 text-lg text-gray-700 dark:text-gray-300">Loading cities...</span>
    </div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Explore Tamil Nadu's Cities</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Discover the rich cultural heritage, ancient temples, and historical landmarks of Tamil Nadu's most iconic cities.
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto mb-12">
        <div className="relative flex-grow">
          <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-md">
            <div className="pl-4">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search cities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 px-4 focus:outline-none bg-transparent dark:text-white"
            />
          </div>
        </div>

        <motion.button
          onClick={detectLocation}
          disabled={isLoading}
          className="flex items-center justify-center px-5 py-3 ml-0 md:ml-2 bg-red-800 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg min-w-[180px]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Map className="h-5 w-5 mr-2" />
          {isLoading ? 
            <span className="flex items-center">
              <div className="animate-spin h-4 w-4 border-2 border-white rounded-full mr-2"></div>
              Detecting...
            </span> : 
            'Find Nearby Cities'
          }
        </motion.button>
      </div>

      {nearbyCities.length > 0 && (
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Nearby Cities</h2>
            <div className="ml-3 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-sm rounded-full">
              {nearbyCities.length} found
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearbyCities.map((city) => (
              <motion.div
                key={city.name}
                onClick={() => handleCityClick(city.name)}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer city-card"
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)" 
                }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={handleCardHover}
                onMouseLeave={handleCardHoverOut}
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={city.image || `https://images.pexels.com/photos/7084313/pexels-photo-7084313.jpeg`}
                    alt={city.name}
                    className="w-full h-full object-cover transition-all duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-7">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-red-800 dark:text-red-500 mr-2" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{city.name}</h3>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                      {Math.round(city.distance || 0)}km away
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-5 leading-relaxed">
                    {city.description || `Explore the cultural heritage of ${city.name}`}
                  </p>
                  <button
                    onMouseEnter={handleButtonHover}
                    onMouseLeave={handleButtonHoverOut}
                    className="w-full px-4 py-3 bg-red-800 dark:bg-red-700 text-white rounded-md text-sm font-medium transition-all duration-300 hover:bg-red-700 hover:shadow-lg"
                  >
                    Explore Heritage Sites
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
      >
        {filteredCities.map((city) => (
          <div
            key={city.name}
            onMouseEnter={handleCardHover}
            onMouseLeave={handleCardHoverOut}
            onClick={() => handleCityClick(city.name)}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-103 hover:shadow-xl cursor-pointer city-card group"
          >
            <div className="h-48 sm:h-44 lg:h-48 overflow-hidden relative">
              <img
                src={city.image || `https://images.pexels.com/photos/7084313/pexels-photo-7084313.jpeg`}
                alt={city.name}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-5 sm:p-6 lg:p-7">
              <div className="flex items-center mb-3">
                <MapPin className="h-5 w-5 text-red-800 dark:text-red-500 mr-2 flex-shrink-0" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white truncate">{city.name}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-5 leading-relaxed line-clamp-3">
                {city.description || `Explore the cultural heritage of ${city.name}`}
              </p>
              <button
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonHoverOut}
                className="w-full px-4 py-3 bg-red-800 dark:bg-red-700 text-white rounded-md text-sm font-medium transition-all duration-300 hover:bg-red-700 hover:shadow-lg"
              >
                Explore Heritage Sites
              </button>
            </div>
          </div>
        ))}
      </motion.div> 

      {filteredCities.length === 0 && (
        <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-lg shadow-inner">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-3 opacity-50" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">No cities match your search. Try a different term.</p>
        </div>
      )}
    </div>
  );
};

export default Cities;

