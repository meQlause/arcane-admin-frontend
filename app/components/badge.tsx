import React, { ReactNode, FC } from "react";

type BadgeProps = {
  children: ReactNode
  variant?: 'default' | 'primary' | 'error' | 'warning' | 'success' | 'info'
  className?: string
}

export const Badge: FC<BadgeProps> = ({ children, variant = 'default', className }) => {
  let variantStyle = "text-gray-800 bg-gray-200"

  switch (variant) {
    case "primary":
      variantStyle = "text-primary-800 bg-primary-200"
      break
    case "error":
      variantStyle = "text-error-800 bg-error-100"
      break
    case "warning":
      variantStyle = "text-warning-800 bg-warning-100"
      break
    case "success":
      variantStyle = "text-success-800 bg-success-100"
      break
    case "info":
      variantStyle = "text-info-800 bg-info-100"
      break
    default:
      break
  }

  return (
    <div className={`inline-block rounded-full px-4 py-2 ${variantStyle} ${className || ''}`}>
      {children}
    </div>
  )
}