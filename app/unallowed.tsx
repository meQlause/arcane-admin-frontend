import Image from "next/image";
import Link from "next/link";
import { Button } from "@/app/components/button";
import { Card } from "@/app/components/card";

export default function Unallowed() {
  return (
    <Card className="my-4">
      <div className="flex max-md:flex-col md:gap-8 items-center p-4">
        <Image
          src="/restriction.svg"
          alt="image"
          className="filter-primary-600 mx-auto w-32 md:w-56 md:px-6 md:py-4 max-md:mb-6"
          width={72}
          height={72}
          priority
        />
        <div className="font-maven-pro font-medium max-md:text-center w-full">
          <h1 className="text-3xl text-primary-700 font-semibold mb-2">Sorry...</h1>
          <p>You are not permitted to access this page!</p>
          <hr className="mt-5 mb-6" />
          <Link href="/">
            <Button type={"button"} variant={"primary"} className={"md:!w-fit"}>Return home</Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}