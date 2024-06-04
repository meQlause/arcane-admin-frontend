import React, { ReactNode, FC } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export const Card: FC<CardProps> = ({ children, className, id, ...props }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-main px-6 py-5 md:px-7 md:py-6 ${
        className || ""
      }`}
      id={id}
      {...props}
    >
      {children}
    </div>
  );
};

type CardOutlineProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  variant?: "default" | "primary" | "error" | "warning" | "info";
};

export const CardOutline: FC<CardOutlineProps> = ({
  children,
  className,
  id,
  variant = "default",
  ...props
}) => {
  let variantStyle = "border-gray-300";

  switch (variant) {
    case "primary":
      variantStyle = "border-primary-300";
      break;
    case "error":
      variantStyle = "border-error-300";
      break;
    case "warning":
      variantStyle = "border-warning-300";
      break;
    case "info":
      variantStyle = "border-info-300";
      break;
    default:
      break;
  }

  return (
    <div
      className={`border rounded-lg px-6 py-5 md:px-7 md:py-6 ${variantStyle} ${
        className || ""
      }`}
      id={id}
      {...props}
    >
      {children}
    </div>
  );
};
