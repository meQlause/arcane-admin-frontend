import React, { ReactNode, FC } from "react";
import Image from "next/image";

type ButtonProps = {
  type: 'submit' | 'reset' | 'button'
  disabled?: boolean
  loading?: boolean | 'none'
  className?: string
  variant?: 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'success' | 'info' | 'light'
  children: ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export const Button: FC<ButtonProps> = ({ type, disabled, loading, className, variant = 'default', children, onClick }) => {
  let variantStyle = "text-white bg-gray-700 lg:hover:bg-gray-800"

  switch (variant) {
    case "primary":
      variantStyle = "text-white bg-primary-600 lg:hover:bg-primary-700"
      break
    case "secondary":
      variantStyle = "text-primary-700 bg-primary-100 lg:hover:bg-primary-200/70"
      break
    case "error":
      variantStyle = "text-white bg-error-600 lg:hover:bg-error-700"
      break
    case "warning":
      variantStyle = "text-black bg-warning-400 lg:hover:bg-warning-500"
      break
    case "success":
      variantStyle = "text-white bg-success-600 lg:hover:bg-success-700"
      break
    case "info":
      variantStyle = "text-white bg-info-600 lg:hover:bg-info-700"
      break
    case "light":
      variantStyle = "text-gray-500 bg-white lg:hover:bg-gray-100 border border-gray-200"
      break
    default:
      break
  }

  return (
    <button type={type} disabled={disabled} className={`flex justify-center gap-3 w-full rounded-xl py-3 px-4 lg:px-6 font-medium focus-visible:outline-none lg:transition disabled:pointer-events-none [&.disabled]:pointer-events-none disabled:bg-gray-200 [&.disabled]:bg-gray-200 [&[disabled]_img]:filter-white [&.disabled_img]:filter-white ${variantStyle} ${className || ''}`} onClick={onClick}>
      <span>{children}</span>
      {loading !== 'none' &&
        <div className={`transition-all ${!loading ? '-mr-9 opacity-0' : ''}`}>
          <Image
            src={variant === "light" ? "/loading.svg" : "/loading-white.svg"}
            alt="loading"
            className="animate-spin"
            width={24}
            height={24}
            priority
          />
        </div>
      }
    </button>
  )
}