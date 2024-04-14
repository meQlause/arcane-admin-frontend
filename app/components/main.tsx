import React, { ReactNode, FC, useEffect, useState } from "react";
import Image from "next/image";
import { truncateMiddle } from '@/app/functions/truncate';
import { Sidebar } from "@/app/components/sidebar";
import { Badge } from "@/app/components/badge";
import { useWallet } from "@/app/auth/wallet";
import { RTMGenerator } from "../rtm_generator";

type MainProps = {
  children: ReactNode
  className?: string
}

export const Main: FC<MainProps> = ({ children, className }) => {
  const { address, rdt } = useWallet()

  useEffect(() => {
    const div = document.querySelector('main>div')
    if (div) {
      setTimeout(() => {
        div.classList.add('h-auto')
      },1000)
    }
  },[])

  const devMode = true
  const [loading, setLoading] = useState(false)
  const [successMintToken, setSuccessMintToken] = useState(false)
  const [failedMintToken, setFailedMintToken] = useState(false)

  const handleMintToken = async () => {
    setLoading(true)
    const mintArcToken = RTMGenerator.mint_arc(address)
    // console.log(addVoting)
    const result = await rdt.walletApi.sendTransaction({
      transactionManifest: mintArcToken,
      message: 'mint arc token'
    })

    rdt.buttonApi.status$.subscribe((data:any) => {
      if ( data === 'error' ) {
        setLoading(false)
        setFailedMintToken(true)
        setTimeout(() => {
          setFailedMintToken(false)
        },3000)
      }
      if ( data === 'success' ) {
        setSuccessMintToken(true)
        setTimeout(() => {
          setLoading(false)
          setSuccessMintToken(false)
        },3000)
      }
    })

    if (result.isErr()) {
      /* write logic here when the transaction signed on wallet unsucessfull */
      // throw new Error("Error add voting")
      setLoading(false)
      setFailedMintToken(true)
      setTimeout(() => {
        setFailedMintToken(false)
      },3000)
    }
  }

  return (
    <section className="lg:flex w-full max-w-8xl mx-auto">
      <Sidebar className={devMode ? 'lg:!pt-12 lg:[&>div>ul]:!max-h-[calc(100vh-88px-24px)]' : ''} />
      {devMode &&
        <div className={`sticky lg:fixed top-[69px] lg:top-0 left-0 w-full h-fit z-[9] lg:z-20 px-4 py-2 text-xs text-center ${successMintToken ? 'bg-success-100 text-success-600' : failedMintToken ? 'bg-error-100 text-error-600' : 'bg-primary-100 text-primary-700'}`}>
          {successMintToken ?
            <>
              {`Mint $ARC tokens successfully!`}
            </>
          :
            failedMintToken ?
              <>
                {`Failed to mint $ARC tokens!`}
              </>
            :
              <>
                {`This dApp is configured to use the testnet Stokenet. It does not use the Radix Public Network mainnet. Click`}
                <button type="button" className="inline-block mx-1 underline" onClick={handleMintToken}>
                  HERE
                  <Image
                    src="/loading.svg"
                    alt="loading"
                    className={`animate-spin ml-1 mr-0.5 ${!loading ? 'hidden' : 'inline-block'}`}
                    width={16}
                    height={16}
                  />
                </button>
                {`to mint $ARC tokens and you can use them for voting on Stokenet.`}
              </>
          }
        </div>
      }
      <main className={`w-full max-lg:min-h-[calc(100vh-70px-env(safe-area-inset-bottom))] lg:my-3 py-4 px-6 lg:px-12 overflow-hidden ${devMode ? 'lg:!mt-8' : ''}`}>
        <div className={className} style={{paddingBottom: 'env(safe-area-inset-bottom)'}}>
          {children}
        </div>
      </main>
    </section>
  )
}

type MainTitleProps = {
  title: string
  userName?: string
  userImage?: string
  userRole?: string
  className?: string
  children?: ReactNode
}

export const MainTitle: FC<MainTitleProps> = ({ title, userName, userImage, userRole, className, children }) => {
  return (
    <div className="relative flex items-center justify-between gap-4 mb-8 max-lg:mt-4">
      <h1 className="font-maven-pro font-semibold text-2xl">{title}</h1>
      <div className={`max-md:hidden ${className || ''}`}>
        {userImage && 
          <Image
            src={userImage}
            alt="user"
            className="w-10 h-10 rounded-full object-cover inline-block"
            width={24}
            height={24}
            unoptimized
          />
        }
        {userName && 
          <span className="inline-block ml-3" title={userName}>
            {truncateMiddle(`${userName}`, 13)}
          </span>
        }
        {userRole && 
          <Badge variant="primary" className="ml-3">
            {userRole}
          </Badge>
        }
      </div>
      {children}
    </div>
  )
}