'use client'

import { usePathname } from "next/navigation";
import { RoleType } from "@/app/types";
import { useWallet } from "@/app/auth/wallet";
import Loading from "@/app/loading";
import Wallet from "@/app/wallet/page";
import { Main } from "@/app/components/main";
import ProposalCreateAdmin from "./admin";

export default function ProposalCreate() {
  const { isLoading, walletConnect, role, rdt } = useWallet()
  const pathname = usePathname()

  return (
    <Main>
      {!isLoading ?
        <>
          {walletConnect ?
            <>
              {role === RoleType.Admin && <ProposalCreateAdmin rdt={rdt} />}
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