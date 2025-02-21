import { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import useLocation from "../hooks/useLocation";

const GOOGLE_MAPS_API_KEY = "AIzaSyBwFwaCCpsWuvzAkhMZUnr2J43623__Jdw";

const containerStyle = {
  width: "100%",
  height: "calc(100vh - 64px)", // Full height minus header
};

export default function Map() {
  const { location, error } = useLocation();
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (!location || !map || !window.google) return;

    const service = new window.google.maps.places.PlacesService(map);

    const request = {
      location: new google.maps.LatLng(location.lat, location.lng),
      radius: 5000,
      type: "hospital",
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        setHospitals(results);
      }
    });
  }, [location, map]);

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
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={location}
        zoom={14}
        onLoad={setMap}
        options={{
          styles: [
            {
              featureType: "poi.business",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "transit",
              elementType: "labels.icon",
              stylers: [{ visibility: "off" }],
            },
          ],
        }}
      >
        {/* Current location marker */}
        <Marker
          position={location}
          icon={{
            url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          }}
        />

        {/* Hospital markers */}
        {hospitals.map((hospital) => (
          <Marker
            key={hospital.place_id}
            position={hospital.geometry.location}
            title={hospital.name}
            onClick={() => setSelectedHospital(hospital)}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/red-cross.png",
            }}
          />
        ))}

        {/* Hospital info window */}
        {selectedHospital && (
          <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-lg font-semibold mb-2">
              {selectedHospital.name}
            </h2>
            <p className="text-gray-600 mb-2">{selectedHospital.vicinity}</p>
            <div className="flex justify-between">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedHospital.geometry.location.lat()},${selectedHospital.geometry.location.lng()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600"
              >
                Get Directions
              </a>
              <button
                onClick={() => setSelectedHospital(null)}
                className="text-gray-500 hover:text-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </GoogleMap>
    </LoadScript>
  );
}
