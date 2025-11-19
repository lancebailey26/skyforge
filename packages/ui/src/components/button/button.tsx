import React, { CSSProperties } from "react"
import "./button.css"
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "warning"
  | "danger"
  | "success"
  | "ghost"

export type ButtonSize = "sm" | "md" | "lg"

export type ButtonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  className?: string,
  customStyles?: CSSProperties
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  customStyles,
  children,
  ...rest
}: ButtonProps) {
  const classes = [
    "ui-button",
    `ui-button--${variant}`,
    `ui-button--${size}`,
    fullWidth ? "ui-button--fullwidth" : "",
    className || ""
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <button className={classes} style={customStyles} {...rest}>
      {children}
    </button>
  )
}
