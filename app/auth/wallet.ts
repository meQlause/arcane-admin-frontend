"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useWalletContext } from "@/app/contexts/wallet-context";
import { RoleType } from "@/app/types";
import CryptoJS from "crypto-js";

export const useWallet = () => {
  const rdt = useWalletContext();
  const router = useRouter();
  const pathname = usePathname();
  const data = localStorage.getItem("arcane")!;

  let role: string = "";
  let address: string = "";
  let access_token: string = "";
  if (data) {
    const bytes = CryptoJS.AES.decrypt(data, `${process.env.SECRET_JS}`);
    const originalData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    role = originalData.role;
    address = originalData.address;
    access_token = originalData.access_token;
  }

  const [isLoading, setIsLoading] = useState(true);
  const [walletConnect, setWalletConnect] = useState(false);

  // rdt.walletApi.provideConnectResponseCallback(() => (
  //   <Wallet rdt={rdt} path={pathname} />
  // ))

  useEffect(() => {
    if (rdt?.walletApi.getWalletData().accounts[0] && address && role) {
      if (role !== RoleType.Admin && role === RoleType.Member) {
        router.push(pathname.replace("/admin", ""));
      }
      setWalletConnect(true);
    } else {
      rdt?.disconnect();
      setWalletConnect(false);
    }
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  return { rdt, role, address, access_token, isLoading, walletConnect };
};
