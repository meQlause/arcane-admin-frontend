import Image from "next/image";
import Link from "next/link";
import { Button } from "@/app/components/button";
import { Card } from "@/app/components/card";

export default function UnderConstruction() {
  return (
    <Card className="my-4">
      <div className="grid md:grid-cols-2 md:gap-12 items-center px-4">
        <Image
          src="/under-construction.svg"
          alt="image"
          className="filter-primary-600"
          width={512}
          height={512}
          priority
        />
        <div className="font-maven-pro font-medium max-md:text-center">
          <h1 className="text-3xl text-primary-700 font-semibold mb-2">Sorry...</h1>
          <p>This page is under development.</p>
          <p>It will be available soon.</p>
          <hr className="mt-5 mb-6" />
          <Link href="/">
            <Button type={"button"} variant={"primary"} className={"md:!w-fit"}>Return home</Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}