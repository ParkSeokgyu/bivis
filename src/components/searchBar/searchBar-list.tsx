"use client";

import { useRouter } from "next/navigation";
import SearchBarListItem from "./searchBar-list-item";
import { KakaoAddressSearchResponse } from "@/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { fetchMoreKakaoAddress } from "@/app/building-info/page";
import { Button } from "@material-tailwind/react";

export default function SearchBarList({
  kakaoAddress,
  query,
  setSelectedLocation,
}: {
  kakaoAddress: KakaoAddressSearchResponse;
  query: string;
  setSelectedLocation: Dispatch<
    SetStateAction<{
      lat: number;
      lng: number;
      info: string | JSX.Element;
    } | null>
  >;
}) {
  // ##### 검색어 리셋을 위한 라우터 객체 생성
  const router = useRouter();

  // ##### 추가주소 : 주소 더보기 상태 관리
  const [address, setAddress] = useState(kakaoAddress); // 주소 데이터 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [page, setPage] = useState(1); // 초기 페이지 1로 설정
  const [isLastPage, setIsLastPage] = useState(false); // 마지막 페이지 여부

  // ##### 추가주소 : 주소 데이터 업데이트 및 페이지 초기화
  useEffect(() => {
    setAddress(kakaoAddress); // 새로운 주소 데이터 설정
    setPage(1); // 페이지 초기화 : 초기 페이지 1로 설정
    setIsLastPage(kakaoAddress.meta.total_count <= 15); // 15개 이하인 경우 마지막 페이지로 설정
  }, [kakaoAddress]);

  // ###### 검색어 리셋 핸들러
  const handleClearSearch = () => {
    router.push("building-info"); // 검색어 초기화
  };

  // ##### 더보기 버튼 클릭 시 주소 데이터 추가 로드
  const onLoadMoreClick = async () => {
    if (isLoading || isLastPage) return;

    setIsLoading(true);
    const nextPage = page + 1;
    const newMoreKakaoAddress = await fetchMoreKakaoAddress(query, nextPage);

    if (newMoreKakaoAddress.documents.length > 0) {
      setPage(nextPage);
      setAddress((prev) => ({
        ...prev!,
        documents: [
          ...(prev!.documents || []),
          ...newMoreKakaoAddress.documents,
        ],
      }));

      if (
        (address?.documents.length || 0) +
          newMoreKakaoAddress.documents.length >=
        newMoreKakaoAddress.meta.total_count
      ) {
        setIsLastPage(true);
      }
    } else {
      setIsLastPage(true);
    }
    setIsLoading(false);
  };

  // ##### 주소 검색 조건 로직 함수: 검색 결과가 특정 조건에 맞지 않을 경우 메시지를 표시할지 결정
  const shouldShowNoAddressMessage = () => {
    // 주소 타입이 REGION인 경우, 세부 지역 정보(region_3depth_name)가 없는 경우를 확인
    const isRegionWithoutDetail = address?.documents.every(
      (doc) => doc.address_type === "REGION" && !doc.address?.region_3depth_name
    );
    // 주소 타입이 ROAD인 경우, 지번 주소 정보(address)가 없는 경우를 확인
    const isRoadWithoutAddress = address?.documents.every(
      (doc) => doc.address_type === "ROAD" && !doc.address
    );
    // 위의 두 조건 중 하나라도 해당되면 메시지를 표시
    return isRegionWithoutDetail || isRoadWithoutAddress;
  };

  // ##### 주소 검색 조건에 따라 유효한 데이터가 없는 경우, 검색 결과를 표시하지 않음
  if (
    !address || // 주소 객체가 없거나
    !address.documents || // documents 배열이 없거나
    address.documents.length === 0 || // documents 배열이 비어 있거나
    shouldShowNoAddressMessage() // 특정 조건에 따라 메시지를 표시해야 하는 경우
  ) {
    return null; // 검색 결과를 표시하지 않음
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* ##### 검색결과 갯수 및 검색 초기화 버튼 ##### */}
      <div className="flex justify-between items-center px-2 py-4">
        <h3 className="text-base font-bold">
          검색결과
          <span className="text-gray-700 text-base ml-2">
            {address.meta.total_count}
          </span>
        </h3>
        <button onClick={handleClearSearch}>
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* ##### 주소 리스트 출력 ##### */}
      {address.documents.map((document, index) => (
        <SearchBarListItem
          key={index}
          document={document}
          onSelectLocation={(location) => setSelectedLocation(location)} // 지도 : 위치 선택 시 선택된 위치 정보 업데이트(선택된 위치 전달하는 콜백 함수 )
        />
      ))}

      {/* ##### 주소 더보기 버튼 ##### */}
      {!isLastPage && (
        <div className="flex justify-center my-4 mx-4">
          <Button
            onClick={onLoadMoreClick}
            disabled={isLoading}
            fullWidth
            className="bg-gray-500 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-gray-600 transition duration-200 ease-in-out"
          >
            {isLoading
              ? "Loading..."
              : `주소 더보기 (${
                  address.meta.total_count - address.documents.length
                })`}
          </Button>
        </div>
      )}
    </div>
  );
}
