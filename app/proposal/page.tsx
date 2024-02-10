'use client'

import { RoleType } from "@/app/types";
import { useWallet } from "@/app/auth/wallet";
import Loading from "@/app/loading";
import { Main } from "@/app/components/main";
import ProposalMember from "./member";

export default function Proposal() {
  const { isLoading, walletConnect, role, rdt } = useWallet()

  return (
    <Main>
      {!isLoading ?
        <>
          {walletConnect ?
            <>
              {(role === RoleType.Admin || role === RoleType.Member) && (
                <ProposalMember rdt={rdt} />
              )}
            </>
          :
            <ProposalMember />
          }
        </>
      :
        <Loading className="max-lg:pb-10" />
      }
    </Main>
  )
}