import React, { useState, useCallback, useEffect, useRef } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194,
};

interface GoogleMapComponentProps {
  draggable?: boolean;
  onLocationSelect: (location: { lat: number; lng: number }) => void;
  initialLatitude?: number;
  initialLongitude?: number;
}

const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  draggable = false,
  onLocationSelect,
  initialLatitude = defaultCenter.lat,
  initialLongitude = defaultCenter.lng,
}) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [center, setCenter] = useState({
    lat: initialLatitude,
    lng: initialLongitude,
  });
  const [markerPosition, setMarkerPosition] = useState({
    lat: initialLatitude,
    lng: initialLongitude,
  });
  const lastUpdateRef = useRef<number>(Date.now());
  const mapRef = useRef<google.maps.Map | null>(null);

  const debounceUpdate = useCallback(
    debounce((location: { lat: number; lng: number }) => {
      const now = Date.now();
      if (now - lastUpdateRef.current > 3000) {
        // 3 seconds debounce time
        setMarkerPosition(location);
        setCenter(location);
        onLocationSelect(location);
        lastUpdateRef.current = now;
      }
    }, 300),
    [onLocationSelect]
  );

  const handleMapLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;

      if (!draggable) {
        map.setOptions({ draggable: false });
      }

      const handleCenterChange = () => {
        if (!draggable) {
          map.panTo(center);
          return;
        }

        const newCenter = map.getCenter();
        if (newCenter) {
          const lat = newCenter.lat();
          const lng = newCenter.lng();
          debounceUpdate({ lat, lng });
        }
      };

      const handleMapDoubleClick = (event: google.maps.MapMouseEvent) => {
        if (!draggable) return;

        const latLng = event.latLng;
        if (latLng) {
          const lat = latLng.lat();
          const lng = latLng.lng();
          debounceUpdate({ lat, lng });
        }
      };

      google.maps.event.addListener(map, "center_changed", handleCenterChange);
      google.maps.event.addListener(map, "dblclick", handleMapDoubleClick);
    },
    [debounceUpdate, draggable, center]
  );

  const handleMarkerDragEnd = (event: google.maps.MapMouseEvent) => {
    if (!draggable) return;

    const latLng = event.latLng;
    if (latLng) {
      const lat = latLng.lat();
      const lng = latLng.lng();
      debounceUpdate({ lat, lng });
    }
  };

  useEffect(() => {
    setMarkerPosition({ lat: initialLatitude, lng: initialLongitude });
    setCenter({ lat: initialLatitude, lng: initialLongitude });
  }, [initialLatitude, initialLongitude]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={14}
      onLoad={handleMapLoad}
      options={{
        disableDefaultUI: false, // Enable default controls
        clickableIcons: false, // Disable clickable icons
        zoomControl: true, // Show zoom control
        streetViewControl: false, // Hide street view control
        mapTypeControl: true, // Show map type control
        fullscreenControl: true, // Show fullscreen control
        draggable: draggable, // Control if the map itself is draggable
      }}
    >
      <Marker
        position={markerPosition}
        draggable={draggable}
        onDragEnd={handleMarkerDragEnd}
        animation={google.maps.Animation.DROP} // Animation when marker is placed
      />
    </GoogleMap>
  );
};

export default GoogleMapComponent;
