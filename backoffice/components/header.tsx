"use client"

import type React from "react"

import Link from "next/link"
import { useAuth } from "@/app/providers"
import { ArrowLeft, User, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

interface HeaderProps {
  showBackButton?: boolean
  title?: string
  rightContent?: React.ReactNode
}

export function Header({ showBackButton = true, title, rightContent }: HeaderProps) {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <header className="bg-[#1e2a32] text-white p-4 flex items-center justify-between">
      <div className="flex items-center">
        {showBackButton && (
          <Link href="/" className="mr-4">
            <ArrowLeft size={20} />
          </Link>
        )}
        <h1 className="text-xl font-medium">MatchED</h1>
      </div>

      <div className="flex items-center">
        {user ? (
          <>
            <Link href="/perfil-propio" className="flex items-center mr-4 text-sm">
              <User size={16} className="mr-1" />
              {user.name}
            </Link>
            <button onClick={handleLogout} className="flex items-center text-sm">
              <LogOut size={16} className="mr-1" />
              Salir
            </button>
          </>
        ) : (
          <Link href="/login" className="text-sm">
            Iniciar sesión
          </Link>
        )}
        {rightContent}
      </div>
    </header>
  )
}
