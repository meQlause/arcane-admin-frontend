'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import { Navigation } from "@/app/components/navigation";

export function Sidebar() {
  const [isMenuOpen, setMenuOpen] = useState(false)

  const handleMenu = () => {
    setMenuOpen(!isMenuOpen)

    const body = document.documentElement
    if (!isMenuOpen) {
      body.classList.add('overflow-hidden')
    } else {
      body.classList.remove('overflow-hidden')
    }
  }

  const linksItems = [
    { name: "Dashboard", href: "/dashboard", icon: "/icon/home-02.svg" },
    { name: "Proposal", href: "/proposal", icon: "/icon/file-02.svg" },
    { name: "Discussion", href: "/discussion", icon: "/icon/message-chat-circle.svg" },
    { name: "Setting", href: "/setting", icon: "/icon/settings-01.svg" },
  ]

  useEffect(() => {
    const body = document.documentElement
    if (body) {
      body.classList.remove('overflow-hidden')
    }
  }, [])

  return (
    <>
      <aside className="bg-white flex flex-col gap-4 lg:gap-8 max-lg:w-screen lg:min-w-[250px] lg:w-[400px] lg:h-screen lg:pt-6 sticky top-0 z-10">
        <div className="flex justify-between gap-4 w-full px-6 max-lg:py-3 max-lg:border max-lg:border-gray-100">
          <div className="flex items-center gap-3 lg:py-1">
            <Image
              src="/brand/logo.svg"
              alt="logo"
              width={32}
              height={32}
              priority
            />
            <span className="font-maven-pro font-medium text-lg text-[#B47B34]">Governance</span>
          </div>
          <button type="button" className="p-2 -mr-2 lg:hidden" onClick={handleMenu}>
            <Image
              src="/icon/menu-02.svg"
              alt="icon"
              className={`filter-primary-600 ${isMenuOpen ? 'hidden' : ''}`}
              width={28}
              height={28}
              priority
            />
            <Image
              src="/icon/x.svg"
              alt="icon"
              className={`filter-primary-600 ${!isMenuOpen ? 'hidden' : ''}`}
              width={28}
              height={28}
              priority
            />
            <span className="sr-only">Menu</span>
          </button>
        </div>
        <div className={`hidden lg:block [&.active]:block ${isMenuOpen ? 'active' : ''}`}>
          <Navigation links={linksItems} />
        </div>
      </aside>
      <div className="fixed top-0 left-0 -z-10 w-[calc(calc(100vw-75rem)/2)] h-screen bg-white max-2xl:hidden"></div>
    </>
  )
}