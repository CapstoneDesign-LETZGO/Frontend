import React, { useEffect, useRef, useState } from "react";
import { PlaceInfo } from "../../types/MapTypes";

interface MapViewProps {
  onSelectPlace: (placeInfo: PlaceInfo) => void;
}

const MapView: React.FC<MapViewProps> = ({ onSelectPlace }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
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
    loadMapScript(); // 먼저 스크립트 로드
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

      console.log("Map Instance: ", mapInstance.current); // 맵 인스턴스가 정상적으로 초기화되었는지 확인

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

  return (
    <div
      ref={mapRef}
      className="w-full h-full m-0 p-0 min-h-screen z-10" // z-index 추가, 화면 전체를 채우도록 설정
    />
  );
};

export default React.memo(MapView);
