'use client'

import { RoleType } from "@/app/types";
import { useWallet } from "@/app/auth/wallet";
import Loading from "@/app/loading";
import { Main } from "@/app/components/main";
import ProposalDetailMember from "./member";

export default function ProposalDetail({ params }: { params: { detail: string } }) {
  const { isLoading, walletConnect, role, rdt } = useWallet()

  return (
    <Main>
      {!isLoading ?
        <>
          {walletConnect ?
            <>
              {(role === RoleType.Admin || role === RoleType.Member) && (
                <ProposalDetailMember rdt={rdt} id={params.detail} />
              )}
            </>
          :
            <ProposalDetailMember id={params.detail} />
          }
        </>
      :
        <Loading className="max-lg:pb-10" />
      }
    </Main>
  )
}