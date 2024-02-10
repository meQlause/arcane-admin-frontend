'use client'

import { useEffect, useState } from "react";
import { redirect, usePathname } from "next/navigation";
import { useWalletContext } from '@/app/contexts/wallet-context';
import Proposal from "@/app/proposal/page";

export default function Home() {
  const rdt = useWalletContext()

  const pathname = usePathname()

  const [loadPage, setLoadPage] = useState(false)

  useEffect(() => {
    if ( rdt?.walletApi && pathname === '/' ) {
      redirect('/proposal')
    } else {
      setLoadPage(true)
    }
  }, [])

  return (
    <>
      {loadPage && <Proposal />}
    </>
  )
}
