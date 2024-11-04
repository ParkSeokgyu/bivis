// 질문 : 아래 코드는 Next.js 14로 만든 카카오 주소 api를 통해 주소를 검색하고 검색한 주소를 통해 카카오 지도에 표시하는 프로젝트인데, 현재 이 프로젝트를 Recoil을 사용하여 상태관리를 하여 아래 코드를 수정하고 완성하고 싶어. 수정 및 추가를 할때 기존에 작성된 코드의 주석 설명을 최대한 지우지 않고 추가 및 수정해줘, 한국어로 알려줘야해!!




// 프로젝트 폴더 구조

src/
├── app/
│   ├── (home)/
│   │   └── page.tsx
│   ├── building-info/
│   │   ├── page.tsx
│   │   └── ui.tsx
│   ├── globals.css      // 전역 스타일
│   └── layout.tsx
├── components/
│   ├── kakao-map/
│   │   ├── kakao-map.tsx
│   │   └── use-kakao-loader.tsx
│   ├── searchBar/
│   │   ├── searchBar-input.tsx
│   │   ├── searchBar-list.tsx
│   │   └── searchBar-list-item.tsx
│   └── sideBar.tsx
├── providers/
│   └── material-tailwind-theme-provider.tsx
│   └── RecoilProvider.tsx
├── recoil/
│   └── atoms.ts        // Recoil Atoms & Selectors 관리
├── utils/
│   ├── address-utils.tsx // 주소 관련 유틸리티 함수
│   └── types.ts         // 공통 타입 정의
├── fonts/               // 로컬 폰트 파일
├── .env                 // 환경 변수
├── .eslintrc.json       // ESLint 설정
├── tailwind.config.js   // Tailwind 설정
├── tsconfig.json        // TypeScript 설정
└── next.config.js       // Next.js 설정


// ##### providers/aterial-tailwind-theme-provider.tsx
"use client";

export { ThemeProvider } from "@material-tailwind/react";


// ##### providers/RecoilProvider.tsx
"use client";
import { RecoilRoot } from "recoil";

export default function RecoilProvider({ children }: React.PropsWithChildren) {
  return <RecoilRoot>{children}</RecoilRoot>;
}


// ##### recoil/atoms.ts
import { atom } from "recoil";
import { KakaoAddressSearchResponse } from "@/utils/types";

// ##### 주소 검색 결과 상태 #####
export const kakaoAddressState = atom<KakaoAddressSearchResponse>({
  key: "kakaoAddressState",
  default: {
    documents: [],
    meta: { is_end: true, pageable_count: 0, total_count: 0 },
  },
});


// ##### 선택된 위치 정보 상태 #####
export const selectedLocationState = atom<{
  lat: number;
  lng: number;
  info: string | JSX.Element;
} | null>({
  key: "selectedLocationState",
  default: null,
});


// ##### utils/address-utils.tsx
// addressUtils.tsx
import { Document } from "@/utils/types";
import React from "react";

// ##### 카카오주소 조건부 검색 결과 렌더링 함수
export function renderAddress(document: Document): JSX.Element | null {
  const { address, address_name, road_address, address_type } = document;
  const region_3depth_name = address?.region_3depth_name;
  const region_3depth_h_name = address?.region_3depth_h_name;

  if (address_type === "REGION_ADDR") {
    return (
      <div>
        <h4 className="font-bold text-base">{address_name}</h4>
        {road_address?.address_name && (
          <p className="text-sm text-gray-600 mt-1">
            {road_address.address_name}
          </p>
        )}
      </div>
    );
  }

  if (address_type === "ROAD_ADDR") {
    return (
      <div>
        <h4 className="font-bold text-base">{address_name}</h4>
        {address?.address_name && (
          <p className="text-sm text-gray-600 mt-1">{address.address_name}</p>
        )}
      </div>
    );
  }

  if (region_3depth_name || region_3depth_h_name) {
    return (
      <div>
        <h4 className="font-bold text-base">{address_name}</h4>
      </div>
    );
  }

  return null;
}


// ##### utils/types.ts
// ********** 카카오 주소 요청 파라미터 타입 정의 ********** //
export interface KakaoAddressSearchRequest {
  format: string; // 응답 포맷, 필수
  analyze_type?: string; // 검색 결과 제공 방식, 선택
  query: string; // 질의어, 필수
  page?: number; // 결과 페이지 번호, 선택
  size?: number; // 한 페이지에 보여질 문서 수, 선택
}

// ********** 카카오 주소 응답 파라미터 타입 정의 ********** //
// 전체 검색 결과 타입 정의
export interface KakaoAddressSearchResponse {
  meta: Meta; // 메타데이터
  documents: Document[]; // 검색 결과 목록
}

// 메타데이터 타입 정의
export interface Meta {
  total_count: number; // 결과 수
  pageable_count: number; // 노출 가능 문서 수
  is_end: boolean; // 현재 페이지가 마지막 페이지인지 여부
}

// 검색 결과 문서 타입 정의
export interface Document {
  address_name: string; // 전체 지번 주소 또는 도로명 주소
  address_type: "REGION" | "ROAD" | "REGION_ADDR" | "ROAD_ADDR"; // address_name의 값 타입 (리터럴 타입 사용)
  x: string; // X 좌표
  y: string; // Y 좌표
  address?: Address; // 지번 주소 상세 정보 (선택적 프로퍼티)
  road_address?: RoadAddress; // 도로명 주소 상세 정보 (선택적 프로퍼티)
}

// 지번 주소 상세 정보 타입 정의
export interface Address {
  address_name: string; // 전체 지번 주소
  region_1depth_name: string; // 시도 단위
  region_2depth_name: string; // 구 단위
  region_3depth_name: string; // 동 단위
  region_3depth_h_name?: string; // 행정동 명칭 (선택)
  mountain_yn: string; // 산 여부
  main_address_no: string; // 지번 주번지
  sub_address_no: string; // 지번 부번지
  x: string; // X 좌표
  y: string; // Y 좌표
}

// 도로명 주소 상세 정보 타입 정의
export interface RoadAddress {
  address_name: string; // 전체 도로명 주소
  region_1depth_name: string; // 지역명 1
  region_2depth_name: string; // 지역명 2
  region_3depth_name: string; // 지역명 3
  road_name: string; // 도로명
  underground_yn: string; // 지하 여부
  main_building_no: string; // 건물 본번
  sub_building_no: string; // 건물 부번
  building_name: string; // 건물 이름
  zone_no: string; // 우편번호 (5자리)
  x: string; // X 좌표
  y: string; // Y 좌표
}

// ##### components/kakao-map/kakao-map.tsx
import { Map, MapMarker } from "react-kakao-maps-sdk";
import useKakaoLoader from "./use-kakao-loader";
import { useRef, useState } from "react";

export default function KakaoMap() {
  // ##### 0. 카카오 지도 API를 로드 #####
  useKakaoLoader();

  // ##### 1. 지도 타입 상태 관리: 일반지도(roadmap) 또는 스카이뷰(skyview)
  const [mapType, setMapType] = useState<"roadmap" | "skyview">("roadmap");

  // ##### 2. 지도 객체 레퍼런스 관리 - 지도 조작을 위한 참조
  // 지도 확대/축소, 중심 좌표 변경 등을 수행
  const mapRef = useRef<kakao.maps.Map>(null);

  ////////////////////////////////////////////////////////////////////////
  // ##### 2-1. 지도 확대, 축소 컨트롤 기능 #####
  const zoomIn = () => mapRef.current?.setLevel(mapRef.current.getLevel() - 1);
  const zoomOut = () => mapRef.current?.setLevel(mapRef.current.getLevel() + 1);

  return (
    <>
      {/* ////////////////////////////////////////////////////////////////////// */}
      {/* # 0-1. 지도를 표시할 Container */}
      <Map
        id="map"
        center={{
          // # 0-2. 지도의 기본 중심좌표
          lat: 35.538228,
          lng: 129.329897,
        }}
        style={{
          // # 0-3. 지도의 크기
          width: "100%",
          height: "100%",
          position: "relative", // 지도 포지션 설정
          overflow: "hidden", // 지도 컨터이너 넘침 숨기기
        }}
        level={6} // # 0-4. 지도의 기본 확대 레벨
        mapTypeId={mapType === "roadmap" ? "ROADMAP" : "HYBRID"} // # 1-1. 지도 타입 설정
        ref={mapRef} // # 2-2. 지도 컴포넌트를 mapRef에 연결(지도 객체 참조)
      >
        {/* 마커, 선, 도형 등의 오버레이를 추가할 수 있다. */}
        <MapMarker position={selectedLocation} />
      </Map>

      {/* ////////////////////////////////////////////////////////////////////// */}
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

      {/* ////////////////////////////////////////////////////////////////////// */}
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


// ##### components/kakao-map/use-kakao-loader.tsx
import { useKakaoLoader as useKakaoLoaderOrigin } from "react-kakao-maps-sdk";
// 참고 https://apis.map.kakao.com/web/guide/
export default function useKakaoLoader() {
  useKakaoLoaderOrigin({
    appkey: process.env.NEXT_PUBLIC_KAKAO_JS_KEY || "",
    libraries: ["clusterer", "drawing", "services"],
  });
}


// ##### components/searchBar/searchBar-input.tsx
"use client";

import { Button, Input } from "@material-tailwind/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchBarInput() {
  const [search, setSearch] = useState(""); // # 검색어를 저장할 상태 선언 (초기값은 빈 문자열)
  const router = useRouter(); // ## 라우터 객체 생성
  const searchParams = useSearchParams(); // ### 쿼리스트링을 가져오는 훅

  const q = searchParams.get("q"); // ### 쿼리스트링에서 q 값을 가져옴

  // ### 컴포넌트가 렌더링될 때마다 실행되는 훅
  useEffect(() => {
    setSearch(q || ""); // ### q 값이 있으면 그 값을 검색어 상태에 저장, 없으면 빈 문자열로 초기화
  }, [q]); // ### q 값이 변경될 때마다 useEffect가 실행됨

  // ★ 새로고침 시 검색어 리셋을 위해 쿼리스트링 제거
  useEffect(() => {
    if (!q) {
      router.replace("/building-info"); // 쿼리스트링 제거
    }
  }, [q, router]);

  // ### 검색어가 입력될 때마다 호출되는 함수
  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value); // # 입력된 검색어를 상태에 저장
  };

  // ### 검색 버튼을 눌렀을 때 호출되는 함수
  const onSubmit = () => {
    if (!search || q === search) return; // ## 검색어가 없거나 검색어가 이전 검색어와 같으면 함수 종료(추가적인 검색이 불필요 하니깐)
    router.push(`/building-info?q=${search}`); // ## 검색어를 쿼리스트링으로 전달하며 검색 페이지로 이동 ### SearchPage로 이동
  };

  // ### 엔터키를 눌렀을 때 호출되는 함수
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  return (
    <div className="w-full py-5 px-3 border-b border-gray-300">
      <div className="relative flex w-full max-w-[24rem] ">
        <Input
          type="text"
          label="주소 검색"
          placeholder="주소를 입력해 주세요."
          value={search}
          onChange={onChangeSearch} // # 입력이 발생할 때마다 onChangeSearch 함수 호출
          onKeyDown={onKeyDown} // ## 엔터키를 누르면 onKeyDown 함수 호출
          color="blue-gray"
          className="pr-20 h-[43px]"
          containerProps={{
            className: "min-w-0 ",
          }}
        />
        <Button
          onClick={onSubmit} // ## 검색 버튼을 누르면 onSubmit 함수 호출
          size="sm"
          // color={search ? "gray" : "blue-gray"}
          disabled={!search}
          className="!absolute right-[2.5px]  top-[2.5px] rounded bg-transparent shadow-none hover:shadow-none"
        >
          <i className="fas fa-search text-gray-700 text-lg" />
        </Button>
      </div>
    </div>
  );
}


// ##### components/searchBar/searchBar-list.tsx
// import { LocationOnOutlined, StarBorderRounded } from "@mui/icons-material";
import { Document } from "@/utils/types";
import { renderAddress } from "@/utils/address-utils";
export default function SearchBarListItem({
  document,
  setSelectLocation,
  isHighlighted,
}: {
  document: Document;
  setSelectLocation: (selectedData: {
    lat: number;
    lng: number;
    info: string | JSX.Element;
  }) => void;
  isHighlighted: boolean;
}) {
  // ##### 지도 : 리스트 item 클릭 시 선택된 위치 정보 업데이트
  // (선택된 위치 전달하는 콜백 함수 )
  const handleLocationClick = () => {
    if (document.address) {
      const selectedData = {
        lat: parseFloat(document.address.y),
        lng: parseFloat(document.address.x),
        info: renderAddress(document) || "", // renderAddress 사용
      };
      setSelectLocation(selectedData); // 선택된 위치 전달 및 하이라이트 업데이트
    }
  };

  return (
    <div
      onClick={handleLocationClick}
      className={`cursor-pointer flex justify-between items-start w-full p-4 border-b border-gray-300 first:pt-7 ${
        isHighlighted ? "bg-[#eff7ff]" : "hover:bg-[#eff7ff]"
      }`}
    >
      <div className="flex gap-2">
        {/* <LocationOnOutlined
          className="text-2xl text-gray-400"
          aria-label="Location"
        /> */}
        <div className="flex flex-col">
          {/* ##### 주소 출력 함수 호출 ##### */}
          {renderAddress(document)}

          {/* ##### 주소 출력 추가 UI ##### */}
          <div className="flex gap-2 mt-4">
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
      {/* <StarBorderRounded
        className="text-3xl text-gray-400 cursor-pointer rounded-lg"
        aria-label="Favorite"
      /> */}
    </div>
  );
}


// ##### components/searchBar/searchBar-list-item.tsx
// import { LocationOnOutlined, StarBorderRounded } from "@mui/icons-material";
import { Document } from "@/utils/types";
import { renderAddress } from "@/utils/address-utils";
export default function SearchBarListItem({
  document,
  setSelectLocation,
  isHighlighted,
}: {
  document: Document;
  setSelectLocation: (selectedData: {
    lat: number;
    lng: number;
    info: string | JSX.Element;
  }) => void;
  isHighlighted: boolean;
}) {
  // ##### 지도 : 리스트 item 클릭 시 선택된 위치 정보 업데이트
  // (선택된 위치 전달하는 콜백 함수 )
  const handleLocationClick = () => {
    if (document.address) {
      const selectedData = {
        lat: parseFloat(document.address.y),
        lng: parseFloat(document.address.x),
        info: renderAddress(document) || "", // renderAddress 사용
      };
      setSelectLocation(selectedData); // 선택된 위치 전달 및 하이라이트 업데이트
    }
  };

  return (
    <div
      onClick={handleLocationClick}
      className={`cursor-pointer flex justify-between items-start w-full p-4 border-b border-gray-300 first:pt-7 ${
        isHighlighted ? "bg-[#eff7ff]" : "hover:bg-[#eff7ff]"
      }`}
    >
      <div className="flex gap-2">
        {/* <LocationOnOutlined
          className="text-2xl text-gray-400"
          aria-label="Location"
        /> */}
        <div className="flex flex-col">
          {/* ##### 주소 출력 함수 호출 ##### */}
          {renderAddress(document)}

          {/* ##### 주소 출력 추가 UI ##### */}
          <div className="flex gap-2 mt-4">
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
      {/* <StarBorderRounded
        className="text-3xl text-gray-400 cursor-pointer rounded-lg"
        aria-label="Favorite"
      /> */}
    </div>
  );
}


// ##### components/sideBar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: "/", labelLine1: "Home", icon: "home" },
    {
      href: "/building-info",
      labelLine1: "부동산",
      labelLine2: "종합정보",
      icon: "home_work",
    },
  ];

  return (
    <header className="min-w-20 h-screen bg-white border-r border-gray-300 flex flex-col justify-between">
      <div className="w-full flex flex-col items-center">
        <div className="flex flex-col items-center w-full border-b border-gray-300 text-center">
          <Link href="/" className="py-5 w-full">
            <h1 className="text-[21px] font-bold">Bivis</h1>
            <p className="text-[9px]">Real Estate</p>
          </Link>
        </div>

        {/* 메뉴 아이콘 */}
        <div className="w-full flex-1 flex flex-col items-center">
          <nav className="w-full">
            <ul className="flex flex-col items-center">
              {menuItems.map((item) => (
                <li
                  key={item.href}
                  className={`w-full flex flex-col items-center transition ${
                    pathname === item.href
                      ? "bg-blue-700 text-white font-medium"
                      : "text-gray-700 hover:text-blue-800"
                  }`}
                >
                  <Link href={item.href} className="w-full py-3">
                    <div className="flex flex-col items-center text-center">
                      <span className="material-symbols-outlined">
                        {item.icon}
                      </span>
                      <p className="text-[12px]">{item.labelLine1}</p>
                      {item.labelLine2 && (
                        <p className="text-[12px]">{item.labelLine2}</p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="w-full mb-6">
        <button className="w-full flex flex-col items-center text-gray-700 py-4">
          <span className="material-symbols-outlined">person</span>
          <p className="text-[12px] mt-1">로그인</p>
        </button>
      </div>
    </header>
  );
}


// ##### app/building-info/page.tsx
import BuildingInfoUI from "./ui";

////////////////////////////////////////////////
// ##### 초기 카카오 주소 검색 API 호출 함수 #####
async function fetchKakaoAddress(query: string) {
  const response = await fetch(
    `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
      query
    )}&size=15&page=1`,
    {
      method: "GET",
      headers: {
        Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`,
      },
      cache: "force-cache",
    }
  );
  if (!response.ok) {
    throw new Error(`API 호출 실패: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

/////////////////////////////////////////////////////////////////
// ##### 더 많은 주소를 가져오는 카카오 주소 검색 API 호출 함수 #####
export async function fetchMoreKakaoAddress(query: string, page: number = 1) {
  const response = await fetch(
    `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
      query
    )}&size=15&page=${page}`,
    {
      method: "GET",
      headers: {
        Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`,
      },
      // cache: "force-cache",
    }
  );
  if (!response.ok) {
    throw new Error(`API 호출 실패: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

///////////////////////////////////
// ##### 주소 검색 결과 페이지 #####
export default async function BuildingInfo({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams;
  const kakaoAddress = await fetchKakaoAddress(q);

  return (
    <div>
      <BuildingInfoUI kakaoAddress={kakaoAddress} query={q} />
    </div>
  );
}

// ##### app/building-info/ui.tsx
"use client";

import KakaoMap from "@/components/kakao-map/kakao-map";
import SearchBarInput from "@/components/searchBar/searchBar-input";
import SearchBarList from "@/components/searchBar/searchBar-list";
import { KakaoAddressSearchResponse } from "@/utils/types";
import { useRouter } from "next/navigation";
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

  // ### 새로고침 시 리셋을 위한 라우터 객체 생성
  const router = useRouter(); // ★ 추가

  // 새로고침 시 selectedLocation과 query를 초기화
  useEffect(() => {
    setSelectedLocation(null); // 상태 초기화
    router.replace("/building-info"); // URL 초기화
  }, [router]);

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


// ##### app/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 스크롤바 넓이 지정 */
::-webkit-scrollbar {
  width: 5px;
}

/* 스크롤바 트랙 꾸미기 */
::-webkit-scrollbar-track {
  background: #f0f0f3;
  border-radius: 5px;
}

/* 스크롤바 손잡이 꾸미기 */
::-webkit-scrollbar-thumb {
  background: #c4c6c8;
  border-radius: 5px;
}

/* 스크롤바 손잡이 호버 시 색 */
/* ::-webkit-scrollbar-thumb:hover {
  background: #555;
} */

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: Arial, Helvetica, sans-serif;
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}


// ##### app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "@/components/sideBar";
import { ThemeProvider } from "@/providers/material-tailwind-theme-provider";
import Script from "next/script";
import KakaoMap from "@/components/kakao-map/kakao-map";
import RecoilProvider from "@/providers/RecoilProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RecoilProvider>
      <ThemeProvider>
        <html lang="en">
          <head>
            <link
              rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
              integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w=="
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />
            <link
              href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@400;500;600;700&display=swap"
              rel="stylesheet"
            />
            <link
              href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:wght@400;500;600;700&display=swap"
              rel="stylesheet"
            />
            <link
              href="https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:wght@400;500;600;700&display=swap"
              rel="stylesheet"
            />
          </head>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased flex w-full min-h-screen`}
          >
            <Sidebar />

            <main className="w-full h-screen">{children}</main>
          </body>
        </html>
      </ThemeProvider>
    </RecoilProvider>
  );
}
