'use client'

import { usePathname } from "next/navigation";
import { RoleType } from "@/app/types";
import { useWallet } from "@/app/auth/wallet";
import Loading from "@/app/loading";
import Wallet from "@/app/wallet/page";
import { Main } from "@/app/components/main";
import DiscussionMember from "./member";

export default function Discussion() {
  const { isLoading, walletConnect, role, rdt } = useWallet()
  const pathname = usePathname()

  return (
    <Main>
      {!isLoading ?
        <>
          {walletConnect ?
            <>
              {(role === RoleType.Admin || role === RoleType.Member) && (
                <DiscussionMember rdt={rdt} />
              )}
            </>
          :
            <Wallet rdt={rdt} path={pathname} />
          }
        </>
      :
        <Loading />
      }
    </Main>
  )
}