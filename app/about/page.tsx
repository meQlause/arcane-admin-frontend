'use client'

import { RoleType } from "@/app/types";
import { useWallet } from "@/app/auth/wallet";
import Loading from "@/app/loading";
import { Main } from "@/app/components/main";
import AboutMember from "./member";

export default function About() {
  const { isLoading, walletConnect, role, rdt } = useWallet()

  return (
    <Main>
      {!isLoading ?
        <>
          {walletConnect ?
            <>
              {(role === RoleType.Admin || role === RoleType.Member) ?
                <AboutMember rdt={rdt} />
              :
                <AboutMember />
              }
            </>
          :
            <AboutMember />
          }
        </>
      :
        <Loading className="max-lg:pb-10" />
      }
    </Main>
  )
}