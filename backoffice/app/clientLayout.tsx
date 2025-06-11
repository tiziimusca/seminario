"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { useState, useEffect, createContext, useContext } from "react"

const inter = Inter({ subsets: ["latin"] })

// Definir el contexto de autenticación
interface AuthContextType {
  user: any | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<any>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("authToken")
          if (token) {
            const userData = { id: 1, name: "Usuario Demo", email: "demo@example.com" }
            setUser(userData)
          }
        }
      } catch (e) {
        console.error("Error loading user from storage:", e)
      } finally {
        setLoading(false)
      }
    }

    loadUserFromStorage()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      // Simular demora
      await new Promise((resolve) => setTimeout(resolve, 500))

      const userData = { id: 1, name: "Usuario Demo", email }

      if (typeof window !== "undefined") {
        localStorage.setItem("authToken", "demo-token")
        document.cookie = "authToken=demo-token; path=/; max-age=86400"
      }

      setUser(userData)
      return userData
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken")
      document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, error, login, logout }}>{children}</AuthContext.Provider>
}

// Exportar useAuth para que pueda ser usado por otros componentes
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
