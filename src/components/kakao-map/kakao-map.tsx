import {
  CustomOverlayMap,
  Map,
  MapMarker,
  MapTypeId,
} from "react-kakao-maps-sdk";
import useKakaoLoader from "./use-kakao-loader";
import { useEffect, useRef, useState } from "react";
import { mapLevelState, selectedAddressLocationState } from "@/recoil/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import { MdMap, MdTerrain, MdTraffic, MdDirectionsBike } from "react-icons/md";

export default function KakaoMap() {
  // ◆ 0. 카카오 지도 API를 로드
  useKakaoLoader();

  // ◆ 1. 지도 타입 상태 관리: 일반지도(roadmap) 또는 스카이뷰(skyview)
  const [mapType, setMapType] = useState<"roadmap" | "skyview">("roadmap");

  // ◆ 2. 지도 객체 레퍼런스 관리 - 지도 조작을 위한 참조
  // # 지도 확대/축소, 중심 좌표 변경 등을 수행
  const mapRef = useRef<kakao.maps.Map>(null);

  // ◆ Recoil 상태에서 선택된 위치 정보를 관리(지도에 표시할 마커 위치)
  const selectedAddressLocation = useRecoilValue(selectedAddressLocationState);

  // ◆ Recoil 상태에서 지도 레벨을 관리
  const [mapLevel, setMapLevel] = useRecoilState(mapLevelState);

  // ◆ 커스텀 오버레이 닫기/열기 기능 상태 관리(초기값: 열림)
  const [isOpen, setIsOpen] = useState(true);

  // ◆◆  2-1. 지도 확대, 축소 컨트롤 기능 #####
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

  // ◆◆  Recoil 상태 변경에 따른 선택된 위치가 있을 경우, 해당 위치로 지도 중심 이동 및 레벨 조정
  useEffect(() => {
    if (selectedAddressLocation && mapRef.current) {
      const { lat, lng } = selectedAddressLocation; // 선택된 위치의 위도, 경도
      const mapCenter = new kakao.maps.LatLng(lat, lng); // 지도 중심 좌표 객체 생성

      mapRef.current.setCenter(mapCenter); // 지도 중심 이동
      mapRef.current.setLevel(3); // 지도 레벨 조정(이동 시 레벨 값 지정)
    }
  }, [selectedAddressLocation]); // 선택된 위치 정보가 변경될 때마다 실행

  // ◆ 지적편집도, 지형정보, 교통정보, 자전거도로 정보 표시 상태 관리
  const [overlayMapTypeId, setOverlayMapTypeId] = useState({
    TRAFFIC: false,
    BICYCLE: false,
    TERRAIN: false,
    USE_DISTRICT: false,
  });

  return (
    <>
      {/* ◆  0-1. 지도를 표시할 Container ◆  */}
      <Map
        id="map"
        center={
          selectedAddressLocation
            ? {
                // 선택된 위치가 있을 경우 해당 위치로 지도 중심 설정(마커 위치)
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
        // # 0-4. 지도의 기본 확대 레벨
        // level={6}

        // # Recoil 상태에 저장된 레벨로 설정
        level={mapLevel}
        // # 1-1. 지도 타입 설정
        mapTypeId={mapType === "roadmap" ? "ROADMAP" : "HYBRID"}
        // # 2-2. 지도 컴포넌트를 mapRef에 연결(지도 객체 참조)
        ref={mapRef}
      >
        {/* ▣▣▣▣▣ 지도 관련 요소들 추가 ▣▣▣▣▣ */}

        {/*  마커, 오버레이, ...., 추가 */}
        {selectedAddressLocation && (
          <>
            {/* ◆◆◆ 마커 표시  */}
            <MapMarker
              position={selectedAddressLocation}
              onClick={() => setIsOpen(true)}
            />

            {/* ◆◆◆ 커스텀 오버레이 */}
            {isOpen && (
              <CustomOverlayMap position={selectedAddressLocation}>
                <div className="absolute left-1/2 bottom-14 w-fit -translate-x-1/2 text-left text-[12px] font-sans leading-snug bg-white shadow-[0px_1px_2px_rgba(136,136,136,0.5)] rounded-lg">
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    {/* 오베레이 헤더 */}
                    <div className="flex justify-between items-center px-3 py-2 bg-gray-50 border-b border-gray-300">
                      <h3 className="text-[14px] font-bold text-gray-800">
                        {/* 위치 정보 확인 */}
                        {/* 검색 위치 정보 */}
                        검색 위치
                        {/* 위치 정보 */}
                        {/* 관심위치 */}
                        {/* 관심지역 */}
                        {/* 검색지역 */}
                      </h3>
                      <button
                        onClick={() => setIsOpen(false)}
                        aria-label="닫기"
                        className="hover:opacity-75"
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </div>

                    {/* 이미지 - 로드뷰 사진 또는 건물 사진 UI */}
                    <div className="flex gap-3 p-3">
                      <div className="flex items-center justify-center w-[80px] h-[80px] border border-gray-300 rounded-lg overflow-hidden font-bold">
                        <img
                          src="https://ygfamily.com/contents/images/2023/04/sonnaeun-main-image_1.jpg"
                          alt=""
                          className="w-full h-full object-cover object-[50%_top]"
                        />
                      </div>

                      {/* 다음 동작 구현을 위한 버튼 */}
                      <div className="flex flex-col justify-between flex-1">
                        <div>{selectedAddressLocation.info}</div>
                        {/* <button className="border border-gray-300 px-3 py-1 text-xs font-medium rounded-md bg-white">
                          건축물대장 조회
                        </button> */}
                        <div className="flex justify-end gap-2 mt-4">
                          <button className="border border-gray-300 px-3 py-1 text-xs font-medium rounded-md bg-white">
                            기본정보
                          </button>
                          <button className="border border-gray-300 px-3 py-1 text-xs font-medium rounded-md bg-white">
                            토지정보
                          </button>
                          <button className="border border-gray-300 px-3 py-1 text-xs font-medium rounded-md bg-white ">
                            건축물정보
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 마커 표시 화살표 */}
                    <div className="absolute left-1/2 bottom-[-11px] transform -translate-x-1/2 w-[22px] h-[12px] bg-[url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white.png')]"></div>
                  </div>
                </div>
              </CustomOverlayMap>
            )}
          </>
        )}

        {/* ◆◆  지적편집도, 지형정보, 교통정보, 자전거도로 정보 표시 */}
        {overlayMapTypeId.TRAFFIC && <MapTypeId type={"TRAFFIC"} />}
        {overlayMapTypeId.BICYCLE && <MapTypeId type={"BICYCLE"} />}
        {overlayMapTypeId.TERRAIN && <MapTypeId type={"TERRAIN"} />}
        {overlayMapTypeId.USE_DISTRICT && <MapTypeId type={"USE_DISTRICT"} />}
      </Map>

      {/* ▣▣▣▣▣ 지도 관련 요소들 추가 ▣▣▣▣▣ */}

      {/* ◆◆◆◆◆ 1-2. 지도 타입 컨트롤(일반지도, 스카이뷰) ◆◆◆◆◆ */}
      <div className="absolute top-5 left-5 w-[160px] h-[40px] z-10 flex border border-gray-300 rounded-md shadow-md overflow-hidden">
        <button
          className={`w-1/2 h-full flex items-center justify-center text-sm font-semibold transition-colors duration-300 cursor-pointer ${
            mapType === "roadmap"
              ? "bg-[#425470] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          aria-label="지도 보기"
          onClick={() => setMapType("roadmap")}
        >
          지도
        </button>
        <button
          className={`w-1/2 h-full flex items-center justify-center text-sm font-semibold transition-colors duration-300 cursor-pointer ${
            mapType === "skyview"
              ? "bg-[#425470] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          aria-label="스카이뷰 보기"
          onClick={() => setMapType("skyview")}
        >
          스카이뷰
        </button>
      </div>

      {/* ◆◆◆◆◆ 지도 확대, 축소 컨트롤 ◆◆◆◆◆ */}
      <div
        className="absolute top-20 left-5
         w-9 h-20 z-10 bg-gray-100 rounded-md flex flex-col items-center overflow-hidden shadow-lg border border-gray-400"
      >
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

      {/* ◆◆◆◆◆ 지적편집도, 지형정보, 교통정보, 자전거도로 정보표시 ◆◆◆◆◆ */}
      <div className="absolute top-5 left-48 w-auto h-[40px] z-10 flex border border-gray-300 rounded-full shadow-md overflow-hidden">
        <button
          className={`w-auto pl-4 pr-2 h-full flex items-center justify-center gap-1 text-xs font-semibold transition-colors duration-300 cursor-pointer ${
            overlayMapTypeId.USE_DISTRICT
              ? "bg-[#258fff] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() =>
            setOverlayMapTypeId((prev) => ({
              ...prev,
              USE_DISTRICT: !prev.USE_DISTRICT,
            }))
          }
        >
          <MdMap className="text-base" />
          <span>지적도</span>
        </button>

        <button
          className={`w-auto px-2 h-full flex items-center justify-center gap-1 text-xs font-semibold transition-colors duration-300 cursor-pointer ${
            overlayMapTypeId.TERRAIN
              ? "bg-[#258fff] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() =>
            setOverlayMapTypeId((prev) => ({
              ...prev,
              TERRAIN: !prev.TERRAIN,
            }))
          }
        >
          <MdTerrain className="text-base" />
          <span>지형도</span>
        </button>

        <button
          className={`w-auto px-2 h-full flex items-center justify-center gap-1 text-xs font-semibold transition-colors duration-300 cursor-pointer ${
            overlayMapTypeId.TRAFFIC
              ? "bg-[#258fff] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() =>
            setOverlayMapTypeId((prev) => ({
              ...prev,
              TRAFFIC: !prev.TRAFFIC,
            }))
          }
        >
          <MdTraffic className="text-base" />
          <span>교통정보</span>
        </button>

        <button
          className={`w-auto pl-2 pr-4 h-full flex items-center justify-center gap-1 text-xs font-semibold transition-colors duration-300 cursor-pointer ${
            overlayMapTypeId.BICYCLE
              ? "bg-[#258fff] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() =>
            setOverlayMapTypeId((prev) => ({
              ...prev,
              BICYCLE: !prev.BICYCLE,
            }))
          }
        >
          <MdDirectionsBike className="text-base" />
          <span>자전거도로</span>
        </button>
      </div>
    </>
  );
}

//////////////////////////////////////////////
