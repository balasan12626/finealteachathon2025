import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useTheme } from '../context/ThemeContext';
import { FaMapMarkedAlt, FaCalendarAlt, FaRulerCombined, FaHistory, FaPaw, FaHotel, FaTicketAlt, FaCar, FaInfoCircle } from 'react-icons/fa';

interface WildlifePlace {
  name: string;
  district: string;
  type: string;
  area: string;
  established: string;
  key_species: string[];
  description: string;
  best_time_to_visit: string;
  facilities: {
    safari?: { available: boolean; fee?: string };
    lodging?: boolean;
    visitor_center?: boolean;
    entry_fee?: string;
    [key: string]: any; // Allow other facilities
  };
  image_url: string;
}

interface Metadata {
  notes?: string;
  data_source?: string;
}

interface WildlifeData {
  wildlife_places: WildlifePlace[];
  metadata?: Metadata;
}

const Wildlife: React.FC = () => {
  const [wildlifeData, setWildlifeData] = useState<WildlifeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<WildlifePlace | null>(null);
  const { theme } = useTheme();

  // Helper function to get species icon
  const getSpeciesIcon = (species: string): string => {
    const icons: { [key: string]: string } = {
      'Tiger': '🐅',
      'Elephant': '🐘',
      'Lion': '🦁',
      'Deer': '🦌',
      'Bird': '🦜',
      'Monkey': '🐒',
      'Bear': '🐻',
      'Leopard': '🐆',
    };
    
    for (const [key, icon] of Object.entries(icons)) {
      if (species.toLowerCase().includes(key.toLowerCase())) {
        return icon;
      }
    }
    return '🦕';
  };

  // Format currency
  const formatCurrency = (fee: string): string => {
    return fee.replace(/(\d+)/g, '₹$1');
  };

  useEffect(() => {
    const db = getDatabase();
    const wildlifeRef = ref(db, '/wildlife');

    onValue(
      wildlifeRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setWildlifeData(data);
        } else {
          setError('No data found.');
        }
        setLoading(false);
      },
      (error) => {
        setError(`Error fetching data: ${error.message}`);
        setLoading(false);
      }
    );
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#00008B]">
        <div className="text-center">
          <div className="animate-spin mb-4 mx-auto w-16 h-16 border-t-4 border-b-4 border-white rounded-full"></div>
          <p className="text-xl text-white">Loading wildlife sanctuaries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500 bg-[#00008B]">{error}</div>;
  }

  if (!wildlifeData) {
    return <div className="text-center py-10 text-white bg-[#00008B]">No data available.</div>;
  }

  return (
    <div className="min-h-screen bg-[#00008B] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-white flex items-center justify-center">
            <FaPaw className="mr-3 text-3xl" />
            Wildlife Sanctuaries of Tamil Nadu
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Explore the rich biodiversity and natural heritage of Tamil Nadu through its protected wildlife areas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wildlifeData.wildlife_places.map((place, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden border border-white/20 transform transition duration-300 hover:scale-105"
              onClick={() => setSelectedPlace(place)}
            >
              <div className="relative">
                <img
                  src={place.image_url}
                  alt={place.name}
                  className="w-full h-56 object-cover"
                />
                <div className="absolute top-0 right-0 bg-amber-600 text-white px-3 py-1 m-2 rounded-full text-sm">
                  {place.type}
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{place.name}</h2>
                <p className="text-gray-300 flex items-center mb-4">
                  <FaMapMarkedAlt className="mr-2" />
                  {place.district}
                </p>

                <p className="text-gray-300 mb-4 line-clamp-3">{place.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-300">
                    <FaRulerCombined className="mr-2" />
                    <span>Area: {place.area}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <FaHistory className="mr-2" />
                    <span>Established: {place.established}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <FaCalendarAlt className="mr-2" />
                    <span>Best Time: {place.best_time_to_visit}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <FaPaw className="mr-2" />
                    Key Species
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {place.key_species.slice(0, 4).map((species, i) => (
                      <span key={i} className="bg-white/10 px-3 py-1 rounded-full text-sm">
                        {getSpeciesIcon(species)} {species}
                      </span>
                    ))}
                    {place.key_species.length > 4 && (
                      <span className="text-gray-300 text-sm">+{place.key_species.length - 4} more</span>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {place.facilities.safari?.available && (
                    <span className="bg-amber-600/20 px-3 py-1 rounded-full text-sm flex items-center">
                      <FaCar className="mr-2" /> Safari Available
                    </span>
                  )}
                  {place.facilities.lodging && (
                    <span className="bg-amber-600/20 px-3 py-1 rounded-full text-sm flex items-center">
                      <FaHotel className="mr-2" /> Lodging
                    </span>
                  )}
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the card click from triggering
                    setSelectedPlace(place);
                  }}
                  className="w-full mt-4 bg-amber-600 hover:bg-amber-500 text-white py-2 rounded-lg transition duration-300 flex items-center justify-center group"
                >
                  <span className="transform group-hover:translate-x-1 transition-transform">
                    Explore Details
                  </span>
                  <FaInfoCircle className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for detailed view */}
        {selectedPlace && (
          <div 
            className="fixed inset-0 bg-black/80 z-50 overflow-y-auto overflow-x-hidden flex justify-center items-start md:items-center p-4 animate-fadeIn"
            onClick={() => setSelectedPlace(null)}
            style={{ maxHeight: '100vh' }}
          >
            <div 
              className="relative bg-[#000066]/95 backdrop-blur-sm rounded-lg w-full max-w-4xl my-8 border border-white/20 shadow-2xl transform transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedPlace(null)}
                className="absolute -top-4 -right-4 z-50 bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors duration-300 shadow-lg"
              >
                ✕
              </button>

              <div className="relative">
                <img 
                  src={selectedPlace.image_url} 
                  alt={selectedPlace.name} 
                  className="w-full h-72 object-cover rounded-t-lg"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#000066] to-transparent p-6">
                  <h2 className="text-3xl font-bold text-white">{selectedPlace.name}</h2>
                  <p className="text-gray-300 flex items-center mt-2">
                    <FaMapMarkedAlt className="mr-2" />
                    {selectedPlace.district} - {selectedPlace.type}
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <p className="text-gray-300">{selectedPlace.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
                      <FaPaw className="mr-2" />
                      Key Species
                    </h3>
                    <div className="space-y-2">
                      {selectedPlace.key_species.map((species, i) => (
                        <div key={i} className="flex items-center text-gray-300">
                          <span className="mr-2">{getSpeciesIcon(species)}</span>
                          {species}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-white">Facilities & Information</h3>
                    <div className="space-y-3">
                      {selectedPlace.facilities.entry_fee && (
                        <div className="flex items-center text-gray-300">
                          <FaTicketAlt className="mr-2" />
                          Entry Fee: {formatCurrency(selectedPlace.facilities.entry_fee)}
                        </div>
                      )}
                      {selectedPlace.facilities.safari?.available && (
                        <div className="flex items-center text-gray-300">
                          <FaCar className="mr-2" />
                          Safari: Available {selectedPlace.facilities.safari.fee && `(${formatCurrency(selectedPlace.facilities.safari.fee)})`}
                        </div>
                      )}
                      {selectedPlace.facilities.lodging && (
                        <div className="flex items-center text-gray-300">
                          <FaHotel className="mr-2" />
                          Lodging: Available
                        </div>
                      )}
                    </div>

                    <div className="mt-6">
                      <h4 className="font-semibold mb-2 text-white">Visitor Information</h4>
                      <div className="bg-white/10 p-4 rounded-lg space-y-2">
                        <p className="text-gray-300 flex items-center">
                          <FaCalendarAlt className="mr-2" />
                          Best Time to Visit: {selectedPlace.best_time_to_visit}
                        </p>
                        <p className="text-gray-300 flex items-center">
                          <FaRulerCombined className="mr-2" />
                          Area: {selectedPlace.area}
                        </p>
                        <p className="text-gray-300 flex items-center">
                          <FaHistory className="mr-2" />
                          Established: {selectedPlace.established}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <a 
                    href={`https://www.google.com/maps/search/${encodeURIComponent(selectedPlace.name + ' ' + selectedPlace.district)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-full transition-colors duration-300"
                  >
                    <FaMapMarkedAlt className="mr-2" />
                    View on Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {wildlifeData.metadata && (
          <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaInfoCircle className="mr-2" />
              Additional Information
            </h2>
            {wildlifeData.metadata.notes && (
              <p className="text-gray-300 mb-2">
                <strong>Note:</strong> {wildlifeData.metadata.notes}
              </p>
            )}
            {wildlifeData.metadata.data_source && (
              <p className="text-gray-300">
                <strong>Data Source:</strong> {wildlifeData.metadata.data_source}
              </p>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translate3d(0, -20px, 0) scale(0.95); }
          to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default Wildlife;