'use client'

import { redirect, usePathname , useRouter} from "next/navigation";
import { RoleType } from "@/app/types";
import { useWallet } from "@/app/auth/wallet";
import Loading from "@/app/loading";
import Wallet from "@/app/wallet/page";
import { Main } from "@/app/components/main";
import { Card } from "@/app/components/card";
import { Button } from "@/app/components/button";
import { signUpMember } from "../rtm_generator";
import { useAccount } from "../auth/account";

export default function SignUp() {
  const { isLoading, walletConnect, role, rdt } = useWallet()
  const { account } = useAccount({ rdt })
  const router = useRouter()
  if ( role === RoleType.Admin ) redirect('/admin/dashboard')
  if ( role === RoleType.Member ) redirect('/dashboard')

  const pathname = usePathname()
  const sign_up = async () => {
    const rtm_signup = signUpMember(account?.address).trim()
    const result = await rdt.walletApi.sendTransaction({
      transactionManifest: rtm_signup,
      message: 'Mint Member Arcane Badge'
    })
    
    if (result.isErr()) {
    /*
    write logic here when the transaction signed on wallet unsucessfull 
    */
      throw new Error("Minting Error")
    }
    /*
    write logic here when the transaction signed on wallet sucessfull 
    */ 
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_SERVER}/address/register`,
        {
          method: 'POST',
          body: JSON.stringify({'address' : account?.address}),
          headers: { 'content-type': 'application/json' },
        }
      )
    if (res.ok) {
      /*
        logic here when data is recorded on database
      */ 
      rdt.disconnect();
      localStorage.removeItem('arcane')
      router.push('/dashboard')
    } 
      /*
        logic here when data is failed storing on database
      */ 
  }
  return (
    <Main>
      {!isLoading ?
        <>
          {walletConnect ?
            <>
              {role === RoleType.Unregistered &&
                <Card>
                  <h1 className="font-maven-pro font-semibold text-2xl mb-4">Registration</h1>
                  <p className="mb-6">Cillum sunt in ipsum esse dolor eiusmod cillum adipisicing. Laboris ea ea veniam consectetur pariatur consectetur cupidatat.</p>
                  <Button type={"button"} variant={"primary"} onClick={sign_up}>Sign Up</Button>
                </Card>
              }
            </>
          :
            <Wallet rdt={rdt} path={pathname} />
          }
        </>
      :
        <Loading className="max-lg:pb-10" />
      }
    </Main>
  )
}