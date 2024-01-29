'use client'

import { redirect, usePathname } from "next/navigation";
import { RoleType } from "@/app/types";
import { useWallet } from "@/app/auth/wallet";
import Loading from "@/app/loading";
import Wallet from "@/app/wallet/page";
import { Main } from "@/app/components/main";
import { Card } from "@/app/components/card";
import { Button } from "@/app/components/button";

export default function SignUp() {
  const { isLoading, walletConnect, role, rdt } = useWallet()
  if ( role === RoleType.Admin ) redirect('/admin/dashboard')
  if ( role === RoleType.Member ) redirect('/dashboard')

  const pathname = usePathname()

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
                  <Button type={"button"} variant={"primary"}>Sign Up</Button>
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