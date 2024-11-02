// import { LocationOnOutlined, StarBorderRounded } from "@mui/icons-material";

import { Document } from "@/types";

export default function SearchBarListItem({
  document,
}: {
  document: Document;
}) {
  // ##### 주소 데이터 구조 분해 할당으로 추출
  const { address, address_name, road_address, address_type } = document;
  // ##### 지번 주소의 동 단위 주소명 추출
  const region_3depth_name = address?.region_3depth_name;
  const region_3depth_h_name = address?.region_3depth_h_name;

  // ##### 주소 검색 로직 함수 : 주소 검색 결과 우선 순위에 따라 주소 출력 ###
  const renderAddress = () => {
    // address_type에 따라 조건을 분리하여 주소를 반환
    if (address_type === "REGION_ADDR") {
      return (
        <div>
          <h4 className="font-bold text-base">{address_name}</h4>
          {road_address?.address_name && (
            <p className="text-sm text-gray-600 mt-1">
              {road_address.address_name}
            </p> // 지번 주소일 때 도로명 주소 표시
          )}
        </div>
      );
    }
    if (address_type === "ROAD_ADDR") {
      return (
        <div>
          <h4 className="font-bold text-base">{address_name}</h4>
          {address?.address_name && (
            <p className="text-sm text-gray-600 mt-1">{address.address_name}</p> // 도로명 주소일 때 지번 주소 표시
          )}
        </div>
      );
    }
    // region_3depth_name 또는 region_3depth_h_name이 있을 때 기본 출력
    if (region_3depth_name || region_3depth_h_name) {
      return (
        <div>
          <h4 className="font-bold text-base">{address_name}</h4>
        </div>
      );
    }
    // 조건에 맞지 않으면 아무것도 반환하지 않음
    return null;
  };

  return (
    <div>
      <div className="flex gap-2">
        {/* <LocationOnOutlined
          className="text-2xl text-gray-400"
          aria-label="Location"
        /> */}
        <div className="flex flex-col">
          {/* ##### 주소 출력 함수 호출 ##### */}
          {renderAddress()}

          {/* ##### 주소 출력 추가 UI ##### */}
          <div className="flex gap-2 mt-4">
            <button className="border border-gray-300 px-3 py-1 text-xs font-medium rounded-md bg-white">
              기본정보
            </button>
            <button className="border border-gray-300 px-3 py-1 text-xs font-medium rounded-md bg-white">
              토지정보
            </button>
            <button className="border border-gray-300 px-3 py-1 text-xs font-medium rounded-md bg-white">
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
