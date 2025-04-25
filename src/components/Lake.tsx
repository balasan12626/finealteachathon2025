import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useTheme } from '../context/ThemeContext';
import { FaWater, FaSwimmer, FaFish, FaParking, FaUtensils, FaToilet, FaCheck, FaTimes, FaMapMarkedAlt, FaInfoCircle, FaChevronRight } from 'react-icons/fa';
import { GiBoatFishing, GiHorseHead, GiBirdHouse } from 'react-icons/gi';
import { MdDirectionsWalk, MdDirectionsBike } from 'react-icons/md';

interface Lake {
  name: string;
  city: string;
  district: string;
  description: string;
  area: string;
  activities: string[];
  facilities: { [key: string]: boolean };
  image_url: string;
}

interface Metadata {
  note?: string;
  data_source?: string;
}

interface LakesData {
  lakes: Lake[];
  metadata?: Metadata;
}

const Lake: React.FC = () => {
  const [lakesData, setLakesData] = useState<LakesData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLake, setSelectedLake] = useState<Lake | null>(null);
  const { theme } = useTheme();
  
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    const db = getDatabase();
    const lakesRef = ref(db, '/lake');

    onValue(
      lakesRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setLakesData(data);
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

  const getActivityIcon = (activity: string) => {
    const lowerActivity = activity.toLowerCase();
    if (lowerActivity.includes('boat')) return <GiBoatFishing className="text-blue-500" />;
    if (lowerActivity.includes('swim')) return <FaSwimmer className="text-blue-500" />;
    if (lowerActivity.includes('fish')) return <FaFish className="text-blue-500" />;
    if (lowerActivity.includes('bird') || lowerActivity.includes('watch')) return <GiBirdHouse className="text-green-500" />;
    if (lowerActivity.includes('horse')) return <GiHorseHead className="text-amber-700" />;
    if (lowerActivity.includes('walk') || lowerActivity.includes('hiking')) return <MdDirectionsWalk className="text-green-600" />;
    if (lowerActivity.includes('cycl') || lowerActivity.includes('biking')) return <MdDirectionsBike className="text-purple-500" />;
    return <FaWater className="text-blue-400" />;
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-screen ${isDarkMode ? 'bg-gray-900 text-blue-300' : 'bg-blue-50 text-blue-600'}`}>
        <div className="text-center">
          <div className={`animate-spin mb-4 mx-auto w-16 h-16 border-t-4 border-b-4 rounded-full ${isDarkMode ? 'border-blue-400' : 'border-blue-600'}`}></div>
          <p className="text-xl">Loading peaceful lakes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className={`text-center py-10 text-red-500 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>{error}</div>;
  }

  if (!lakesData) {
    return <div className={`text-center py-10 ${isDarkMode ? 'text-white bg-gray-900' : 'text-gray-800 bg-white'}`}>No data available.</div>;
  }

  const openLakeDetails = (lake: Lake) => {
    setSelectedLake(lake);
  };

  const closeLakeDetails = () => {
    setSelectedLake(null);
  };

  return (
    <div className={`min-h-screen py-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-blue-50 text-gray-800'}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 animate-fade-in-up">
          <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
            Lakes of Tamil Nadu
          </h1>
          <p className={`text-lg max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Tamil Nadu's lakes blend natural beauty with recreational activities, offering visitors 
            serene escapes from city life. From hill stations to urban reserves, each lake has its unique charm.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lakesData.lakes.map((lake, index) => (
            <div 
              key={index} 
              className={`rounded-lg shadow-lg overflow-hidden border transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer 
              ${isDarkMode 
                ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' 
                : 'bg-white border-blue-100 hover:bg-blue-50'}`}
              onClick={() => openLakeDetails(lake)}
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={lake.image_url}
                  alt={lake.name}
                  className="w-full h-full object-cover transition-transform duration-10000 hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${isDarkMode ? 'from-black/80' : 'from-black/60'} to-transparent flex items-end`}>
                  <div className="p-4 w-full">
                    <h2 className="text-2xl font-bold text-white">{lake.name}</h2>
                    <p className="text-blue-200 flex items-center">
                      <FaMapMarkedAlt className="mr-2" /> {lake.city}, {lake.district}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <p className={`mb-3 line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{lake.description}</p>
                
                <div className={`mb-3 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                  <span className="font-semibold">Area:</span> {lake.area}
                </div>
                
                <div className="mb-3">
                  <div className="font-semibold mb-1 flex items-center">
                    <FaWater className={`mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    Top Activities
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {lake.activities.slice(0, 3).map((activity, i) => (
                      <span 
                        key={i} 
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs 
                        ${isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}
                      >
                        {getActivityIcon(activity)}
                        <span className="ml-1">{activity}</span>
                      </span>
                    ))}
                    {lake.activities.length > 3 && (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs 
                      ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                        +{lake.activities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <div className="flex space-x-3">
                    {Object.entries(lake.facilities).slice(0, 3).map(([facility, available], i) => {
                      let icon;
                      if (facility.toLowerCase().includes('boat')) icon = <GiBoatFishing />;
                      else if (facility.toLowerCase().includes('food')) icon = <FaUtensils />;
                      else if (facility.toLowerCase().includes('park')) icon = <FaParking />;
                      else if (facility.toLowerCase().includes('rest')) icon = <FaToilet />;
                      else icon = <FaCheck />;
                      
                      return (
                        <div key={i} className="tooltip" data-tip={`${facility}: ${available ? 'Available' : 'Not Available'}`}>
                          <span className={available 
                            ? (isDarkMode ? 'text-green-400' : 'text-green-600') 
                            : (isDarkMode ? 'text-red-400' : 'text-red-500')}>
                            {icon}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <button className={`flex items-center text-sm px-3 py-1 rounded-full 
                  ${isDarkMode 
                    ? 'bg-blue-700 text-white hover:bg-blue-600' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                    <span>Details</span>
                    <FaChevronRight className="ml-1 text-xs" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lake Details Modal */}
        {selectedLake && (
          <div className={`fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fadeIn ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            <div className={`rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="relative">
                <img 
                  src={selectedLake.image_url} 
                  alt={selectedLake.name} 
                  className="w-full h-64 object-cover"
                />
                <button 
                  onClick={closeLakeDetails}
                  className="absolute top-4 right-4 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600"
                >
                  ✕
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                  <h2 className="text-3xl font-bold text-white">{selectedLake.name}</h2>
                  <p className="text-blue-300">{selectedLake.city}, {selectedLake.district}</p>
                </div>
              </div>
              
              <div className="p-6">
                <p className={`mb-6 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{selectedLake.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className={`mb-4 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                      <span className="text-xl font-semibold">Area: </span> 
                      {selectedLake.area}
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-3 flex items-center">
                      <FaWater className={`mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} /> 
                      Activities
                    </h3>
                    <ul className="space-y-2">
                      {selectedLake.activities.map((activity, i) => (
                        <li key={i} className="flex items-center">
                          <span className="mr-2">{getActivityIcon(activity)}</span> 
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Facilities</h3>
                    <table className="w-full">
                      <tbody>
                        {Object.entries(selectedLake.facilities).map(([facility, available], i) => {
                          let icon;
                          if (facility.toLowerCase().includes('boat')) icon = <GiBoatFishing className="mr-2" />;
                          else if (facility.toLowerCase().includes('food')) icon = <FaUtensils className="mr-2" />;
                          else if (facility.toLowerCase().includes('park')) icon = <FaParking className="mr-2" />;
                          else if (facility.toLowerCase().includes('rest')) icon = <FaToilet className="mr-2" />;
                          else icon = <FaInfoCircle className="mr-2" />;
                          
                          return (
                            <tr key={i} className={i % 2 === 0 ? (isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100') : ''}>
                              <td className="py-2 px-2 flex items-center">
                                {icon}
                                {facility.charAt(0).toUpperCase() + facility.slice(1).replace(/_/g, ' ')}
                              </td>
                              <td className="py-2 px-2 text-center">
                                {available ? 
                                  <FaCheck className={isDarkMode ? 'text-green-400 mx-auto' : 'text-green-600 mx-auto'} /> : 
                                  <FaTimes className={isDarkMode ? 'text-red-400 mx-auto' : 'text-red-500 mx-auto'} />
                                }
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    
                    <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                      <h3 className="font-semibold mb-2 flex items-center">
                        <FaInfoCircle className="mr-2" /> Visitor Tips
                      </h3>
                      <ul className="text-sm space-y-1">
                        <li>• Best to visit during early morning or late afternoon</li>
                        <li>• Check local regulations for swimming and fishing</li>
                        <li>• Some lakes may have seasonal restrictions</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <a 
                    href={`https://www.google.com/maps/search/${encodeURIComponent(selectedLake.name + ' ' + selectedLake.city + ' ' + selectedLake.district)}`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center px-4 py-2 rounded-full ${
                      isDarkMode 
                        ? 'bg-blue-700 hover:bg-blue-600 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <FaMapMarkedAlt className="mr-2" /> View on Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {lakesData.metadata && (
          <div className={`mt-12 p-6 rounded-lg animate-fade-in-up ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-blue-100 shadow-md'
          }`}>
            <h2 className="text-xl font-semibold mb-4">Information</h2>
            {lakesData.metadata.note && <p className="mb-2"><strong>Note:</strong> {lakesData.metadata.note}</p>}
            {lakesData.metadata.data_source && <p><strong>Data Source:</strong> {lakesData.metadata.data_source}</p>}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
        .tooltip {
          position: relative;
          display: inline-block;
        }
        .tooltip:hover:after {
          content: attr(data-tip);
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background-color: rgba(0,0,0,0.8);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          white-space: nowrap;
          font-size: 12px;
          pointer-events: none;
          margin-bottom: 5px;
          z-index: 10;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Lake;
