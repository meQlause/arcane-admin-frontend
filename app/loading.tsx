import Image from "next/image";

type LoadingProps = {
  className?: string
}

export default function Loading({ className }: LoadingProps) {
  return (
    <div className={`flex items-center justify-center w-full h-full loading ${className || ''}`}>
      <Image
        src="/loading.svg"
        alt="loading"
        className="animate-spin"
        width={32}
        height={32}
        priority
      />
    </div>
  )
}
