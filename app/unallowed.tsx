import Image from "next/image";
import Link from "next/link";
import { Button } from "@/app/components/button";
import { Card } from "@/app/components/card";

export default function Unallowed() {
  return (
    <Card>
      <Image
        src="/icon/alert-circle.svg"
        alt="icon"
        className="filter-primary-500 mx-auto mb-4"
        width={44}
        height={44}
        priority
      />
      <p className="font-maven-pro font-medium text-center">Sorry, You are not permitted to access this page!</p>
      <hr className="mt-5 mb-6" />
      <Link href="/">
        <Button type={"button"} variant={"primary"} className={"w-fit mx-auto mt-6"}>Return home</Button>
      </Link>
    </Card>
  )
}