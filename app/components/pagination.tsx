'use client'

import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/app/components/button";

type PaginationProps = {
  id: string
  total: number
  current: number
  className?: string
  onPageChange: (page: number) => void
}

export const Pagination: FC<PaginationProps> = ({ id, total, current, className, onPageChange }) => {
  const [optionSelected, setOptionSelected] = useState<string>()
  const handleSelect = (value: string) => {
    setOptionSelected(value)
    if ( current !== Number(value) ) {
      onPageChange(Number(value))
      sessionStorage.setItem(`arcane-${id}-pagin`,value)
    }
  }

  const handlePrev = () => {
    onPageChange(Number(current-1))
    handleSelect(String(current-1))
    sessionStorage.setItem(`arcane-${id}-pagin`,`${current-1}`)
  }

  const handleNext = () => {
    onPageChange(Number(current+1))
    handleSelect(String(current+1))
    sessionStorage.setItem(`arcane-${id}-pagin`,`${current+1}`)
  }

  const [prevDisabled, setPrevDisabled] = useState(false)
  const [nextDisabled, setNextDisabled] = useState(false)
  useEffect(() => {
    console.log(current)
    if (current > 1) {
      setPrevDisabled(false);
    }
    if ( current === 1 ) {
      setPrevDisabled(true)
      setNextDisabled(false)
    }
    if ( current == total ) {
      setNextDisabled(true)
    }
  },[current])

  return (
    <div className={`flex gap-2 ${className ? className : ''}`}>
      <fieldset>
        <label htmlFor={`${id}-pagin`} className={`sr-only`}>Pagination</label>
        <select id={`${id}-pagin`} value={optionSelected} onChange={(e) => handleSelect(e.target.value)} className={`w-full h-full appearance-none rounded-xl py-2.5 pl-5 pr-10 text-center bg-white border border-gray-200 placeholder-gray-300 focus:border-primary-500 focus:ring-primary-500 focus:outline-none focus-visible:outline-none disabled:bg-gray-100 disabled:cursor-default cursor-pointer`}>
          {[...Array(total)].map((_, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>
      </fieldset>
      <Button type="button" variant="light" loading="none" className="!w-fit !p-3" disabled={prevDisabled} onClick={handlePrev}>
        <Image
          src="/icon/arrow-left.svg"
          alt="icon"
          className="filter-primary-600 min-w-[24px]"
          width={24}
          height={24}
        />
        <span className="sr-only">Previous</span>
      </Button>
      <Button type="button" variant="light" loading="none" className="!w-fit !p-3" disabled={nextDisabled} onClick={handleNext}>
        <Image
          src="/icon/arrow-right.svg"
          alt="icon"
          className="filter-primary-600 min-w-[24px]"
          width={24}
          height={24}
        />
        <span className="sr-only">Next</span>
      </Button>
    </div>
  )
}