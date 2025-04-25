import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { FaCalendarAlt, FaCheck, FaTimes, FaMapMarkedAlt, FaParking, FaUtensils, FaToilet, FaArrowRight } from 'react-icons/fa';

interface Beach {
  name: string;
  image_url: string;
  city: string;
  district: string;
  state: string;
  description: string;
  attractions: string[];
  best_time_to_visit: string;
  facilities: {
    parking: boolean;
    food_stalls: boolean;
    restrooms: boolean;
  }
}

interface Metadata {
  note: string;
  data_source: string;
}

interface BeachesData {
  beaches: Beach[];
  metadata: Metadata;
}

const Beach: React.FC = () => {
  const [beachesData, setBeachesData] = useState<BeachesData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBeach, setSelectedBeach] = useState<Beach | null>(null);

  useEffect(() => {
    const db = getDatabase();
    const beachesRef = ref(db, '/beach');
   
    onValue(
      beachesRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setBeachesData(data);
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
      <div className="flex justify-center items-center h-screen bg-[#0a2458]">
        <div className="text-center">
          <div className="animate-spin mb-4 mx-auto w-16 h-16 border-t-4 border-b-4 border-blue-400 rounded-full"></div>
          <p className="text-xl text-blue-300">Loading beaches...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500 bg-[#0a2458]">{error}</div>;
  }

  if (!beachesData) {
    return <div className="text-center py-10 text-white bg-[#0a2458]">No data available.</div>;
  }

  return (
    <div className="bg-[#0a2458] text-white min-h-screen pb-12">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-4 text-[#5BBDFF]">
          Beaches of Tamil Nadu
        </h1>
        <p className="text-center text-blue-300 max-w-4xl mx-auto mb-12">
          Explore pristine shores steeped in history, from Chola-era ports to colonial relics, along the 
          beautiful coastline of Tamil Nadu. With over 1,000 km of coastline, these beaches offer a perfect 
          blend of natural beauty and cultural heritage.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {beachesData.beaches.map((beach, index) => (
            <div 
              key={index} 
              className="bg-[#102980] rounded-lg overflow-hidden shadow-lg border border-blue-900 transform transition duration-300 hover:scale-105"
            >
              <div className="relative">
                <img
                  src={beach.image_url}
                  alt={beach.name}
                  className="w-full h-56 object-cover"
                />
              </div>
              
              <div className="p-5">
                <h2 className="text-xl font-bold mb-1">{beach.name}</h2>
                <p className="text-blue-300 mb-4 flex items-center text-sm">
                  <FaMapMarkedAlt className="mr-2" /> 
                  {beach.city}, {beach.district}
                </p>
                
                <p className="text-gray-300 mb-4 text-sm line-clamp-3">
                  {beach.description}
                </p>
                
                <div className="flex items-center text-sm text-gray-300 mb-4">
                  <FaCalendarAlt className="mr-2 text-blue-400" />
                  <span>Best Time: {beach.best_time_to_visit}</span>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <div className="flex space-x-4">
                    {beach.facilities.parking && (
                      <div className="text-green-400" title="Parking Available">
                        <FaParking />
                      </div>
                    )}
                    {beach.facilities.food_stalls && (
                      <div className="text-green-400" title="Food Stalls Available">
                        <FaUtensils />
                      </div>
                    )}
                    {beach.facilities.restrooms && (
                      <div className="text-green-400" title="Restrooms Available">
                        <FaToilet />
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBeach(beach);
                    }}
                    className="bg-[#00008B] hover:bg-[#000073] text-white py-2 px-6 rounded-lg transition duration-300 flex items-center justify-center group"
                  >
                    <span className="transform group-hover:translate-x-1 transition-transform">Details</span>
                    <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Beach Details Modal */}
        {selectedBeach && (
          <div 
            className="fixed inset-0 bg-black/80 z-50 overflow-y-auto overflow-x-hidden flex justify-center items-start md:items-center p-4 animate-fadeIn"
            onClick={() => setSelectedBeach(null)}
            style={{ maxHeight: '100vh' }}
          >
            <div 
              className="relative bg-[#102980]/95 backdrop-blur-sm rounded-lg w-full max-w-4xl my-8 border border-blue-500/30 shadow-2xl transform transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedBeach(null)}
                className="absolute -top-4 -right-4 z-50 bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors duration-300 shadow-lg"
              >
                ✕
              </button>

              <div className="relative">
                <img 
                  src={selectedBeach.image_url} 
                  alt={selectedBeach.name} 
                  className="w-full h-72 object-cover rounded-t-lg"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#102980] to-transparent p-6">
                  <h2 className="text-3xl font-bold text-white">{selectedBeach.name}</h2>
                  <p className="text-blue-300 flex items-center mt-2">
                    <FaMapMarkedAlt className="mr-2" />
                    {selectedBeach.city}, {selectedBeach.district}
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <p className="text-gray-300 text-lg leading-relaxed">{selectedBeach.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-[#5BBDFF] flex items-center">
                      <FaMapMarkedAlt className="mr-2" />
                      Attractions
                    </h3>
                    <div className="space-y-2">
                      {selectedBeach.attractions.map((attraction, i) => (
                        <div key={i} className="flex items-start text-gray-300">
                          <span className="text-blue-400 mr-2">•</span>
                          {attraction}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-[#5BBDFF]">Facilities & Information</h3>
                    <div className="bg-white/10 p-4 rounded-lg space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className={`flex items-center ${selectedBeach.facilities.parking ? 'text-green-400' : 'text-red-400'}`}>
                          <FaParking className="mr-2" />
                          <span>Parking</span>
                        </div>
                        <div className={`flex items-center ${selectedBeach.facilities.food_stalls ? 'text-green-400' : 'text-red-400'}`}>
                          <FaUtensils className="mr-2" />
                          <span>Food Stalls</span>
                        </div>
                        <div className={`flex items-center ${selectedBeach.facilities.restrooms ? 'text-green-400' : 'text-red-400'}`}>
                          <FaToilet className="mr-2" />
                          <span>Restrooms</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/10">
                        <p className="text-gray-300 flex items-center mb-2">
                          <FaCalendarAlt className="mr-2 text-[#5BBDFF]" />
                          Best Time to Visit: {selectedBeach.best_time_to_visit}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <a 
                    href={`https://www.google.com/maps/search/${encodeURIComponent(selectedBeach.name + ' ' + selectedBeach.city + ' ' + selectedBeach.district)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-[#00008B] hover:bg-[#000073] text-white rounded-full transition-colors duration-300 group"
                  >
                    <FaMapMarkedAlt className="mr-2 transform group-hover:scale-110 transition-transform" />
                    <span className="transform group-hover:translate-x-1 transition-transform">View on Maps</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {beachesData.metadata && (
          <div className="mt-12 p-6 bg-[#102980] rounded-lg mx-auto max-w-4xl">
            <h2 className="text-xl font-semibold mb-4 text-[#5BBDFF]">Information</h2>
            <p className="text-gray-300"><strong>Note:</strong> {beachesData.metadata.note}</p>
            <p className="mt-2 text-gray-300"><strong>Data Source:</strong> {beachesData.metadata.data_source}</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translate3d(0, -20px, 0) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Beach;