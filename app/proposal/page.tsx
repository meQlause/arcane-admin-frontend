'use client'

import { useWallet } from "@/app/auth/wallet";
import Loading from "@/app/loading";
import { Main } from "@/app/components/main";
import ProposalMember from "./member";

export default function Proposal() {
  const { isLoading, walletConnect, rdt } = useWallet()

  return (
    <Main>
      {!isLoading ?
        <>
          {walletConnect ?
            <ProposalMember rdt={rdt} />
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