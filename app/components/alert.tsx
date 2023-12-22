import React, { ReactNode, FC } from "react";
import Image from "next/image";

type AlertProps = {
  children: ReactNode
  className?: string
  variant?: 'default' | 'primary' | 'error' | 'warning' | 'success' | 'info'
  icon?: string
  active?: boolean
}

export const Alert: FC<AlertProps> = ({ children, className, variant = 'default', icon, active }) => {
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

  return (
    <div className={`px-5 py-3 rounded-xl shadow-main max-md:w-full absolute -top-1 right-0 transition [&:not(.active)]:translate-x-[100vw] ${variantStyle} ${className || ''} ${active && 'active'}`}>
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
      <span>{children}</span>
    </div>
  )
}