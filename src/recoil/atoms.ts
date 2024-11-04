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
export const selectedAddressLocationState = atom<{
  lat: number;
  lng: number;
  info: string | JSX.Element;
} | null>({
  key: "selectedAddressLocationState",
  default: null,
  effects: [
    ({ setSelf, onSet }) => {
      // 초기화 시 로컬 스토리지에서 저장된 상태를 로드
      if (typeof window !== "undefined") {
        const savedState = localStorage.getItem("selectedAddressLocation");
        if (savedState) {
          setSelf(JSON.parse(savedState));
        }
      }

      // 변경할 때마다 로컬 저장소에 상태 저장
      onSet((newValue) => {
        if (newValue) {
          localStorage.setItem(
            "selectedAddressLocation",
            JSON.stringify(newValue)
          );
        } else {
          localStorage.removeItem("selectedAddressLocation");
        }
      });
    },
  ],
});

// ##### 선택된 지도 레벨 상태 #####
export const mapLevelState = atom<number>({
  key: "mapLevelState",
  default: 6, // 초기 확대 레벨
  effects: [
    ({ setSelf, onSet }) => {
      // 초기화 시 로컬 스토리지에서 저장된 상태를 로드
      if (typeof window !== "undefined") {
        const savedLevel = localStorage.getItem("mapLevel");
        if (savedLevel) {
          setSelf(parseInt(savedLevel, 10));
        }
      }

      // 변경할 때마다 로컬 저장소에 상태 저장
      onSet((newLevel) => {
        if (newLevel !== undefined) {
          localStorage.setItem("mapLevel", newLevel.toString());
        } else {
          localStorage.removeItem("mapLevel");
        }
      });
    },
  ],
});

// ##### 사용자가 선택한 주소리스트를 새로고침 후에도 유지
export const selectedIndexState = atom<number | null>({
  key: "selectedIndexState",
  default: null,
  effects: [
    ({ setSelf, onSet }) => {
      if (typeof window !== "undefined") {
        const savedIndex = localStorage.getItem("selectedIndex");
        if (savedIndex !== null) {
          setSelf(parseInt(savedIndex, 10));
        }
      }

      onSet((newIndex) => {
        if (newIndex !== null) {
          localStorage.setItem("selectedIndex", newIndex.toString());
        } else {
          localStorage.removeItem("selectedIndex");
        }
      });
    },
  ],
});
