'use client'

import React, { ReactNode, FC, useEffect, useState } from "react";
import Image from "next/image";

type PopupProps = {
  children: ReactNode
  className?: string
  show: boolean
  backdropClose: boolean
  handleClose?: () => void
}

export const Popup: FC<PopupProps> = ({ children, className, show, backdropClose, handleClose }) => {
  const [active, setActive] = useState(false)

  useEffect(() => {
    if ( show ) {
      setTimeout(() => {
        setActive(true)
        document.documentElement.classList.add('overflow-hidden')
      },1)
    } else {
      setTimeout(() => {
        setActive(false)
        document.documentElement.classList.remove('overflow-hidden')
      },300)
    }
  }, [show])

  return (
    <div className={`fixed top-0 bottom-0 left-0 right-0 z-50 p-4 md:p-6 lg:p-10 overflow-auto opacity-0 transition-opacity duration-300 [&.active]:opacity-100 [&.active.hidden]:block [&.active.hidden]:opacity-0 ${active && 'active'} ${!show && 'hidden'} popup ${className ? className : ''}`}>
      <div className="flex items-center justify-center w-full">
        <div className="bg-white p-5 lg:p-8 rounded-2xl w-full md:max-w-[500px] z-10 relative popup-content">
          {children}
        </div>
        <div className={`fixed top-0 left-0 w-full h-full bg-black/70 ${!backdropClose && 'pointer-events-none'} popup-backdrop`} onClick={handleClose}></div>
      </div>
    </div>
  )
}

type PopupHeaderProps = {
  children?: ReactNode
  className?: string
  variant?: 'default' | 'primary' | 'error' | 'warning' | 'success' | 'info'
  icon?: string
}

export const PopupHeader: FC<PopupHeaderProps> = ({ children, className, variant, icon }) => {
  let variantStyle = "shadow-gray-200 bg-gray-400"

  switch (variant) {
    case "primary":
      variantStyle = "shadow-primary-200 bg-primary-400"
      break
    case "error":
      variantStyle = "shadow-error-200 bg-error-500"
      break
    case "warning":
      variantStyle = "shadow-warning-200 bg-warning-300"
      break
    case "success":
      variantStyle = "shadow-success-200 bg-success-400"
      break
    case "info":
      variantStyle = "shadow-info-200 bg-info-400"
      break
    default:
      break
  }

  return (
    <div className={`popup-header last:mb-0 ${children ? 'border-b-2 border-dashed border-gray-300 mb-6 lg:mb-8' : 'mb-2'} ${className ? className : ''}`}>
      <div className={`inline-block p-2.5 mb-3 rounded-2xl shadow-main ${variantStyle}`}>
        <Image
          src={`${icon}`}
          alt="icon"
          className="filter-white"
          width={36}
          height={36}
        />
      </div>
      {children && <h3 className="text-xl font-semibold mb-4">{children}</h3>}
    </div>
  )
}

type PopupContentProps = {
  children: ReactNode
  className?: string
}

export const PopupBody: FC<PopupContentProps> = ({ children, className }) => {
  return (
    <div className={`popup-body mb-6 lg:mb-8 last:mb-0 ${className ? className : ''}`}>
      {children}
    </div>
  )
}

export const PopupFooter: FC<PopupContentProps> = ({ children, className }) => {
  return (
    <div className={`popup-footer md:flex overflow-hidden mb-6 lg:mb-8 last:mb-0 ${className ? className : ''}`}>
      <div className="flex max-sm:flex-col sm:flex-wrap gap-4 md:ml-auto">
        {children}
      </div>
    </div>
  )
}