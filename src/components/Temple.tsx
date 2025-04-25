import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../firebase';
import { FaMapMarkedAlt, FaMoon, FaStar, FaCalendarAlt, FaInfoCircle, FaPray, FaLandmark, FaMonument, FaArrowRight } from 'react-icons/fa';

interface TempleData {
  name: string;
  district: string;
  deity: string;
  image: string;
}

const Temple: React.FC = () => {
  const [temples, setTemples] = useState<{ [key: string]: TempleData } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTemple, setSelectedTemple] = useState<TempleData | null>(null);

  useEffect(() => {
    const db = getDatabase(app);
    const templeRef = ref(db, '/temple/historical_temples');
    
    onValue(templeRef, (snapshot) => {
      const data = snapshot.val();
      setTemples(data);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching temples:', error);
      setLoading(false);
    });
  }, []);

  const openTempleDetails = (temple: TempleData) => {
    setSelectedTemple(temple);
    document.body.style.overflow = 'hidden';
  };

  const closeTempleDetails = () => {
    setSelectedTemple(null);
    document.body.style.overflow = 'auto';
  };

  // Helper function to get correct district
  const getCorrectDistrict = (temple: TempleData) => {
    const corrections: Record<string, string> = {
      'Brihadeswarar Temple': 'Thanjavur',
      'Brihadeeswarar Temple': 'Thanjavur',
      'Brihadeeshwara Temple': 'Thanjavur',
      'Ramanathaswamy Temple': 'Ramanathapuram',
      'Nataraja Temple': 'Chidambaram',
      'Meenakshi Amman Temple': 'Madurai',
      'Meenakshi Temple': 'Madurai',
      'Ekambareswarar Temple': 'Kanchipuram'
    };
    
    // Check if there's a correction for this temple
    for (const templeName in corrections) {
      if (temple.name.includes(templeName.split(' ')[0])) {
        return corrections[templeName];
      }
    }
    
    return temple.district;
  };

  // Helper function to get corrected deity name
  const getCorrectDeity = (temple: TempleData) => {
    const corrections: Record<string, string> = {
      'Brihadeswarar Temple': 'Lord Shiva (as Peruvudaiyar)',
      'Brihadeeswarar Temple': 'Lord Shiva (as Peruvudaiyar)',
      'Brihadeeshwara Temple': 'Lord Shiva (as Peruvudaiyar)',
      'Ramanathaswamy Temple': 'Lord Shiva (as Ramanathaswamy)',
      'Nataraja Temple': 'Lord Shiva (as Nataraja, the Cosmic Dancer)',
      'Meenakshi Amman Temple': 'Goddess Meenakshi (Parvati) & Lord Sundareswarar (Shiva)',
      'Meenakshi Temple': 'Goddess Meenakshi (Parvati) & Lord Sundareswarar (Shiva)',
      'Ekambareswarar Temple': 'Lord Shiva (as Ekambareswarar, "Lord of the Mango Tree")'
    };
    
    // Check if there's a correction for this temple
    for (const templeName in corrections) {
      if (temple.name.includes(templeName.split(' ')[0])) {
        return corrections[templeName];
      }
    }
    
    return temple.deity;
  };

  // Helper function to get temple significance based on name
  const getTempleSummary = (name: string) => {
    const summaries: Record<string, string> = {
      'Meenakshi Amman Temple': 'One of India\'s most iconic temples, featuring 14 magnificent gopurams (towers) adorned with 33,000 sculptures. A masterpiece of Dravidian architecture from the 14th century, dedicated to Goddess Meenakshi (Parvati) and Lord Sundareswarar (Shiva).',
      'Brihadeswarar Temple': 'UNESCO World Heritage site built by Raja Raja Chola I in 1010 CE. Features the magnificent 216-foot vimana (tower) and a massive Nandi statue carved from a single stone. Known for its architectural brilliance and historical significance.',
      'Ramanathaswamy Temple': 'One of the twelve Jyotirlinga temples dedicated to Lord Shiva, featuring the world\'s longest temple corridor (1.2 km) with over 1000 intricately carved pillars. Associated with the Ramayana, where Lord Rama worshipped Shiva.',
      'Nataraja Temple': 'Famous for its bronze Nataraja idol depicting Lord Shiva as the cosmic dancer in the "Ananda Tandava" pose. The temple represents the element of space (akasha) among the Pancha Bhoota Sthalams.',
      'Ekambareswarar Temple': 'One of the Pancha Bhoota Sthalams representing the earth element, featuring a sacred 3500-year-old mango tree with four branches symbolizing the four Vedas. Dedicated to Lord Shiva as Prithvi Lingam.'
    };
    
    const key = Object.keys(summaries).find(k => name.includes(k.split(' ')[0]));
    return summaries[name] || (key ? summaries[key] : 'A significant temple showcasing Tamil Nadu\'s rich spiritual heritage and architectural excellence.');
  };

  // Helper function to get notable features
  const getNotableFeatures = (temple: TempleData) => {
    const features: Record<string, string[]> = {
      'Meenakshi Amman Temple': [
        'Fourteen colorful gopurams (towers) covered with thousands of stone figures',
        'Hall of 1000 Pillars with intricate carvings',
        'Musical pillars that produce various musical notes when tapped',
        'Porthamarai Kulam (Golden Lotus Tank)'
      ],
      'Brihadeswarar Temple': [
        'Built entirely from granite without using mortar',
        'The 80-ton capstone at the top of the 216-foot vimana tower',
        'The monolithic Nandi (bull) statue measuring 16 feet long and 13 feet high carved from a single stone',
        'Exquisite Chola-era frescoes and paintings'
      ],
      'Ramanathaswamy Temple': [
        'Twenty-two sacred wells, each with water of different taste and medicinal properties',
        'The third corridor with 1212 pillars, the longest in India (1.2 km)',
        'Association with Lord Rama who worshipped Lord Shiva here',
        'Intricate Sethupathi-era carvings on pillars'
      ],
      'Nataraja Temple': [
        'Famous bronze Nataraja idol depicting the cosmic dance',
        'The Sabha (performance hall) with acoustically designed architecture',
        'Five-metal (Panchaloha) idols of exceptional craftsmanship',
        'Spacious courtyard with intricate stone carvings'
      ],
      'Ekambareswarar Temple': [
        'The 3500-year-old mango tree with four branches representing four Vedas',
        'The 1000-pillar mandapam (hall)',
        'Massive temple tank (Shivaganga Tank)',
        'Intricate carvings depicting 108 dance poses of Bharatanatyam'
      ]
    };

    // Look for partial matches if full name isn't found
    const key = Object.keys(features).find(k => temple.name.includes(k.split(' ')[0]));
    const defaultFeatures = [
      'Beautiful Dravidian architecture',
      'Ancient stone carvings and sculptures',
      'Sacred temple tank',
      'Traditional rituals and ceremonies'
    ];
    
    return features[temple.name] || (key ? features[key] : defaultFeatures);
  };

  // Helper function to get best time to visit
  const getBestTimeToVisit = (temple: TempleData) => {
    const timings: Record<string, string> = {
      'Meenakshi Amman Temple': 'February to March for Chithirai Festival, October to March for pleasant weather',
      'Brihadeswarar Temple': 'October to March when the weather is cooler',
      'Ramanathaswamy Temple': 'October to March, and during Maha Shivaratri',
      'Nataraja Temple': 'November to February, and during Arudra Darshan in December-January',
      'Ekambareswarar Temple': 'January to March for Panguni Uthiram festival'
    };
    
    // Look for partial matches if full name isn't found
    const key = Object.keys(timings).find(k => temple.name.includes(k.split(' ')[0]));
    return timings[temple.name] || (key ? timings[key] : 'October to March when the weather is pleasant, and during temple festivals');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-indigo-950">
        <div className="text-center">
          <div className="animate-spin mb-4 mx-auto w-16 h-16 border-t-4 border-b-4 border-amber-500 rounded-full"></div>
          <p className="text-xl text-amber-300">Loading sacred temples...</p>
        </div>
      </div>
    );
  }

  if (!temples) {
    return <div className="container mx-auto p-4 text-center text-red-600">Unable to load temple information. Please try again later.</div>;
  }

  return (
    <div className="bg-[#00008B] text-white min-h-screen">
      <div className="container mx-auto p-4 pt-8">
        <div className="text-center mb-10 animate-fade-in-up">
          <h1 className="text-4xl font-bold mb-4 text-amber-400 flex items-center justify-center">
            <span className="mr-3 text-3xl">🕉️</span>
            <FaLandmark className="mr-3 text-3xl" /> 
            Sacred Temples of Tamil Nadu
          </h1>
          <p className="text-lg max-w-3xl mx-auto text-amber-200">
            Discover the magnificent temples of Tamil Nadu, showcasing centuries of spiritual heritage, 
            architectural brilliance, and cultural significance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(temples).map(([key, temple]) => (
            <div 
              key={key} 
              className="bg-indigo-900/80 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden border border-amber-500/30 transform transition duration-300 hover:scale-105 hover:shadow-amber-500/20"
              onClick={() => openTempleDetails(temple)}
            >
              <div className="relative">
                <img 
                  src={temple.image} 
                  alt={temple.name} 
                  className="w-full h-60 object-cover transition-transform duration-500 hover:scale-110" 
                />
                <div className="absolute top-0 right-0 bg-amber-600 text-white px-3 py-1 m-2 rounded-full text-sm font-medium">
                  Historical
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/90 to-transparent flex items-end">
                  <div className="p-4 w-full">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <span className="mr-2">🏛️</span>
                      {temple.name}
                    </h2>
                    <p className="text-amber-300 flex items-center mt-2">
                      <FaMapMarkedAlt className="mr-2" />
                      {getCorrectDistrict(temple)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center text-amber-300 mb-3">
                  <FaPray className="mr-2" />
                  <span>{getCorrectDeity(temple)}</span>
                </div>

                <p className="text-gray-200 line-clamp-3 mb-4">
                  {getTempleSummary(temple.name)}
                </p>

                <button 
                  className="w-full mt-2 bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-lg transition-all duration-300 flex items-center justify-center group"
                  onClick={(e) => {
                    e.stopPropagation();
                    openTempleDetails(temple);
                  }}
                >
                  <span className="transform group-hover:translate-x-1 transition-transform">
                    Explore Temple Details
                  </span>
                  <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Temple Details Modal */}
      {selectedTemple && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 overflow-y-auto overflow-x-hidden flex justify-center items-start md:items-center p-4"
          onClick={closeTempleDetails}
          style={{ maxHeight: '100vh' }}
        >
          <div 
            className="relative bg-indigo-900/95 backdrop-blur-sm rounded-lg w-full max-w-4xl my-8 border border-amber-500/30 shadow-2xl transform transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
            style={{ margin: 'auto' }}
          >
            <button 
              onClick={closeTempleDetails}
              className="absolute -top-4 -right-4 z-50 bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors duration-300 shadow-lg"
            >
              ✕
            </button>

            <div className="relative">
              <img 
                src={selectedTemple.image} 
                alt={selectedTemple.name} 
                className="w-full h-72 object-cover rounded-t-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-950 to-transparent p-6">
                <h2 className="text-3xl font-bold text-white flex items-center">
                  <span className="mr-2">🏛️</span>
                  {selectedTemple.name}
                </h2>
                <div className="flex items-center text-amber-300 mt-2">
                  <FaMapMarkedAlt className="mr-2" /> 
                  {getCorrectDistrict(selectedTemple)}
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center text-amber-300 text-lg border-b border-amber-500/30 pb-4">
                <FaPray className="mr-2 text-xl" /> 
                <span className="font-medium">Presiding Deity:</span> 
                <span className="ml-2">{getCorrectDeity(selectedTemple)}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center text-amber-400">
                    <FaMonument className="mr-2" /> Architectural Highlights
                  </h3>
                  <ul className="space-y-3">
                    {getNotableFeatures(selectedTemple).map((feature, index) => (
                      <li key={index} className="flex items-start text-gray-200">
                        <span className="text-amber-400 mr-2">•</span> 
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center text-amber-400">
                    <FaCalendarAlt className="mr-2" /> Best Time to Visit
                  </h3>
                  <p className="text-gray-200 mb-6">{getBestTimeToVisit(selectedTemple)}</p>
                  
                  <div className="p-4 bg-indigo-950 rounded-lg border border-amber-500/30">
                    <h3 className="font-semibold mb-3 text-amber-400">Visitor Guidelines</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-center">
                        <span className="text-amber-400 mr-2">•</span>
                        Dress modestly (covered shoulders and knees)
                      </li>
                      <li className="flex items-center">
                        <span className="text-amber-400 mr-2">•</span>
                        Remove footwear before entering
                      </li>
                      <li className="flex items-center">
                        <span className="text-amber-400 mr-2">•</span>
                        Photography restrictions may apply
                      </li>
                      <li className="flex items-center">
                        <span className="text-amber-400 mr-2">•</span>
                        Maintain silence in sacred areas
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center space-x-4">
                <a 
                  href={`https://www.google.com/maps/search/${encodeURIComponent(selectedTemple.name + ' ' + getCorrectDistrict(selectedTemple) + ' Tamil Nadu')}`} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-full transition-colors duration-300"
                >
                  <FaMapMarkedAlt className="mr-2" /> View on Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

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
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
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

export default Temple;