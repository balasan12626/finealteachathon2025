import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";
import axios from "axios";

interface Location {
  lat: number;
  lng: number;
  googleMapsUrl?: string;
}

interface HeritagePlace {
  id: string;
  name: string;
  description: string;
  image: string;
  story: string;
  year: string;
  location: Location;
}

interface NearbyPlace {
  name: string;
  vicinity: string;
  rating?: number;
  types: string[];
  photos?: { photo_reference: string }[];
}

interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

const PlaceDetails: React.FC = () => {
  const { city, id } = useParams<{ city: string; id: string }>();
  const navigate = useNavigate();

  const [place, setPlace] = useState<HeritagePlace | null>(null);
  const [error, setError] = useState("");
  const [translatedDescription, setTranslatedDescription] = useState("");
  const [translatedStory, setTranslatedStory] = useState("");
  const [selectedLang, setSelectedLang] = useState("en");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [aiResearch, setAiResearch] = useState<string>("");
  const [researchLoading, setResearchLoading] = useState<boolean>(false);
  const [isResearchPlaying, setIsResearchPlaying] = useState<boolean>(false);
  const researchAudioRef = useRef<HTMLAudioElement | null>(null);

  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [placesLoading, setPlacesLoading] = useState<boolean>(false);
  const [showNearbyPlaces, setShowNearbyPlaces] = useState<boolean>(false);

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);

  // 1) Fetch the heritage place from Firebase
  useEffect(() => {
    const db = getDatabase();
    const placeRef = ref(db, `c/${city}/heritagePlaces`);
    const off = onValue(
      placeRef,
      (snap) => {
        const data = snap.val();
        if (Array.isArray(data)) {
          const found = data.find((p) => String(p.id) === String(id));
          if (found) {
            setPlace(found);
            translateText(found.description, found.story, selectedLang);
            fetchWeather(found.location.lat, found.location.lng);
          } else {
            setError("No heritage place found with the given ID.");
          }
        } else {
          setError("Unexpected data structure in Firebase.");
        }
        setLoading(false);
      },
      (err) => {
        setError("Failed to fetch data: " + err.message);
        setLoading(false);
      }
    );

    // stop any TTS when navigating away
    const stopAll = () => {
      stopResearchSpeaking();
      stopSpeaking();
    };
    const unlisten = () => {
      stopAll()
    };
    window.addEventListener("pushstate", stopAll);
    window.addEventListener("popstate", stopSpeaking);

    return () => {
      off();
      stopSpeaking();
      if (timerRef.current) clearInterval(timerRef.current);
      unlisten();
    };
  }, [city, id, selectedLang]);

  // Fetch weather data
  const fetchWeather = async (lat: number, lng: number) => {
    setWeatherLoading(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            lat: lat,
            lon: lng,
            appid: import.meta.env.VITE_OPENWEATHERMAP_API_KEY,
            units: "metric",
          },
        }
      );
      setWeather({
        temp: response.data.main.temp,
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon,
        humidity: response.data.main.humidity,
        windSpeed: response.data.wind.speed,
      });
    } catch (error) {
      console.error("Failed to fetch weather:", error);
    } finally {
      setWeatherLoading(false);
    }
  };

  // 2) Translate the description & story
  const translateText = async (desc: string, story: string, lang: string) => {
    try {
      const resp = await axios.post(
        `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=${lang}`,
        [{ Text: desc }, { Text: story }],
        {
          headers: {
            "Ocp-Apim-Subscription-Key": import.meta.env.VITE_AZURE_TRANSLATOR_KEY!,
            "Ocp-Apim-Subscription-Region": import.meta.env.VITE_AZURE_TRANSLATOR_REGION!,
            "Content-Type": "application/json",
          },
        }
      );
      setTranslatedDescription(resp.data[0]?.translations[0]?.text || "");
      setTranslatedStory(resp.data[1]?.translations[0]?.text || "");
    } catch (err) {
      console.error(err);
    }
  };

  // 3) Play / stop TTS for description + story
  const speakText = async () => {
    if (isPlaying) {
      stopSpeaking();
      return;
    }
    setIsPlaying(true);

    const toSpeak = `${translatedDescription || place?.description}\n${translatedStory || place?.story}`;
    const ssml = `
      <speak version='1.0' xml:lang='${selectedLang}'>
        <voice xml:lang='${selectedLang}' name='${getVoiceByLang(selectedLang)}'>
          ${toSpeak}
        </voice>
      </speak>
    `;

    try {
      const resp = await axios.post(
        `https://${import.meta.env.VITE_AZURE_TTS_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`,
        ssml,
        {
          headers: {
            "Content-Type": "application/ssml+xml",
            "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
            "Ocp-Apim-Subscription-Key": import.meta.env.VITE_AZURE_TTS_KEY!,
          },
          responseType: "blob",
        }
      );
      const url = URL.createObjectURL(resp.data);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => setIsPlaying(false);
      audio.play();
    } catch (err) {
      console.error(err);
      setIsPlaying(false);
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      audioRef.current = null;
    }
  };

  const getVoiceByLang = (lang: string) => {
    const voices: Record<string, string> = {
      as: "as-IN-AalokitaNeural",   bn: "bn-IN-TanishaaNeural",
      brx: "brx-IN-AnoojNeural",    doi: "doi-IN-KaushikiNeural",
      en: "en-IN-NeerjaNeural",     gu: "gu-IN-DhwaniNeural",
      hi: "hi-IN-SwaraNeural",      kok: "kok-IN-AkhilNeural",
      kn: "kn-IN-SapnaNeural",      ks: "ks-IN-RekhaNeural",
      mai: "mai-IN-SadhakaNeural",  ml: "ml-IN-SobhanaNeural",
      mni: "mni-IN-SaraniNeural",    mr: "mr-IN-AarohiNeural",
      ne: "ne-NP-HemkalaNeural",     or: "or-IN-AshwiniNeural",
      pa: "pa-IN-HarjotNeural",      sa: "sa-IN-MadhusreeNeural",
      sd: "sd-IN-AbbasiNeural",      ta: "ta-IN-PallaviNeural",
      te: "te-IN-MohanNeural"
    };
    return voices[lang] || voices["en"];
  };

  // 4) AI Heritage Research + TTS
  const getAiResearch = async () => {
    if (!place) return;
    setAiResearch("");

    const prompt = `
    You are a Tamil Nadu heritage AI agent.
    Generate a numbered list (1–5) of key heritage features of ${place.name}.
    Include:
    - Historical significance
    - Architectural details
    - Cultural importance
    - Visitor tips
    - Any unique facts
    
    Use this information as context:
    - Description: ${place.description}
    - Story: ${place.story}
    - Year: ${place.year}
    `;

    setResearchLoading(true);
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${import.meta.env.VITE_GOOGLE_GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
        }
      );
      const researchText = response.data.candidates[0]?.content.parts[0]?.text || "No research available";
      setAiResearch(researchText);
    } catch (error: any) {
      console.error("Gemini Research Error:", error);
      setError("AI Research failed. Please try again later.");
    } finally {
      setResearchLoading(false);
    }
  };

  const speakAiResearch = async () => {
    if (isResearchPlaying) {
      stopResearchSpeaking();
      return;
    }
    if (!aiResearch) return;

    setIsResearchPlaying(true);
    const ssml = `
      <speak xml:lang='${selectedLang}'>
        <voice xml:lang='${selectedLang}' name='${getVoiceByLang(selectedLang)}'>
          ${aiResearch}
        </voice>
      </speak>
    `;

    try {
      const response = await axios.post(
        `https://${import.meta.env.VITE_AZURE_TTS_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`,
        ssml,
        {
          headers: {
            "Content-Type": "application/ssml+xml",
            "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
            "Ocp-Apim-Subscription-Key": import.meta.env.VITE_AZURE_TTS_KEY!,
          },
          responseType: "blob",
        }
      );
      const audioUrl = URL.createObjectURL(response.data);
      researchAudioRef.current = new Audio(audioUrl);
      researchAudioRef.current.onended = () => setIsResearchPlaying(false);
      researchAudioRef.current.play();
    } catch (error: any) {
      console.error("AI TTS error:", error);
      setIsResearchPlaying(false);
    }
  };

  const stopResearchSpeaking = () => {
    if (researchAudioRef.current) {
      researchAudioRef.current.pause();
      researchAudioRef.current.currentTime = 0;
      setIsResearchPlaying(false);
      researchAudioRef.current = null;
    }
  };

  // 5) NEARBY SEARCH now uses **city** param via Google Places TEXT SEARCH
  const getNearbyPlaces = async () => {
    if (!city) return;
    setPlacesLoading(true);
    setShowNearbyPlaces(!showNearbyPlaces);

    if (!showNearbyPlaces) {
      try {
        const resp = await axios.get(
          `https://maps.googleapis.com/maps/api/place/textsearch/json`,
          {
            params: {
              query: `restaurants and hotels in ${city}`,
              key: import.meta.env.VITE_GOOGLE_PLACES_API_KEY,
            },
          }
        );
        const results = resp.data.results.map((pl: any) => ({
          name: pl.name,
          vicinity: pl.formatted_address || pl.vicinity,
          rating: pl.rating,
          types: pl.types,
          photos: pl.photos?.map((p: any) => ({ photo_reference: p.photo_reference })),
        }));
        setNearbyPlaces(results);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch nearby places");
      } finally {
        setPlacesLoading(false);
      }
    }
  };

  const getPhotoUrl = (ref: string) =>
    `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ref}&key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}`;

  // RENDER
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        <span className="ml-3 text-lg text-gray-700 dark:text-gray-300">Loading details...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md max-w-md">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  if (!place) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md shadow-md max-w-md">
          <p>No place information found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 pb-12">
      {/* Hero Section with Image */}
      <div className="relative w-full h-80 md:h-96 mb-8 overflow-hidden">
        <img 
          src={place.image} 
          alt={place.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-md">
                {place.name}
              </h1>
              <p className="text-gray-200 text-lg"><span className="font-semibold">Era:</span> {place.year}</p>
            </div>
            
            {/* Weather Card */}
            {weather && (
              <div className="backdrop-blur-md bg-white/20 rounded-lg p-3 border border-white/20 shadow-lg text-white">
                <div className="flex items-center gap-3">
                  <img 
                    src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} 
                    alt={weather.description} 
                    className="w-16 h-16"
                  />
                  <div>
                    <p className="font-bold text-2xl">{Math.round(weather.temp)}°C</p>
                    <p className="capitalize">{weather.description}</p>
                    <p className="text-sm opacity-90">Humidity: {weather.humidity}% | Wind: {weather.windSpeed} m/s</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 max-w-4xl mx-auto">
        {/* Language Selector */}
        <div className="mb-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 shadow-md">
          <label className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300 font-medium">Select Language:</span>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="ml-4 px-4 py-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="ta">Tamil</option>
              <option value="te">Telugu</option>
              <option value="kn">Kannada</option>
              <option value="ml">Malayalam</option>
              <option value="bn">Bengali</option>
              <option value="mr">Marathi</option>
              <option value="gu">Gujarati</option>
            </select>
          </label>
        </div>

        {/* Content Cards */}
        <div className="grid gap-6 mb-8">
          {/* Description Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 dark:bg-blue-900/30">
              <h2 className="text-xl font-bold text-blue-700 dark:text-blue-300">Description</h2>
            </div>
            <div className="p-5">
              <p className="leading-relaxed">{translatedDescription || place.description}</p>
            </div>
          </div>

          {/* Story Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="border-l-4 border-amber-500 pl-4 py-2 bg-amber-50 dark:bg-amber-900/30">
              <h2 className="text-xl font-bold text-amber-700 dark:text-amber-300">Story & History</h2>
            </div>
            <div className="p-5">
              <p className="leading-relaxed">{translatedStory || place.story}</p>
            </div>
          </div>
        </div>

        {/* Interactive Buttons Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Explore More</h3>
          
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={speakText} 
              className={`flex items-center px-4 py-2 rounded-md shadow-sm transition-all duration-300 ${
                isPlaying 
                  ? "bg-red-600 hover:bg-red-700 text-white" 
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                {isPlaying ? (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                ) : (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                )}
              </svg>
              {isPlaying ? "Stop Audio" : "Play Audio"}
            </button>
            
            <button 
              onClick={getAiResearch} 
              disabled={researchLoading}
              className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md shadow-sm transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              {researchLoading ? "Researching..." : "AI Research"}
            </button>

            {place.location.googleMapsUrl && (
              <a
                href={place.location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Google Maps
              </a>
            )}
          
            <button
              onClick={getNearbyPlaces}
              disabled={placesLoading}
              className="flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md shadow-sm transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
              {showNearbyPlaces ? `Hide Nearby in ${city}` : `Show Nearby in ${city}`}
            </button>
          </div>
        </div>

        {/* AI Research Results */}
        {aiResearch && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
            <div className="border-l-4 border-purple-500 pl-4 py-2 bg-purple-50 dark:bg-purple-900/30 flex justify-between items-center">
              <h2 className="text-xl font-bold text-purple-700 dark:text-purple-300">AI Research Summary</h2>
              <div className="flex gap-2">
                <button 
                  onClick={speakAiResearch} 
                  className={`px-3 py-1 rounded text-xs font-medium ${isResearchPlaying ? "bg-red-600 text-white" : "bg-blue-600 text-white"}`}
                >
                  {isResearchPlaying ? "Stop" : "Play"}
                </button>
                <button 
                  onClick={getAiResearch} 
                  className="px-3 py-1 bg-purple-600 text-white rounded text-xs font-medium"
                >
                  Refresh
                </button>
              </div>
            </div>
            <div className="p-5">
              <pre className="whitespace-pre-wrap font-sans">{aiResearch}</pre>
            </div>
          </div>
        )}
        
        {/* Nearby Places */}
        {showNearbyPlaces && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
            <div className="border-l-4 border-orange-500 pl-4 py-2 bg-orange-50 dark:bg-orange-900/30">
              <h2 className="text-xl font-bold text-orange-700 dark:text-orange-300">
                Nearby Hotels & Restaurants in {city}
              </h2>
            </div>
            
            {placesLoading && (
              <div className="p-6 flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange-500"></div>
              </div>
            )}
            
            {!placesLoading && nearbyPlaces.length === 0 && (
              <div className="p-6 text-center text-gray-600 dark:text-gray-400">
                No results found in {city}
              </div>
            )}
            
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {nearbyPlaces.map((pl, i) => (
                <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-gray-50 dark:bg-gray-800/50">
                  {pl.photos?.[0]?.photo_reference && (
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={getPhotoUrl(pl.photos[0].photo_reference)}
                        alt={pl.name}
                        className="w-full h-full object-cover"
                      />
                      {pl.rating != null && (
                        <span className="absolute top-2 right-2 bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-sm font-bold">
                          ★ {pl.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="font-semibold text-lg">{pl.name}</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{pl.vicinity}</p>
                    
                    {!pl.photos?.[0]?.photo_reference && pl.rating != null && (
                      <p className="mt-2 text-yellow-500">★ {pl.rating.toFixed(1)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceDetails;