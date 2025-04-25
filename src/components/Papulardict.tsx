import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { realtimeDb as database } from '../firebase';

interface DestinationDetails {
    title: string;
    description: string;
    historicalSignificance: string;
    keyFeatures: {
        [key: string]: boolean;
    };
    attractions: {
        [key: string]: string;
    };
    location: {
        latitude: number;
        longitude: number;
        mapLink: string;
    };
    visitorInfo: {
        bestSeason: string;
        category: string[];
        imageUrl: string;
    };
    timestamp: number;
}

interface DestinationsData {
    [key: string]: DestinationDetails;
}

const Papulardict: React.FC = () => {
    const [destinations, setDestinations] = useState<DestinationsData | null>(null);
    const [expandedDestination, setExpandedDestination] = useState<string | null>(null);

    useEffect(() => {
        const destinationsRef = ref(database, '/papular/destinations');
        onValue(destinationsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setDestinations(data);
            }
        });
    }, []);

    if (!destinations) {
        return <div>Loading...</div>;
    }

    const handleToggleExpand = (destinationName: string) => {
        setExpandedDestination(expandedDestination === destinationName ? null : destinationName);
    };

    return (
        <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(destinations).map(([destinationName, details]) => (
                <div key={destinationName} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <img
                        src={details.visitorInfo.imageUrl}
                        alt={destinationName}
                        className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                        <h3 className="text-xl font-bold mb-2">{details.title}</h3>
                        <p className="text-gray-700 mb-2">
                            {details.description.length > 100
                                ? `${details.description.substring(0, 100)}...`
                                : details.description}
                        </p>
                        {expandedDestination === destinationName && (
                            <div className="mt-2">
                                <p className="text-gray-700 mb-1">
                                    <span className="font-semibold">Historical Significance:</span> {details.historicalSignificance}
                                </p>
                                <div className="text-gray-700 mb-1">
                                    <span className="font-semibold">Key Features:</span>
                                    <ul className="list-disc list-inside">
                                        {Object.entries(details.keyFeatures).map(([feature, value]) => (
                                            value && <li key={feature}>{feature}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="text-gray-700 mb-1">
                                    <span className="font-semibold">Attractions:</span>
                                    <ol className="list-decimal list-inside">
                                        {Object.entries(details.attractions).map(([key, attraction]) => (
                                            <li key={key}>{attraction}</li>
                                        ))}
                                    </ol>
                                </div>
                                <p className="text-gray-700 mb-1">
                                    <span className="font-semibold">Location:</span> <a href={details.location.mapLink} target="_blank" rel="noopener noreferrer">
                                        {details.location.latitude}, {details.location.longitude}
                                    </a>
                                </p>
                                <p className="text-gray-700 mb-1">
                                    <span className="font-semibold">Best Season:</span> {details.visitorInfo.bestSeason}
                                </p>
                                <p className="text-gray-700 mb-1">
                                    <span className="font-semibold">Category:</span> {details.visitorInfo.category.join(', ')}
                                </p>

                            </div>
                        )}
                        <button
                            onClick={() => handleToggleExpand(destinationName)}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                        >
                            {expandedDestination === destinationName ? 'Less' : 'More'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Papulardict;