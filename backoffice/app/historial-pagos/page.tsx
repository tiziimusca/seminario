"use client"

import { Layout } from "@/components/layout"
import { useApi } from "@/hooks/use-api"
import { api, type User, type Clase } from "@/lib/api"
import Image from "next/image"
import { useState, useEffect } from "react"

export default function HistorialPagosPage() {
  const [users, setUsers] = useState<Record<number, User>>({})
  const [clases, setClases] = useState<Record<number, Clase>>({})

  // TODO: Filtrar por pagadorId o beneficiarioId del usuario actual cuando se implemente autenticación
  const { data: pagos, loading, error } = useApi(() => api.pagos.getAll())

  // Cargar información de usuarios y clases
  useEffect(() => {
    if (pagos) {
      const loadData = async () => {
        // Cargar clases
        const clasePromises = pagos.map(async (pago) => {
          try {
            const clase = await api.clases.getById(pago.claseId)
            return { id: pago.claseId, clase }
          } catch (error) {
            console.error(`Error loading clase ${pago.claseId}:`, error)
            return null
          }
        })

        const claseResults = await Promise.all(clasePromises)
        const clasesMap: Record<number, Clase> = {}

        claseResults.forEach((result) => {
          if (result) {
            clasesMap[result.id] = result.clase
          }
        })

        setClases(clasesMap)

        // Cargar usuarios únicos
        const userIds = new Set<number>()
        pagos.forEach((pago) => {
          userIds.add(pago.pagadorId)
          userIds.add(pago.beneficiarioId)
        })

        const userPromises = Array.from(userIds).map(async (userId) => {
          try {
            const user = await api.users.getById(userId)
            return { id: userId, user }
          } catch (error) {
            console.error(`Error loading user ${userId}:`, error)
            return null
          }
        })

        const userResults = await Promise.all(userPromises)
        const usersMap: Record<number, User> = {}

        userResults.forEach((result) => {
          if (result) {
            usersMap[result.id] = result.user
          }
        })

        setUsers(usersMap)
      }

      loadData()
    }
  }, [pagos])

  if (loading) {
    return (
      <Layout title="Historial de pagos y cobros">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Cargando historial...</div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout title="Historial de pagos y cobros">
        <div className="text-center text-red-600">Error al cargar el historial: {error}</div>
      </Layout>
    )
  }

  return (
    <Layout title="Historial de pagos y cobros">
      <div className="space-y-4">
        {pagos?.map((pago) => {
          const pagador = users[pago.pagadorId]
          const beneficiario = users[pago.beneficiarioId]
          const clase = clases[pago.claseId]

          // TODO: Determinar si es pago o cobro basado en el usuario actual
          const esPago = true // Placeholder - cambiar cuando se implemente autenticación
          const otroUsuario = esPago ? beneficiario : pagador

          return (
            <div key={pago.id} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-3">
                    <Image
                      src="/placeholder.svg?height=50&width=50"
                      alt={otroUsuario ? `${otroUsuario.name} ${otroUsuario.surname}` : "Usuario"}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {otroUsuario ? `${otroUsuario.name} ${otroUsuario.surname}` : "Cargando..."}
                    </h3>
                    {clase && <p className="text-sm text-gray-600">Clase: {clase.tema}</p>}
                  </div>
                </div>
                <div className="text-sm font-medium">
                  <span className="text-green-500">({esPago ? "Pago" : "Cobro"}) Completado</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div>
                  <span className="font-medium">Monto:</span>
                  <p>${pago.price}</p>
                </div>
                <div>
                  <span className="font-medium">Fecha:</span>
                  <p>{clase ? new Date(clase.date).toLocaleString() : "-"}</p>
                </div>
              </div>
            </div>
          )
        })}

        {pagos?.length === 0 && (
          <div className="text-center text-gray-500 py-8">No hay transacciones en el historial</div>
        )}
      </div>
    </Layout>
  )
}
