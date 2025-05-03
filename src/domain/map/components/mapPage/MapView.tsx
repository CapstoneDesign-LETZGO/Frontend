import React, { useEffect, useRef, useState } from "react";
import { PlaceInfo } from "../../types/MapTypes";
import { useAuthFetch } from "../../../../common/hooks/useAuthFetch";

interface MapViewProps {
  onSelectPlace: (placeInfo: PlaceInfo) => void;
  selectedCategory: string | null;
}

const MapView: React.FC<MapViewProps> = ({ onSelectPlace, selectedCategory }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const { authFetch } = useAuthFetch();
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

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
            alert("위치 정보를 가져올 수 없습니다.");
          }
        );
      } else {
        alert("GPS를 지원하지 않습니다.");
      }
    };

    const loadMapScript = () => {
      if (document.querySelector("#google-maps-script")) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.id = "google-maps-script";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          console.log("Google Maps API Loaded");
          resolve();
        };
        script.onerror = (error) => {
          console.error("Error loading Google Maps API:", error);
          reject(error);
        };
        document.head.appendChild(script);
      });
    };

    getLocation();
    loadMapScript();
  }, []);

  useEffect(() => {
    if (lat !== null && lng !== null && mapRef.current && window.google && window.google.maps) {
      console.log("Initializing Google Maps...");
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
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

      mapInstance.current.addListener("click", (event: any) => {
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
  }, [lat, lng]);

  useEffect(() => {
    const fetchPlaces = async () => {
      if (!selectedCategory || !lat || !lng || !mapInstance.current) return;
  
      try {
        const response = await authFetch(
          'api/map-api/places',
          {
            params: {
              query: selectedCategory,
              lat: lat.toString(),
              lng: lng.toString(),
              radius: 1000,
              num: 10,
            },
          },
          'GET'
        );
  
        // 기존 마커 제거
        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];
  
        if (response?.data?.data) {
          const places = response.data.data;
  
          places.forEach((place: any) => {
            const marker = new window.google.maps.Marker({
              map: mapInstance.current!,
              position: { lat: place.lat, lng: place.lng },
              title: place.name,
            });
            markersRef.current.push(marker);
          });
        }
      } catch (err) {
        console.error("백엔드로부터 장소 데이터 가져오기 실패:", err);
      }
    };
  
    fetchPlaces();
  }, [selectedCategory, lat, lng]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full m-0 p-0 min-h-screen z-10"
    />
  );
};

export default React.memo(MapView);