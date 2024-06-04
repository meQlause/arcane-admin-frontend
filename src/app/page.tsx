'use client'

import { useEffect, useState } from "react";
import { redirect, usePathname } from "next/navigation";
import { useWalletContext } from '@/app/contexts/wallet-context';
import About from "@/app/about/page";

export default function Home() {
  const rdt = useWalletContext()

  const pathname = usePathname()

  const [loadPage, setLoadPage] = useState(false)

  useEffect(() => {
    if ( rdt?.walletApi && pathname === '/' ) {
      redirect('/about')
    } else {
      setLoadPage(true)
    }
  }, [])

  return (
    <>
      {loadPage && <About />}
    </>
  )
}
