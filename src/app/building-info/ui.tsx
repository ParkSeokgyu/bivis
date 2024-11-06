"use client";

import KakaoMap from "@/components/kakao-map/kakao-map";
import SearchBarInput from "@/components/searchBar/searchBar-input";
import SearchBarList from "@/components/searchBar/searchBar-list";
import {
  kakaoAddressState,
  selectedAddressLocationState,
} from "@/recoil/atoms";
import { KakaoAddressSearchResponse } from "@/utils/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

export default function BuildingInfoUI({
  kakaoAddress,
  query,
}: {
  kakaoAddress: KakaoAddressSearchResponse;
  query: string;
}) {
  // ◆  Recoil 상태에서 주소 검색 결과와 선택된 위치 정보 상태를 가져옴
  const [, setKakaoAddress] = useRecoilState(kakaoAddressState);

  // ◆  Recoil 상태에서 선택된 위치 정보 상태를 가져옴
  const [, setselectedAddressLocation] = useRecoilState(
    selectedAddressLocationState
  );

  // ◆ 주소 검색 결과와 선택된 위치 초기화
  useEffect(() => {
    setKakaoAddress(kakaoAddress);
    setselectedAddressLocation(null);
  }, [kakaoAddress, setKakaoAddress, setselectedAddressLocation]);

  return (
    <div className="flex w-full h-screen">
      <div className="min-w-[390px] h-screen flex flex-col border-r border-gray-300">
        {/* ##### 주소 입력 및 검색 영역 ##### */}
        <SearchBarInput />

        {/* ##### 주소검색 결과 리스트 영역 */}
        <SearchBarList query={query} />
      </div>

      {/* ##### 지도 영역 ##### */}
      <div className="flex flex-col w-full flex-1 h-screen">
        <div className="w-full h-[90%] relative">
          <KakaoMap />
        </div>

        {/* 광고 위치 */}
        <div className="w-full h-[10%] bg-gray-100 flex items-center justify-center border-t border-gray-300 font-bold text-xl">
          구글 및 쿠팡 광고 위치
        </div>
      </div>
    </div>
  );
}

// 📍
// 🗺️
