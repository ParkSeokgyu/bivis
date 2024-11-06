"use client";
import { useRouter } from "next/navigation";
import SearchBarListItem from "./searchBar-list-item";
import { Document } from "@/utils/types";
import { useEffect, useState } from "react";
import { fetchMoreKakaoAddress } from "@/app/building-info/page";
import { Button } from "@material-tailwind/react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { renderAddress } from "@/utils/address-utils";
import { useRecoilState } from "recoil";
import {
  kakaoAddressState,
  selectedAddressLocationState,
  selectedIndexState,
} from "@/recoil/atoms";

export default function SearchBarList({ query }: { query: string }) {
  // ##### 검색어 리셋을 위한 라우터 객체 생성
  const router = useRouter();

  // ##### 추가주소 : 주소 더보기 상태 관리
  const [address, setAddress] = useRecoilState(kakaoAddressState); // 주소 데이터 상태

  // ##### 선택된 위치 정보 상태 관리
  const [selectedAddressLocation, setSelectedAddressLocation] = useRecoilState(
    selectedAddressLocationState
  );

  // ##### 하이라이트된 인덱스 상태 관리
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0); // 기본값을 첫 번째로 설정
  const [storedIndex, setStoredIndex] = useRecoilState(selectedIndexState); // Recoil을 통해 선택된 인덱스 상태 관리

  // ##### 페이지 상태 관리
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [page, setPage] = useState(1); // 초기 페이지 1로 설정
  const [isLastPage, setIsLastPage] = useState(false); // 마지막 페이지 여부
  const [initialLoad, setInitialLoad] = useState(true); // ★ 초기 로딩 상태 추가

  // ##### 검색 결과 데이터와 페이지 상태 초기화
  // 검색 결과가 업데이트될 때마다 주소 데이터를 새로 설정하고 페이지를 초기화.
  // 검색 결과의 첫 번째 항목이 있을 경우 해당 위치를 지도에 표시하며, 첫 번째 항목을 하이라이트.
  useEffect(() => {
    setPage(1); // 페이지 초기화 : 초기 페이지 1로 설정
    setIsLastPage(address.documents.length >= address.meta.total_count); // 로드된 문서 수와 총 문서 수 비교로 마지막 페이지 여부 설정

    // 저장된 인덱스를 사용하여 선택된 위치를 설정
    const initialIndex = storedIndex !== null ? storedIndex : 0;
    setHighlightedIndex(initialIndex);

    if (address.documents.length > 0 && address.documents[initialIndex]) {
      const initialDocument = address.documents[initialIndex];
      if (initialDocument.address) {
        setSelectedAddressLocation({
          lat: parseFloat(initialDocument.address.y),
          lng: parseFloat(initialDocument.address.x),
          info: renderAddress(initialDocument) || "",
        });
      }
    }

    setInitialLoad(false); // 초기 로딩 완료를 빠르게 설정
  }, [address, storedIndex, setSelectedAddressLocation]);

  // ###### 검색어 리셋 핸들러
  const handleClearSearch = () => {
    setSelectedAddressLocation(null); // ★ 선택된 위치 초기화하여 마커 제거
    router.push("building-info"); // 검색어 초기화
  };

  // ##### 더보기 버튼 클릭 시 주소 데이터 추가 로드
  const onLoadMoreClick = async () => {
    if (isLoading || isLastPage) return; // 마지막 페이지일 경우 더 이상 로드하지 않음

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
  // ### UI를 통해 사용자 메시지 제공
  if (
    query && // ★ query가 존재할 경우에만 아래 조건을 체크하도록 추가
    !initialLoad && // ★ 로딩이 완료된 후에만 조건을 체크
    (!address || // 주소 객체가 없거나
      !address.documents || // documents 배열이 없거나
      address.documents.length === 0 || // documents 배열이 비어 있거나
      shouldShowNoAddressMessage()) // 특정 조건에 따라 메시지를 표시해야 하는 경우
  ) {
    // 메시지 스타일링 및 검색 결과 수 포함
    return (
      <div className="flex flex-col items-center justify-center h-full  bg-white shadow-md rounded-lg">
        <div className="w-full h-[40%] flex flex-col items-center justify-center text-center p-8">
          <div className="mb-4">
            <ExclamationCircleIcon className="w-12 h-12 text-red-500 animate-bounce" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            정확한 주소를 입력해 주세요
          </h2>
          <p className="text-sm text-gray-600 mb-3 leading-relaxed">
            입력한 주소에 맞는 결과가 없습니다. <br /> 다시 시도해 주세요.
          </p>
          <button
            onClick={handleClearSearch} // 검색어 초기화
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg shadow-sm hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-150 ease-in-out"
          >
            검색 초기화
          </button>
        </div>

        {/* 광고 위치 */}
        <div className="w-full h-[60%] bg-gray-100 flex items-center justify-center font-bold text-xl mt-9">
          구글 및 쿠팡 광고 위치
        </div>
      </div>
    );
  }

  // ##### 지도 : 리스트 클릭 시 선택된 위치 정보 업데이트
  // ##### 리스트 클릭 시 하이라이트 및 위치 정보 업데이트
  const handleLocationClick = (index: number, document: Document) => {
    setHighlightedIndex(index); // 즉각적인 하이라이트 변경
    setStoredIndex(index); // Recoil 상태와 로컬 스토리지에 저장
    if (document.address) {
      setSelectedAddressLocation({
        lat: parseFloat(document.address.y),
        lng: parseFloat(document.address.x),
        info: renderAddress(document) || "",
      });
    }
  };

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
          onClick={() => handleLocationClick(index, document)}
        />
      ))}

      {/* ##### 주소 더보기 버튼 ##### */}
      {/* ★ 초기 로딩 중에는 "주소 더보기" 버튼을 숨김 */}
      {!initialLoad && !isLastPage && (
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

      {/* 광고 위치 */}
      <div className="w-full max-h-screen mt-5 px-2 py-4 bg-gray-100 flex flex-col items-center justify-center font-bold text-xl">
        <div>구글 및 쿠팡 광고 위치</div>
      </div>
    </div>
  );
}
