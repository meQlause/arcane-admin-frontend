'use client'

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { RoleType } from "@/app/types";
import { useWallet } from "@/app/auth/wallet";
import Wallet from "@/app/wallet/page";
import { Card } from "./card";
import { Button } from "./button";
import { Popup, PopupBody } from "./popup";
import SignUp from "@/app/signup/page";

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

export function Navigation({links, socials}: any ) {
  const { walletConnect, role, rdt } = useWallet()
  const pathname = usePathname()

  const [loading, setLoading] = useState(false)

  const [showPopupSignin, setShowPopupSignin] = useState(false)
  const handleOpenPopupSignin = () => {
    setShowPopupSignin(true)
  }
  const handleClosePopupSignin = () => {
    setShowPopupSignin(false)
  }

  const [showPopupSignup, setShowPopupSignup] = useState(false)
  const handleOpenPopupSignup = () => {
    setShowPopupSignup(true)
  }
  const handleClosePopupSignup = () => {
    setShowPopupSignup(false)
  }

  useEffect(() => {
    const dashboardDisabled = document.querySelector('aside .order-1 a')
    if (dashboardDisabled && pathname.indexOf('/admin') < 0 && (role === RoleType.Unregistered || role === '')) {
      dashboardDisabled.classList.add('disabled')
    }
    const discussionDisabled = document.querySelector('aside .order-3 a')
    if (discussionDisabled) {
      discussionDisabled.classList.add('disabled')
    }
  }, [])

  const logout = () => {
    setLoading(true)
    localStorage.removeItem('arcane')
    rdt?.disconnect()
    window.location.reload()
  }

  return (
    <>
      <ul className={`px-6 w-full flex flex-col gap-3 h-[calc(100vh-68px-env(safe-area-inset-bottom))] max-h-[calc(100vh-84px)] lg:h-screen lg:max-h-[calc(100vh-88px)] pb-4 ${(!walletConnect && pathname.indexOf('/admin') < 0) && 'max-lg:pb-20'} ${(walletConnect && pathname.indexOf('/admin') > -1) && 'max-lg:pb-28'} ${(walletConnect && pathname.indexOf('/admin') < 0) && 'max-lg:pb-40'} overflow-auto font-maven-pro`}>
        {pathname.indexOf('/admin') < 0 &&
          <li className="order-9 lg:order-1">
            <Card className="!bg-primary-100 !shadow-none max-lg:mb-8 max-lg:mt-4 lg:mb-4">
              <div className="flex lg:flex-col gap-5 lg:gap-3 lg:text-center mb-5 last:mb-0">
                <Image
                  src="/brand/logo.svg"
                  alt="logo"
                  width={54}
                  height={54}
                  className="w-14 h-14 lg:mx-auto"
                  priority
                />
                <div>
                  <h2 className="font-semibold text-lg lg:text-xl text-gray-800 mb-1 lg:mb-2">Arcane Labyrinth</h2>
                  <p className="text-gray-600 max-lg:text-sm">200 Members</p>
                </div>
              </div>

              {!walletConnect && (
                  <>
                    <hr className="border-primary-300 mb-6 max-lg:hidden" />
                    <Button type={"button"} variant={"primary"} loading={"none"} className="lg:!w-fit mx-auto lg:!px-8 lg:py-2.5" onClick={handleOpenPopupSignin}>
                      Login
                    </Button>
                    <Popup show={showPopupSignin} backdropClose={true} handleClose={handleClosePopupSignin}>
                      <PopupBody>
                        <Wallet rdt={rdt} path={pathname} variant={"content-only"} />
                        <Button type={"button"} variant={"light"} loading={"none"} className="w-full mt-6" onClick={handleClosePopupSignin}>Cancel</Button>
                      </PopupBody>
                    </Popup>
                  </>
                )
              }

              {(walletConnect && role === RoleType.Unregistered) &&
                <>
                  <hr className="border-primary-300 mb-6 max-lg:hidden" />
                  <Button type={"button"} variant={"primary"} loading={"none"} className="lg:!w-fit mx-auto lg:!px-8 lg:py-2.5" onClick={handleOpenPopupSignup}>
                    Join as Member
                  </Button>
                  <Popup show={showPopupSignup} backdropClose={true} handleClose={handleClosePopupSignup}>
                    <PopupBody>
                      <SignUp />
                      <Button type={"button"} variant={"light"} loading={"none"} className="w-full mt-6" onClick={handleClosePopupSignup}>Cancel</Button>
                    </PopupBody>
                  </Popup>
                </>
              }
            </Card>
          </li>
        }

        {links.map(( item: any, index: number ) => {
          const isAdmin = pathname.indexOf('/admin') > -1
          const isActive = pathname.indexOf(item.href) > -1

          if ((isAdmin && item.name === "About") || (!isAdmin && item.name === "Setting")) {
            return null
          }

          return (
            <li key={item.name} className={`order-${index + 1} lg:order-${index + 2}`}>
              <Link 
                href={isAdmin ? '/admin' + item.href : item.href}
                className={`${isActive ? 'active' : ''} flex items-center gap-2 relative px-4 py-3 text-left break-words lg:transition rounded-lg text-gray-500 lg:hover:text-primary-900 lg:hover:bg-primary-100 lg:[&:hover_img]:filter-primary-900 [&.active]:font-medium [&.active]:text-primary-900 [&.active]:bg-primary-300 [&.active_img]:filter-primary-900 [&.disabled]:pointer-events-none [&.disabled]:opacity-30 [&.disabled]:bg-transparent`}>
                <Icon path={item.icon} />
                <span className="w-full">{item.name}</span>
              </Link>
            </li>
          )
        })}

        <li className="order-10 mt-auto z-[1] max-lg:bg-white max-lg:fixed max-lg:bottom-0 max-lg:pb-4 max-lg:w-[calc(100%-3rem)]" style={{marginBottom: 'env(safe-area-inset-bottom)'}}>
          {pathname.indexOf('/admin') < 0 &&
            <div className="flex px-1 pt-3">
              {socials.map(( item: any, index: number ) => (
                <Link key={index} href={item.href} target="_blank" className="m-3 group">
                  <Image
                    src={item.icon}
                    alt="icon"
                    width={26}
                    height={26}
                    className="transition group-hover:filter-primary-600"
                    priority
                  />
                  <span className="sr-only">{item.name}</span>
                </Link>
              ))}
            </div>
          }
          {walletConnect &&
            (role === RoleType.Admin || role === RoleType.Member || role === RoleType.Unregistered) && (
              <>
                <hr className={`border-t border-gray-300 my-4 ${pathname.indexOf('/admin') > -1 && 'max-lg:mt-0'}`} />
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
              </>
            )
          }
        </li>
      </ul>
    </>
  )
}