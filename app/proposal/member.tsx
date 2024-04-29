"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
// import { RoleType } from "@/app/types";
import { useAccount } from "@/app/auth/account";
import { MainTitle } from "@/app/components/main";
import { Card } from "@/app/components/card";
import { Fieldset, Select } from "@/app/components/form";
import { ProposalList, ProposalProps } from "@/app/components/proposal";
import { Button } from "@/app/components/button";
import { Alert } from "@/app/components/alert";
import { formatDate } from "@/app/functions/datetime";
import { Pagination } from "@/app/components/pagination";
import { useRouter } from "next/navigation";

export default function ProposalMember({ rdt }: any) {
  const { account, access_token } = useAccount({ rdt });

  const [currentOptionsActive, setCurrentOptionsActive] = useState("All");
  const [voteList, setVotesList] = useState<ProposalProps[]>([]);
  const [totalVotes, setTotalVotes] = useState<number>(0);
  const router = useRouter();
  const optionsActive: any = [
    {
      value: "All",
      label: "All",
    },
    {
      value: "Pending",
      label: "Pending",
    },
    {
      value: "Active",
      label: "Active",
    },
  ];
  const handleSelectActive = (value: string) => {
    setCurrentOptionsActive(value);
  };

  const [searchKeyword, setSearchKeyword] = useState("");
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    console.log(searchKeyword);
  };
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const [dataVotes, setDataVotes] = useState<boolean>();

  const getTotalVotes = async (): Promise<Response> => {
    return await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_SERVER}/votes/counter/pending`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
  };

  const getVotes = async (page: number) => {
    let res = await getTotalVotes();
    if (res.status === 401) {
      if (rdt) {
        rdt.disconnect();
      }
      router.push("/about");
      localStorage.removeItem("arcane");
      return;
    }
    setTotalVotes(Number(await res.text()));
    return await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_SERVER}/votes/get-votes?page=${page}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    ).then((res) => res.json());

    // return [
    //   {
    //     "id": "5",
    //     "startDate": "2024-02-17T12:02:34.796Z",
    //     "endDate": "2024-02-17T12:02:34.796Z",
    //     "title": "test",
    //     "description": "test",
    //     "componentAddress": "component_tdx_2_1cznduwd6y9lr2a0dcm0yhdnclc9zc2esnz0ehvj7uwzdv873zvnc26",
    //     "voteTokenAmount": {
    //       "For": 0,
    //       "Againts": 0,
    //       "Abstain": 0
    //     },
    //     "voteAddressCount": {
    //       "For": 0,
    //       "Againts": 0,
    //       "Abstain": 0
    //     },
    //     "isPending": true,
    //     "address": {
    //       "id": 4,
    //       "address": "account_tdx_2_12yq620haqzlptj7tumgnyl8a9lwpg0z3cwtfyha754rtw2lggn033c",
    //       "role": "member",
    //       "vault_admin_address": null,
    //       "nft_id": null,
    //       "signUpAt": "2024-02-17T11:28:55.931Z"
    //     }
    //   }
    // ]
  };

  useEffect(() => {
    const fetchData = async () => {
      const currentPage: number = sessionStorage.getItem(
        "arcane-proposal-pagin"
      )
        ? Number(sessionStorage.getItem("arcane-proposal-pagin"))
        : 1;
      const data = await getVotes(currentPage);
      let res = await getTotalVotes();
      if (res.status === 401) {
        if (rdt) {
          rdt.disconnect();
        }
        router.push("/about");
        localStorage.removeItem("arcane");
        return;
      }
      const total = Number(await res.text());
      setTotalVotes(total);
      if (data && total > 0) {
        let dataProposal = data.map((item: any) => {
          return {
            id: item.id,
            user_address: item.address.address,
            avatar: "/user/user-1.png",
            title: item.title,
            description: item.description,
            end: item.endEpoch,
            status: item.status,
            vote: Object.entries(item.voteTokenAmount).map(
              ([label, amount]) => ({ label, amount })
            ),
          };
        });
        setVotesList(dataProposal);
        setDataVotes(true);
      } else {
        setVotesList([]);
        setDataVotes(false);
      }
    };
    fetchData();
  }, []);

  const handlePageChange = async (page: number) => {
    const data = await getVotes(page);
    let res = await getTotalVotes();
    if (res.status === 401) {
      if (rdt) {
        rdt.disconnect();
      }
      router.push("/about");
      localStorage.removeItem("arcane");
      return;
    }
    const total = Number(await res.text());
    setTotalVotes(total);
    if (data && total > 0) {
      let dataProposal: any = data.map((item: any) => {
        return {
          id: item.id,
          user_address: item.address.address,
          avatar: "/user/user-1.png",
          title: item.title,
          description: item.description,
          end: item.endEpoch,
          status: item.status,
          vote: Object.entries(item.voteTokenAmount).map(([label, amount]) => ({
            label,
            amount,
          })),
        };
      });
      setVotesList(dataProposal);
      setDataVotes(true);
    } else {
      setVotesList([]);
      setDataVotes(false);
    }
  };

  // const dataProposal: ProposalProps[] = [
  //   {
  //     id: '1',
  //     user_address: 'rdx1shb1412422216dba',
  //     avatar: '/user/user-1.png',
  //     title: 'Arcane Labyrinth',
  //     description: 'Laborum officia incididunt consequat veniam tempor ea officia minim id excepteur pariatur nisi dolor. Deserunt occaecat ullamco est consequat. Culpa consequat veniam ullamco veniam aute culpa laborum nostrud dolor mollit non elit veniam commodo.',
  //     end: 'Ended, 28 Nov 2023',
  //     status: 'Pending'
  //   },
  //   {
  //     id: '2',
  //     user_address: 'rdx1shb1412422216dbb',
  //     avatar: '/user/user-1.png',
  //     title: '[ARFC] Add fUSDC to Ethereum v3',
  //     description: 'Qui aliquip reprehenderit veniam sit eu nostrud ad ipsum laboris exercitation.Tempor nulla irure aute minim ea occaecat do magna velit voluptate occaecat minim duis.Elit ex minim exercitation labore et.',
  //     end: 'Ends in 2 Weeks - 24 Nov 2023',
  //     status: 'Active',
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
  //   },
  //   {
  //     id: '3',
  //     user_address: 'rdx1shb1412422216dbc',
  //     avatar: '/user/user-1.png',
  //     title: 'Arcane Labyrinth',
  //     description: 'Laboris labore culpa duis in esse in reprehenderit excepteur sit ut labore dolore.Aliquip do duis occaecat voluptate.Ad qui ullamco sunt sunt pariatur est ullamco.Id incididunt et ipsum elit non veniam et laborum elit anim.',
  //     end: 'Ended, 28 Nov 2023',
  //     status: 'Pending'
  //   }
  // ]

  return (
    <>
      <MainTitle
        title={`Proposal`}
        userName={account && account.address}
        userImage={account && account.avatar}
        userRole={account && account.role}
      >
        {sessionStorage.getItem("arcane-alert-status")?.toLocaleLowerCase() ===
          "success" && (
          <Alert
            variant="success"
            icon="/icon/check-circle.svg"
            duration={5}
            source="arcane-alert-message"
          />
        )}
        {sessionStorage.getItem("arcane-alert-status")?.toLocaleLowerCase() ===
          "error" && (
          <Alert
            variant="error"
            icon="/icon/alert-circle.svg"
            duration={5}
            source="arcane-alert-message"
          />
        )}
      </MainTitle>

      <Card className="mb-4">
        <div className="grid md:grid-cols-5 gap-4 items-center mb-6">
          <Select
            label={"Status"}
            id={"filter-status"}
            name={"filter-status"}
            showLabel={false}
            className={"md:col-span-1"}
            value={currentOptionsActive}
            options={optionsActive}
            onChange={(e) => handleSelectActive(e.target.value)}
          />
          <div className="md:col-span-4 flex max-md:flex-col gap-4">
            <form spellCheck="false" className="w-full" onSubmit={handleSearch}>
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
            {/* {(account && (account.role === RoleType.Admin || account.role === RoleType.Member)) && */}
            <Link
              href="/proposal/create"
              className="md:w-fit md:whitespace-nowrap"
            >
              <Button type="button" variant="primary" loading="none">
                Create New Proposal
                <Image
                  src="/icon/plus.svg"
                  alt="icon"
                  className="filter-white inline ml-1 -mt-px md:mr-4"
                  width={24}
                  height={24}
                  priority
                />
              </Button>
            </Link>
            {/* } */}
          </div>
        </div>
        <div className="grid gap-6 mb-2 lg:mb-1">
          {dataVotes ? (
            <>
              {voteList.map((item: any) => (
                <Link key={item.id} href={"proposal/" + item.id}>
                  <ProposalList {...item} />
                </Link>
              ))}
              <div className="flex justify-end">
                <Pagination
                  id={"proposal"}
                  total={Math.ceil(totalVotes / 10)}
                  current={
                    sessionStorage.getItem(`arcane-proposal-pagin`)
                      ? Number(sessionStorage.getItem(`arcane-proposal-pagin`))
                      : 1
                  }
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          ) : (
            <div className="bg-gray-50 text-gray-300 px-6 py-4 rounded-lg italic">
              No proposal here, please create new one.
            </div>
          )}
        </div>
      </Card>
    </>
  );
}
