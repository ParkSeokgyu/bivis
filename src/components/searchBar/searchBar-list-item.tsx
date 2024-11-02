// import { LocationOnOutlined, StarBorderRounded } from "@mui/icons-material";
import { Document } from "@/types";
import { renderAddress } from "@/utils/addressUtils";
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
