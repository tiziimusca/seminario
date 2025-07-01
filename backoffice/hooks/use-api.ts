"use client"

import { useState, useEffect } from "react"

export interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiCall()
      setData(result)
    } catch (err) {
      console.error("API error:", err)
      setError(err instanceof Error ? err.message : "Error desconocido")
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, dependencies)

  return { data, loading, error, refetch: fetchData }
}


export function useApiMutation<T, P = any>() {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mutate = async (apiCall: (...args: any[]) => Promise<T>, ...params: any[]) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiCall(...params) // 👈 cambio clave
      setData(result)
      return result
    } catch (err) {
      console.error("Mutation error:", err)
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      setError(errorMessage)
      setData(null)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, mutate }
}

