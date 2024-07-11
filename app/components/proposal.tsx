"use client";

import React, { FC, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { RoleType } from "@/app/types";
import { useWallet } from "@/app/auth/wallet";
import Wallet from "@/app/wallet/page";
import { formatNumber } from "@/app/functions/notation";
import { truncateMiddle } from "@/app/functions/truncate";
import { Card, CardOutline } from "@/app/components/card";
import { Badge } from "@/app/components/badge";
import { Button } from "@/app/components/button";
import { Fieldset, Input, Radio, Checkbox } from "@/app/components/form";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import {
  Popup,
  PopupBody,
  PopupFooter,
  PopupHeader,
} from "@/app/components/popup";
import { Tooltip } from "@/app/components/tooltip";
import { RTMGenerator } from "@/app/rtm_generator";
import { formatDate } from "@/app/functions/datetime";
import https from "https";
import axios from "axios";
import config from "@/app/config";
import { GatewayApiClient } from "@radixdlt/babylon-gateway-api-sdk";

export type ProposalProps = {
  id: string;
  user_address: string;
  user_role?: string;
  title: string;
  description: string;
  component_address: string;
  avatar: string;
  start?: number;
  end?: number;
  status?: string;
  vote?: ProposalVoteProps[] | null;
  vote_hide?: string;
  className?: string;
};

export type ProposalVoteProps = {
  label: string;
  amount?: number;
  token?: number;
  selected?: boolean;
};

export const ProposalList: FC<ProposalProps> = ({
  id,
  user_address,
  title,
  description,
  avatar,
  end,
  status,
  vote,
  className,
}) => {
  const totalVotes: any = vote?.reduce(
    (total: number, item: any) => total + item.amount,
    0
  );

  return (
    <CardOutline
      variant="primary"
      className={`ring-2 ring-transparent lg:hover:ring-primary-500 lg:transition ${
        className || ""
      }`}
      data-id={id}
    >
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-3 font-maven-pro font-medium">
          <Image
            src={avatar}
            alt="user"
            className="w-8 h-8 rounded-xl object-cover"
            width={24}
            height={24}
          />
          <div className="max-md:hidden" title={user_address}>
            {truncateMiddle(`${user_address}`, 30)}
          </div>
          <div
            className="break-all line-clamp-1 md:hidden"
            title={user_address}
          >
            {user_address}
          </div>
        </div>
        <div className="flex items-center max-md:justify-between gap-4 text-sm text-gray-600 md:ml-auto">
          {(status?.toLowerCase() === "active" ||
            status?.toLowerCase() === "pending" ||
            status?.toLowerCase() === "closed") &&
            end && (
              <>
                <span>{end}</span>
                <div className="w-px h-8 bg-gray-300 max-md:hidden"></div>
              </>
            )}
          <Badge
            variant={
              status?.toLowerCase() === "active"
                ? "success"
                : status?.toLowerCase() === "closed"
                ? "info"
                : status?.toLowerCase() === "rejected"
                ? "error"
                : "warning"
            }
          >
            {status}
          </Badge>
        </div>
      </div>
      <div className="font-maven-pro font-semibold text-lg mb-3">{title}</div>
      <p className="text-gray-600">{description}</p>
      {vote && (
        <CardOutline
          variant="primary"
          className="flex flex-col gap-4 !rounded-xl !p-4 mt-4"
        >
          {vote?.map((item: any, index: number) => {
            let percentage: string =
              totalVotes !== 0
                ? ((item.amount / totalVotes) * 100).toFixed(2)
                : "0";
            return (
              <div
                key={index}
                className="relative overflow-hidden flex items-start justify-between rounded-lg bg-primary-50 text-primary-600"
              >
                <div className="relative z-[1] w-fit px-5 py-3 max-sm:flex">
                  <span className="font-medium text-primary-800">
                    {item.label}
                  </span>
                </div>
                <div className="relative z-[1] whitespace-nowrap w-fit px-5 py-3 min-w-[100px] text-right">
                  {item.selected && (
                    <Image
                      src="/icon/check-circle.svg"
                      alt="icon"
                      className="filter-success-500 inline -mt-1 mr-2"
                      width={24}
                      height={24}
                    />
                  )}
                  <span className="font-medium text-gray-900">
                    {percentage}%
                  </span>
                </div>
                <div
                  className="absolute top-0 left-0 h-full rounded-r-lg bg-primary-200"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            );
          })}
        </CardOutline>
      )}
    </CardOutline>
  );
};

const predefinedColors = [
  "#C9A0DC",
  "#F3B6C8",
  "#FFDAC1",
  "#C6E6D0",
  "#C7CEEA",
  "#AEDDFF",
  "#B5EAD7",
  "#E1E8C7",
  "#D4A5A5",
  "#FFD3B5",
];

export type ProposalDetailProps = ProposalProps & {
  voter?: ProposalVoterProps[];
  photos?: any;
  handleBack?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  account?: any;
  user_voted?: any;
  user_withdraw?: any;
  // need_approval?: boolean;
};

type ProposalVoterProps = {
  user_address: string;
  avatar: string;
  selected: string;
  amount?: number;
  label?: string;
};

export const ProposalDetail: FC<ProposalDetailProps> = ({
  id,
  component_address,
  user_address,
  user_role,
  title,
  description,
  avatar,
  start,
  end,
  status,
  vote,
  vote_hide,
  voter,
  photos,
  handleBack,
  account,
  user_voted,
  user_withdraw,
  // need_approval,
}) => {
  const { walletConnect, role, rdt, nft_id, address } = useWallet();
  const pathname = usePathname();
  const router = useRouter();
  const [tokenAmount, setTokenAmount] = useState<string>("0");
  const [loading, setLoading] = useState(false);
  const [imagesData, setImagesData] = useState<string[]>([]);
  const [totalArcToken, setTotalArcToken] = useState<number | null>(null);
  const isNotCreate = pathname.indexOf("/create") < 0;

  const [showPopupSignin, setShowPopupSignin] = useState(false);
  const handleOpenPopupSignin = () => {
    setShowPopupSignin(true);
  };
  const handleClosePopupSignin = () => {
    setShowPopupSignin(false);
  };

  // custom load for image to fix https issue
  const customImageLoader = async (src: string) => {
    try {
      const instance = axios.create({
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      });

      const response = await instance.get(src, {
        responseType: "arraybuffer",
      });

      const base64 = Buffer.from(response.data, "binary").toString("base64");
      const dataUrl = `data:${response.headers["content-type"]};base64,${base64}`;

      return dataUrl;
    } catch (err) {
      console.error("Error reading certificate file:", err);
    }
  };

  useEffect(() => {
    if (photos[0]) {
      photos.forEach((photo: any) => {
        customImageLoader(
          `${config.apis?.NEXT_PUBLIC_BACKEND_API_SERVER}/proposal/pict/${photo}`
        ).then((dataUrl) => {
          if (dataUrl) {
            setImagesData((prevData) => [...prevData, dataUrl]);
          }
        });
      });
    }
  }, [photos]);

  const [showPopupVote, setShowPopupVote] = useState(false);
  const handleOpenPopupVote = () => {
    setShowPopupVote(true);
  };
  const handleClosePopupVote = () => {
    setShowPopupVote(false);
  };

  const [showPopupShare, setShowPopupShare] = useState(false);
  const handleOpenPopupShare = () => {
    setShowPopupShare(true);
  };
  const handleClosePopupShare = () => {
    setShowPopupShare(false);
  };

  const [showPopupApproval, setShowPopupApproval] = useState(false);
  const handleOpenPopupApproval = () => {
    setShowPopupApproval(true);
  };
  const handleClosePopupApproval = () => {
    setShowPopupApproval(false);
  };

  const [copy, setCopy] = useState(false);
  const handleCopyURL = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopy(true);
      setTimeout(() => setCopy(false), 3000);
    } catch (error) {
      setCopy(false);
    }
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const totalVotes: any = vote?.reduce(
    (total: number, item: any) => total + item.amount,
    0
  );
  const colorArray: any = vote?.map(
    (_, index) => predefinedColors[index % predefinedColors.length]
  );

  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
    },
    []
  );

  const [voting, setVoting] = useState("");
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const isFormFilled = voting !== "";
    setFilled(isFormFilled);
  }, [voting]);

  const [isClosed, setIsClosed] = useState(false);
  const [isVoteAbleToUse, setIsVoteAbleToUse] = useState(true);
  const [isWithdrawAbleToUse, setIsWithdrawAbleToUse] = useState(true);
  const gatewayApi = GatewayApiClient.initialize(rdt.gatewayApi.clientConfig);

  useEffect(() => {
    const getArcTokenData = async () => {
      const metadata = await gatewayApi.state.getEntityDetailsVaultAggregated(
        account?.address
      );
      let ft_data = metadata.fungible_resources.items;
      const filteredObject = ft_data.find(
        (item) => item.resource_address === config.addresses.ARC
      );
      console.log(filteredObject);
      setTotalArcToken(
        filteredObject ? Number(filteredObject.vaults.items[0].amount) : null
      );
    };
    getArcTokenData();
    setIsClosed(status === "closed" ? true : false);
    setIsWithdrawAbleToUse(
      status === "closed" ? (user_withdraw ? false : true) : false
    );
  }, [user_withdraw]);

  useEffect(() => {
    if (Number(tokenAmount) > 0 && voting) {
      setIsVoteAbleToUse(true);
    } else {
      setIsVoteAbleToUse(false);
    }
    if (typeof user_voted !== "undefined" && user_voted !== "") {
      setIsVoteAbleToUse(false);
    }
    if (
      totalArcToken === null ||
      Number(tokenAmount) > (totalArcToken ? totalArcToken : 0)
    ) {
      setIsVoteAbleToUse(false);
    }
  }, [tokenAmount, voting]);

  const handleWithdraw = async () => {
    setLoading(true);

    const withdrawFromVote = RTMGenerator.withdraw(
      account?.address,
      nft_id,
      component_address!
    ).trim();
    const result = await rdt.walletApi.sendTransaction({
      transactionManifest: withdrawFromVote,
      message: "withdraw",
    });

    if (!result.isErr()) {
      sessionStorage.setItem("arcane-alert-status", "success"); // primary, error, warning, success, info
      sessionStorage.setItem(
        "arcane-alert-message",
        "You have successfully withdrawn"
      );
      if (pathname.indexOf("admin") > -1) {
        router.push("/admin/proposal");
      } else {
        router.push("/proposal");
      }
    }

    if (result.isErr()) {
      /* write logic here when the transaction signed on wallet unsucessfull */
      // throw new Error("Error add voting")
      sessionStorage.setItem("arcane-alert-status", "error"); // primary, error, warning, success, info
      sessionStorage.setItem("arcane-alert-message", "You failed to withdraw");
      if (pathname.indexOf("admin") > -1) {
        router.push("/admin/proposal");
      } else {
        router.push("/proposal");
      }
    }
  };

  const handleVoteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const addVoting = RTMGenerator.vote(
      account?.address,
      tokenAmount.trim(),
      nft_id,
      component_address!,
      voting
    ).trim();
    const result = await rdt.walletApi.sendTransaction({
      transactionManifest: addVoting,
      message: "Vote to a proposal",
    });

    if (result.isErr()) {
      /* write logic here when the transaction signed on wallet unsucessfull */
      // throw new Error("Error add voting")
      sessionStorage.setItem("arcane-alert-status", "error"); // primary, error, warning, success, info
      sessionStorage.setItem(
        "arcane-alert-message",
        "You failed to submit your vote"
      );
      if (pathname.indexOf("admin") > -1) {
        router.push("/admin/proposal");
      } else {
        router.push("/proposal");
      }
    }

    // console.log(result.value.transactionIntentHash)

    // const res = await fetch(
    //   `${process.env.NEXT_PUBLIC_BACKEND_API_SERVER}/votes/add-vote`,
    //     {
    //       method: 'POST',
    //       body: JSON.stringify({
    //         'address' : account?.address,
    //         'key': voting,
    //         'tokenAmount': Number(tokenAmount),
    //         'voteId': Number(id)
    //       }),
    //       headers: {
    //         'content-type': 'application/json',
    //         'Authorization': `Bearer ${access_token}`
    //       },
    //     }
    // )

    if (!result.isErr()) {
      /* logic here when data is recorded on database */
      sessionStorage.setItem("arcane-alert-status", "success"); // primary, error, warning, success, info
      sessionStorage.setItem(
        "arcane-alert-message",
        "You have successfully submitted your vote"
      );
    }

    if (result.isErr()) {
      /* logic here when data is failed storing on database */
      sessionStorage.setItem("arcane-alert-status", "error"); // primary, error, warning, success, info
      sessionStorage.setItem(
        "arcane-alert-message",
        "You failed to submit your vote"
      );
    }

    if (pathname.indexOf("admin") > -1) {
      router.push("/admin/proposal");
    } else {
      router.push("/proposal");
    }
  };

  const [approvalChoice, setApprovalChoice] = useState<string>();
  const [approvalResult, setApprovalResult] = useState<boolean>();

  const handleApprovalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const manifest = RTMGenerator.changeProposalStatusTo(
      approvalChoice?.toLocaleLowerCase() === "approve" ? true : false,
      component_address,
      address,
      nft_id.slice(1, -1)
    );
    const result = await rdt.walletApi.sendTransaction({
      transactionManifest: manifest,
      message: `${approvalChoice} Proposal`,
    });
    if (!result.isErr()) {
      /* logic here when data is recorded on database */
      sessionStorage.setItem("arcane-alert-status", "success"); // primary, error, warning, success, info
      sessionStorage.setItem(
        "arcane-alert-message",
        "Proposal has been approved"
      );
    }
    if (result.isErr()) {
      /* logic here when data is failed storing on database */
      sessionStorage.setItem("arcane-alert-status", "error"); // primary, error, warning, success, info
      sessionStorage.setItem(
        "arcane-alert-message",
        "Proposal failed to be created"
      );
    }
    setLoading(false);
    router.push("/admin/proposal");
  };

  return (
    <>
      <Card
        className="!bg-primary-50 border border-primary-300 max-sm:px-3 max-sm:py-2 mt-2 mb-8 relative overflow-hidden"
        data-id={id}
      >
        <div className="relative z-[1] flex gap-4 md:gap-8 px-2 pt-3 pb-4">
          <div>
            <Button
              type="button"
              variant="light"
              loading="none"
              className="!w-fit !p-2"
              onClick={handleBack}
            >
              <Image
                src="/icon/arrow-left.svg"
                alt="icon"
                className="filter-primary-600 min-w-[24px]"
                width={24}
                height={24}
              />
              <span className="sr-only">Back</span>
            </Button>
          </div>
          <div className="relative flex items-center justify-between gap-3 w-full">
            <div className="flex items-center justify-between gap-3 max-md:w-full md:max-w-[400px] leading-tight">
              <div className="flex items-center gap-3">
                {avatar && (
                  <Image
                    src={avatar}
                    alt="user"
                    className="w-10 h-10 rounded-xl object-cover inline-block"
                    width={24}
                    height={24}
                    unoptimized
                  />
                )}
                {user_address && (
                  <div className="max-sm:text-sm">
                    <div className="max-md:hidden" title={user_address}>
                      {truncateMiddle(`${user_address}`, 13)}
                    </div>
                    <div
                      className="break-all line-clamp-1 md:hidden"
                      title={user_address}
                    >
                      {user_address}
                    </div>
                  </div>
                )}
              </div>
              {user_role && (
                <Badge
                  variant="primary"
                  className="max-md:text-sm max-md:px-3 max-md:pt-0.5 max-md:pb-1"
                >
                  {user_role}
                </Badge>
              )}
            </div>
            {isNotCreate && (
              <div className="flex items-center gap-6 max-md:hidden">
                <Button
                  type="button"
                  variant="light"
                  loading="none"
                  className="!border-0 !bg-transparent !w-fit !p-0 !text-gray-700 font-normal"
                  onClick={handleOpenPopupShare}
                >
                  <Image
                    src="/icon/send-01.svg"
                    alt="icon"
                    className="inline mr-2 -mt-1"
                    width={24}
                    height={24}
                    priority
                  />
                  Share
                </Button>
                {status && (
                  <Badge
                    variant={
                      status?.toLowerCase() === "active"
                        ? "success"
                        : status?.toLowerCase() === "closed"
                        ? "info"
                        : status?.toLowerCase() === "rejected"
                        ? "error"
                        : "warning"
                    }
                  >
                    {status}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="px-2 mt-2">
          <h1
            className={`${
              title.length > 0
                ? "text-primary-800 font-semibold"
                : "text-gray-300 italic"
            } text-xl md:text-3xl font-maven-pro mb-6 md:mb-3`}
          >
            {title.length > 0 ? title : "Empty title"}
          </h1>
          {isNotCreate && (
            <>
              <div className="flex items-center justify-between gap-4 mb-3 md:hidden">
                {status && (
                  <Badge
                    variant={
                      status?.toLowerCase() === "active"
                        ? "success"
                        : status?.toLowerCase() === "closed"
                        ? "info"
                        : status?.toLowerCase() === "rejected"
                        ? "error"
                        : "warning"
                    }
                    className="max-md:text-sm max-md:px-3 max-md:pt-0.5 max-md:pb-1"
                  >
                    {status}
                  </Badge>
                )}
                <Button
                  type="button"
                  variant="light"
                  loading="none"
                  className="!border-0 !bg-transparent !w-fit !p-0 !text-gray-700 font-normal max-md:text-sm"
                  onClick={handleOpenPopupShare}
                >
                  <Image
                    src="/icon/send-01.svg"
                    alt="icon"
                    className="inline mr-2 -mt-1"
                    width={18}
                    height={18}
                    priority
                  />
                  Share
                </Button>
              </div>
              <Popup
                show={showPopupShare}
                backdropClose={true}
                handleClose={handleClosePopupShare}
              >
                <PopupHeader variant={"primary"} icon={"/icon/send-01.svg"} />
                <PopupBody>
                  <h3 className="text-xl font-semibold mb-6">
                    Share this proposal
                  </h3>
                  <Fieldset className="relative">
                    {copy && (
                      <div className="bg-success-100 text-success-600 px-5 py-3.5 rounded-xl w-full h-full absolute top-0 left-0">
                        <Image
                          src="/icon/check-circle.svg"
                          alt="icon"
                          className="inline-block -mt-1 mr-1.5 -ml-1 filter-success-500"
                          width={24}
                          height={24}
                          priority
                        />
                        <span className="max-md:hidden">
                          Proposal URL copied successfully
                        </span>
                        <span className="md:hidden">Copied successfully</span>
                      </div>
                    )}
                    <Input
                      type={"text"}
                      label={"URL"}
                      showLabel={false}
                      id={"share-url"}
                      name={"share-url"}
                      defaultValue={window.location.href}
                      disabled={true}
                    />
                  </Fieldset>
                  <div className="relative">
                    <div className="flex gap-4 md:gap-7 md:flex-wrap max-md:overflow-auto">
                      <div
                        className="flex items-center justify-center flex-col gap-2 group cursor-pointer"
                        onClick={handleCopyURL}
                      >
                        <div className="w-16 h-16 p-4 rounded-full transition border border-gray-200 group-hover:border-primary-200 group-hover:bg-primary-100">
                          <Image
                            src="/icon/link-01.svg"
                            alt="icon"
                            width={24}
                            height={24}
                            className="w-full h-full transition group-hover:filter-primary-600"
                          />
                        </div>
                        <div className="text-xs">Copy</div>
                      </div>
                      <Link
                        href={`https://t.me/share/url?url=${encodeURIComponent(
                          window.location.href
                        )}`}
                        target={isMobile ? "_self" : "_blank"}
                        className="flex items-center justify-center flex-col gap-2 group"
                      >
                        <div className="w-16 h-16 p-4 rounded-full transition border border-gray-200 group-hover:border-primary-200 group-hover:bg-primary-100">
                          <Image
                            src="/icon/social-media-telegram.svg"
                            alt="icon"
                            width={24}
                            height={24}
                            className="w-full h-full transition group-hover:filter-primary-600"
                          />
                        </div>
                        <div className="text-xs">Telegram</div>
                      </Link>
                      <Link
                        href={`https://twitter.com/share?text=${encodeURIComponent(
                          window.location.href
                        )}`}
                        target={isMobile ? "_self" : "_blank"}
                        className="flex items-center justify-center flex-col gap-2 group"
                      >
                        <div className="w-16 h-16 p-4 rounded-full transition border border-gray-200 group-hover:border-primary-200 group-hover:bg-primary-100">
                          <Image
                            src="/icon/social-media-twitter.svg"
                            alt="icon"
                            width={24}
                            height={24}
                            className="w-full h-full transition group-hover:filter-primary-600"
                          />
                        </div>
                        <div className="text-xs">Twitter</div>
                      </Link>
                      <Link
                        href={`https://api.whatsapp.com/send/?text=${encodeURIComponent(
                          window.location.href
                        )}`}
                        target={isMobile ? "_self" : "_blank"}
                        className="flex items-center justify-center flex-col gap-2 group"
                      >
                        <div className="w-16 h-16 p-4 rounded-full transition border border-gray-200 group-hover:border-primary-200 group-hover:bg-primary-100">
                          <Image
                            src="/icon/social-media-whatsapp.svg"
                            alt="icon"
                            width={24}
                            height={24}
                            className="w-full h-full transition group-hover:filter-primary-600"
                          />
                        </div>
                        <div className="text-xs">WhatsApp</div>
                      </Link>
                    </div>
                  </div>
                </PopupBody>
                <PopupFooter>
                  <Button
                    type="button"
                    variant="light"
                    loading="none"
                    className="md:w-fit"
                    onClick={handleClosePopupShare}
                  >
                    Back
                  </Button>
                </PopupFooter>
              </Popup>
            </>
          )}
        </div>
        <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-3/4 flex justify-between">
          <Image
            src="/icon/polygon-2.svg"
            alt="bg"
            className="w-auto h-full"
            width={100}
            height={100}
          />
          <Image
            src="/icon/polygon-3.svg"
            alt="bg"
            className="w-auto h-full max-md:hidden"
            width={100}
            height={100}
          />
        </div>
      </Card>

      <section className="grid md:grid-cols-12 gap-x-8">
        <div className="md:col-span-7 xl:col-span-8 h-fit">
          <Card className="mb-8">
            {description.length > 0 ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: description.replace(/\n/g, "<br>"),
                }}
              />
            ) : (
              <div className="italic text-gray-300">Empty description</div>
            )}
          </Card>

          {/* <Card className="mb-8">
            <Link href="/admin/discussion">
              <Button type="button" variant="light" loading="none">
                Forum Discussion
                <Image
                  src="/icon/arrow-up-right.svg"
                  alt="icon"
                  className="inline-block min-w-[24px] -mt-px ml-1"
                  width={24}
                  height={24}
                />
              </Button>
            </Link>
          </Card> */}

          <Card className="mb-8">
            <h2 className="text-lg font-maven-pro font-semibold text-center mb-6">
              Cast Your Vote
            </h2>
            {account || walletConnect ? (
              <>
                {status === "active" && isNotCreate ? (
                  <form spellCheck="false" onSubmit={handleVoteSubmit}>
                    {vote?.map((item: any, index: number) => (
                      <Fieldset
                        key={index}
                        className={`!mb-3 !last:mb-0 ${
                          isClosed ? "pointer-events-none" : ""
                        }`}
                      >
                        <Radio
                          id={`proposal-voting-${index}`}
                          name={"proposal-voting"}
                          value={item.label}
                          disabled={false}
                          onChange={(e) => setVoting(e.target.value)}
                        >
                          {item.label}
                        </Radio>
                      </Fieldset>
                    ))}
                    {!isClosed && (
                      <>
                        <Input
                          type={"number"}
                          className="!mb-3 !last:mb-0"
                          id={"proposal-token"}
                          name={"proposal-token"}
                          variant={"secondary"}
                          showLabel={true}
                          required={true}
                          label={"Token"}
                          placeholder={"Amount of token you will commit"}
                          defaultValue={"0"}
                          onChange={(e) => setTokenAmount(e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="primary"
                          loading="none"
                          disabled={!isVoteAbleToUse}
                          onClick={handleOpenPopupVote}
                        >
                          Vote
                        </Button>
                      </>
                    )}
                    <Popup
                      show={showPopupVote}
                      backdropClose={true}
                      handleClose={handleClosePopupVote}
                    >
                      <PopupHeader
                        variant={"primary"}
                        icon={"/icon/alert-circle.svg"}
                      />
                      <PopupBody>
                        <h3 className="text-xl font-semibold mb-4">
                          Are you sure for your vote?
                        </h3>
                        <p>Make sure your choice is correct.</p>
                      </PopupBody>
                      <PopupFooter>
                        <Button
                          type="button"
                          variant="light"
                          loading="none"
                          className="md:w-fit"
                          onClick={handleClosePopupVote}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="primary"
                          className="md:w-fit"
                          loading={loading}
                        >
                          Submit Vote
                        </Button>
                      </PopupFooter>
                    </Popup>
                  </form>
                ) : (
                  <>
                    {vote && vote.length > 0 ? (
                      <>
                        {vote?.map((item: any, index: number) => (
                          <Fieldset key={index} className="!mb-3 !last:mb-0">
                            <Radio
                              id={`proposal-voting-${index}`}
                              disabled={false}
                              name={"proposal-voting"}
                              value={item.label}
                              onChange={(e) => setVoting(e.target.value)}
                            >
                              {item.label}
                            </Radio>
                          </Fieldset>
                        ))}
                      </>
                    ) : (
                      <p className="italic text-gray-300">Empty choices</p>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                <p className="text-center mb-7">
                  Sorry, you must to connect your wallet first to vote!
                </p>
                <Button
                  type="button"
                  variant="primary"
                  loading="none"
                  onClick={handleOpenPopupSignin}
                >
                  Connect Now
                </Button>
                <Popup
                  show={showPopupSignin}
                  backdropClose={true}
                  handleClose={handleClosePopupSignin}
                >
                  <PopupBody>
                    <Wallet
                      rdt={rdt}
                      path={pathname}
                      variant={"content-only"}
                    />
                    <Button
                      type="button"
                      variant="light"
                      loading="none"
                      className="w-full mt-6"
                      onClick={handleClosePopupSignin}
                    >
                      Cancel
                    </Button>
                  </PopupBody>
                </Popup>
              </>
            )}
          </Card>

          {status != "pending" && isNotCreate && (
            <Card className="mb-8">
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="primary"
                  loading={loading}
                  disabled={!isWithdrawAbleToUse}
                  className="shadow-main"
                  onClick={handleWithdraw}
                >
                  Withdraw
                </Button>
                <Tooltip
                  content={
                    !isClosed
                      ? typeof user_voted !== "undefined" && user_voted !== ""
                        ? `You can withdraw your token after proposal closed`
                        : `You have to vote first to be able to make a withdrawal`
                      : typeof user_voted !== "undefined" && user_voted !== ""
                      ? user_withdraw
                        ? `You have made a withdrawal`
                        : `You can withdraw your token right now`
                      : `You can't make a withdrawal because you didn't vote`
                  }
                  className="[&_.tooltip]:-translate-x-44 [&_.tooltip]:max-w-[27ch]"
                >
                  <Image
                    src="/icon/alert-circle.svg"
                    alt="user"
                    className="w-6 h-6 min-w-[1.5rem]"
                    width={24}
                    height={24}
                  />
                </Tooltip>
              </div>
            </Card>
          )}

          {status != "pending" &&
            voter &&
            voter.length > 0 &&
            (vote_hide?.toLocaleLowerCase() !== "true" ||
              role === RoleType.Admin) &&
            !isMobile && (
              <Card className="mb-8">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <h2 className="text-lg font-maven-pro font-semibold">
                    Voters
                  </h2>
                  <Button
                    type="button"
                    variant="light"
                    className="!w-fit pointer-events-none"
                  >
                    {formatNumber(voter.length)} voter{voter.length > 1 && "s"}
                  </Button>
                </div>
                <div className="max-h-[500px] max-md:overflow-auto md:overflow-hidden md:hover:overflow-auto scroll-bg-white -mb-4 -mx-6 px-6">
                  <table className="w-full">
                    <tbody>
                      {voter.map((item: any, index: number) => {
                        return (
                          <tr
                            key={index}
                            className="[&_td]:py-6 [&:not(:last-child)_td]:border-b [&_td]:border-gray-300"
                          >
                            {(item.avatar || item.user_address) && (
                              <td valign="top">
                                <div
                                  className="flex gap-2"
                                  title={item.user_address}
                                >
                                  {item.avatar && (
                                    <Image
                                      src={item.avatar}
                                      alt="user"
                                      className="w-6 h-6 min-w-[1.5rem] rounded-md object-cover inline-block"
                                      width={24}
                                      height={24}
                                      unoptimized
                                    />
                                  )}
                                  {item.user_address && (
                                    <span className="line-clamp-1 break-all">
                                      {item.user_address}
                                    </span>
                                  )}
                                </div>
                              </td>
                            )}
                            {item.selected && (
                              <td
                                valign="top"
                                className="w-2/5 font-semibold pl-6 pr-4"
                              >
                                {item.selected}
                              </td>
                            )}
                            {(item.amount || item.label) && (
                              <td valign="top" className="text-right">
                                {item.amount && (
                                  <span className="text-primary-600 font-medium mr-1">
                                    {formatNumber(item.amount)}
                                  </span>
                                )}
                                {item.label && (
                                  <span className="text-gray-400">
                                    {item.label}
                                  </span>
                                )}
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
        </div>

        <div className="md:col-span-5 xl:col-span-4 h-fit">
          {isNotCreate ? (
            <>
              {imagesData.length > 0 && (
                <Card className="mb-8 !bg-primary-400 !p-2 overflow-hidden">
                  {imagesData.length > 1 ? (
                    <div
                      className="rounded-md overflow-hidden max-w-[calc(100vw-4rem)] keen-slider"
                      ref={sliderRef}
                    >
                      {imagesData?.map((item: any, index: number) => (
                        <div key={index} className="keen-slider__slide">
                          <Image
                            src={item}
                            alt="photo"
                            className="w-full h-auto"
                            width={300}
                            height={300}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-md overflow-hidden max-w-[calc(100vw-4rem)]">
                      {imagesData?.map((item: any, index: number) => (
                        <Image
                          key={index}
                          src={item}
                          alt="photo"
                          className="w-full h-auto"
                          width={300}
                          height={300}
                        />
                      ))}
                    </div>
                  )}
                </Card>
              )}
            </>
          ) : (
            <>
              {photos.length > 0 && (
                <Card className="mb-8 !bg-primary-400 !p-2 overflow-hidden">
                  {photos.length > 1 ? (
                    <div
                      className="rounded-md overflow-hidden max-w-[calc(100vw-4rem)] keen-slider"
                      ref={sliderRef}
                    >
                      {photos?.map((item: any, index: number) => (
                        <div key={index} className="keen-slider__slide">
                          <Image
                            src={
                              typeof item === "string"
                                ? item
                                : URL.createObjectURL(item)
                            }
                            alt="photo"
                            className="w-full h-auto"
                            width={300}
                            height={300}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-md overflow-hidden max-w-[calc(100vw-4rem)]">
                      {photos?.map((item: any, index: number) => (
                        <Image
                          key={index}
                          src={
                            typeof item === "string"
                              ? item
                              : URL.createObjectURL(item)
                          }
                          alt="photo"
                          className="w-full h-auto"
                          width={300}
                          height={300}
                        />
                      ))}
                    </div>
                  )}
                </Card>
              )}
            </>
          )}

          <Card className="mb-8">
            <div className="border-b-2 border-dashed border-gray-300 pb-6 mt-2 mb-8">
              <h2 className="text-lg font-maven-pro font-semibold">
                Information
              </h2>
            </div>
            <ul className="mb-2">
              <li className="mb-5 last:mb-0">
                <div className="float-left mr-4">Voting system</div>
                <div className="font-semibold text-right">
                  Single Choice Voting
                </div>
              </li>
              {start && (
                <li className="mb-5 last:mb-0">
                  <div className="float-left mr-4">Start Epoch</div>
                  <div className="font-semibold text-right">{start}</div>
                </li>
              )}
              {end && (
                <li className="mb-5 last:mb-0">
                  <div className="float-left mr-4">End Epoch</div>
                  <div className="font-semibold text-right">{end}</div>
                </li>
              )}
            </ul>
          </Card>

          {status != "pending" && voter && (
            <Card className="mb-8">
              <div className="mb-6">
                <h2 className="text-lg font-maven-pro font-semibold">
                  {status?.toLocaleLowerCase() !== "done" ? "Current" : "Vote"}{" "}
                  Result
                </h2>
                {status?.toLocaleLowerCase() === "done" && (
                  <p className="text-gray-400 text-sm mt-3">
                    Vote result which was carried out, from {start} to {end}{" "}
                    {(vote_hide?.toLocaleLowerCase() !== "true" ||
                      role === RoleType.Admin) &&
                      `with the participation of ${totalVotes} user${
                        totalVotes > 1 && "s"
                      }`}
                  </p>
                )}
              </div>
              {(vote_hide?.toLocaleLowerCase() !== "true" ||
                role === RoleType.Admin) && (
                <div className="flex overflow-hidden rounded-lg h-7 bg-gray-100 mb-10">
                  {vote?.map((item: any, index: number) => {
                    let percentage: string =
                      totalVotes !== 0
                        ? ((item.amount / totalVotes) * 100).toFixed(2)
                        : "0";
                    return (
                      <div
                        key={index}
                        title={`${item.label} - ${percentage}%`}
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: colorArray[index],
                        }}
                      ></div>
                    );
                  })}
                </div>
              )}
              <ul className="mb-2">
                {vote?.map((item: any, index: number) => {
                  let percentage: string =
                    totalVotes !== 0
                      ? ((item.amount / totalVotes) * 100).toFixed(2)
                      : "0";
                  return (
                    <li
                      key={index}
                      className="flex gap-4 max-sm:flex-col mb-6 last:mb-0"
                    >
                      <div className="w-full">
                        <div
                          className="w-6 h-6 rounded-md inline-block mr-2 float-left"
                          style={{ backgroundColor: colorArray[index] }}
                        ></div>
                        <span>{item.label}</span>
                      </div>
                      <div className="w-fit sm:text-right sm:whitespace-nowrap leading-tight">
                        <p className="font-semibold text-lg">
                          {vote_hide?.toLocaleLowerCase() !== "true" ||
                          role === RoleType.Admin
                            ? `${percentage}%`
                            : `?`}
                        </p>
                        {(vote_hide?.toLocaleLowerCase() !== "true" ||
                          role === RoleType.Admin) && (
                          <>
                            <p className="text-sm text-gray-400">
                              {item.amount} voter{item.amount > 1 && "s"}
                            </p>
                            <p className="text-sm text-gray-400">
                              {item.token} token{item.token > 1 && "s"} used
                            </p>
                          </>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Card>
          )}

          {status != "pending" &&
            voter &&
            voter.length > 0 &&
            (vote_hide?.toLocaleLowerCase() !== "true" ||
              role === RoleType.Admin) &&
            isMobile && (
              <Card className="mb-8">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <h2 className="text-lg font-maven-pro font-semibold">
                    Voters
                  </h2>
                  <Button
                    type="button"
                    variant="light"
                    className="!w-fit pointer-events-none"
                  >
                    {formatNumber(voter.length)} voter{voter.length > 1 && "s"}
                  </Button>
                </div>
                <table className="w-full">
                  <tbody>
                    {voter.map((item: any, index: number) => {
                      return (
                        <tr
                          key={index}
                          className="[&_td]:py-6 [&:not(:last-child)_td]:border-b [&_td]:border-gray-300"
                        >
                          <td>
                            <div className="flex justify-between gap-4 mb-4">
                              <div
                                className="flex gap-2"
                                title={item.user_address}
                              >
                                {item.avatar && (
                                  <Image
                                    src={item.avatar}
                                    alt="user"
                                    className="w-6 h-6 min-w-[1.5rem] rounded-md object-cover inline-block"
                                    width={24}
                                    height={24}
                                    unoptimized
                                  />
                                )}
                                {item.user_address && (
                                  <span className="line-clamp-1 break-all">
                                    {truncateMiddle(item.user_address, 13)}
                                  </span>
                                )}
                              </div>
                              <div className="text-right">
                                {item.amount && (
                                  <span className="text-primary-600 font-medium mr-1">
                                    {formatNumber(item.amount)}
                                  </span>
                                )}
                                {item.label && (
                                  <span className="text-gray-400">
                                    {item.label}
                                  </span>
                                )}
                              </div>
                            </div>
                            {item.selected && (
                              <div className="font-semibold">
                                {item.selected}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Card>
            )}
        </div>

        {status === "pending" && role === "admin" && isNotCreate && (
          <Card className="md:col-span-12 mb-4">
            <form spellCheck="false" onSubmit={handleApprovalSubmit}>
              <h2 className="text-lg font-maven-pro font-semibold mb-4">
                Proposal Approval
              </h2>
              <Fieldset>
                <Checkbox
                  label={"Hide current result"}
                  id={"proposal-approval-result"}
                  name={"proposal-approval-result"}
                  revert={false}
                  className="text-sm text-gray-500 !mr-1.5 [&+input]:mb-0"
                  onChange={(e) => setApprovalResult(e.target.checked)}
                />
              </Fieldset>
              <div className="flex gap-4 flex-col sm:flex-row">
                <Fieldset className="!mb-0 w-full">
                  <Radio
                    id="proposal-approval-1"
                    name="proposal-approval"
                    value="reject"
                    className="text-center transition border-0 bg-error-50 text-error-500 lg:hover:!bg-error-500 lg:hover:!text-white peer-checked:!border-0 peer-checked:!ring-0 peer-checked:!bg-error-50 peer-checked:!text-error-500 peer-checked:lg:hover:!bg-error-500 peer-checked:lg:hover:!text-white"
                    onChange={(e) => setApprovalChoice(e.target.value)}
                    onClick={handleOpenPopupApproval}
                  >
                    Reject
                  </Radio>
                </Fieldset>
                <Fieldset className="!mb-0 w-full">
                  <Radio
                    id="proposal-approval-2"
                    name="proposal-approval"
                    value="approve"
                    className="text-center transition border-0 bg-success-500 text-white lg:hover:!bg-success-600 peer-checked:!border-0 peer-checked:!ring-0 peer-checked:!bg-success-500 peer-checked:!text-white peer-checked:lg:hover:!bg-success-600"
                    onChange={(e) => setApprovalChoice(e.target.value)}
                    onClick={handleOpenPopupApproval}
                  >
                    Approve
                  </Radio>
                </Fieldset>
              </div>
              <Popup
                show={showPopupApproval}
                backdropClose={true}
                handleClose={handleClosePopupApproval}
              >
                <PopupHeader
                  variant={"primary"}
                  icon={"/icon/alert-circle.svg"}
                />
                <PopupBody>
                  <h3 className="text-xl font-semibold mb-4">
                    Do you {approvalChoice?.toLowerCase()} this proposal?
                  </h3>
                  <p>Make sure your acceptance.</p>
                </PopupBody>
                <PopupFooter>
                  <Button
                    type="button"
                    variant="light"
                    loading="none"
                    className="md:w-fit"
                    onClick={handleClosePopupApproval}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="md:w-fit"
                    loading={loading}
                  >
                    Yes
                  </Button>
                </PopupFooter>
              </Popup>
            </form>
          </Card>
        )}
      </section>
    </>
  );
};
