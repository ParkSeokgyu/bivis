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
