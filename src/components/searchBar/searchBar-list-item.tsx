// import { LocationOnOutlined, StarBorderRounded } from "@mui/icons-material";
import { Document } from "@/utils/types";
import { renderAddress } from "@/utils/address-utils";
import { useRecoilState } from "recoil";
import { selectedAddressLocationState } from "@/recoil/atoms";
import { LocationOnOutlined, StarBorderRounded } from "@mui/icons-material";

export default function SearchBarListItem({
  document,
  isHighlighted,
  onClick,
}: {
  document: Document;
  isHighlighted: boolean;
  onClick: () => void; // 추가된 onClick prop
}) {
  //
  const [, setSelectedAddressLocation] = useRecoilState(
    selectedAddressLocationState
  );

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer flex justify-between items-start w-full p-4 border-b border-gray-300 first:pt-7 ${
        isHighlighted ? "bg-[#eff7ff]" : "hover:bg-[#eff7ff]"
      }`}
    >
      <div className="flex gap-2">
        <LocationOnOutlined
          className="text-2xl text-gray-400"
          aria-label="Location"
        />
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
      <StarBorderRounded
        className="text-3xl text-gray-400 cursor-pointer rounded-lg "
        aria-label="Favorite"
      />
    </div>
  );
}
