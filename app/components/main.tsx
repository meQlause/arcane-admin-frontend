import React, { ReactNode, FC, useEffect } from "react";
import Image from "next/image";
import { truncateMiddle } from '@/app/functions/truncate';
import { Sidebar } from "@/app/components/sidebar";
import { Badge } from "@/app/components/badge";

type MainProps = {
  children: ReactNode
  className?: string
}

export const Main: FC<MainProps> = ({ children, className }) => {
  useEffect(() => {
    const div = document.querySelector('main>div')
    if (div) {
      setTimeout(() => {
        div.classList.add('h-auto')
      },1000)
    }
  },[])

  return (
    <section className="lg:flex w-full max-w-8xl mx-auto">
      <Sidebar />
      <main className="w-full max-lg:min-h-[calc(100vh-70px-env(safe-area-inset-bottom))] lg:my-3 py-4 px-6 lg:px-12 overflow-hidden">
        <div className={className} style={{paddingBottom: 'env(safe-area-inset-bottom)'}}>
          {children}
        </div>
      </main>
    </section>
  )
}

type MainTitleProps = {
  title: string
  userName?: string
  userImage?: string
  userRole?: string
  children?: ReactNode
}

export const MainTitle: FC<MainTitleProps> = ({ title, userName, userImage, userRole, children }) => {
  return (
    <div className="relative flex items-center justify-between gap-4 mb-8 max-lg:mt-4">
      <h1 className="font-maven-pro font-semibold text-2xl">{title}</h1>
      <div className="max-md:hidden">
        {userImage && 
          <Image
            src={userImage}
            alt="user"
            className="w-10 h-10 rounded-full object-cover inline-block"
            width={24}
            height={24}
            unoptimized
          />
        }
        {userName && 
          <span className="inline-block ml-3" title={userName}>
            {truncateMiddle(`${userName}`, 13)}
          </span>
        }
        {userRole && 
          <Badge variant="primary" className="ml-3">
            {userRole}
          </Badge>
        }
      </div>
      {children}
    </div>
  )
}