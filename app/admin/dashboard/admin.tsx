'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAccount } from "@/app/auth/account";
import { MainTitle } from "@/app/components/main";
import { Card } from "@/app/components/card";
import { Fieldset, Select } from "@/app/components/form";
import { Alert } from "@/app/components/alert";
import Chart from "@/app/components/chart";
import { ProposalList, ProposalProps } from "@/app/components/proposal";

export default function DashboardAdmin({ rdt }: any) {
  const { account } = useAccount({ rdt })
  const [votesList, setVotesList] = useState<ProposalProps[]>([])
  const [currentOptionsYear, setCurrentOptionsYear] = useState('')
  const optionsYear: any = [
    {
      value: '2023',
      label: '2023'
    },
    {
      value: '2022',
      label: '2022'
    },
    {
      value: '2021',
      label: '2021'
    }
  ]
  const handleSelectYear = (value: string) => {
    setCurrentOptionsYear(value)
  }

  const [searchKeyword, setSearchKeyword] = useState('')
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    console.log(searchKeyword)
  }
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value)
  }

  const dataChart = [
    {
      name: 'Jan',
      total: 220,
    },
    {
      name: 'Feb',
      total: 309,
    },
    {
      name: 'Mar',
      total: 170,
    },
    {
      name: 'Apr',
      total: 303,
    },
    {
      name: 'May',
      total: 413,
    },
    {
      name: 'Jun',
      total: 407,
    },
    {
      name: 'Jul',
      total: 240,
    },
    {
      name: 'Aug',
      total: 174,
    },
    {
      name: 'Sep',
      total: 211,
    },
    {
      name: 'Oct',
      total: 466,
    },
    {
      name: 'Nov',
      total: 382,
    },
    {
      name: 'Dec',
      total: 459,
    },
  ]

  const getVotes = async () => {
    return await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_SERVER}/votes/get-votes`,
      {
        method: 'GET',
        headers: { 
          'content-type': 'application/json',
        },
      }
    ).then((res) => res.json());
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await getVotes();
      let dataProposal = data.map((item:any) => {
        return {
          id: item.id,
          user_address: item.address.address,
          avatar: '/user/user-1.png',
          title: item.title,
          description: item.description,
          end: `Ends on ${new Date(new Date(item.endDate).setDate(new Date(item.endDate).getDate() + 7)).toLocaleDateString()}`,
          status: item.isPending ? 'pending' : 'active',
          vote: Object.entries(item.vote_choice).map(([label, amount]) => ({ label, amount }))
        };
      })
      setVotesList(dataProposal);
    }
    fetchData();
  }, [])
  // const dataProposal: ProposalProps[] = [
  //   {
  //     id: '1',
  //     user_address: 'rdx1shb1412422216dba',
  //     title: 'Arcane Labyrinth',
  //     avatar: '/user/user-1.png',
  //     description: 'Laborum officia incididunt consequat veniam tempor ea officia minim id excepteur pariatur nisi dolor. Deserunt occaecat ullamco est consequat. Culpa consequat veniam ullamco veniam aute culpa laborum nostrud dolor mollit non elit veniam commodo.',
  //     end: 'Ended, 28 Nov 2023',
  //     status: 'Pending'
  //   },
  //   {
  //     id: '2',
  //     user_address: 'rdx1shb1412422216dbb',
  //     title: 'Arcane Labyrinth',
  //     avatar: '/user/user-1.png',
  //     description: 'Qui aliquip reprehenderit veniam sit eu nostrud ad ipsum laboris exercitation.Tempor nulla irure aute minim ea occaecat do magna velit voluptate occaecat minim duis.Elit ex minim exercitation labore et.',
  //     end: 'Ended, 28 Nov 2023',
  //     status: 'Pending'
  //   },
  //   {
  //     id: '3',
  //     user_address: 'rdx1shb1412422216dbc',
  //     title: 'Arcane Labyrinth',
  //     avatar: '/user/user-1.png',
  //     description: 'Laboris labore culpa duis in esse in reprehenderit excepteur sit ut labore dolore.Aliquip do duis occaecat voluptate.Ad qui ullamco sunt sunt pariatur est ullamco.Id incididunt et ipsum elit non veniam et laborum elit anim.',
  //     end: 'Ended, 28 Nov 2023',
  //     status: 'Pending'
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
            {sessionStorage.getItem('arcane-alert-status')?.toLocaleLowerCase() === 'success' &&
              <Alert variant="success" icon="/icon/check-circle.svg" duration={5} source="arcane-alert-message" />
            }
            {sessionStorage.getItem('arcane-alert-status')?.toLocaleLowerCase() === 'error' &&
              <Alert variant="error" icon="/icon/alert-circle.svg" duration={5} source="arcane-alert-message" />
            }
          </MainTitle>

          <div className="grid gap-6">
            <div className="grid md:grid-cols-[repeat(2,1fr)] xl:grid-cols-[repeat(3,1fr)] gap-6">
              <Card className="md:col-start-1 md:col-end-3 md:row-start-1 md:row-end-3 max-md:overflow-auto md:overflow-hidden md:hover:overflow-auto scroll-bg-white">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-maven-pro">
                    <div className="text-xl font-medium">240 Proposals</div>
                    <div>have been submitted</div>
                  </div>
                  <Select label={"Year"} id={"chart-year"} name={"chart-year"} showLabel={false} className={"!w-fit"} value={currentOptionsYear} options={optionsYear} onChange={(e) => handleSelectYear(e.target.value)} />
                </div>
                <div className="w-full h-full max-md:overflow-auto md:overflow-hidden md:hover:overflow-auto scroll-bg-white mb-2" style={{ maxHeight: '250px' }}>
                  <Chart data={dataChart} />
                </div>
              </Card>
              <Card>
                <div className="flex items-start gap-4">
                  <div className="bg-primary-100 rounded-full relative z-[1] inline-block p-2">
                    <Image
                      src="/icon/check-circle.svg"
                      alt="icon"
                      className="filter-primary-600 min-w-[24px]"
                      width={24}
                      height={24}
                      priority
                    />
                    <div className="bg-primary-100 rounded-full animate-ping absolute top-0 left-0 w-full h-full -z-[1]"></div>
                  </div>
                  <div className="font-medium mt-2.5">
                    Request Accepted
                  </div>
                </div>
                <div className="mt-6">
                  <span className="font-semibold text-2xl md:text-4xl mr-4">4</span>
                  <Image
                    src="/icon/arrow-up.svg"
                    alt="icon"
                    className="filter-success-500 min-w-[20px] inline -mt-1 mr-1"
                    width={20}
                    height={20}
                    priority
                  />
                  <span className="text-success-600 mr-2">50%</span>
                  <span className="text-gray-600 text-sm">vs last month</span>
                </div>
              </Card>
              <Card>
                <div className="flex items-start gap-4">
                  <div className="bg-primary-100 rounded-full relative z-[1] inline-block p-2">
                    <Image
                      src="/icon/alert-circle.svg"
                      alt="icon"
                      className="filter-primary-600 min-w-[24px]"
                      width={24}
                      height={24}
                      priority
                    />
                    <div className="bg-primary-100 rounded-full animate-ping absolute top-0 left-0 w-full h-full -z-[1]"></div>
                  </div>
                  <div className="font-medium mt-2.5">
                    Request Rejected
                  </div>
                </div>
                <div className="mt-6">
                  <span className="font-semibold text-2xl md:text-4xl mr-4">1</span>
                  <Image
                    src="/icon/arrow-down.svg"
                    alt="icon"
                    className="filter-error-500 min-w-[20px] inline -mt-1 mr-1"
                    width={20}
                    height={20}
                    priority
                  />
                  <span className="text-error-600 mr-2">80%</span>
                  <span className="text-gray-600 text-sm">vs last month</span>
                </div>
              </Card>
            </div>
            <Card className="mb-4">
              <div className="grid md:grid-cols-2 gap-4 items-center mb-6">
                <h2 className="font-maven-pro font-semibold text-lg">Need Review</h2>
                <form spellCheck="false" onSubmit={handleSearch}>
                  <Fieldset className="relative">
                    <label htmlFor="search-proposal" className="absolute top-0 bottom-0 left-0 my-auto mx-3 h-fit opacity-50">
                      <Image
                        src="/icon/search-md.svg"
                        alt="icon"
                        width={24}
                        height={24}
                        priority
                      />
                      <span className="sr-only">Search</span>
                    </label>
                    <input type="text" id="search-proposal" name="search-proposal" placeholder="Search Proposal" className="w-full appearance-none rounded-xl py-3 pr-4 pl-11 text-gray-500 bg-gray-100 border-2 border-transparent placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500 focus:outline-none focus-visible:outline-none disabled:bg-gray-100 disabled:cursor-default" onChange={handleSearchInput} />
                  </Fieldset>
                </form>
              </div>
              <div className="grid gap-6 mb-2 lg:mb-1">
                {votesList.map((item: any) => (
                  <Link key={item.id} href={'proposal/' + item.id}>
                    <ProposalList {...item} />
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
    </>
  )
}