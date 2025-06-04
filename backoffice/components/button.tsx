"use client"

import type React from "react"

import { Check, X, Star, Send, Trash, Edit, Eye } from "lucide-react"

interface ButtonProps {
  children: React.ReactNode
  variant?: "primary" | "danger" | "info"
  icon?: "check" | "x" | "star" | "send" | "trash" | "edit" | "eye"
  onClick?: () => void
  type?: "button" | "submit" | "reset"
  className?: string
  fullWidth?: boolean
}

export function Button({
  children,
  variant = "primary",
  icon,
  onClick,
  type = "button",
  className = "",
  fullWidth = true,
}: ButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-[#0a5744] hover:bg-[#084535] text-white"
      case "danger":
        return "bg-[#ff3b30] hover:bg-[#e0352b] text-white"
      case "info":
        return "bg-[#007aff] hover:bg-[#0066d6] text-white"
      default:
        return "bg-gray-200 hover:bg-gray-300 text-gray-800"
    }
  }

  const getIcon = () => {
    switch (icon) {
      case "check":
        return <Check size={16} className="ml-1" />
      case "x":
        return <X size={16} className="ml-1" />
      case "star":
        return <Star size={16} className="ml-1" />
      case "send":
        return <Send size={16} className="ml-1" />
      case "trash":
        return <Trash size={16} className="ml-1" />
      case "edit":
        return <Edit size={16} className="ml-1" />
      case "eye":
        return <Eye size={16} className="ml-1" />
      default:
        return null
    }
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${getVariantClasses()} ${fullWidth ? "w-full" : ""} py-2 px-4 rounded-md flex items-center justify-center ${className}`}
    >
      {children}
      {icon && getIcon()}
    </button>
  )
}
