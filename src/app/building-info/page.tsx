import BuildingInfoUI from "./ui";

////////////////////////////////////////////////
// ##### 초기 카카오 주소 검색 API 호출 함수 #####
async function fetchKakaoAddress(query: string) {
  const response = await fetch(
    `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
      query
    )}&size=30&page=1`,
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
    )}&size=30&page=${page}`,
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

// ********************************************************************************************************************************************************************************/
//

// address_type
// 울산 "REGION"
// 남구 "REGION"
// 달동 "REGION"
// 달동 1347-1 "REGION_ADDR"

// 돋질로 "ROAD"
// 돋질로 220번길 15 "ROAD_ADDR"

// // 지번 주소로 검색
// "documents":[
//   {
//     "address": {
//       "address_name": "울산 남구 달동 1347-1",
//       "b_code": "3114010500",
//       "h_code": "3114057000",
//       "main_address_no": "1347",
//       "mountain_yn": "N",
//       "region_1depth_name": "울산",
//       "region_2depth_name": "남구",
//       "region_3depth_h_name": "삼산동",
//       "region_3depth_name": "달동",
//       "sub_address_no": "1",
//       "x": "129.330040456184", // 1번
//       "y": "35.5406644685444" // 1번
//     },
//     "address_name": "울산 남구 달동 1347-1",
//     "address_type": "REGION_ADDR",
//     "road_address": {
//       "address_name": "울산 남구 돋질로220번길 15",
//       "building_name": "",
//       "main_building_no": "15",
//       "region_1depth_name": "울산",
//       "region_2depth_name": "남구",
//       "region_3depth_name": "달동",
//       "road_name": "돋질로220번길",
//       "sub_building_no": "",
//       "underground_yn": "N",
//       "x": "129.330028645965", //
//       "y": "35.5406906473583", //
//       "zone_no": "44703"
//     },
//     "x": "129.330040456184", //
//     "y": "35.5406644685444" //
//   }
// ],

// // 도로명 주소로 검색
// "documents":[
//   {
//     "address": {
//       "address_name": "울산 남구 달동 1347-1",
//       "b_code": "3114010500",
//       "h_code": "3114057000",
//       "main_address_no": "1347",
//       "mountain_yn": "N",
//       "region_1depth_name": "울산",
//       "region_2depth_name": "남구",
//       "region_3depth_h_name": "삼산동",
//       "region_3depth_name": "달동",
//       "sub_address_no": "1",
//       "x": "129.330028645965", // 1번
//       "y": "35.5406906473583" // 1번
//     },
//     "address_name": "울산 남구 돋질로220번길 15",
//     "address_type": "ROAD_ADDR",
//     "road_address": {
//       "address_name": "울산 남구 돋질로220번길 15",
//       "building_name": "",
//       "main_building_no": "15",
//       "region_1depth_name": "울산",
//       "region_2depth_name": "남구",
//       "region_3depth_name": "달동",
//       "road_name": "돋질로220번길",
//       "sub_building_no": "",
//       "underground_yn": "N",
//       "x": "129.330028645965",
//       "y": "35.5406906473583",
//       "zone_no": "44703"
//     },
//     "x": "129.330028645965",
//     "y": "35.5406906473583"
//   }
// ],

//////////////////
// {
//   "documents": [
//     {
//       "address": {
//         "address_name": "울산 남구 달동 1347-1",
//         "b_code": "3114010500",
//         "h_code": "3114057000",
//         "main_address_no": "1347",
//         "mountain_yn": "N",
//         "region_1depth_name": "울산",
//         "region_2depth_name": "남구",
//         "region_3depth_h_name": "삼산동",
//         "region_3depth_name": "달동",
//         "sub_address_no": "1",
//         "x": "129.330040456184",
//         "y": "35.5406644685444"
//       },
//       "address_name": "울산 남구 달동 1347-1",
//       "address_type": "REGION_ADDR",
//       "road_address": {
//         "address_name": "울산 남구 돋질로220번길 15",
//         "building_name": "",
//         "main_building_no": "15",
//         "region_1depth_name": "울산",
//         "region_2depth_name": "남구",
//         "region_3depth_name": "달동",
//         "road_name": "돋질로220번길",
//         "sub_building_no": "",
//         "underground_yn": "N",
//         "x": "129.330028645965",
//         "y": "35.5406906473583",
//         "zone_no": "44703"
//       },
//       "x": "129.330040456184",
//       "y": "35.5406644685444"
//     }
//   ],
//   "meta": {
//     "is_end": true,
//     "pageable_count": 1,
//     "total_count": 1
//   }
// }
