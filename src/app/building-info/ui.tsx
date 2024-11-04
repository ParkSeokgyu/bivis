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
  const [, setKakaoAddress] = useRecoilState(kakaoAddressState); // ★
  const [, setselectedAddressLocation] = useRecoilState(
    selectedAddressLocationState
  ); // ★

  useEffect(() => {
    setKakaoAddress(kakaoAddress);
    setselectedAddressLocation(null);
  }, [kakaoAddress, setKakaoAddress, setselectedAddressLocation]);

  // // ### 새로고침 시 리셋을 위한 라우터 객체 생성
  // const router = useRouter(); // ★ 추가
  // // 새로고침 시 selectedLocation과 query를 초기화
  // useEffect(() => {
  //   setSelectedLocation(null); // 상태 초기화
  //   router.replace("/building-info"); // URL 초기화
  // }, [router]);

  return (
    <div className="flex w-full h-screen">
      <div className="min-w-[390px] h-screen flex flex-col border-r border-gray-300">
        {/* ##### 주소 입력 및 검색 영역 ##### */}
        <SearchBarInput />

        {/* ##### 주소검색 결과 리스트 영역 */}
        <SearchBarList query={query} />
      </div>

      {/* ##### 지도 영역 ##### */}
      <div className="w-full h-screen">
        <KakaoMap />
      </div>
    </div>
  );
}

// 📍
// 🗺️
