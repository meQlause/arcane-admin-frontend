'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const useAccount = ({ rdt }: any) => {
  const router = useRouter()
  const [account, setAccount] = useState<any>(null)

  useEffect(() => {
    const fetchAccount = () => {
      const walletData = rdt?.walletApi.getWalletData()
      if (walletData && walletData.accounts.length > 0) {
        setAccount(walletData.accounts[0])
      } else {
        setAccount(null)
      }
    }

    fetchAccount()
  }, [rdt, router])

  return { account }
}