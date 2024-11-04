import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";
import useKakaoLoader from "./use-kakao-loader";
import { useEffect, useRef, useState } from "react";
import { mapLevelState, selectedAddressLocationState } from "@/recoil/atoms";
import { useRecoilState, useRecoilValue } from "recoil";

export default function KakaoMap() {
  // ##### 0. 카카오 지도 API를 로드 #####
  useKakaoLoader();

  // ##### Recoil 상태에서 선택된 위치 정보를 관리
  const selectedAddressLocation = useRecoilValue(selectedAddressLocationState);

  // ##### Recoil 상태에서 지도 레벨을 관리
  const [mapLevel, setMapLevel] = useRecoilState(mapLevelState);

  // ##### 1. 지도 타입 상태 관리: 일반지도(roadmap) 또는 스카이뷰(skyview)
  const [mapType, setMapType] = useState<"roadmap" | "skyview">("roadmap");

  // ##### 2. 지도 객체 레퍼런스 관리 - 지도 조작을 위한 참조
  // 지도 확대/축소, 중심 좌표 변경 등을 수행
  const mapRef = useRef<kakao.maps.Map>(null);

  // ##### 닫기 가능한 커스텀 오버레이 상태 관리
  const [isOpen, setIsOpen] = useState(true);

  // ##### 2-1. 지도 확대, 축소 컨트롤 기능 #####
  const zoomIn = () => {
    if (mapRef.current) {
      const newLevel = mapRef.current.getLevel() - 1;
      mapRef.current.setLevel(newLevel);
      setMapLevel(newLevel); // Recoil 상태에 저장
    }
  };
  const zoomOut = () => {
    if (mapRef.current) {
      const newLevel = mapRef.current.getLevel() + 1;
      mapRef.current.setLevel(newLevel);
      setMapLevel(newLevel); // Recoil 상태에 저장
    }
  };

  // ##### 선택된 위치가 있을 경우, 해당 위치로 지도 중심 이동 및 레벨 조정
  useEffect(() => {
    if (selectedAddressLocation && mapRef.current) {
      const { lat, lng } = selectedAddressLocation;
      const mapCenter = new kakao.maps.LatLng(lat, lng);

      mapRef.current.setCenter(mapCenter); // 지도 중심 이동
      mapRef.current.setLevel(3); // 지도 레벨 조정
    }
  }, [selectedAddressLocation]);

  return (
    <>
      {/* //////////////////////////////////////////////////////// */}
      {/* # 0-1. 지도를 표시할 Container */}
      <Map
        id="map"
        center={
          selectedAddressLocation
            ? {
                // 선택된 위치가 있을 경우 해당 위치로 지도 중심 설정
                lat: selectedAddressLocation.lat,
                lng: selectedAddressLocation.lng,
              }
            : { lat: 35.538228, lng: 129.329897 } // 기본 좌표
        }
        style={{
          // # 0-3. 지도의 크기
          width: "100%",
          height: "100%",
          position: "relative", // 지도 포지션 설정
          overflow: "hidden", // 지도 컨터이너 넘침 숨기기
        }}
        // level={6} // # 0-4. 지도의 기본 확대 레벨
        level={mapLevel} // 초기 레벨 설정 Recoil 상태 사용
        mapTypeId={mapType === "roadmap" ? "ROADMAP" : "HYBRID"} // # 1-1. 지도 타입 설정
        ref={mapRef} // # 2-2. 지도 컴포넌트를 mapRef에 연결(지도 객체 참조)
      >
        {/* 마커, 선, 도형 등의 오버레이를 추가할 수 있다. */}
        {selectedAddressLocation && (
          <>
            <MapMarker
              position={selectedAddressLocation}
              onClick={() => setIsOpen(true)}
            />
            {isOpen && (
              <CustomOverlayMap position={selectedAddressLocation}>
                <div className="absolute left-1/2 bottom-14 w-fit -translate-x-1/2 text-left text-[12px] font-sans leading-snug bg-white shadow-[0px_1px_2px_rgba(136,136,136,0.5)] rounded-lg">
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <div className="flex justify-between items-center px-3 py-2 bg-gray-50 border-b border-gray-300">
                      <h3 className="text-[16px] font-bold text-gray-800">
                        위치 정보 확인
                      </h3>
                      <button
                        onClick={() => setIsOpen(false)}
                        aria-label="닫기"
                        className="hover:opacity-75"
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </div>
                    <div className="flex gap-3 p-3">
                      <div className="flex items-center justify-center w-[80px] h-[80px] border border-gray-300 rounded-lg overflow-hidden font-bold">
                        <img
                          src="https://ygfamily.com/contents/images/2023/04/sonnaeun-main-image_1.jpg"
                          alt=""
                          className="w-full h-full object-cover object-[50%_top]"
                        />
                      </div>
                      <div className="flex flex-col justify-between flex-1">
                        <div>{selectedAddressLocation.info}</div>
                        <button className="border border-gray-300 px-3 py-1 text-xs font-medium rounded-md bg-white">
                          건축물대장 조회
                        </button>
                      </div>
                    </div>
                    <div className="absolute left-1/2 bottom-[-11px] transform -translate-x-1/2 w-[22px] h-[12px] bg-[url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white.png')]"></div>
                  </div>
                </div>
              </CustomOverlayMap>
            )}
          </>
        )}
      </Map>

      {/* ////////////////////////////////////////////////////////// */}
      {/* ##### 1-2. 지도 타입 컨트롤(일반지도, 스카이뷰)  ##### */}
      <div className="absolute top-5 right-5 overflow-hidden w-[135px] h-[35px] z-10 text-xs font-sans border border-gray-400 rounded-md flex shadow-lg">
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

      {/* //////////////////////////////////////////////////////////// */}
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
    </>
  );
}
