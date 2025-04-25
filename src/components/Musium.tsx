import React, { useState, useEffect } from 'react';
import { ref, get, getDatabase } from 'firebase/database';
import { getApp } from 'firebase/app';


interface MuseumData {
  name: string;
  city: string;
  description: string;
  timings: string;
  closedOn: string;
  entryFee: number;
  childEntryFee?: number;
  foreignerEntryFee?: number;
  imageUrl?:string
  mapUrl?:string
  category?:string;

}

const Musium: React.FC = () => {
  const [museums, setMuseums] = useState<{ [key: string]: MuseumData }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMuseums = async () => {
      try {
        const app = getApp();
        const database = getDatabase(app);
        const museumsRef = ref(database, '/musium/destinations/{city}/{category}/{museumId}'); // Corrected line
        const snapshot = await get(museumsRef);

        if (snapshot.exists()) {
          setMuseums(snapshot.val());
        } else {
          setError('No museums found.');
        }
      } catch (error) {
        setError('Failed to load museums.');
        console.error('Error fetching museums:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMuseums();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {/* Display museums here */}
      {Object.entries(museums).map(([key, museum]) => (
        <div key={key}>
          <h3>{museum.name}</h3>
          <p>{museum.description}</p>
          {/* Display other museum details */}
        </div>
      ))}
    </div>
  );
};

export default Musium;