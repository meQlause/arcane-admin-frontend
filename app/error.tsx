'use client'

import Image from "next/image";
import { useEffect } from "react";
import { Button } from "@/app/components/button";

export default function Error({error, reset}: {error: Error, reset: () => void}) {
  useEffect(() => {
    console.error(error)
  }, [error])
 
  return (
    <div className="w-screen h-screen min-h-[350px] flex items-center justify-center">
      <div className="text-center p-6 mb-8">
        <Image
          src="/icon/alert-circle.svg"
          alt="icon"
          className="filter-primary-600 mx-auto mb-3"
          width={100}
          height={100}
          priority
        />
        <h1 className="text-3xl xl:text-4xl font-semibold font-maven-pro text-primary-700 mb-4">Something went wrong!</h1>
        <p className="max-w-[30ch] mx-auto opacity-50">{`The page didn't load successfully, please try again.`}</p>
        <Button type={"button"} variant={"primary"} className="mt-6" onClick={reset}>Try again</Button>
      </div>
    </div>
  )
}