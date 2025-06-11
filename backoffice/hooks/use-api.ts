"use client"

import { useState, useEffect } from "react"

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useApi<T>(apiCall: () => Promise<T>, dependencies: any[] = []): UseApiState<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }))
        const result = await apiCall()

        // Debug
        console.log("API result:", result)

        if (isMounted) {
          setState({ data: result, loading: false, error: null })
        }
      } catch (error) {
        console.error("API error:", error)
        if (isMounted) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error.message : "Error desconocido",
          })
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, dependencies)

  return state
}

export function useApiMutation<T, P = any>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const mutate = async (apiCall: (params: P) => Promise<T>, params: P) => {
    try {
      setState({ data: null, loading: true, error: null })
      const result = await apiCall(params)
      setState({ data: result, loading: false, error: null })
      return result
    } catch (error) {
      console.error("Mutation error:", error)
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      setState({ data: null, loading: false, error: errorMessage })
      throw error
    }
  }

  return { ...state, mutate }
}
