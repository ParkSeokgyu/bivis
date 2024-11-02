"use client";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { useRef, useState, useEffect } from "react";
import useKakaoLoader from "./use-kakao-loader";

interface Location {
  lat: number;
  lng: number;
  info: string | JSX.Element;
}

interface KakaoMapProps {
  selectedLocation: Location | null;
  setSelectedLocation: (location: Location | null) => void;
}

export default function KakaoMap({
  selectedLocation,
  setSelectedLocation,
}: KakaoMapProps) {
  // ##### 카카오 지도 API를 로드
  useKakaoLoader();

  // ### 지도 레퍼런스 및 상태 관리
  const mapRef = useRef<kakao.maps.Map>(null);

  // ### 지도 타입 상태 관리 : 일반지도 또는 스카이뷰
  const [mapType, setMapType] = useState<"roadmap" | "skyview">("roadmap");

  // ### 사용자 위치 상태 관리
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null); // 사용자 위치 상태 관리

  // ### 사용자 기본 위치를 가져오는 함수
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          setUserLocation({ lat: 35.538228, lng: 129.329897 }); // 기본 위치 (울산)
        }
      );
    } else {
      setUserLocation({ lat: 37.5665, lng: 126.978 }); // 기본 위치 (서울)
    }
  }, []);

  // ### 선택된 위치가 있을 경우, 해당 위치로 지도 중심 이동
  useEffect(() => {
    if (selectedLocation && mapRef.current) {
      mapRef.current.setCenter(
        new kakao.maps.LatLng(selectedLocation.lat, selectedLocation.lng)
      );
    }
  }, [selectedLocation]);

  // ### 지도 객체의 setLevel 메서드를 사용하여 지도 축소/확대 조절
  const zoomIn = () => mapRef.current?.setLevel(mapRef.current.getLevel() - 1);
  const zoomOut = () => mapRef.current?.setLevel(mapRef.current.getLevel() + 1);

  return (
    <div className="relative overflow-hidden w-full h-screen">
      {/* ### 지도 메인 ### */}
      <Map
        id="map"
        center={
          selectedLocation || // 선택된 위치가 없으면 기본 사용자 위치를 사용
          userLocation || {
            lat: 35.538228,
            lng: 129.329897, // 기본 좌표 (사용자 위치가 없을 경우)
          }
        }
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
        }}
        level={5}
        mapTypeId={mapType === "roadmap" ? "ROADMAP" : "HYBRID"}
        ref={mapRef}
      >
        {/* ##### 지도 : 선택된 위치(selectedLocation)가 있을 경우, 해당 위치에 마커를 추가하여 지번주소 또는 도로명주소를 우선순위에 맞게 노출  ###*/}
        {selectedLocation && (
          <MapMarker position={selectedLocation}>
            <div className="absolute left-20 top-6 transform -translate-x-1/2 -translate-y-full bg-white p-4 border border-gray-300 rounded-lg shadow-xl w-80 z-40">
              {/* ##### 주소 출력 함수 호출 ##### */}
              {selectedLocation.info}

              {/* ##### 주소 출력 추가 UI ##### */}
              <div className="flex gap-2 mt-4">
                <button className="border border-gray-300 px-3 py-1 text-xs font-medium rounded-md bg-white">
                  동작 부분 추가 예정
                </button>
              </div>
            </div>
            <div className="absolute left-[74.5px] top-[23px]  w-5 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white -bottom-2 transform -translate-x-1/2 z-50 shadow-lg"></div>
          </MapMarker>
        )}
      </Map>

      {/* ##### 지도(일반지도, 스카이뷰)타입 컨트롤 ##### */}
      <div className="absolute top-5 right-5 overflow-hidden w-[130px] h-[32px] z-10 text-xs font-sans border border-gray-400 rounded-md flex shadow-lg">
        <span
          className={`w-1/2 h-full flex items-center justify-center cursor-pointer ${
            mapType === "roadmap"
              ? "text-white bg-[#425470] bg-gradient-to-b from-[#425470] to-[#5b6d8a]"
              : "bg-white hover:bg-[#f5f5f5] active:bg-[#e6e6e6]"
          }`}
          aria-label="지도 보기"
          onClick={() => setMapType("roadmap")} // 일반지도 선택
        >
          지도
        </span>
        <span
          className={`w-1/2 h-full flex items-center justify-center cursor-pointer ${
            mapType === "skyview"
              ? "text-white bg-[#425470] bg-gradient-to-b from-[#425470] to-[#5b6d8a]"
              : "bg-white hover:bg-[#f5f5f5] active:bg-[#e6e6e6]"
          }`}
          aria-label="스카이뷰 보기"
          onClick={() => setMapType("skyview")} // 스카이뷰 선택
        >
          스카이뷰
        </span>
      </div>

      {/* ##### 지도 확대, 축소 컨트롤 ##### */}
      <div className="absolute top-20 right-5 w-9 h-20 z-10 bg-gray-100 rounded-md flex flex-col items-center overflow-hidden shadow-lg border border-gray-400">
        <span
          onClick={zoomIn} // 지도 축소 클릭 시 호출
          className="w-full h-1/2 flex items-center justify-center cursor-pointer border-b border-gray-400"
        >
          <img
            src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/ico_plus.png"
            alt="확대"
            className="w-[15px] h-[15px]" // 확대 아이콘
          />
        </span>
        <span
          onClick={zoomOut} // 지도 확대 클릭 시 호출
          className="w-full h-1/2 flex items-center justify-center cursor-pointer"
        >
          <img
            src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/ico_minus.png"
            alt="축소"
            className="w-[15px] h-[15px]" // 축소 아이콘
          />
        </span>
      </div>
    </div>
  );
}
