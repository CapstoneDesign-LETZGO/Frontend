import React, { useEffect, useRef, useState } from "react";
import { PlaceInfo } from "../../types/MapTypes";

interface MapViewProps {
  onSelectPlace: (placeInfo: PlaceInfo) => void;
}

const MapView: React.FC<MapViewProps> = ({ onSelectPlace }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLat(position.coords.latitude);
            setLng(position.coords.longitude);
          },
          (error) => {
            console.error(error);
          }
        );
      } else {
        alert("GPS를 지원하지 않습니다. 설정을 확인하세요.");
      }
    };

    const initMap = () => {
      if (mapRef.current && window.google && window.google.maps) {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat, lng },
          zoom: 16,
          disableDefaultUI: true,
          styles: [
            {
              featureType: "road",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        });

        window.google.maps.event.addListener(map, "click", (event: any) => {
          if (event.placeId) {
            event.stop();

            const placeInfo: PlaceInfo = {
              name: "선택한 장소 이름(" + event.placeId + ")", 
              address: "선택한 장소 주소",
              placeId: event.placeId,
              placePhoto: "", 
              lat: event.latLng.lat(),
              lng: event.latLng.lng(),
            };

            onSelectPlace(placeInfo);
          }
        });
      }
    };

    const loadMapScript = () => {
      if (document.querySelector("#google-maps-script")) {
        initMap();
        return;
      }

      const script = document.createElement("script");
      script.id = "google-maps-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    };

    getLocation();
    if (
      typeof window.google === "undefined" ||
      typeof window.google.maps === "undefined"
    ) {
      loadMapScript();
    } else {
      initMap();
    }
  }, [lat, lng, onSelectPlace]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "100%",
        margin: 0,
        padding: 0,
      }}
    />
  );
};

export default MapView;
