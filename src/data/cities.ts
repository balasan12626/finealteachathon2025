export interface City {
  name: string;
  lat: number;
  lng: number;
  image?: string;
  description?: string;
}

// Tamil Nadu cities with coordinates
const cities: Record<string, City> = {
  "Virudhunagar": {
    "name": "Virudhunagar",
    "lat": 9.5827,
    "lng": 77.9803,
    "image": "https://example.com/virudhunagar.jpg",
    "description": "Known for its firecracker industries and agricultural products."
  },
  "Chennai": { 
    name: "Chennai",
    lat: 13.0827, 
    lng: 80.2707,
    image: "https://images.pexels.com/photos/9309093/pexels-photo-9309093.jpeg",
    description: "The capital city of Tamil Nadu, known for its cultural heritage, beaches, and historical monuments."
  },
  "Coimbatore": { 
    name: "Coimbatore",
    lat: 11.0174, 
    lng: 76.9589,
    image: "https://images.pexels.com/photos/15371817/pexels-photo-15371817/free-photo-of-aerial-photography-of-coimbatore-city.jpeg",
    description: "Known as the 'Manchester of South India', famous for its textile industry and surrounded by the Western Ghats."
  },
  "Madurai": { 
    name: "Madurai",
    lat: 9.9252, 
    lng: 78.1198,
    image: "https://images.pexels.com/photos/12715260/pexels-photo-12715260.jpeg",
    description: "One of the oldest continuously inhabited cities in the world, home to the magnificent Meenakshi Amman Temple."
  },
  "Tiruchirappalli": { 
    name: "Tiruchirappalli",
    lat: 10.7905, 
    lng: 78.7047,
    image: "https://images.pexels.com/photos/17079145/pexels-photo-17079145/free-photo-of-rockfort-temple-in-trichy-tamil-nadu-india.jpeg",
    description: "Home to the famous Rock Fort Temple and Srirangam temple, a major pilgrimage center."
  },
  "Salem": { 
    name: "Salem",
    lat: 11.6643, 
    lng: 78.1460,
    image: "https://images.pexels.com/photos/19443213/pexels-photo-19443213/free-photo-of-yercaud-lake-in-salem.jpeg",
    description: "Known for its rich history, mango cultivation, and the steel industry."
  },
  "Tirunelveli": { 
    name: "Tirunelveli",
    lat: 8.7139, 
    lng: 77.7567,
    image: "https://images.pexels.com/photos/13320989/pexels-photo-13320989.jpeg",
    description: "Famous for its unique cuisine including 'Tirunelveli Halwa' and ancient temples."
  },
  "Tiruppur": { 
    name: "Tiruppur",
    lat: 11.1085, 
    lng: 77.3411,
    image: "https://images.pexels.com/photos/15975512/pexels-photo-15975512/free-photo-of-tiruppur-district-tamil-nadu.jpeg",
    description: "Known as the 'Knit Wear Capital' of India for its textile manufacturing."
  },
  "Thanjavur": { 
    name: "Thanjavur",
    lat: 10.7869, 
    lng: 79.1378,
    image: "https://images.pexels.com/photos/13389220/pexels-photo-13389220.jpeg",
    description: "The cultural capital of Tamil Nadu, home to the UNESCO World Heritage Site Brihadeeswarar Temple."
  },
  "Vellore": { 
    name: "Vellore",
    lat: 12.9165, 
    lng: 79.1325,
    image: "https://images.pexels.com/photos/9887899/pexels-photo-9887899.jpeg",
    description: "Known for its grand Vellore Fort and prestigious educational institutions."
  },
  "Kancheepuram": { 
    name: "Kancheepuram",
    lat: 12.8342, 
    lng: 79.7036,
    image: "https://images.pexels.com/photos/19123211/pexels-photo-19123211/free-photo-of-kailasanathar-temple-kanchipuram.jpeg",
    description: "The 'City of Thousand Temples' and famous for its handwoven silk sarees."
  },
  "Kumbakonam": { 
    name: "Kumbakonam",
    lat: 10.9601, 
    lng: 79.3773,
    image: "https://images.pexels.com/photos/15493965/pexels-photo-15493965/free-photo-of-mahamaham-tank-kumbakonam-tamil-nadu-india.jpeg",
    description: "Known as the 'Temple Town' with numerous ancient temples and the Mahamaham tank."
  },
  "Rameswaram": { 
    name: "Rameswaram",
    lat: 9.2900, 
    lng: 79.3100,
    image: "https://images.pexels.com/photos/12715380/pexels-photo-12715380.jpeg",
    description: "A sacred pilgrimage site with the famous Ramanathaswamy Temple and the Pamban Bridge."
  },
  "Mahabalipuram": { 
    name: "Mahabalipuram",
    lat: 12.6269, 
    lng: 80.1922,
    image: "https://images.pexels.com/photos/18652041/pexels-photo-18652041/free-photo-of-sea-shore-temple-in-mahabalipuram.jpeg",
    description: "UNESCO World Heritage Site famous for its stone-carved temples and shore temple."
  },
  "Ooty": { 
    name: "Ooty",
    lat: 11.4102, 
    lng: 76.6950,
    image: "https://images.pexels.com/photos/15050556/pexels-photo-15050556/free-photo-of-ooty-tea-garden.jpeg",
    description: "A popular hill station known as the 'Queen of Hill Stations' with beautiful gardens and lakes."
  },
  "Kodaikanal": { 
    name: "Kodaikanal",
    lat: 10.2381, 
    lng: 77.4892,
    image: "https://images.pexels.com/photos/17034915/pexels-photo-17034915/free-photo-of-kodaikanal-lake-in-tamil-nadu.jpeg",
    description: "A charming hill station known for its cool climate, misty hills, and Kodai Lake."
  }
};

export default cities;