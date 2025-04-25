export interface City {
    name: string;
    lat: number;
    lng: number;
    image?: string;
    description?: string;
    distance?: number; // optional, used for nearby city sorting
  }
  

export interface HeritagePlace {
  id: string;
  name: string;
  city: string;
  image: string;
  description: string;
  story: string;
  year: string;
  location: {
    lat: number;
    lng: number;
  };
  googleMapsUrl: string;
}  