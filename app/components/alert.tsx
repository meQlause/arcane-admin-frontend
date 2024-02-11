import React, { ReactNode, FC, useEffect, useState } from "react";
import Image from "next/image";

type AlertProps = {
  children?: ReactNode
  className?: string
  variant?: 'default' | 'primary' | 'error' | 'warning' | 'success' | 'info'
  icon?: string
  active?: boolean
  duration?: number
  source?: string
  from?: string
}

export const Alert: FC<AlertProps> = ({ children, className, variant = 'default', icon, active, duration, source, from }) => {
  let variantStyle = "text-white bg-gray-800"
  let iconStyle = "filter-white"

  switch (variant) {
    case "primary":
      variantStyle = "text-primary-600 bg-primary-100"
      iconStyle = "filter-primary-500"
      break
    case "error":
      variantStyle = "text-error-600 bg-error-100"
      iconStyle = "filter-error-500"
      break
    case "warning":
      variantStyle = "text-warning-600 bg-warning-100"
      iconStyle = "filter-warning-500"
      break
    case "success":
      variantStyle = "text-success-600 bg-success-100"
      iconStyle = "filter-success-500"
      break
    case "info":
      variantStyle = "text-info-600 bg-info-100"
      iconStyle = "filter-info-500"
      break
    default:
      break
  }

  const [show, setShow] = useState('active')
  const [message, setMessage] = useState<any>()

  useEffect(() => {
    let status = 'arcane-alert-status'
    if (source) {
      if (duration && (!from || from === 'sessionStorage')) {
        setMessage(sessionStorage.getItem(source))
        setTimeout(() => {
          sessionStorage.removeItem(status)
          sessionStorage.removeItem(source)
        },duration * 1000)
      }
      if (duration && from === 'localStorage') {
        setMessage(localStorage.getItem(source))
        setTimeout(() => {
          localStorage.removeItem(status)
          localStorage.removeItem(source)
        },duration * 1000)
      }
    }
    if (duration) {
      setTimeout(() => setShow(''),duration * 1000)
    }
  },[])

  return (
    <div className={`px-5 py-3 rounded-xl shadow-main max-md:w-full absolute -top-1 right-0 transition [&:not(.active)]:translate-x-[100vw] ${variantStyle} ${className || ''} ${active ? show : ''} ${duration && show}`}>
      {icon && 
        <Image
          src={icon}
          alt="icon"
          className={`inline-block -mt-1 mr-1.5 -ml-1 ${iconStyle}`}
          width={24}
          height={24}
          priority
        />
      }
      <span>{children ? children : message}</span>
    </div>
  )
}