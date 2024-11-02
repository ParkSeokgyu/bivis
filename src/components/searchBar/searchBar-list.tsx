"use client";
import { useRouter } from "next/navigation";
import SearchBarListItem from "./searchBar-list-item";
import { KakaoAddressSearchResponse } from "@/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { fetchMoreKakaoAddress } from "@/app/building-info/page";
import { Button } from "@material-tailwind/react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { renderAddress } from "@/utils/addressUtils";

export default function SearchBarList({
  kakaoAddress,
  query,
  setSelectedLocation, // 📍 사용자가 선택한 위치 정보를 지도에 표시하기 위해 상위 컴포넌트로 전달
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
  const [highlightedIndex, setHighlightedIndex] = useState(0); // ★ 리스트의 첫 번째 주소에 하이라이트를 적용하기 위한 상태

  // ##### 검색 결과 데이터와 페이지 상태 초기화
  // 검색 결과가 업데이트될 때마다 주소 데이터를 새로 설정하고 페이지를 초기화.
  // 검색 결과의 첫 번째 항목이 있을 경우 해당 위치를 지도에 표시하며, 첫 번째 항목을 하이라이트.
  useEffect(() => {
    setAddress(kakaoAddress); // 새로운 주소 데이터 설정
    setPage(1); // 페이지 초기화 : 초기 페이지 1로 설정
    setIsLastPage(kakaoAddress.meta.total_count <= 15); // 15개 이하인 경우 마지막 페이지로 설정

    // 첫 번째 항목을 하이라이트
    // 📍 첫 번째 위치를 초기 마커 위치로 설정
    if (kakaoAddress.documents.length > 0) {
      const firstDocument = kakaoAddress.documents[0];
      setHighlightedIndex(0);
      if (firstDocument.address) {
        setSelectedLocation({
          lat: parseFloat(firstDocument.address.y),
          lng: parseFloat(firstDocument.address.x),
          info: renderAddress(firstDocument) || "", // 초기 info 값을 renderAddress로 설정
        });
      }
    }
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
    query && // ★ query가 존재할 경우에만 아래 조건을 체크하도록 추가
    (!address || // 주소 객체가 없거나
      !address.documents || // documents 배열이 없거나
      address.documents.length === 0 || // documents 배열이 비어 있거나
      shouldShowNoAddressMessage()) // 특정 조건에 따라 메시지를 표시해야 하는 경우
  ) {
    // 메시지 스타일링
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-50 ">
        <div className="mb-6">
          <ExclamationCircleIcon className="w-12 h-12 text-red-500" />
        </div>
        <h2 className="text-lg font-bold text-gray-700 mb-2">
          정확한 주소를 입력해 주세요
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          입력한 주소에 맞는 결과가 없습니다. <br /> 다시 시도해 주세요.
        </p>
        <button
          onClick={handleClearSearch} // 검색어 초기화
          className="px-8 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-800 transition duration-150 ease-in-out"
        >
          검색 초기화
        </button>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* ##### 검색결과 갯수 및 검색 초기화 버튼 ##### */}
      {/* 검색어가 있을 경우에만 검색결과 헤더와 초기화 버튼을 표시 */}
      {query && (
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
      )}

      {/* ##### 주소 리스트 출력 ##### */}
      {address.documents.map((document, index) => (
        <SearchBarListItem
          key={index}
          document={document}
          isHighlighted={index === highlightedIndex}
          setSelectLocation={(location) => {
            setSelectedLocation(location); // 지도 위치 설정
            setHighlightedIndex(index); // 하이라이트 업데이트
          }}
        />
      ))}

      {/* ##### 주소 더보기 버튼 ##### */}
      {/* 더보기 버튼이 첫 페이지 로드 이후 보이지 않도록 조건 추가 */}
      {!isLastPage && address.documents.length > 15 && (
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
