'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardOutline } from "@/app/components/card";
import { Button } from "@/app/components/button";
import WalletRadix from "@/app/wallet/radix";

export default function Wallet({ rdt, path, variant }: any) {
  const router = useRouter()
  const [walletConnect, setWalletConnect] = useState(false)
  const [walletList, setWalletList] = useState(false)
  const [isButtonDisabled, setButtonDisabled] = useState(false)
  const [loading, setLoading] = useState(false)

  const openConnectWallet = () => {
    setWalletList(true)
    setButtonDisabled(true)
  }

  const updateWalletConnect = (state: any) => {
    if ( state ) {
      setWalletConnect(true)
    }
  }

  const handlePageUnlock = () => {
    setLoading(true)
    if ( path === '/' ) {
      router.push(path + 'dashboard')
    } else if ( path === '/admin' ) {
      router.push(path + '/dashboard')
    } else if ( path === '/about' ) {
      router.push('/dashboard')
    } else {
      window.location.reload()
    }
  }

  return (
    <div className={`${variant === 'content-only' ? '' : 'my-4'}`}>
      {walletConnect ?
        <Card className={`${variant === 'content-only' ? '!p-0 !shadow-none' : ''}`}>
          <Image
            src="/icon/check-circle.svg"
            alt="icon"
            className="filter-success-500 mx-auto mb-4"
            width={44}
            height={44}
            priority
          />
          <p className="font-maven-pro font-medium text-center">Successfully Connected Wallet</p>
          <CardOutline className="my-6">
            <span className="font-maven-pro">Your Wallet</span>
            <hr className="mt-3 mb-5" />
            <div className="flex items-start font-maven-pro font-medium break-all mt-1">
              <Image
                src="/icon/logo-radix.svg"
                alt="icon"
                className="inline-block -mt-1 mr-3"
                width={32}
                height={32}
                priority
              />
              <span>{rdt?.walletApi.getWalletData().accounts[0].address}</span>
            </div>
          </CardOutline>
          <Button type="button" variant="primary" onClick={handlePageUnlock} loading={loading}>
            Finish & Unlock
          </Button>
        </Card>
      :
        <Card className={`${variant === 'content-only' ? '!p-0 !shadow-none' : ''}`}>
          <Image
            src="/icon/alert-circle.svg"
            alt="icon"
            className="filter-primary-500 mx-auto mb-4"
            width={44}
            height={44}
            priority
          />
          <p className="font-maven-pro font-medium text-center">Sorry, you have to connect your wallet first!</p>
          <hr className="mt-5 mb-6" />
          <Button type="button" variant="primary" disabled={isButtonDisabled} onClick={openConnectWallet}>
            Connect Wallet
            <Image
              src="/icon/credit-card-02.svg"
              alt="icon"
              className="inline-block -mt-1 ml-2 brightness-0 contrast-100 invert"
              width={24}
              height={24}
              priority
            />
          </Button>
          {walletList &&
            <ul className="mt-6">
              <li className="flex items-start justify-between gap-1 border border-gray-300 lg:hover:bg-gray-100 lg:transition rounded-lg px-4 py-2 mb-5 last:mb-0">
                <div className="font-maven-pro font-medium mt-3">
                  <Image
                    src="/icon/logo-radix.svg"
                    alt="icon"
                    className="inline-block -mt-1 mr-3 max-sm:hidden"
                    width={32}
                    height={32}
                    priority
                  />
                  Radix Wallet
                </div>
                <div className="text-sm mt-1">
                  <WalletRadix onUpdate={updateWalletConnect} />
                </div>
              </li>
            </ul>
          }
        </Card>
      }
    </div>
  )
}
