'use client'

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAccount } from "@/app/auth/account";
import { MainTitle } from "@/app/components/main";
import { Card } from "@/app/components/card";
import { Fieldset, Select } from "@/app/components/form";
import { Tab, Tabs } from "@/app/components/tab";
import { ProposalList, ProposalProps } from "@/app/components/proposal";
import { Button } from "@/app/components/button";

export default function ProposalAdmin({ rdt }: any) {
  const { account } = useAccount({ rdt })

  const [currentOptionsActive, setCurrentOptionsActive] = useState('')
  const optionsActive: any = [
    {
      value: 'All',
      label: 'All'
    },
    {
      value: 'Pending',
      label: 'Pending'
    },
    {
      value: 'Active',
      label: 'Active'
    }
  ]
  const handleSelectActive = (value: string) => {
    setCurrentOptionsActive(value)
  }

  const [currentOptionsHistory, setCurrentOptionsHistory] = useState('')
  const optionsHistory: any = [
    {
      value: 'All',
      label: 'All'
    },
    {
      value: 'Rejected',
      label: 'Rejected'
    },
    {
      value: 'Closed',
      label: 'Closed'
    }
  ]
  const handleSelectHistory = (value: string) => {
    setCurrentOptionsHistory(value)
  }

  const [searchKeyword, setSearchKeyword] = useState('')
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    console.log(searchKeyword)
  }
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value)
  }

  const dataProposalActive: ProposalProps[] = [
    {
      id: '1',
      user: 'rdx1shb1412422216dba',
      avatar: '/user/user-1.png',
      title: 'Arcane Labyrinth',
      description: 'Laborum officia incididunt consequat veniam tempor ea officia minim id excepteur pariatur nisi dolor. Deserunt occaecat ullamco est consequat. Culpa consequat veniam ullamco veniam aute culpa laborum nostrud dolor mollit non elit veniam commodo.',
      end: 'Ended, 28 Nov 2023',
      status: 'Pending'
    },
    {
      id: '2',
      user: 'rdx1shb1412422216dbb',
      avatar: '/user/user-1.png',
      title: '[ARFC] Add fUSDC to Ethereum v3',
      description: 'Qui aliquip reprehenderit veniam sit eu nostrud ad ipsum laboris exercitation.Tempor nulla irure aute minim ea occaecat do magna velit voluptate occaecat minim duis.Elit ex minim exercitation labore et.',
      end: 'Ends in 2 Weeks - 24 Nov 2023',
      status: 'Active',
      vote: [
        {
          label: 'Yes',
          amount: 120,
          selected: true
        },
        {
          label: 'No',
          amount: 48
        }
      ]
    },
    {
      id: '3',
      user: 'rdx1shb1412422216dbc',
      avatar: '/user/user-1.png',
      title: 'Arcane Labyrinth',
      description: 'Laboris labore culpa duis in esse in reprehenderit excepteur sit ut labore dolore.Aliquip do duis occaecat voluptate.Ad qui ullamco sunt sunt pariatur est ullamco.Id incididunt et ipsum elit non veniam et laborum elit anim.',
      end: 'Ended, 28 Nov 2023',
      status: 'Pending'
    }
  ]

  const dataProposalHistory: ProposalProps[] = [
    {
      id: '1',
      user: 'rdx1shb1412422216dba',
      avatar: '/user/user-1.png',
      title: 'fUSDC to Ethereum v3',
      description: 'Laborum officia incididunt consequat veniam tempor ea officia minim id excepteur pariatur nisi dolor. Deserunt occaecat ullamco est consequat. Culpa consequat veniam ullamco veniam aute culpa laborum nostrud dolor mollit non elit veniam commodo.',
      end: 'Ended, 28 Nov 2023',
      status: 'Closed',
      vote: [
        {
          label: '1M vARC',
          amount: 120,
          selected: true
        },
        {
          label: '20K sARB',
          amount: 48
        }
      ]
    },
    {
      id: '2',
      user: 'rdx1shb1412422216dbb',
      avatar: '/user/user-1.png',
      title: '[ARFC] Add fUSDC to Ethereum v3',
      description: 'Qui aliquip reprehenderit veniam sit eu nostrud ad ipsum laboris exercitation.Tempor nulla irure aute minim ea occaecat do magna velit voluptate occaecat minim duis.Elit ex minim exercitation labore et.',
      end: 'Ended, 28 Nov 2023',
      status: 'Rejected'
    },
    {
      id: '3',
      user: 'rdx1shb1412422216dbc',
      avatar: '/user/user-1.png',
      title: 'Arcane Labyrinth',
      description: 'Laboris labore culpa duis in esse in reprehenderit excepteur sit ut labore dolore.Aliquip do duis occaecat voluptate.Ad qui ullamco sunt sunt pariatur est ullamco.Id incididunt et ipsum elit non veniam et laborum elit anim.',
      end: 'Ended, 28 Nov 2023',
      status: 'Rejected'
    }
  ]

  return (
    <>
      {account && (
        <>
          <MainTitle
            title={`Proposal`}
            userName={account.address}
            userImage={`/user/user-1.png`}
            userStatus={`Core`}
          />

          <Card className="mb-4">
            <Tabs>
              <Tab label="Active">
                <div className="grid md:grid-cols-5 gap-4 items-center mb-6">
                  <Select label={"Status"} id={"filter-status"} name={"filter-status"} showLabel={false} className={"md:col-span-1"} valueUpdated={currentOptionsActive} options={optionsActive} onChange={(e) => handleSelectActive(e.target.value)} />
                  <div className="md:col-span-4 flex max-md:flex-col gap-4">
                    <form spellCheck="false" className="w-full" onSubmit={handleSearch}>
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
                        <input type="text" id="search-proposal" name="search-proposal" placeholder="Search Proposal" className="w-full appearance-none rounded-xl py-3 pr-4 pl-11 text-gray-500 bg-gray-100 border-2 border-transparent placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500 focus:outline-none focus-visible:outline-none disabled:bg-gray-100 disabled:cursor-default"  />
                      </Fieldset>
                    </form>
                    <Link href="/admin/proposal/create" className="md:w-fit md:whitespace-nowrap">
                      <Button type={"button"} variant="primary" loading="none">
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
                  </div>
                </div>
                <div className="grid gap-6 mb-2 lg:mb-1">
                  {dataProposalActive.map((item: any) => (
                    <Link key={item.id} href={'proposal/' + item.id}>
                      <ProposalList {...item} />
                    </Link>
                  ))}
                </div>
              </Tab>
              <Tab label="History">
                <div className="grid sm:grid-cols-8 md:grid-cols-5 gap-4 items-center mb-6">
                  <Select label={"Status"} id={"filter-status"} name={"filter-status"} showLabel={false} className={"sm:col-span-2 md:col-span-1"} valueUpdated={currentOptionsHistory} options={optionsHistory} onChange={(e) => handleSelectHistory(e.target.value)} />
                  <form spellCheck="false" className="sm:col-span-6 md:col-span-4" onSubmit={handleSearch}>
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
                  {dataProposalHistory.map((item: any) => (
                    <Link key={item.id} href={'proposal/' + item.id}>
                      <ProposalList {...item} />
                    </Link>
                  ))}
                </div>
              </Tab>
            </Tabs>
          </Card>
        </>
      )}
    </>
  )
}