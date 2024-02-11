'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/app/auth/wallet";

export const useAccount = ({ rdt }: any) => {
  const { role } = useWallet()
  const router = useRouter()
  const [account, setAccount] = useState<any>(null)

  useEffect(() => {
    const fetchAccount = () => {
      const walletData = rdt?.walletApi.getWalletData()
      if (walletData && walletData.accounts.length > 0) {
        let fromWallet: {[key: string]: any} = {
          "address": walletData.accounts[0].address,
          "label": walletData.accounts[0].label
        }
        let fromDb: {[key: string]: any} = {
          "avatar": "/user/user-1.png",
          "role": role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
        }
        setAccount({...fromWallet, ...fromDb})
      } else {
        setAccount(null)
      }
    }

    fetchAccount()
  }, [rdt, router])

  return { account }
}