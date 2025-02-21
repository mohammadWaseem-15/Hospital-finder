import { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import useLocation from '../hooks/useLocation';

const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

const containerStyle = {
  width: '100%',
  height: 'calc(100vh - 64px)', // Full height minus header
};

interface Hospital {
  place_id: string;
  name: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export default function Map() {
  const { location, error } = useLocation();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);

  useEffect(() => {
    if (!location || !window.google) return;

    const service = new window.google.maps.places.PlacesService(
      document.createElement('div')
    );

    const request = {
      location: new google.maps.LatLng(location.lat, location.lng),
      radius: 5000,
      type: 'hospital'
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        setHospitals(results as Hospital[]);
      }
    });
  }, [location]);

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>Loading location...</p>
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={['places']}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={location}
        zoom={14}
      >
        {/* Current location marker */}
        <Marker
          position={location}
          icon={{
            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
          }}
        />
        
        {/* Hospital markers */}
        {hospitals.map((hospital) => (
          <Marker
            key={hospital.place_id}
            position={hospital.geometry.location}
            title={hospital.name}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}