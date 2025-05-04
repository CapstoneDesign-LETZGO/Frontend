import React, { useEffect, useRef } from "react";
import { PlaceInfo } from "../../types/MapTypes";
import { usePlaceInfo } from "../../hooks/usePlaceInfo";
import markerImage from "../../../../assets/icons/map/marker_image.png"
import mapStyle from "../../style/MapStyle.json"

interface MapViewProps {
  onSelectPlace: (placeInfo: PlaceInfo) => void;
  selectedCategory: string | null;
  center?: { lat: number; lng: number };
  isPoiClick?: boolean;
  selectedPlace?: PlaceInfo | null;
}

const MapView: React.FC<MapViewProps> = ({ onSelectPlace, selectedCategory, center, isPoiClick, selectedPlace }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const selectedMarkerRef = useRef<google.maps.Marker | null>(null); // 선택 장소용 마커
  const { fetchPlaceSearch, searchResults } = usePlaceInfo();


  // 구글 맵 스크립트 로드 + 초기화
  useEffect(() => {
    const loadMapScript = () => {
      if (document.querySelector("#google-maps-script")) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.id = "google-maps-script";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = (err) => reject(err);
        document.head.appendChild(script);
      });
    };

    const initMap = () => {
      if (mapRef.current && center && window.google && window.google.maps) {
        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          center,
          zoom: 17,
          disableDefaultUI: true,
          styles: mapStyle
        });


        mapInstance.current.addListener("click", (event: any) => {
          if (event.placeId) {
            event.stop();

            const placeInfo: PlaceInfo = {
              name: "",
              address: "",
              placeId: event.placeId,
              placePhoto: "",
              lat: event.latLng.lat(),
              lng: event.latLng.lng(),
            };

            onSelectPlace(placeInfo); // 이때 isPoiClick === true로 설정됨
          }
        });
      }
    };

    loadMapScript().then(initMap).catch(console.error);
  }, []);

  useEffect(() => {
    if (mapInstance.current && center) {
      mapInstance.current.setCenter(center);

      if (!isPoiClick && selectedPlace) {
        // 기존 선택 마커 제거
        if (selectedMarkerRef.current) {
          selectedMarkerRef.current.setMap(null);
        }

        // 새로운 마커 표시
        const marker = new window.google.maps.Marker({
          position: { lat: selectedPlace.lat, lng: selectedPlace.lng },
          map: mapInstance.current,
          title: "선택한 장소",
          icon: {
            url: markerImage,
            scaledSize: new window.google.maps.Size(50, 50)
          }
        });

        marker.addListener("click", () => {
          const placeInfo: PlaceInfo = {
            name: "",
            address: "",
            placeId: selectedPlace.placeId,
            placePhoto: "",
            lat: center.lat,
            lng: center.lng,
          };

          onSelectPlace(placeInfo);
        });

        selectedMarkerRef.current = marker;
      }

    }
  }, [center, isPoiClick, selectedPlace]);


  // 카테고리 기반 장소 검색
  useEffect(() => {
    if (selectedCategory && center) {
      fetchPlaceSearch(selectedCategory, center.lat, center.lng);
    }
  }, [selectedCategory]);

  // 검색 결과 마커 표시
  useEffect(() => {
    if (!mapInstance.current) return;

    // 기존 검색 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    searchResults.forEach((place) => {
      const marker = new window.google.maps.Marker({
        map: mapInstance.current!,
        position: { lat: place.lat, lng: place.lng },
        title: place.name,
        icon: {
          url: markerImage,
          scaledSize: new window.google.maps.Size(50, 50)
        }
      });
      marker.addListener("click", () => {
        onSelectPlace(place); // triggeredByPoi=false로 인식됨
      });

      markersRef.current.push(marker);
    });
  }, [searchResults]);

  return <div ref={mapRef} className="w-full h-full m-0 p-0 min-h-screen z-10" />;
};

export default React.memo(MapView);
