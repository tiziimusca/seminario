"use client"

import { Layout } from "@/components/layout"
import { Button } from "@/components/button"
import { useApi, useApiMutation } from "@/hooks/use-api"
import { api, type User, type Propuesta} from "@/lib/api"
import Image from "next/image"
import { useState, useEffect } from "react"
import { stat } from "fs"
import { ContraOferta } from "@/lib/api"

export default function MisOfertasPage() {
  const [users, setUsers] = useState<Record<number, User>>({})
  const [propuestas, setPropuestas] = useState<Record<number, Propuesta>>({})
  const { mutate: cancelarOferta, loading: cancelando } = useApiMutation()

  // TODO: Filtrar por userId del usuario actual cuando se implemente autenticación
  const { data, loading, error, refetch } = useApi(() => api.contraOfertas.getAll({state: "pendiente"}))

  // Asegurarse de que contraOfertas sea siempre un array
  const contraOfertas = data?.results ?? []

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
      await cancelarOferta(api.contraOfertas.cancel, contraOfertaId)
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
        {contraOfertas.filter(c => c.userId === 1).length > 0 ? (
        contraOfertas
          .filter(c => c.userId === 1)
          .map((contraOferta) => {
            const propuesta = propuestas[contraOferta.propuestaId]
            const user = propuesta ? users[propuesta.userId] : null

              return (
                <div key={contraOferta.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-md mb-6 w-[90%] mx-auto">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src="https://th.bing.com/th/id/OIP.HBdW0soa6fQZVCR3DWGlqQHaG5?rs=1&pid=ImgDetMain"
                        alt={user ? `${user.name} ${user.surname}` : "Usuario"}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                      <h3 className="text-lg font-semibold text-gray-900">{user ? `${user.name} ${user.surname}` : "Cargando..."}</h3>
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${getEstadoColor(contraOferta.state)} bg-opacity-20 border border-current`}>
                      {contraOferta.state.charAt(0).toUpperCase() + contraOferta.state.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="font-medium text-black">💰 Monto</span>
                      <p className="text-sm text-gray-600">${contraOferta.new_price}</p>
                    </div>
                    <div>
                      <span className="font-medium text-black">⏱ Duración</span>
                      <p className="text-sm text-gray-600">{contraOferta.duration}</p>
                    </div>
                    <div>
                      <span className="font-medium text-black">📅 Fecha límite</span>
                      <p className="text-sm text-gray-600">{new Date(contraOferta.date_available).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="text-sm mb-4">
                    <span className="font-medium text-black">📝 Descripción</span>
                    <p className="text-sm text-gray-600">{contraOferta.description}</p>
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
