"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAccount } from "@/app/auth/account";
import { useWallet } from "@/app/auth/wallet";
import { MainTitle } from "@/app/components/main";
import { Alert } from "@/app/components/alert";
import { Card } from "@/app/components/card";
import { Fieldset, Select } from "@/app/components/form";
import { ProposalList, ProposalProps } from "@/app/components/proposal";
import { Button } from "@/app/components/button";
import { truncateMiddle } from "@/app/functions/truncate";
import { formatNumber } from "@/app/functions/notation";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import config from "../config";
import { VaultResponse } from "@/app/types";
import {
  GatewayApiClient,
  ProgrammaticScryptoSborValueEnum,
  ProgrammaticScryptoSborValueEnumAllOf,
  ProgrammaticScryptoSborValueString,
  StateEntityDetailsVaultResponseItem,
} from "@radixdlt/babylon-gateway-api-sdk";

export default function DashboardMember({ rdt }: any) {
  const { account } = useAccount({ rdt });
  const { nft_id, access_token } = useWallet();
  const [currentOptionsProposal, setCurrentOptionsProposal] = useState("All");
  const [totalNFT, setTotalNFT] = useState<number>(0);
  const [totalProposal, setTotalProposal] = useState<number>(0);
  const [dataToken, setDataToken] = useState<any>([]);
  const [dataNFT, setDataNFT] = useState<any>([]);
  const [dataHistoryVote, setDataHistoryVote] = useState<any>([]);
  const [dataProposal, setDataProposal] = useState<ProposalProps[]>([]);
  const router = useRouter();
  const gatewayApi = GatewayApiClient.initialize(rdt.gatewayApi.clientConfig);

  const optionsProposal: any = [
    {
      value: "All",
      label: "All",
    },
    {
      value: "Active",
      label: "Active",
    },
    {
      value: "Review",
      label: "Review",
    },
    {
      value: "Rejected",
      label: "Rejected",
    },
    {
      value: "Closed",
      label: "Closed",
    },
  ];
  const handleSelectActive = (value: string) => {
    setCurrentOptionsProposal(value);
  };
  const [searchKeyword, setSearchKeyword] = useState("");
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(searchKeyword);
  };
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };
  const [sliderCurrent, setSliderCurrent] = useState(0);
  const [sliderLoaded, setSliderLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: false,
      mode: "free-snap",
      slides: {
        perView: 2,
        spacing: 15,
      },
      breakpoints: {
        "(min-width: 640px)": {
          slides: {
            perView: 4,
            spacing: 15,
          },
        },
        "(min-width: 1024px)": {
          slides: {
            perView: 3,
            spacing: 15,
          },
        },
        "(min-width: 1280px)": {
          slides: {
            perView: 5,
            spacing: 15,
          },
        },
        "(min-width: 1536px)": {
          slides: {
            perView: 4,
            spacing: 15,
          },
        },
      },
      initial: 0,
      slideChanged(slider) {
        setSliderCurrent(slider.track.details.rel);
      },
      created() {
        setSliderLoaded(true);
      },
    },
    []
  );
  const [maxSlidesToShow, setMaxSlidesToShow] = useState(2);
  useEffect(() => {
    const handleResize = () => {
      const screen = window.innerWidth;
      let max;
      if (screen >= 640 && screen < 1024) {
        max = 4;
      } else if (screen >= 1024 && screen < 1280) {
        max = 3;
      } else if (screen >= 1280 && screen < 1536) {
        max = 5;
      } else if (screen >= 1536) {
        max = 4;
      } else {
        max = 2;
      }
      setMaxSlidesToShow(max);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // const dataProposal: ProposalProps[] = [
  //   {
  //     id: '1',
  //     user_address: 'rdx1shb1412422216dba',
  //     title: 'Arcane Labyrinth',
  //     avatar: '/user/user-1.png',
  //     description: 'Incididunt ipsum dolore cupidatat irure laboris duis in amet sit reprehenderit occaecat deserunt proident. Velit ipsum laboris sunt adipisicing veniam non laboris sint ullamco incididunt. Amet exercitation enim officia dolor esse.',
  //     ComponentAddress: 'string',
  //     end: 'Ended, 28 Nov 2023',
  //     status: 'Active',
  //     vote: [
  //       {
  //         label: 'Yes',
  //         amount: 50
  //       },
  //       {
  //         label: 'No',
  //         amount: 30
  //       }
  //     ]
  //   },
  //   {
  //     id: '2',
  //     user_address: 'rdx1shb1412422216dbb',
  //     title: 'Arcane Labyrinth',
  //     avatar: '/user/user-1.png',
  //     description: 'Minim tempor anim ipsum aute. Non et labore do cupidatat. Dolore sunt non id Lorem voluptate ad incididunt aute. Non dolore elit est do magna pariatur adipisicing ea exercitation Lorem ullamco.',
  //     ComponentAddress: 'string',
  //     end: 'Ended, 28 Nov 2023',
  //     status: 'Review'
  //   },
  //   {
  //     id: '3',
  //     user_address: 'rdx1shb1412422216dbc',
  //     title: 'Arcane Labyrinth',
  //     avatar: '/user/user-1.png',
  //     description: 'Reprehenderit exercitation excepteur quis irure eiusmod nisi aute consectetur excepteur ea. Officia veniam reprehenderit laboris ex id consequat commodo cillum elit dolor proident amet dolor est. Esse veniam labore incididunt amet.',
  //     ComponentAddress: 'string',
  //     end: 'Ended, 28 Nov 2023',
  //     status: 'Rejected'
  //   },
  //   {
  //     id: '4',
  //     user_address: 'rdx1shb1412422216dbb',
  //     title: 'Arcane Labyrinth',
  //     avatar: '/user/user-1.png',
  //     description: 'Non esse elit irure cillum irure veniam ex deserunt in consequat mollit nulla non sit. Qui est in qui amet est magna nostrud non anim occaecat eu. Sunt culpa laborum proident labore sunt exercitation non sunt eiusmod pariatur irure sunt.',
  //     ComponentAddress: 'string',
  //     end: 'Ended, 28 Nov 2023',
  //     status: 'Closed',
  //     vote: [
  //       {
  //         label: 'Yes',
  //         amount: 120,
  //         selected: true
  //       },
  //       {
  //         label: 'No',
  //         amount: 48
  //       }
  //     ]
  //   }
  // ]

  // const dataNFT: any = [
  //   {
  //     title: 'NFT #1',
  //     src: '/upload/proposal-1.png'
  //   },
  //   {
  //     title: 'NFT #2',
  //     src: '/upload/proposal-1.png'
  //   },
  //   {
  //     title: 'NFT #3',
  //     src: '/upload/proposal-1.png'
  //   },
  //   {
  //     title: 'NFT #4',
  //     src: '/upload/proposal-1.png'
  //   },
  //   {
  //     title: 'NFT #5',
  //     src: '/upload/proposal-1.png'
  //   },
  //   {
  //     title: 'NFT #6',
  //     src: '/upload/proposal-1.png'
  //   }
  // ]

  useEffect(() => {
    const fetchEntityMetadata = async () => {
      let dataV: any = [];
      if (account?.address) {
        const responseVote = await fetch(
          `${
            config.apis?.NEXT_PUBLIC_BACKEND_API_SERVER
          }/proposal/get-proposal-list-by/${nft_id.slice(1, -1)}`,
          {
            method: "GET",
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
          }
        );

        if (responseVote.status === 401) {
          rdt.diconnect();
          router.push("/about");
          localStorage.removeItem("arcane");
          setTimeout(() => {
            sessionStorage.setItem("arcane-alert-status", "error"); // primary, error, warning, success, info
            sessionStorage.setItem(
              "arcane-alert-message",
              "Your session is over, please login again to create a proposal."
            );
          }, 1000);
          return;
        }

        let resV = await responseVote.json();

        setTotalProposal(resV.length);
        for (let x = 0; x < resV.length; x++) {
          dataV.push({
            id: resV[x].id,
            user_address: resV[x].address.address,
            avatar: "/user/user-1.png",
            title: resV[x].title,
            description: resV[x].description,
            end: resV[x].end_epoch,
            status: resV[x].status,
            vote: Object.entries(resV[x].vote_token_amount).map(
              ([label, amount]) => ({ label, amount })
            ),
          });
        }
        setDataProposal(dataV);

        const responseHistory = await fetch(
          `${
            config.apis?.NEXT_PUBLIC_BACKEND_API_SERVER
          }/proposal/get-voted-proposal-list/${nft_id.slice(1, -1)}`,
          {
            method: "GET",
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
          }
        );

        if (responseHistory.status === 401) {
          rdt.diconnect();
          router.push("/about");
          localStorage.removeItem("arcane");
          return;
        }

        let resH = await responseHistory.json();
        let dataH: any = [];
        for (let x = 0; x < resH.length; x++) {
          dataH.push({
            user_address: resH[x].voter,
            title: resH[x].title,
            amount: resH[x].amount,
            label: "ARC",
            vote: resH[x].proposal.id,
          });
        }
        setDataHistoryVote(dataH);

        const metadata: StateEntityDetailsVaultResponseItem =
          await gatewayApi.state.getEntityDetailsVaultAggregated(
            account?.address
          );
        let ft_data = metadata.fungible_resources.items;
        let nft_data = metadata.non_fungible_resources.items;
        let dataT: any = [];
        let dataN: any = [];
        setTotalNFT(metadata.non_fungible_resources.total_count!);
        for (let x = 0; x < ft_data.length; x++) {
          if (Number(ft_data[x].vaults.items[0].amount) === 0) continue;
          let ft_metadata = await gatewayApi.state.getEntityMetadata(
            ft_data[x].resource_address
          );
          console.log(ft_metadata);
          let label: any;
          let url: any;
          for (let i = 0; i < ft_metadata.items.length; i++) {
            if (ft_metadata.items[i].key === "symbol") {
              label = (
                ft_metadata.items[i].value
                  .programmatic_json as ProgrammaticScryptoSborValueString
              )?.value;
              console.log(label);
            }
            if (ft_metadata.items[i].key === "icon_url") {
              url = (
                ft_metadata.items[i].value
                  .programmatic_json as ProgrammaticScryptoSborValueString
              )?.value;
              console.log(url);
            }
          }
          dataT.push({
            label: label,
            url: url,
            amount: ft_data[x].vaults.items[0].amount,
            value: 0,
          });
        }

        for (let x = 0; x < nft_data.length; x++) {
          if (nft_data[x].vaults.items[0].total_count === 0) continue;
          let nft_metadata = await gatewayApi.state.getEntityMetadata(
            nft_data[x].resource_address
          );
          let title: any;
          let src: any;
          for (let i = 0; i < nft_metadata.items.length; i++) {
            if (nft_metadata.items[i].key === "name") {
              title = (
                nft_metadata.items[i].value
                  .programmatic_json as ProgrammaticScryptoSborValueString
              )?.value;
              console.log(title);
              console.log(nft_metadata.items[i].value.programmatic_json);
            }
            if (nft_metadata.items[i].key === "icon_url") {
              src = (
                nft_metadata.items[i].value
                  .programmatic_json as ProgrammaticScryptoSborValueString
              )?.value;
              console.log(src);
            }
          }
          dataN.push({
            title: title,
            src: src,
          });
        }

        setDataToken(dataT);
        setDataNFT(dataN);
      }
    };
    fetchEntityMetadata();
  }, [account?.address]);

  // let dataToken: any = [
  // {
  //   label: 'XRD',
  //   url: "https://i.ibb.co/2vtP4Kr/arcane.jpg",
  //   amount: 1200000,
  //   value: 120100
  // },
  // {
  //   label: 'ARC',
  //   url: "https://i.ibb.co/2vtP4Kr/arcane.jpg",
  //   amount: 830000,
  //   value: 83000
  // },
  // {
  //   label: 'XRD',
  //   url: "https://i.ibb.co/2vtP4Kr/arcane.jpg",
  //   amount: 2500,
  //   value: 250
  // },
  // {
  //   label: 'XRD',
  //   url: "https://i.ibb.co/2vtP4Kr/arcane.jpg",
  //   amount: 1000,
  //   value: 100
  // },
  // {
  //   label: 'ARC',
  //   url: "https://i.ibb.co/2vtP4Kr/arcane.jpg",
  //   amount: 500,
  //   value: 50
  // }
  // ]

  // const dataHistoryVote: any = [
  // {
  //     user_address: 'yzp2lmc2445678901abc',
  //     title: 'Save v3 MVP deploy',
  //     amount: 8300,
  //     label: 'vARC'
  //   },
  //   {
  //     user_address: 'abc4xyz3789012345lmn',
  //     title: 'Bug Bounties',
  //     amount: 4200,
  //     label: 'vARC'
  //   },
  //   {
  //     user_address: 'qwe3njk3154321876xyz',
  //     title: 'Gauntlet Recommended',
  //     amount: 1700,
  //     label: 'vARC'
  //   },
  //   {
  //     user_address: '1235ghi4321098765qwe',
  //     title: 'Chaos Lab',
  //     amount: 300,
  //     label: 'vARC'
  //   }
  // ]

  return (
    <>
      {account && (
        <>
          <MainTitle
            title={`Dashboard`}
            userName={account.address}
            userImage={account.avatar}
            userRole={account.role}
          >
            {sessionStorage
              .getItem("arcane-alert-status")
              ?.toLocaleLowerCase() === "success" && (
              <Alert
                variant="success"
                icon="/icon/check-circle.svg"
                duration={5}
                source="arcane-alert-message"
              />
            )}
            {sessionStorage
              .getItem("arcane-alert-status")
              ?.toLocaleLowerCase() === "error" && (
              <Alert
                variant="error"
                icon="/icon/alert-circle.svg"
                duration={5}
                source="arcane-alert-message"
              />
            )}
          </MainTitle>

          <div className="grid gap-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <div className="flex items-start gap-4">
                  <div className="bg-primary-100 rounded-full relative z-[1] inline-block p-2">
                    <Image
                      src="/icon/currency-dollar-circle.svg"
                      alt="icon"
                      className="filter-primary-600 min-w-[24px]"
                      width={24}
                      height={24}
                      priority
                    />
                    <div className="bg-primary-100 rounded-full animate-ping absolute top-0 left-0 w-full h-full -z-[1]"></div>
                  </div>
                  <div className="font-medium mt-2.5">Total Asset</div>
                </div>
                <div className="mt-6">
                  <div className="font-semibold text-2xl md:text-4xl mb-4">
                    {/* ${formatNumber(1400)} */} $ ~
                  </div>
                  {/* <Image
                    src="/icon/arrow-up.svg"
                    alt="icon"
                    className="filter-success-500 min-w-[20px] inline -mt-1 mr-1"
                    width={20}
                    height={20}
                    priority
                  />
                  <span className="text-success-600 mr-2">
                    {formatNumber(80)}%
                  </span>
                  <span className="text-gray-600 text-sm">vs last month</span> */}
                </div>
              </Card>
              <Card>
                <div className="flex items-start gap-4">
                  <div className="bg-primary-100 rounded-full relative z-[1] inline-block p-2">
                    <Image
                      src="/icon/file-02.svg"
                      alt="icon"
                      className="filter-primary-600 min-w-[24px]"
                      width={24}
                      height={24}
                      priority
                    />
                    <div className="bg-primary-100 rounded-full animate-ping absolute top-0 left-0 w-full h-full -z-[1]"></div>
                  </div>
                  <div className="font-medium mt-2.5">Total Proposal</div>
                </div>
                <div className="mt-6">
                  <div className="font-semibold text-2xl md:text-4xl mb-4">
                    {totalProposal ? totalProposal : 0}
                  </div>
                  {/* <Image
                    src="/icon/arrow-up.svg"
                    alt="icon"
                    className="filter-success-500 min-w-[20px] inline -mt-1 mr-1"
                    width={20}
                    height={20}
                    priority
                  />
                  <span className="text-success-600 mr-2">+7</span> 
                  <span className="text-gray-600 text-sm">vs last month</span> */}
                </div>
              </Card>
              <Card>
                <div className="flex items-start gap-4">
                  <div className="bg-primary-100 rounded-full relative z-[1] inline-block p-2">
                    <Image
                      src="/icon/face.svg"
                      alt="icon"
                      className="filter-primary-600 min-w-[24px]"
                      width={24}
                      height={24}
                      priority
                    />
                    <div className="bg-primary-100 rounded-full animate-ping absolute top-0 left-0 w-full h-full -z-[1]"></div>
                  </div>
                  <div className="font-medium mt-2.5">Total NFT</div>
                </div>
                <div className="mt-6">
                  <div className="font-semibold text-2xl md:text-4xl mb-4">
                    {totalNFT ? totalNFT : 0}
                  </div>
                  {/* <Image
                    src="/icon/arrow-down.svg"
                    alt="icon"
                    className="filter-error-500 min-w-[20px] inline -mt-1 mr-1"
                    width={20}
                    height={20}
                    priority
                  />
                  <span className="text-error-600 mr-2">-3</span>
                  <span className="text-gray-600 text-sm">vs last month</span> */}
                </div>
              </Card>
            </div>
            <div className="grid 2xl:grid-cols-6 gap-6">
              <div className="2xl:col-span-2 2xl:order-2 grid md:grid-cols-2 2xl:grid-cols-1 gap-6 h-fit">
                <Card>
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <h2 className="text-lg font-maven-pro font-semibold">
                      My Token
                    </h2>
                    {dataToken.length > 0 && (
                      <Button
                        type="button"
                        variant="light"
                        className="!px-3 !w-fit min-w-[100px] pointer-events-none"
                      >
                        {formatNumber(dataToken.length)} item
                        {dataToken.length > 1 && "s"}
                      </Button>
                    )}
                  </div>
                  {dataToken.length > 0 ? (
                    <div className="max-h-[500px] max-md:overflow-auto md:overflow-hidden md:hover:overflow-auto scroll-bg-white -mb-4 -mx-6 px-6">
                      <table className="w-full">
                        <tbody>
                          {dataToken.map((item: any, index: number) => {
                            return (
                              <tr
                                key={index}
                                className="[&_td]:py-6 [&:not(:last-child)_td]:border-b [&_td]:border-gray-300"
                              >
                                <td>
                                  <div className="flex justify-between gap-4">
                                    <div
                                      className="flex gap-2"
                                      title={item.title}
                                    >
                                      {/* <Image
                                        src={item.url ? item.url : '/icon/logo-arc.svg'}
                                        alt="icon"
                                        className="w-8 h-8 min-w-[2rem] rounded-md object-cover inline-block -my-1"
                                        width={24}
                                        height={24}
                                      /> */}
                                      <img
                                        width={24}
                                        height={24}
                                        className="w-8 h-8 min-w-[2rem] rounded-md object-cover inline-block -my-1"
                                        src={
                                          item.url
                                            ? item.url
                                            : "/upload/proposal-1.png"
                                        }
                                        alt="description"
                                      />
                                      {item.label && (
                                        <div className="font-bold line-clamp-1">
                                          {item.label}
                                        </div>
                                      )}
                                    </div>
                                    {item.amount && (
                                      <div className="text-right min-w-[70px] text-primary-600 font-medium">
                                        {formatNumber(item.amount)}
                                      </div>
                                    )}
                                    {item.value && (
                                      <div className="text-right min-w-[70px] text-success-500 font-medium">
                                        ${formatNumber(item.value)}
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-gray-50 text-gray-300 px-6 py-4 rounded-lg italic mt-4">
                      You have no one token yet
                    </div>
                  )}
                </Card>
                <Card>
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <h2 className="text-lg font-maven-pro font-semibold">
                      History Vote
                    </h2>
                    {dataHistoryVote.length > 0 && (
                      <Button
                        type="button"
                        variant="light"
                        className="!px-3 !w-fit min-w-[100px] pointer-events-none"
                      >
                        {formatNumber(dataHistoryVote.length)} vote
                        {dataHistoryVote.length > 1 && "s"}
                      </Button>
                    )}
                  </div>
                  {dataHistoryVote.length > 0 ? (
                    <div className="max-h-[500px] max-md:overflow-auto md:overflow-hidden md:hover:overflow-auto scroll-bg-white -mb-4 -mx-6 px-6">
                      <table className="w-full">
                        <tbody>
                          {dataHistoryVote.map((item: any, index: number) => {
                            return (
                              <tr
                                key={index}
                                className="[&_td]:py-6 [&:not(:last-child)_td]:border-b [&_td]:border-gray-300"
                              >
                                <td>
                                  <Link
                                    href={"proposal/" + item.vote}
                                    className="group"
                                  >
                                    <div className="flex justify-between gap-4 rounded-lg p-4 -m-4 transition md:group-hover:bg-gray-100">
                                      <div
                                        className="flex gap-2"
                                        title={item.title}
                                      >
                                        <Image
                                          src="/icon/cryptocurrency-02.svg"
                                          alt="icon"
                                          className="w-6 h-6 min-w-[1.5rem] rounded-md object-cover inline-block filter-primary-500"
                                          width={24}
                                          height={24}
                                        />
                                        {item.title && (
                                          <div>
                                            <div className="font-bold line-clamp-1">
                                              {item.title}
                                            </div>
                                            {item.user_address && (
                                              <span className="line-clamp-1 break-all text-sm text-gray-400">
                                                from{" "}
                                                {truncateMiddle(
                                                  item.user_address,
                                                  13
                                                )}
                                              </span>
                                            )}
                                          </div>
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
                                  </Link>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-gray-50 text-gray-300 px-6 py-4 rounded-lg italic mt-4">
                      You did not vote on any proposal
                    </div>
                  )}
                </Card>
              </div>
              <div className="2xl:col-span-4 2xl:order-1 grid gap-6 h-fit">
                <Card>
                  <div className="flex items-center justify-between">
                    <h2 className="font-maven-pro font-semibold text-lg">
                      My NFT Collection
                    </h2>
                    {sliderLoaded && instanceRef.current && (
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="light"
                          loading="none"
                          className="!w-fit !p-2 disabled:opacity-50"
                          onClick={(e: any) =>
                            e.stopPropagation() || instanceRef.current?.prev()
                          }
                          disabled={sliderCurrent === 0}
                        >
                          <Image
                            src="/icon/arrow-left.svg"
                            alt="icon"
                            className="min-w-[24px]"
                            width={24}
                            height={24}
                          />
                          <span className="sr-only">Back</span>
                        </Button>
                        <Button
                          type="button"
                          variant="light"
                          loading="none"
                          className="!w-fit !p-2 disabled:opacity-50"
                          onClick={(e: any) =>
                            e.stopPropagation() || instanceRef.current?.next()
                          }
                          disabled={
                            sliderCurrent ===
                            instanceRef.current.track.details.slides.length -
                              maxSlidesToShow
                          }
                        >
                          <Image
                            src="/icon/arrow-right.svg"
                            alt="icon"
                            className="min-w-[24px]"
                            width={24}
                            height={24}
                          />
                          <span className="sr-only">Next</span>
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="overflow-hidden max-w-[calc(100vw-119px)] lg:max-w-[calc(100vw-461px)] 2xl:max-w-[687px] mt-4">
                    {dataNFT?.length > 0 ? (
                      <div className="keen-slider" ref={sliderRef}>
                        {dataNFT?.map((item: any, index: number) => (
                          <div
                            key={index}
                            className="keen-slider__slide bg-primary-200 p-2 rounded-lg relative"
                            title={item.title}
                          >
                            {/* <Image
                              src={item.src ? item.src : '/upload/proposal-1.png'}
                              alt="photo"
                              className="w-full h-auto rounded-md object-cover aspect-[4/5]"
                              width={300}
                              height={300}
                            /> */}
                            <img
                              width={300}
                              height={300}
                              className="w-full h-auto rounded-md object-cover aspect-[4/5]"
                              src={
                                item.src ? item.src : "/upload/proposal-1.png"
                              }
                              alt="description"
                            />
                            {item.title && (
                              <div className="text-white bg-white/30 backdrop-blur-sm px-4 py-3 absolute bottom-2 left-2 right-2 rounded-b-md">
                                <div className="font-maven-pro font-medium line-clamp-1">
                                  {item.title}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-50 text-gray-300 px-6 py-4 rounded-lg italic">
                        You did not have any NFT
                      </div>
                    )}
                  </div>
                </Card>
                <Card>
                  <div className="grid md:grid-cols-2 gap-4 items-center mb-6">
                    <div className="flex items-center justify-between">
                      <h2 className="font-maven-pro font-semibold text-lg">
                        My Proposal
                      </h2>
                      <Select
                        label={"Status"}
                        id={"filter-status"}
                        name={"filter-status"}
                        showLabel={false}
                        className={"!w-fit"}
                        value={currentOptionsProposal}
                        options={optionsProposal}
                        onChange={(e) => handleSelectActive(e.target.value)}
                      />
                    </div>
                    <form
                      spellCheck="false"
                      onSubmit={handleSearch}
                      className="w-full"
                    >
                      <Fieldset className="relative">
                        <label
                          htmlFor="search-proposal"
                          className="absolute top-0 bottom-0 left-0 my-auto mx-3 h-fit opacity-50"
                        >
                          <Image
                            src="/icon/search-md.svg"
                            alt="icon"
                            width={24}
                            height={24}
                            priority
                          />
                          <span className="sr-only">Search</span>
                        </label>
                        <input
                          type="text"
                          id="search-proposal"
                          name="search-proposal"
                          placeholder="Search Proposal"
                          className="w-full appearance-none rounded-xl py-3 pr-4 pl-11 text-gray-500 bg-gray-100 border-2 border-transparent placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500 focus:outline-none focus-visible:outline-none disabled:bg-gray-100 disabled:cursor-default"
                          onChange={handleSearchInput}
                        />
                      </Fieldset>
                    </form>
                  </div>
                  <div className="grid gap-6 mb-2 lg:mb-1">
                    {dataProposal.length > 0 ? (
                      <>
                        {dataProposal.map((item: any) => (
                          <Link key={item.id} href={"proposal/" + item.id}>
                            <ProposalList {...item} />
                          </Link>
                        ))}
                      </>
                    ) : (
                      <div className="bg-gray-50 text-gray-300 px-6 py-4 rounded-lg italic">
                        You have never made a proposal
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
