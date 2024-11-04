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
  // ##### 카카오 지도 API를 로드 #####
  useKakaoLoader();

  // ### 지도 레퍼런스 및 상태 관리
  const mapRef = useRef<kakao.maps.Map>(null);

  // ★★★ 지도 초기화 여부 상태 관리
  const [mapInitialized, setMapInitialized] = useState(false);

  // ### 지도 타입 상태 관리 : 일반지도 또는 스카이뷰
  const [mapType, setMapType] = useState<"roadmap" | "skyview">("roadmap");

  // ### 사용자 위치 상태 관리
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null); // 사용자 위치 상태 관리

  // ★ 정보 창 가시성 관리 상태 추가
  const [infoVisible, setInfoVisible] = useState(true);

  ////////////////////////////////////////////////////////////////////////
  // ★ 초기 로딩 시 저장된 위치 불러오기
  useEffect(() => {
    const savedLocation = localStorage.getItem("lastSelectedLocation");
    if (savedLocation) {
      const parsedLocation: Location = JSON.parse(savedLocation);
      console.log("Saved location found:", parsedLocation); // 디버깅 로그
      setSelectedLocation(parsedLocation); // ★ 저장된 위치를 설정
    } else {
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
    }
  }, [setSelectedLocation]);

  ////////////////////////////////////////////////////////////////////////
  // ★ 선택된 위치가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    if (selectedLocation) {
      localStorage.setItem(
        "lastSelectedLocation",
        JSON.stringify(selectedLocation)
      );
    }
  }, [selectedLocation]);

  ////////////////////////////////////////////////////////////////////////
  // ★★★ 지도 초기화 후 중심 설정
  useEffect(() => {
    if (mapInitialized && selectedLocation && mapRef.current) {
      console.log("Setting map center to:", selectedLocation); // ★ 디버깅 로그
      mapRef.current.setCenter(
        new kakao.maps.LatLng(selectedLocation.lat, selectedLocation.lng)
      );
      setInfoVisible(true); // ★ 정보 창 가시성 보이도록 설정
    }
  }, [mapInitialized, selectedLocation]);

  // ★★★ 지도 초기화 완료 시 상태 업데이트
  const handleMapIdle = () => {
    if (!mapInitialized) {
      setMapInitialized(true);
    }
  };

  ////////////////////////////////////////////////////////////////////////
  // ★ 정보 창 가시성 토글 핸들러
  const handleToggleInfoVisibility = () => {
    setInfoVisible(false); // ★ 정보 창 가시성 숨기기
  };

  ////////////////////////////////////////////////////////////////////////
  // ##### 지도 확대, 축소 컨트롤 #####
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
        onIdle={handleMapIdle} // ★★★ 지도 초기화 완료 이벤트
      >
        {/* ##### 지도 : 선택된 위치(selectedLocation)가 있을 경우, 해당 위치에 마커를 추가하여 지번주소 또는 도로명주소를 우선순위에 맞게 노출  ###*/}
        {selectedLocation && (
          <MapMarker position={selectedLocation}>
            {infoVisible && ( // 정보 창 가시성 상태를 한 번만 체크
              <>
                <div className="absolute left-20 top-6 transform -translate-x-1/2 -translate-y-full bg-white py-5 pl-5 pr-10 border border-gray-300 rounded-lg shadow-xl w-[350px] z-40">
                  {/* ##### 주소 출력 함수 호출 ##### */}
                  {selectedLocation.info}

                  {/* ★ 닫기 버튼을 정보 창 내부 우측 상단에 배치 */}
                  <button
                    onClick={handleToggleInfoVisibility}
                    className="p-1 text-gray-500 hover:text-gray-800 absolute top-1 right-1"
                    aria-label="닫기 버튼"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                <div className="absolute left-[74.5px] top-[23px] w-5 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white -bottom-2 transform -translate-x-1/2 z-50 shadow-lg"></div>
              </>
            )}
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

///////////////////////////////////////////////


// 질문 : 아래 HTML, CSS 코드를 Tailwind CSS로 변환하시오.

// HTML
<div class="wrap">
  <div class="info">
    <div class="title">
      카카오 스페이스닷원
      <div class="close" onclick="closeOverlay()" title="닫기"></div>
    </div>
    <div class="body">
      <div class="img">
        <img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/thumnail.png" width="73" height="70" />
      </div>
      <div class="desc">
        <div class="ellipsis">제주특별자치도 제주시 첨단로 242</div>
        <div class="jibun ellipsis">(우) 63309 (지번) 영평동 2181</div>
        <div><a href="https://www.kakaocorp.com/main" target="_blank" class="link">홈페이지</a></div>
      </div>
    </div>
  </div>
</div>


// CSS
.wrap {
  position: absolute;
  left: 0;
  bottom: 40px;
  width: 288px;
  height: 132px;
  margin-left: -144px;
  text-align: left;
  overflow: hidden;
  font-size: 12px;
  font-family: 'Malgun Gothic', dotum, '돋움', sans-serif;
  line-height: 1.5;
}

.wrap * {
  padding: 0;
  margin: 0;
}

.wrap .info {
  width: 286px;
  height: 120px;
  border-radius: 5px;
  border-bottom: 2px solid #ccc;
  border-right: 1px solid #ccc;
  overflow: hidden;
  background: #fff;
}

.wrap .info:nth-child(1) {
  border: 0;
  box-shadow: 0px 1px 2px #888;
}

.info .title {
  padding: 5px 0 0 10px;
  height: 30px;
  background: #eee;
  border-bottom: 1px solid #ddd;
  font-size: 18px;
  font-weight: bold;
}

.info .close {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #888;
  width: 17px;
  height: 17px;
  background: url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/overlay_close.png');
}

.info .close:hover {
  cursor: pointer;
}

.info .body {
  position: relative;
  overflow: hidden;
}

.info .desc {
  position: relative;
  margin: 13px 0 0 90px;
  height: 75px;
}

.desc .ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.desc .jibun {
  font-size: 11px;
  color: #888;
  margin-top: -2px;
}

.info .img {
  position: absolute;
  top: 6px;
  left: 5px;
  width: 73px;
  height: 71px;
  border: 1px solid #ddd;
  color: #888;
  overflow: hidden;
}

.info:after {
  content: '';
  position: absolute;
  margin-left: -12px;
  left: 50%;
  bottom: 0;
  width: 22px;
  height: 12px;
  background: url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white.png');
}

.info .link {
  color: #5085BB;
}