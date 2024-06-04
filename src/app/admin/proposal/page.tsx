'use client'

import { usePathname } from "next/navigation";
import { RoleType } from "@/app/types";
import { useWallet } from "@/app/auth/wallet";
import Loading from "@/app/loading";
import Wallet from "@/app/wallet/page";
import { Main } from "@/app/components/main";
import Unallowed from "@/app/unallowed";
import ProposalAdmin from "./admin";

export default function Proposal() {
  const { isLoading, walletConnect, role, rdt } = useWallet()
  const pathname = usePathname()

  return (
    <Main>
      {!isLoading ?
        <>
          {walletConnect ?
            <>
              {role === RoleType.Admin && <ProposalAdmin rdt={rdt} />}
              {role === RoleType.Member && <Unallowed />}
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