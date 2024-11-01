// 지도, 스카이뷰, 확대, 축소 컨트롤을 추가하는 예제입니다.

"use client";

import { Map } from "react-kakao-maps-sdk";
import { useRef, useState } from "react";
import useKakaoLoader from "./src/components/kakao-map/use-kakao-loader";

export default function AddMapCustomControl() {
  useKakaoLoader();

  const mapRef = useRef<kakao.maps.Map>(null);
  const [mapType, setMapType] = useState<"roadmap" | "skyview">("roadmap");

  const zoomIn = () => {
    const map = mapRef.current;
    if (!map) return;
    map.setLevel(map.getLevel() - 1);
  };

  const zoomOut = () => {
    const map = mapRef.current;
    if (!map) return;
    map.setLevel(map.getLevel() + 1);
  };

  return (
    <div className="relative overflow-hidden w-full h-screen">
      <Map
        id="map"
        center={{
          lat: 33.450701,
          lng: 126.570667,
        }}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
        }}
        level={3}
        mapTypeId={mapType === "roadmap" ? "ROADMAP" : "HYBRID"}
        ref={mapRef}
      ></Map>

      {/* 지도타입 컨트롤 */}
      <div className="absolute top-[10px] right-[10px] overflow-hidden w-[130px] h-[30px] z-10 text-xs font-sans border border-gray-400 rounded-md flex">
        <span
          className={`w-1/2 h-full flex items-center justify-center cursor-pointer ${
            mapType === "roadmap"
              ? "text-white bg-[#425470] bg-gradient-to-b from-[#425470] to-[#5b6d8a]"
              : "bg-white hover:bg-[#f5f5f5] active:bg-[#e6e6e6]"
          }`}
          onClick={() => setMapType("roadmap")}
        >
          지도
        </span>
        <span
          className={`w-1/2 h-full flex items-center justify-center cursor-pointer ${
            mapType === "skyview"
              ? "text-white bg-[#425470] bg-gradient-to-b from-[#425470] to-[#5b6d8a]"
              : "bg-white hover:bg-[#f5f5f5] active:bg-[#e6e6e6]"
          }`}
          onClick={() => setMapType("skyview")}
        >
          스카이뷰
        </span>
      </div>

      {/* 지도 확대, 축소 컨트롤 */}
      <div className="absolute top-[50px] right-2.5 w-9 h-20 z-10 bg-gray-100 rounded-md flex flex-col items-center overflow-hidden">
        <span
          onClick={zoomIn}
          className="w-full h-1/2 flex items-center justify-center cursor-pointer border-b border-gray-300"
        >
          <img
            src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/ico_plus.png"
            alt="확대"
            className="w-[15px] h-[15px]"
          />
        </span>
        <span
          onClick={zoomOut}
          className="w-full h-1/2 flex items-center justify-center cursor-pointer"
        >
          <img
            src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/ico_minus.png"
            alt="축소"
            className="w-[15px] h-[15px]"
          />
        </span>
      </div>
    </div>
  );
}
