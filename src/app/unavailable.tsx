import Image from "next/image";
import Link from "next/link";
import { Button } from "@/app/components/button";

export default function Unavailable() {
  return (
    <div className="h-[calc(100vh-7rem)] lg:h-[calc(100vh-4rem)] min-h-[350px] flex items-center justify-center">
      <div className="text-center p-6 mb-8">
        <Image
          src="/not-found.svg"
          alt="icon"
          className="w-auto h-[200px] xl:h-[300px] object-contain mx-auto mb-2"
          width={960}
          height={350}
          priority
        />
        <h1 className="text-3xl xl:text-4xl font-semibold font-maven-pro text-primary-700 mb-4">Page not found</h1>
        <p className="max-w-[40ch] mx-auto opacity-50">{`Sorry, page that are you looking for doesn't exist. Please return home.`}</p>
        <Link href="/">
          <Button type={"button"} variant={"primary"} className="md:!w-fit mx-auto mt-6">Return home</Button>
        </Link>
      </div>
    </div>
  )
}