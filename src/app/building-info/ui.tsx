"use client";

import KakaoMap from "@/components/kakao-map/kakao-map";
import SearchBarInput from "@/components/searchBar/searchBar-input";
import SearchBarList from "@/components/searchBar/searchBar-list";
import { KakaoAddressSearchResponse } from "@/types";
import { useEffect, useState } from "react";

export default function BuildingInfoUI({
  kakaoAddress,
  query,
}: {
  kakaoAddress: KakaoAddressSearchResponse;
  query: string;
}) {
  // ##### 📍 : 위치 선택시 선택된 위치 정보 상태 관리
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    info: string | JSX.Element;
  } | null>(null);

  // ### 새로 고침 시 selectedLocation을 초기화
  useEffect(() => {
    setSelectedLocation(null);
  }, []);

  return (
    <div className="flex w-full h-screen">
      <div className="min-w-[390px] h-screen flex flex-col border-r border-gray-300">
        {/* ##### 주소 입력 및 검색 영역 ##### */}
        <SearchBarInput />

        {/* ##### 주소검색 결과 리스트 영역 */}
        <SearchBarList
          kakaoAddress={kakaoAddress}
          query={query}
          setSelectedLocation={setSelectedLocation} // 📍 사용자가 선택한 위치 정보를 지도에 표시하기 위해 상위 컴포넌트로 전달
        />
      </div>

      {/* ##### 지도 영역 ##### */}
      <div className="w-full h-screen">
        <KakaoMap
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
        />
      </div>
    </div>
  );
}

// 📍
// 🗺️
