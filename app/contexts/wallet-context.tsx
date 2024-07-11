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
  Logger,
  RdtState,
} from "@radixdlt/radix-dapp-toolkit";
import { GatewayApiClient } from "@radixdlt/babylon-gateway-api-sdk";
import CryptoJS from "crypto-js";
import Loading from "@/app/loading";
import config from "../config";

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
        dAppDefinitionAddress: config.addresses?.dappsDefinition!,
        networkId: RadixNetwork.Stokenet,
        // logger: Logger(1),
      });
      // const gatewayApi = GatewayApiClient.initialize(
      //   rdt.gatewayApi.clientConfig
      // );

      rdt.walletApi.setRequestData(
        DataRequestBuilder.persona(),
        DataRequestBuilder.accounts().exactly(1).withProof(),
        DataRequestBuilder.personaData().fullName().emailAddresses()
      );

      rdt.buttonApi.setTheme("radix-blue");
      rdt.buttonApi.setMode("dark");

      const getChallenge: () => Promise<string> = () =>
        fetch(
          `${config.apis?.NEXT_PUBLIC_BACKEND_API_SERVER}/rola/generate-challenge`
        )
          .then((res) => res.json())
          .then((res) => res.challenge);

      rdt.walletApi.provideChallengeGenerator(getChallenge);

      rdt.walletApi.dataRequestControl(async ({ proofs }) => {
        const res = await fetch(
          `${config.apis?.NEXT_PUBLIC_BACKEND_API_SERVER}/rola/verify`,
          {
            method: "POST",
            body: JSON.stringify(proofs),
            headers: { "content-type": "application/json" },
          }
        ).then((res): Promise<any> => res.json());
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
