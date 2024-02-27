import React, { ReactNode, useState } from "react";

type TooltipProps = {
  children: ReactNode
  content: string
  className: string
}

export function Tooltip({children, content, className}: Readonly<TooltipProps>) {
  const [show, setShow] = useState(false)

  return (
    <div className={`relative inline-block text-gray-800 group ${className || ''}`} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show &&
        <>
          <div className="bg-gray-800 text-white text-center text-xs rounded-lg py-2 px-3 absolute z-10 bottom-[calc(100%+.4rem)] left-1/2 transform -translate-x-1/2 w-screen max-w-[30ch] tooltip">
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 255 255" className="absolute text-black h-2 w-full left-0 bottom-[calc(100%-.1rem)]" fill="currentColor">
            <polygon points="0,0 127.5,127.5 255,0"/>
          </svg>
        </>
      }
    </div>
  )
}