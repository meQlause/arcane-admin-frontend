'use client'

import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { RoleType } from "@/app/types";
import { useWallet } from "@/app/auth/wallet";
import Wallet from "@/app/wallet/page";
import { useAccount } from "@/app/auth/account";
import { signUpMember } from "@/app/rtm_generator";
import { Button } from "@/app/components/button";

export default function SignUp() {
  const { role, rdt } = useWallet()
  const { account } = useAccount({ rdt })

  const pathname = usePathname()

  const [loading, setLoading] = useState(false)
  const [successReg, setSuccessReg] = useState(false)
  const [failedReg, setFailedReg] = useState(false)
  const [reconnect, setReconnect] = useState(false)

  const handleReconnect = () => {
    setReconnect(true)
  }

  const sign_up = async () => {
    setLoading(true)

    const rtm_signup = signUpMember(account?.address).trim()
    const result = await rdt.walletApi.sendTransaction({
      transactionManifest: rtm_signup,
      message: 'Mint Member Arcane Badge'
    })

    if (result.isErr()) {
      /* write logic here when the transaction signed on wallet unsucessfull */
      setLoading(false)
      // throw new Error("Minting Error")
      setFailedReg(true)
      setTimeout(() => {
        setFailedReg(false)
      },3000)
    }

    /* write logic here when the transaction signed on wallet sucessfull */
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_SERVER}/address/register`,
        {
          method: 'POST',
          body: JSON.stringify({'address' : account?.address}),
          headers: { 'content-type': 'application/json' },
        }
    )

    if (res.ok) {
      /* logic here when data is recorded on database */
      setLoading(false)
      rdt.disconnect()
      localStorage.removeItem('arcane')
      setSuccessReg(true)
    }

    /* logic here when data is failed storing on database */
    setLoading(false)
    setFailedReg(true)
    setTimeout(() => {
      setFailedReg(false)
    },3000)
  }

  return (
    <>
      {(role === RoleType.Unregistered || role === '') &&
        <>
          {!successReg ?
            <>
              {failedReg &&
                <div className="bg-error-100 text-error-600 px-4 py-3 rounded-lg mb-4">
                  You failed to join as member, please to sign up again.
                </div>
              }
              <Image
                src="/icon/alert-circle.svg"
                alt="icon"
                className="filter-primary-500 mx-auto mb-4"
                width={44}
                height={44}
                priority
              />
              <p className="font-maven-pro font-medium text-center">You have to sign up to join with us</p>
              <hr className="mt-5 mb-6" />
              <Button type="button" variant="primary" onClick={sign_up} loading={loading}>
                Sign Up
                <Image
                  src="/icon/user-01.svg"
                  alt="icon"
                  className="inline-block -mt-1 ml-2 brightness-0 contrast-100 invert"
                  width={24}
                  height={24}
                  priority
                />
              </Button>
            </>
          :
            <>
              {!reconnect ?
                <>
                  <Image
                    src="/icon/check-circle.svg"
                    alt="icon"
                    className="filter-success-500 mx-auto mb-4"
                    width={44}
                    height={44}
                    priority
                  />
                  <p className="font-maven-pro font-medium text-center">Registered successful! connect wallet again to login into dashboard</p>
                  <hr className="mt-5 mb-6" />
                  <Button type="button" variant="primary" onClick={handleReconnect}>
                    Connect Wallet Again
                  </Button>
                </>
              :
                <Wallet rdt={rdt} path={pathname} variant={"content-only"} />
              }
            </>
          }
        </>
      }
    </>
  )
}