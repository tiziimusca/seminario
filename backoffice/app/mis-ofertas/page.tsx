"use client"

import { Layout } from "@/components/layout"
import { Button } from "@/components/button"
import { useApi, useApiMutation } from "@/hooks/use-api"
import { api, type User, type Propuesta } from "@/lib/api"
import Image from "next/image"
import { useState, useEffect } from "react"

export default function MisOfertasPage() {
  const [users, setUsers] = useState<Record<number, User>>({})
  const [propuestas, setPropuestas] = useState<Record<number, Propuesta>>({})
  const { mutate: cancelarOferta, loading: cancelando } = useApiMutation()

  // TODO: Filtrar por userId del usuario actual cuando se implemente autenticación
  const { data, loading, error, refetch } = useApi(() => api.contraOfertas.getAll())

  // Asegurarse de que contraOfertas sea siempre un array
  const contraOfertas = Array.isArray(data) ? data : []

  // Debugging
  useEffect(() => {
    console.log("Datos recibidos de mis ofertas API:", data)
  }, [data])

  // Cargar información de usuarios y propuestas
  useEffect(() => {
    if (contraOfertas.length > 0) {
      const loadData = async () => {
        // Cargar propuestas
        const propuestaPromises = contraOfertas.map(async (contraOferta) => {
          try {
            const propuesta = await api.propuestas.getById(contraOferta.propuestaId)
            return { id: contraOferta.propuestaId, propuesta }
          } catch (error) {
            console.error(`Error loading propuesta ${contraOferta.propuestaId}:`, error)
            return null
          }
        })

        const propuestaResults = await Promise.all(propuestaPromises)
        const propuestasMap: Record<number, Propuesta> = {}

        propuestaResults.forEach((result) => {
          if (result) {
            propuestasMap[result.id] = result.propuesta
          }
        })

        setPropuestas(propuestasMap)

        // Cargar usuarios (propietarios de las propuestas)
        const userPromises = Object.values(propuestasMap).map(async (propuesta) => {
          try {
            const user = await api.users.getById(propuesta.userId)
            return { id: propuesta.userId, user }
          } catch (error) {
            console.error(`Error loading user ${propuesta.userId}:`, error)
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
  }, [contraOfertas])

  const handleCancelarOferta = async (contraOfertaId: number) => {
    try {
      await cancelarOferta(api.contraOfertas.cancelar, contraOfertaId)
      refetch()
    } catch (error) {
      console.error("Error al cancelar oferta:", error)
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "text-yellow-600"
      case "aceptada":
        return "text-green-600"
      case "cancelado":
        return "text-red-600"
      case "expirado":
        return "text-gray-600"
      default:
        return "text-gray-600"
    }
  }

  if (loading) {
    return (
      <Layout title="Ver mis ofertas enviadas">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Cargando ofertas...</div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout title="Ver mis ofertas enviadas">
        <div className="text-center text-red-600">Error al cargar las ofertas: {error}</div>
      </Layout>
    )
  }

  return (
    <Layout title="Ver mis ofertas enviadas">
      <div className="space-y-4">
        {contraOfertas.length > 0 ? (
          contraOfertas.map((contraOferta) => {
            const propuesta = propuestas[contraOferta.propuestaId]
            const user = propuesta ? users[propuesta.userId] : null

            return (
              <div key={contraOferta.id} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      <Image
                        src="/placeholder.svg?height=50&width=50"
                        alt={user ? `${user.name} ${user.surname}` : "Usuario"}
                        width={50}
                        height={50}
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{user ? `${user.name} ${user.surname}` : "Cargando..."}</h3>
                      {propuesta && <p className="text-sm text-gray-600">Propuesta: {propuesta.tema}</p>}
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${getEstadoColor(contraOferta.state)}`}>
                    {contraOferta.state.charAt(0).toUpperCase() + contraOferta.state.slice(1)}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
                  <div>
                    <span className="font-medium">Monto:</span>
                    <p>${contraOferta.new_price}</p>
                  </div>
                  <div>
                    <span className="font-medium">Duración:</span>
                    <p>{contraOferta.duration}</p>
                  </div>
                  <div>
                    <span className="font-medium">Fecha y hora:</span>
                    <p>{new Date(contraOferta.date_available).toLocaleString()}</p>
                  </div>
                </div>

                <div className="mb-3 text-sm">
                  <span className="font-medium">Descripción:</span>
                  <p>{contraOferta.description}</p>
                </div>

                {contraOferta.state === "pendiente" && (
                  <div>
                    <Button
                      variant="danger"
                      fullWidth={false}
                      onClick={() => handleCancelarOferta(contraOferta.id)}
                      disabled={cancelando}
                    >
                      {cancelando ? "Cancelando..." : "Cancelar Oferta"}
                    </Button>
                  </div>
                )}
              </div>
            )
          })
        ) : (
          <div className="text-center text-gray-500 py-8">No has enviado ofertas</div>
        )}
      </div>
    </Layout>
  )
}
