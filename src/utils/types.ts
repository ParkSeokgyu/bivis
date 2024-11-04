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

// ##### 아무 것도 모를때 타입정의 한거 #####
// // Address 타입 정의 - 지번 주소 상세 정보
// export interface Address {
//   address_name: string; // 전체 지번 주소
//   region_1depth_name: string; // 지역 1 Depth, 시도 단위
//   region_2depth_name: string; // 지역 2 Depth, 구 단위
//   region_3depth_name: string; // 지역 3 Depth, 동 단위
//   region_3depth_h_name: string; // 지역 3 Depth, 행정동 명칭
//   h_code: string; // 행정 코드
//   b_code: string; // 법정 코드
//   mountain_yn: "Y" | "N"; // 산 여부, Y 또는 N
//   main_address_no: string; // 지번 주번지
//   sub_address_no: string; // 지번 부번지, 없을 경우 빈 문자열("") 반환
//   x: string; // X 좌표값, 경위도인 경우 경도(longitude)
//   y: string; // Y 좌표값, 경위도인 경우 위도(latitude)
// }

// // RoadAddress 타입 정의 - 도로명 주소 상세 정보
// export interface RoadAddress {
//   address_name: string; // 전체 도로명 주소
//   region_1depth_name: string; // 지역명 1
//   region_2depth_name: string; // 지역명 2
//   region_3depth_name: string; // 지역명 3
//   road_name: string; // 도로명
//   underground_yn: "Y" | "N"; // 지하 여부, Y 또는 N
//   main_building_no: string; // 건물 본번
//   sub_building_no: string; // 건물 부번, 없을 경우 빈 문자열("") 반환
//   building_name: string; // 건물 이름
//   zone_no: string; // 우편번호(5자리)
//   x: string; // X 좌표값, 경위도인 경우 경도(longitude)
//   y: string; // Y 좌표값, 경위도인 경우 위도(latitude)
// }

// // Document 타입 정의 - 주소 검색 결과의 상위 구조
// export interface Document {
//   address_name: string; // 전체 지번 주소 또는 전체 도로명 주소
//   address_type: "REGION" | "ROAD" | "REGION_ADDR" | "ROAD_ADDR"; // 주소 타입
//   x: string; // X 좌표값, 경위도인 경우 경도(longitude)
//   y: string; // Y 좌표값, 경위도인 경우 위도(latitude)
//   address?: Address; // 지번 주소 상세 정보 (optional)
//   road_address?: RoadAddress; // 도로명 주소 상세 정보 (optional)
// }

// // Meta 타입 정의 - 응답 관련 정보
// export interface Meta {
//   total_count: number; // 검색어에 검색된 문서 수
//   pageable_count: number; // 노출 가능한 문서 수 (최대 45)
//   is_end: boolean; // 현재 페이지가 마지막 페이지인지 여부
// }

// // API 응답 형식 타입 정의
// export interface KakaoAddressSearchResponse {
//   meta: Meta; // 응답 관련 정보
//   documents: Document[]; // Document 배열로 구성된 검색 결과
// }

// // 추가: KakaoAddressQueryParams - API 요청의 쿼리 파라미터 타입 정의
// export interface KakaoAddressQueryParams {
//   query: string; // 검색을 원하는 질의어 (필수)
//   analyze_type?: "similar" | "exact"; // 검색 결과 제공 방식 (optional)
//   page?: number; // 결과 페이지 번호 (optional, 기본값: 1, 최소: 1, 최대: 45)
//   size?: number; // 한 페이지에 보여질 문서의 개수 (optional, 기본값: 10, 최소: 1, 최대: 30)
// }
