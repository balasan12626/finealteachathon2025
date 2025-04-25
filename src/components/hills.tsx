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
    return <div className="text-center py-10">Loading hill stations...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (!hillsData) {
    return <div className="text-center py-10">No data available.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Hill Stations of Tamil Nadu</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hillsData.hill_stations.map((hillStation, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={hillStation.image_url}
              alt={hillStation.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">{hillStation.name}</h2>
              <p className="text-gray-600">{hillStation.city}</p>
              <p className="mt-2 text-gray-700">{hillStation.description}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-center mt-8 text-gray-700">
        Total Hill Stations: {hillsData.metadata.total_hill_stations}
      </p>
    </div>
  );
};

export default Hills;