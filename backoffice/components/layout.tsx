import type React from "react"
import { Header } from "./header"

interface LayoutProps {
  children: React.ReactNode
  title?: string
  showBackButton?: boolean
  rightContent?: React.ReactNode
}

export function Layout({ children, title, showBackButton = true, rightContent }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#c5d6d8]">
      <Header showBackButton={showBackButton} rightContent={rightContent} />

      {/* Title bar if provided */}
      {title && (
        <div className="bg-[#c5d6d8] border border-[#a7b9bc] p-4 text-center">
          <h2 className="text-lg font-medium">{title}</h2>
        </div>
      )}

      {/* Main content */}
      <main className="p-4">{children}</main>
    </div>
  )
}
