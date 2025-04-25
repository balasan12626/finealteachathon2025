import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { realtimeDb } from '../firebase';
import gsap from 'gsap';
import { ChevronLeft, MapPin, Clock, Info, ArrowRight } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import { HeritagePlace } from '../types';

const HeritagePlaces: React.FC = () => {  
  const { cityName } = useParams<{ cityName: string }>();
  const [places, setPlaces] = useState<HeritagePlace[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState<{ name: string; description: string } | null>(null);

  useEffect(() => {
    if (cityName) {
      const fetchData = async () => {
        setLoading(true);
        try{

          const cityRef = ref(realtimeDb, `/c/${cityName}`);
          onValue(cityRef, (snapshot) => {
            const cityData = snapshot.val();
            if (cityData) {
              setCity({ name: cityName, description: cityData.description });
              const heritagePlacesData = cityData.heritagePlaces;
              if (heritagePlacesData) {
                const loadedHeritagePlaces: HeritagePlace[] = Object.entries(heritagePlacesData).map(([id, details]: [string, any]) => ({
                  id,
                  ...details,
                }));
                setPlaces(loadedHeritagePlaces);
                console.log(loadedHeritagePlaces)
              } else {
                setPlaces([]);
              }
            } else {
              setCity(null);
              setPlaces(null)
            }
          },
          (error) => {
            console.error("Error fetching data:", error);
            setLoading(false);
          });

        }
         catch (error) {
          console.error("Error fetching data:", error);
          // Handle error appropriately, e.g., display an error message
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [cityName]);

  const containerRef = useRef<HTMLDivElement>(null);
  const placesRef = useRef<(HTMLDivElement | null)[]>([]);
  
  useEffect(() => {
    if(city && places){
    const tl = gsap.timeline();

    tl.fromTo(containerRef.current, {opacity:0,y:20},{opacity:1, y:0, duration:0.5})
    tl.fromTo(
      [containerRef.current?.querySelector('h1'), containerRef.current?.querySelector('p')],
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.2, duration: 0.5 },
      "-=0.2"
    );
    tl.fromTo(
      placesRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 },
      "-=0.2"
    );
    }
  },[city,places])

 if (loading) {
    return <LoadingSpinner />;
  }

  if (!cityName || !city) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-500">City information not found.</p>
        <Link to="/cities" className="text-blue-500 hover:underline">Back to Cities</Link> 
      </div>
    );
  }

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-4">
        <Link to="/cities" className="inline-flex items-center text-red-800 hover:text-red-600 transition-colors duration-300 font-medium">
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Cities
        </Link>
      </div>
      
      <div className="mb-6 border-l-4 border-red-700 pl-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{city.name}</h1> 
        <p className="text-gray-600 dark:text-gray-300">{city.description}</p>
      </div>

      {places && places.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-lg text-center shadow-inner">
          <p className="text-gray-600 dark:text-gray-300 text-lg">No heritage places found in {cityName}.</p>
          <Link to="/cities" className="inline-flex items-center mt-4 text-red-700 hover:text-red-600 font-medium">
            Explore other cities <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {places?.map((place) => (
            <div 
              key={place.id} 
              ref={(el) => placesRef.current.push(el)} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1"
            >
              <div className="relative overflow-hidden h-56">
                <img 
                  src={place.image} 
                  alt={place.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-5 sm:p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{place.name}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{place.description}</p>
                
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-4">
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-red-700" />
                    {place.city}
                  </div>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                    <Clock className="w-4 h-4 mr-2 text-blue-600" />
                    {formatYear(place.year)}
                  </div>
                </div>
                
                <Link
                  to={`/place/${cityName}/${place.id}`}
                  className="inline-flex items-center px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-md transition-all duration-300 text-sm font-medium hover:pl-5 group-hover:shadow-md"
                  onMouseEnter={(e) => {
                    gsap.to(e.currentTarget, { scale: 1.05, duration: 0.2 });
                  }}
                  onMouseLeave={(e) => {
                    gsap.to(e.currentTarget, { scale: 1, duration: 0.2 });
                  }}
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper function to format year consistently
const formatYear = (year: string | number): string => {
  if (!year) return "Unknown";
  
  const yearStr = year.toString().toLowerCase();
  
  // If it contains "century", it's already formatted
  if (yearStr.includes("century")) {
    return yearStr.charAt(0).toUpperCase() + yearStr.slice(1);
  }
  
  // If it's a number, format it
  const yearNum = parseInt(yearStr);
  if (!isNaN(yearNum)) {
    if (yearNum < 100) {
      return `${yearNum}th Century`;
    }
    // Get the century
    const century = Math.ceil(yearNum / 100);
    return `${yearNum} (${century}${getCenturySuffix(century)} Century)`;
  }
  
  // Default case
  return yearStr.charAt(0).toUpperCase() + yearStr.slice(1);
};

const getCenturySuffix = (century: number): string => {
  if (century % 10 === 1 && century !== 11) return "st";
  if (century % 10 === 2 && century !== 12) return "nd";
  if (century % 10 === 3 && century !== 13) return "rd";
  return "th";
};

export default HeritagePlaces;
