"use client";

import {
  createContext,
  useEffect,
  useState,
  useContext,
  ReactNode,
} from "react";
import {
  RadixDappToolkit,
  RadixNetwork,
  DataRequestBuilder,
  createLogger,
  RdtState,
} from "@radixdlt/radix-dapp-toolkit";
import CryptoJS from "crypto-js";
import Loading from "@/app/loading";
import { NFTauth } from "@/app/types";
import * as dotenv from "dotenv";

dotenv.config();

type WalletContextProviderProps = {
  children: ReactNode;
};

let rdt: RadixDappToolkit;

export const WalletContext = createContext<RadixDappToolkit | null>(null);

export function WalletContextProvider({
  children,
}: WalletContextProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (typeof window !== "undefined" && !rdt) {
      rdt = RadixDappToolkit({
        dAppDefinitionAddress:
          "account_tdx_2_1293z892mr8wx3ga73zlrfwmlakx38te882yjfe2ehuxhk5z2cgp8rc",
        networkId: RadixNetwork.Stokenet,
        logger: createLogger(1),
      });

      rdt.walletApi.setRequestData(
        DataRequestBuilder.persona(),
        DataRequestBuilder.accounts().exactly(1).withProof(),
        DataRequestBuilder.personaData().fullName().emailAddresses()
      );

      rdt.buttonApi.setTheme("radix-blue");
      rdt.buttonApi.setMode("dark");

      const getChallenge: () => Promise<string> = () =>
        fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_SERVER}/rola/generate-challenge`
        )
          .then((res) => res.json())
          .then((res) => res.challenge);

      rdt.walletApi.provideChallengeGenerator(getChallenge);

      rdt.walletApi.dataRequestControl(async ({ proofs }) => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_SERVER}/rola/verify`,
          {
            method: "POST",
            body: JSON.stringify(proofs),
            headers: { "content-type": "application/json" },
          }
        ).then((res): Promise<NFTauth> => res.json());
        const ciphertext = CryptoJS.AES.encrypt(
          JSON.stringify(res),
          `${process.env.SECRET_JS}`
        ).toString();
        localStorage.setItem("arcane", ciphertext);
      });
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <WalletContext.Provider value={rdt}>{children}</WalletContext.Provider>
  );
}

export function useWalletContext() {
  const rdt = useContext(WalletContext);
  if (!rdt) {
    throw new Error(
      `WalletContext should be used within WalletContext Provider`
    );
  }
  return rdt;
}
