'use client'

import { useEffect, useState } from "react";
import { redirect, usePathname } from "next/navigation";
import { useWalletContext } from '@/app/contexts/wallet-context';
import Dashboard from "@/app/admin/dashboard/page";

export default function Home() {
  const rdt = useWalletContext()

  const pathname = usePathname()

  const [loadPage, setLoadPage] = useState(false)

  useEffect(() => {
    if ( rdt?.walletApi && pathname === '/admin' ) {
      redirect('/admin/dashboard')
    } else {
      setLoadPage(true)
    }
  }, [])

  return (
    <>
      {loadPage && <Dashboard />}
    </>
  )
}
