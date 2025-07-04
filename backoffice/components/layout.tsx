import type React from "react"
import { Header } from "./header"

interface LayoutProps {
  children: React.ReactNode
  title?: string
  showBackButton?: boolean
  rightContent?: React.ReactNode
  noPadding?: boolean
}

export function Layout({ children, title, showBackButton = true, rightContent, noPadding }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#c5d6d8]">
      <Header showBackButton={showBackButton} rightContent={rightContent} />

      {/* Title bar if provided */}
      {title && (
        <div className="bg-[#b5c8ca] border border-[#a7b9bc] p-4 text-center">
          <h1 className="text-lg font-medium">{title}</h1>
        </div>
      )}

      {/* Main content */}
      <main className={noPadding ? "m-0 p-0" : "p-4 m-2"}>
        {children}
      </main>
    </div>
  )
}
