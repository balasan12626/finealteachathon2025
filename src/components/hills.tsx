import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';

interface HillStation {
  name: string;
  city: string;
  description: string;
  image_url: string;
}

interface Metadata {
  total_hill_stations: number;
}

interface HillsData {
  hill_stations: HillStation[];
  metadata: Metadata;
}

const Hills: React.FC = () => {
  const [hillsData, setHillsData] = useState<HillsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const db = getDatabase();
    const hillsRef = ref(db, '/hills');

    onValue(
      hillsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setHillsData(data);
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-red-500 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-lg font-medium text-red-800 dark:text-red-200">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hillsData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-xl text-gray-600 dark:text-gray-300">No data available.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
          Hill Stations of Tamil Nadu
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Discover the breathtaking beauty of Tamil Nadu's hill stations
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {hillsData.hill_stations.map((hillStation, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="relative h-0 pb-[66.67%]">
                <img
                  src={hillStation.image_url}
                  alt={hillStation.name}
                  className="absolute h-full w-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=2070&auto=format&fit=crop';
                    target.onerror = null;
                  }}
                />
              </div>

              <div className="p-6">
                <div className="flex items-baseline">
                  <span className="inline-block px-2 py-1 text-xs font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 rounded-full">
                    Hill Station
                  </span>
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">{hillStation.name}</h2>
                <p className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">{hillStation.city}</p>
                <p className="mt-3 text-base text-gray-500 dark:text-gray-300 line-clamp-3">{hillStation.description}</p>
                
                <div className="mt-4">
                  <button className="text-teal-600 dark:text-teal-400 hover:text-teal-500 dark:hover:text-teal-300 font-medium text-sm">
                    Learn more →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <svg className="h-6 w-6 text-teal-500 dark:text-teal-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
              Total Hill Stations: {hillsData.metadata.total_hill_stations}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hills;