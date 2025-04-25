import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useParams } from 'react-router-dom';

interface Temple {
  id: number;
  name: string;
  city: string;
  image: string;
  description: string;
  story?: string;
  year: string;
  location: { lat: number; lng: number };
  map_url?: string;
}

interface Metadata {
  notes?: string;
  data_source?: string;
}

interface TempleData {
  temples: Temple[];
  metadata?: Metadata;
}

const Temple: React.FC = () => {
  const { cityName } = useParams<{ cityName: string }>();
  const [templeData, setTempleData] = useState<TempleData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const db = getDatabase();
    const templeRef = ref(db, `/temple`);

    onValue(
      templeRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const formattedTemples: Temple[] = Object.entries(data).map(([key, value]) => ({
            id: parseInt(key),
            ...(value as Temple),
          }));
          setTempleData({ temples: formattedTemples });
        } else {
          setError('No data found.');
        }
        setLoading(false);
      },
      (err) => {
        setError(`Error fetching data: ${err.message}`);
        setLoading(false);
      }
    );
  }, [cityName]);

  if (loading) {
    return <div className="text-center py-10 text-white bg-gray-900">Loading temples...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500 bg-gray-900">{error}</div>;
  }

  if (!templeData || templeData.temples.length === 0) {
    return <div className="text-center py-10 text-white bg-gray-900">No temples available.</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Temples in {cityName}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templeData.temples.map((temple) => (
            <div key={temple.id} className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <img
                src={temple.image}
                alt={temple.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{temple.name}</h2>
                <p className="text-gray-300">{temple.city}</p>
                <p className="mt-2">{temple.description}</p>
                <p className="mt-2">
                  <strong>Story:</strong>{' '}
                  {temple.story ? temple.story.split('.').join('. ') : 'No story available.'}
                </p>
                <p className="mt-2">
                  <strong>Year Built:</strong> {temple.year}
                </p>
                {temple.map_url && (
                  <a
                    href={temple.map_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 mt-2 inline-block"
                  >
                    View on Map
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {templeData.metadata && (
          <div className="mt-8 p-4 bg-gray-700 rounded-lg">
            {templeData.metadata.notes && (
              <p>
                <strong>Notes:</strong> {templeData.metadata.notes}
              </p>
            )}
            {templeData.metadata.data_source && (
              <p>
                <strong>Data Source:</strong> {templeData.metadata.data_source}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Temple;
