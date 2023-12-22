'use client'

import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatNumber } from "@/app/functions/notation";
import { truncateMiddle } from "@/app/functions/truncate";
import { Card, CardOutline } from "@/app/components/card";
import { Badge } from "@/app/components/badge";
import { Button } from "@/app/components/button";
import { Fieldset, Radio } from "@/app/components/form";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";

export type ProposalProps = {
  id: string
  user: string
  title: string
  description: string
  avatar: string
  start?: string
  end: string
  status?: string
  vote?: ProposalVoteProps[]
  className?: string
}

type ProposalVoteProps = {
  label: string
  amount?: number
  selected?: boolean
}

export const ProposalList: FC<ProposalProps> = ({ id, user, title, description, avatar, end, status, vote, className }) => {
  const totalVotes: any = vote?.reduce((total: number, item: any) => total + item.amount, 0)

  return (
    <CardOutline variant="primary" className={`ring-2 ring-transparent lg:hover:ring-primary-500 lg:transition ${className || ''}`} data-id={id}>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-3 font-maven-pro font-medium">
          <Image
            src={avatar}
            alt="user"
            className="w-8 h-8 rounded-xl object-cover"
            width={24}
            height={24}
          />
          <span>
            {user}
          </span>
        </div>
        <div className="flex items-center max-md:justify-between gap-4 text-sm text-gray-600 md:ml-auto">
          <span>{end}</span>
          <div className="w-px h-8 bg-gray-300 max-md:hidden"></div>
          <Badge variant={status?.toLowerCase() === 'active' ? 'success' : status?.toLowerCase() === 'pending' ? 'warning' : status?.toLowerCase() === 'rejected' ? 'error' : 'info'}>{status}</Badge>
        </div>
      </div>
      <div className="font-maven-pro font-semibold text-lg mb-3">{title}</div>
      <p className="text-gray-600">{description}</p>
      {vote && 
        <CardOutline variant="primary" className="flex flex-col gap-4 !rounded-xl !p-4 mt-4">
          {vote?.map((item: any, index: number) => {
            let percentage: string = totalVotes !== 0 ? ((item.amount / totalVotes) * 100).toFixed(2) : '0'
            return (
              <div key={index} className="relative overflow-hidden flex items-start justify-between rounded-lg bg-primary-50 text-primary-600">
                <div className="relative z-[1] w-fit px-5 py-3 max-sm:flex">
                  <span className="font-medium text-primary-800">{item.label}</span>
                </div>
                <div className="relative z-[1] whitespace-nowrap w-fit px-5 py-3 min-w-[100px] text-right">
                  {item.selected && 
                    <Image
                      src="/icon/check-circle.svg"
                      alt="icon"
                      className="filter-success-500 inline -mt-1 mr-2"
                      width={24}
                      height={24}
                    />
                  }
                  <span className="font-medium text-gray-900">{percentage}%</span>
                </div>
                <div className="absolute top-0 left-0 h-full rounded-r-lg bg-primary-200" style={{ width: `${percentage}%` }}></div>
              </div>
            )
          })}
        </CardOutline>
      }
    </CardOutline>
  )
}

const predefinedColors = [
  '#C9A0DC',
  '#F3B6C8',
  '#FFDAC1',
  '#C6E6D0',
  '#C7CEEA',
  '#AEDDFF',
  '#B5EAD7',
  '#E1E8C7',
  '#D4A5A5',
  '#FFD3B5'
]

export type ProposalDetailProps = ProposalProps & {
  voter?: ProposalVoterProps[]
  photos?: any
  handleBack?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

type ProposalVoterProps = {
  user: string
  avatar: string
  selected: string
  amount?: number
  label?: string
}

export const ProposalDetail: FC<ProposalDetailProps> = ({ id, user, title, description, avatar, start, end, status, vote, voter, photos, handleBack }) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  },[])

  const totalVotes: any = vote?.reduce((total: number, item: any) => total + item.amount, 0)
  const colorArray: any = vote?.map((_, index) => predefinedColors[index % predefinedColors.length])

  const [sliderRef, instanceRef] = useKeenSlider({
    'loop': true
  },[])

  const [voting, setVoting] = useState('')
  const [filled, setFilled] = useState(false)

  useEffect(() => {
    const isFormFilled = voting !== ''
    setFilled(isFormFilled)
  }, [voting])

  return (
    <>
      <Card className="!bg-primary-50 border border-primary-300 max-sm:px-3 max-sm:py-2 mt-2 mb-8 relative overflow-hidden" data-id={id}>
        <div className="relative z-[1] flex gap-4 md:gap-8 px-2 pt-3 pb-4">
          <div>
            <Button type="button" variant="light" loading="none" className="!w-fit !p-2" onClick={handleBack}>
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
                {avatar && 
                  <Image
                    src={avatar}
                    alt="user"
                    className="w-10 h-10 rounded-xl object-cover inline-block"
                    width={24}
                    height={24}
                    unoptimized
                  />
                }
                {user && 
                  <div className="max-sm:text-sm">
                    <strong>Governances</strong>
                    <div className="break-all line-clamp-1" title={user}>by {user}</div>
                  </div>
                }
              </div>
              <Badge variant="primary" className="max-md:text-sm max-md:px-3 max-md:py-1">Core</Badge>
            </div>
            {status && 
              <Badge variant={status?.toLowerCase() === 'active' ? 'success' : status?.toLowerCase() === 'pending' ? 'warning' : status?.toLowerCase() === 'rejected' ? 'error' : 'info'} className="max-md:hidden">{status}</Badge>
            }
          </div>
        </div>
        <div className="px-2 mt-2">
          <h1 className="text-primary-800 text-xl md:text-3xl font-semibold font-maven-pro mb-6 md:mb-3">{title}</h1>
          {status && 
            <Badge variant={status?.toLowerCase() === 'active' ? 'success' : status?.toLowerCase() === 'pending' ? 'warning' : status?.toLowerCase() === 'rejected' ? 'error' : 'info'} className="max-md:text-sm max-md:px-3 max-md:py-1 mb-3 md:hidden">{status}</Badge>
          }
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
            <div dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, '<br>') }} />
          </Card>
          <Card className="mb-8">
            <Link href="/admin/discussion">
              <Button type={"button"} variant="light" loading="none">
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
          </Card>
          <Card className="mb-8">
            <h2 className="text-lg fotn-maven-pro font-semibold text-center mb-6">Cast Your Vote</h2>
            {vote?.map((item: any, index: number) => (
              <Fieldset key={index} className="!mb-3 !last:mb-0">
                <Radio id={`proposal-voting-${index}`} name={"proposal-voting"} value={item.label} onChange={(e) => setVoting(e.target.value)}>
                  {item.label}
                </Radio>
              </Fieldset>
            ))}
            <Button type={"button"} variant="primary" disabled={!filled && true}>Vote</Button>
          </Card>
          {(voter && !isMobile) &&
            <Card className="mb-8">
              <div className="flex items-center justify-between gap-4 mb-2">
                <h2 className="text-lg fotn-maven-pro font-semibold">Voters</h2>
                <Button type="button" variant="light" className="!w-fit pointer-events-none">{voter.length} voter{voter.length > 1 && 's'}</Button>
              </div>
              <div className="max-h-[500px] overflow-auto scroll-auto-hide -mb-4 -mx-6 px-6">
                <table className="w-full">
                  <tbody>
                    {voter.map((item: any, index: number) => {
                      return (
                        <tr key={index} className="[&_td]:py-6 [&:not(:last-child)_td]:border-b [&_td]:border-gray-300">
                          {(item.avatar || item.user) &&
                            <td valign="top">
                              <div className="flex gap-2" title={item.user}>
                                {item.avatar &&
                                  <Image
                                    src={item.avatar}
                                    alt="user"
                                    className="w-6 h-6 min-w-[1.5rem] rounded-md object-cover inline-block"
                                    width={24}
                                    height={24}
                                    unoptimized
                                  />
                                }
                                {item.user && <span className="line-clamp-1 break-all">{item.user}</span>}
                              </div>
                            </td>
                          }
                          {item.selected && <td valign="top" className="w-2/5 font-semibold pl-6 pr-4">{item.selected}</td>}
                          {(item.amount || item.label) &&
                            <td valign="top" className="text-right">
                              {item.amount && <span className="text-primary-600 font-medium mr-1">{formatNumber(item.amount)}</span>}
                              {item.label && <span className="text-gray-400">{item.label}</span>}
                            </td>
                          }
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          }
        </div>
        <div className="md:col-span-5 xl:col-span-4 h-fit">
          {photos.length > 0 &&
            <Card className="mb-8 !bg-primary-400 !p-2 overflow-hidden">
              <div className="rounded-md overflow-hidden max-w-[calc(100vw-4rem)] keen-slider" ref={sliderRef}>
                {photos?.map((item: any, index: number) => (
                  <div key={index} className="keen-slider__slide">
                    <Image
                      src={typeof item === 'string' ? item : URL.createObjectURL(item)}
                      alt="photo"
                      className="w-full h-auto"
                      width={300}
                      height={300}
                    />
                  </div>
                ))}
              </div>
            </Card>
          }
          <Card className="mb-8">
            <div className="border-b-2 border-dashed border-gray-300 pb-6 mt-2 mb-8">
              <h2 className="text-lg fotn-maven-pro font-semibold">Information</h2>
            </div>
            <ul className="mb-2">
              <li className="mb-5 last:mb-0">
                <div className="float-left mr-4">Strategie(s)</div>
                <div className="font-semibold text-right flex justify-end gap-2">
                  Governance
                  {avatar &&
                    <Image
                      src={avatar}
                      alt="user"
                      className="w-6 h-6 rounded-md object-cover inline-block"
                      width={24}
                      height={24}
                    />
                  }
                </div>
              </li>
              <li className="mb-5 last:mb-0">
                <div className="float-left mr-4">IPFS</div>
                <div className="font-semibold text-right">#bafkrei</div>
              </li>
              <li className="mb-5 last:mb-0">
                <div className="float-left mr-4">Voting system</div>
                <div className="font-semibold text-right">Single Choice Voting</div>
              </li>
              {start &&
                <li className="mb-5 last:mb-0">
                  <div className="float-left mr-4">Start date</div>
                  <div className="font-semibold text-right">{start}</div>
                </li>
              }
              {end &&
                <li className="mb-5 last:mb-0">
                  <div className="float-left mr-4">End date</div>
                  <div className="font-semibold text-right">{end}</div>
                </li>
              }
            </ul>
          </Card>
          {voter &&
            <Card className="mb-8">
              <h2 className="text-lg fotn-maven-pro font-semibold mb-6">Current Result</h2>
              <div className="flex overflow-hidden rounded-lg h-7 bg-gray-100 mb-10">
                {vote?.map((item: any, index: number) => {
                  let percentage: string = totalVotes !== 0 ? ((item.amount / totalVotes) * 100).toFixed(2) : '0'
                  return (
                    <div key={index} title={`${item.label} - ${percentage}%`} style={{width: `${percentage}%`, backgroundColor: colorArray[index]}}></div>
                  )
                })}
              </div>
              <ul className="mb-2">
                {vote?.map((item: any, index: number) => {
                  let percentage: string = totalVotes !== 0 ? ((item.amount / totalVotes) * 100).toFixed(2) : '0'
                  return (
                    <li key={index} className="flex gap-4 max-sm:flex-col mb-6 last:mb-0">
                      <div className="w-full">
                        <div className="w-6 h-6 rounded-md inline-block mr-2 float-left" style={{backgroundColor: colorArray[index]}}></div>
                        <span>{item.label}</span>
                      </div>
                      <div className="w-fit sm:text-right sm:whitespace-nowrap leading-tight">
                        <p className="font-semibold text-lg">{percentage}%</p>
                        <p className="text-sm text-gray-400">{item.amount} voter{item.amount > 1 && 's'} - 3200</p>
                        <p className="text-sm text-gray-400">Token used</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </Card>
          }
          {(voter && isMobile) &&
            <Card className="mb-8">
              <div className="flex items-center justify-between gap-4 mb-2">
                <h2 className="text-lg fotn-maven-pro font-semibold">Voters</h2>
                <Button type="button" variant="light" className="!w-fit pointer-events-none">{voter.length} voter{voter.length > 1 && 's'}</Button>
              </div>
              <table className="w-full">
                <tbody>
                  {voter.map((item: any, index: number) => {
                    return (
                      <tr key={index} className="[&_td]:py-6 [&:not(:last-child)_td]:border-b [&_td]:border-gray-300">
                        <td>
                          <div className="flex justify-between gap-4 mb-4">
                            <div className="flex gap-2" title={item.user}>
                              {item.avatar &&
                                <Image
                                  src={item.avatar}
                                  alt="user"
                                  className="w-6 h-6 min-w-[1.5rem] rounded-md object-cover inline-block"
                                  width={24}
                                  height={24}
                                  unoptimized
                                />
                              }
                              {item.user && <span className="line-clamp-1 break-all">{truncateMiddle(item.user,13)}</span>}
                            </div>
                            <div className="text-right">
                              {item.amount && <span className="text-primary-600 font-medium mr-1">{formatNumber(item.amount)}</span>}
                              {item.label && <span className="text-gray-400">{item.label}</span>}
                            </div>
                          </div>
                          {item.selected && <div className="font-semibold">{item.selected}</div>}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </Card>
          }
        </div>
      </section>
    </>
  )
}