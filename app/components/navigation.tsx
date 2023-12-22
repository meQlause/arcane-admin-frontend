'use client'

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useWalletContext } from "@/app/contexts/wallet-context";
import { RoleType } from "@/app/types";
import CryptoJS from "crypto-js";

const Icon = ({ path }: { path: string }) => {
  return (
    <Image
      src={path}
      alt="icon"
      width={30}
      height={30}
      priority
    />
  )
}

export function Navigation({links}: any ) {
  const rdt = useWalletContext()
  const pathname = usePathname()
  const data = localStorage.getItem('arcane')!

  let role: string = ''
  let address: string = ''
  if (data) {
    const bytes = CryptoJS.AES.decrypt(data, `${process.env.SECRET_JS}`)
    const originalData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    role = originalData.role
    address = originalData.address
  }

  const [walletConnect, setWalletConnect] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if ( rdt?.walletApi.getWalletData().accounts[0] && address && role ) {
      setWalletConnect(true)
    }
  }, [rdt, address, role])

  const logout = () => {
    setLoading(true)
    rdt?.disconnect()
    window.location.reload()
  }

  return (
    <>
      <ul className={`px-6 w-full flex flex-col gap-3 h-[calc(100vh-68px-env(safe-area-inset-bottom))] max-h-[calc(100vh-84px)] lg:h-screen lg:max-h-[calc(100vh-100px)] pb-4 ${walletConnect && 'max-lg:pb-24'} overflow-auto font-maven-pro`}>
        {links.map(( item: any ) => {
          const isAdmin = pathname.indexOf('/admin') > -1
          const isActive = pathname.indexOf(item.href) > -1
          return (
            <li key={item.name}>
              <Link 
                href={isAdmin ? '/admin' + item.href : item.href}
                className={`${isActive ? 'active' : ''} flex items-center gap-2 relative px-4 py-3 text-left break-words lg:transition rounded-lg text-gray-500 lg:hover:text-primary-900 lg:hover:bg-primary-100 lg:[&:hover_img]:filter-primary-900 [&.active]:font-medium [&.active]:text-primary-900 [&.active]:bg-primary-300 [&.active_img]:filter-primary-900`}>
                <Icon path={item.icon} />
                <span className="w-full">{item.name}</span>
              </Link>
            </li>
          )
        })}
        {walletConnect &&
          (role === RoleType.Admin || role === RoleType.Member) && (
            <li className="mt-auto max-lg:bg-white max-lg:fixed max-lg:bottom-0 max-lg:pb-4 max-lg:w-[calc(100%-3rem)]" style={{marginBottom: 'env(safe-area-inset-bottom)'}}>
              <hr className="border-t border-gray-300 my-4 max-lg:mt-0" />
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-2 relative w-full px-4 py-3 text-left break-words lg:transition rounded-lg text-gray-500 lg:hover:text-primary-900 lg:hover:bg-primary-100 lg:[&:hover_img]:filter-primary-900 [&.active]:font-medium [&.active]:text-primary-900 [&.active]:bg-primary-300 [&.active_img]:filter-primary-900 overflow-hidden"
              >
                <Icon path="/icon/log-out-01.svg" />
                <span className="w-full">Logout</span>
                <div className={`transition-all ${!loading ? 'opacity-0' : ''}`}>
                  <Image
                    src="/loading.svg"
                    alt="loading"
                    className="animate-spin"
                    width={24}
                    height={24}
                    priority
                  />
                </div>
              </button>
            </li>
          )
        }
      </ul>
    </>
  )
}