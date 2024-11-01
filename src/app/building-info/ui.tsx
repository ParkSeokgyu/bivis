"use client";

import KakaoMap from "@/components/kakao-map/kakao-map";
import SearchBarInput from "@/components/searchBar/searchBar-input";
import SearchBarList from "@/components/searchBar/searchBar-list";
import { KakaoAddressSearchResponse } from "@/types";
import { useState } from "react";

export default function BuildingInfoUI({
  kakaoAddress,
  query,
}: {
  kakaoAddress: KakaoAddressSearchResponse;
  query: string;
}) {
  // ##### 지도 : 위치 선택시 선택된 위치 정보 상태 관리
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    info: string | JSX.Element;
  } | null>(null);

  return (
    <div className="flex w-full h-screen">
      <div className="min-w-[390px] h-screen flex flex-col border-r border-gray-300">
        {/* ##### 주소 입력 및 검색 영역 ##### */}
        <SearchBarInput />

        {/* ##### 주소검색 결과 리스트 영역 */}
        <SearchBarList
          kakaoAddress={kakaoAddress}
          query={query}
          setSelectedLocation={setSelectedLocation}
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
