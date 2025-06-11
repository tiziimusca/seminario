"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"

// Definir el contexto de autenticación
interface AuthContextType {
  user: any | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<any>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
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

      console.log("Iniciando sesión con:", email)

      // Simular demora
      await new Promise((resolve) => setTimeout(resolve, 500))

      const userData = { id: 1, name: "Usuario Demo", email }

      if (typeof window !== "undefined") {
        localStorage.setItem("authToken", "demo-token")
        document.cookie = "authToken=demo-token; path=/; max-age=86400"
      }

      setUser(userData)
      console.log("Usuario autenticado:", userData)
      return userData
    } catch (err: any) {
      console.error("Error en login:", err)
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

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
