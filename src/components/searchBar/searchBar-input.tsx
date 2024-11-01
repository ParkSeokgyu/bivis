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
