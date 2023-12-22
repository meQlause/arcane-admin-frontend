import Image from 'next/image'

export default function Loading() {
  return (
    <div className="flex items-center justify-center w-full h-full loading">
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
