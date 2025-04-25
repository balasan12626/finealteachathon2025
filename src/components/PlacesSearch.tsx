// PlacesSearch.tsx
import React, { useState } from 'react';
import axios from 'axios';

// Define types for the API responses
interface Location {
  lat: number;
  lng: number;
}

interface Geometry {
  location: Location;
}

interface GeocodeResult {
  formatted_address: string;
  geometry: Geometry;
}

interface GeocodeResponse {
  results: GeocodeResult[];
  status: string;
}

interface Place {
  place_id: string;
  name: string;
  rating?: number;
  vicinity: string;
}

interface PlacesResponse {
  results: Place[];
  status: string;
}

interface ApiResponse {
  location: string;
  places: Place[];
}

const PlacesSearch: React.FC = () => {
  const [district, setDistrict] = useState<string>('');
  const [placeType, setPlaceType] = useState<string>('restaurant');
  const [results, setResults] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const searchPlaces = async () => {
    if (!district) return;
    
    setLoading(true);
    try {
      const response = await axios.post<ApiResponse>('http://localhost:5000/api/places', {
        district,
        placeType
      });
      setResults(response.data);
    } catch (error) {
      console.error(error);
      alert('Error fetching places');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Find Nearby Places</h1>
      <div>
        <input
          type="text"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          placeholder="Enter district name"
        />
        <select value={placeType} onChange={(e) => setPlaceType(e.target.value)}>
          <option value="restaurant">Restaurants</option>
          <option value="hotel">Hotels</option>
          <option value="cafe">Cafes</option>
          <option value="hospital">Hospitals</option>
        </select>
        <button onClick={searchPlaces} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {results && (
        <div>
          <h2>Results for {results.location}</h2>
          <ul>
            {results.places.map((place) => (
              <li key={place.place_id}>
                <h3>{place.name}</h3>
                <p>Rating: {place.rating || 'N/A'}</p>
                <p>Address: {place.vicinity}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PlacesSearch;