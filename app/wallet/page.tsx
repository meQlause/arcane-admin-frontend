"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardOutline } from "@/app/components/card";
import { Button } from "@/app/components/button";
import WalletRadix from "@/app/wallet/radix";
import CryptoJS from "crypto-js";
import { RTMGenerator } from "@/app/rtm_generator";

export default function Wallet({ rdt, path, variant }: any) {
  const router = useRouter();
  const [walletConnect, setWalletConnect] = useState(false);
  // const [walletList, setWalletList] = useState(false)
  // const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
  const [failedReg, setFailedReg] = useState<boolean>(false);
  const [provideProof, setProvideProof] = useState<boolean>(false);
  const [failedProof, setFailedProof] = useState<boolean>(false);
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    rdt.s;
    if (!rdt?.walletApi.getWalletData().accounts[0]) {
      setFailedReg(false);
      setProvideProof(false);
      setIsRegistered(null);
      setWalletConnect(false);
    }
  }, [rdt?.walletApi.getWalletData().accounts[0]]);

  useEffect(() => {
    const verifyAddress = async () => {
      // console.log(walletConnect);
      if (walletConnect) {
        const data = localStorage.getItem("arcane")!;
        if (!data) {
          router.push("/about");
          return;
        }
        const bytes = CryptoJS.AES.decrypt(data, `${process.env.SECRET_JS}`);
        const originalData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        if (originalData.role !== "unregistered") {
          setIsRegistered(true);
          return;
        }
        setIsRegistered(false);
      }
    };
    verifyAddress();
  }, [walletConnect, rdt.walletApi]);

  useEffect(() => {
    // console.log("aasdasdasdadsasdadasss");
    // console.log("isRegistered" + isRegistered);
    // console.log("isWalletConnect" + walletConnect);
    const registered = async () => {
      if (isRegistered === false && walletConnect === true) {
        const rtm_signup = RTMGenerator.signUp(
          rdt?.walletApi.getWalletData().accounts[0].address
        ).trim();
        const result = await rdt.walletApi.sendTransaction({
          transactionManifest: rtm_signup,
          message: "Mint Member Arcane Badge",
        });
        if (!result.isErr()) {
          setAddress(rdt?.walletApi.getWalletData().accounts[0]?.address);
          setProvideProof(true);
          setFailedReg(false);
        }
        if (result.isErr()) {
          localStorage.removeItem("arcane")!;
          router.push("/about");
          setFailedReg(true);
        }
      }
    };
    registered();
  }, [isRegistered, walletConnect]);

  const handleProvideProof = async () => {
    setLoading(true);
    const result = await rdt.walletApi.sendRequest();

    if (address !== rdt?.walletApi.getWalletData().accounts[0]?.address) {
      setFailedProof(true);
      setLoading(false);
    }

    if (result.isErr()) {
      localStorage.removeItem("arcane")!;
      router.push("/about");
      rdt.disconnect();
      return;
    }

    router.push("/dashboard");
  };

  // const openConnectWallet = () => {
  //   setWalletList(true)
  //   setButtonDisabled(true)
  // }

  const updateWalletConnect = (state: any) => {
    if (state) {
      setWalletConnect(true);
    }
  };

  const handlePageUnlock = () => {
    setLoading(true);
    if (path === "/") {
      router.push(path + "dashboard");
    } else if (path === "/admin") {
      router.push(path + "/dashboard");
    } else if (path === "/about") {
      router.push("/dashboard");
    } else {
      window.location.reload();
    }
  };

  const handlePageReload = () => {
    localStorage.removeItem("arcane")!;
    rdt.disconnect();
    window.location.reload();
  };

  return (
    <div className={`${variant === "content-only" ? "" : "my-4"}`}>
      {walletConnect ? (
        <Card
          className={`${variant === "content-only" ? "!p-0 !shadow-none" : ""}`}
        >
          <Image
            src="/icon/check-circle.svg"
            alt="icon"
            className="filter-success-500 mx-auto mb-4"
            width={44}
            height={44}
            priority
          />
          <p className="font-maven-pro font-medium text-center">
            Successfully Connected Wallet
          </p>

          {(!isRegistered && !provideProof) &&
            <div className="bg-error-100 text-error-700 px-4 py-3 rounded-lg my-4 flex items-start gap-2">
              <Image
                src="/icon/alert-circle.svg"
                alt="icon"
                className="filter-error-500 shrink-0"
                width={24}
                height={24}
                priority
              />
              {failedReg ?
                <span>
                  You intentionally canceled or the address you selected does not have the XRD to pay the fee
                </span>
              :
                <span>
                  You are not a member yet. Please register by <b>sign the tx</b> on your wallet app.
                </span>
              }
            </div>
          }
          {(!isRegistered && provideProof && failedProof) &&
            <div className="bg-error-100 text-error-700 px-4 py-3 rounded-lg my-4 flex items-start gap-2">
              <Image
                src="/icon/alert-circle.svg"
                alt="icon"
                className="filter-error-500 shrink-0"
                width={24}
                height={24}
                priority
              />
              <span>
                Your address wallet is different between registered and chosen. Please relogin and choose the address that registered.
              </span>
            </div>
          }

          <CardOutline className="my-6">
            <span className="font-maven-pro">Your Wallet</span>
            <hr className="mt-3 mb-5" />
            <div className="flex items-start gap-3 font-maven-pro font-medium break-all mt-1">
              <Image
                src="/icon/logo-radix.svg"
                alt="icon"
                className="shrink-0 -mt-[3px]"
                width={32}
                height={32}
                priority
              />
              <span>{rdt?.walletApi.getWalletData().accounts[0]?.address}</span>
            </div>
          </CardOutline>

          {provideProof ? (
            <>
              {!failedProof ?
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleProvideProof}
                  loading={loading}
                >
                  Provide proof with the address above
                </Button>
              :
                <Button
                  type="button"
                  variant="primary"
                  onClick={handlePageReload}
                >
                  Refresh page & Login again
                </Button>
              }
            </>
          ) : isRegistered ? (
            <Button
              type="button"
              variant="primary"
              onClick={handlePageUnlock}
              loading={loading}
            >
              Finish & Unlock
            </Button>
          ) : failedReg ? (
            <Button
              type="button"
              variant="primary"
              onClick={handlePageReload}
            >
              Refresh page & Login again
            </Button>
          ) : (
            <>
              <div className="flex justify-center gap-3 my-6">
                <span className="italic text-gray-400">
                  Waiting for a response from your wallet app
                </span>
                <Image
                  src="/loading.svg"
                  alt="loading"
                  className="animate-spin shrink-0"
                  width={24}
                  height={24}
                  priority
                />
              </div>
              <Button
                type="button"
                variant="primary"
                disabled={true}
              >
                Provide proof with the address above
              </Button>
            </>
          )}
        </Card>
      ) : (
        <Card
          className={`${variant === "content-only" ? "!p-0 !shadow-none" : ""}`}
        >
          <Image
            src="/icon/alert-circle.svg"
            alt="icon"
            className="filter-primary-500 mx-auto mb-4"
            width={44}
            height={44}
            priority
          />
          <p className="font-maven-pro font-medium text-center">
            Sorry, you have to connect your wallet first!
          </p>
          <hr className="mt-5 mb-6" />
          {/* <Button type="button" variant="primary" disabled={isButtonDisabled} onClick={openConnectWallet}>
            Connect Wallet
            <Image
              src="/icon/credit-card-02.svg"
              alt="icon"
              className="inline-block -mt-1 ml-2 brightness-0 contrast-100 invert"
              width={24}
              height={24}
              priority
            />
          </Button>
          {walletList && } */}
          <ul className="mt-6">
            <li className="flex items-start justify-between gap-1 border border-gray-300 lg:hover:bg-gray-100 lg:transition rounded-lg px-4 py-2 mb-5 last:mb-0">
              <div className="font-maven-pro font-medium mt-3">
                <Image
                  src="/icon/logo-radix.svg"
                  alt="icon"
                  className="inline-block -mt-1 mr-3 max-sm:hidden"
                  width={32}
                  height={32}
                  priority
                />
                Radix Wallet
              </div>
              <div className="text-sm mt-1">
                <WalletRadix onUpdate={updateWalletConnect} />
              </div>
            </li>
          </ul>
        </Card>
      )}
    </div>
  );
}
