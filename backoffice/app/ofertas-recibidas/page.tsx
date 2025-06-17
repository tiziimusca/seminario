"use client"

import { Layout } from "@/components/layout"
import { Button } from "@/components/button"
import { useApi, useApiMutation } from "@/hooks/use-api"
import { api, type User } from "@/lib/api"
import Image from "next/image"
import { useState, useEffect } from "react"

export default function OfertasRecibidasPage() {
  const [users, setUsers] = useState<Record<number, User>>({})
  const { mutate: aceptarOferta, loading: aceptandoOferta } = useApiMutation()

  // TODO: Filtrar por propuestas del usuario actual cuando se implemente autenticación
  const { data, loading, error, refetch } = useApi(() => api.contraOfertas.getAll({ state: "pendiente" }))

  // Asegurarse de que contraOfertas sea siempre un array
  const contraOfertas = Array.isArray(data) ? data : []

  // Debugging
  useEffect(() => {
    console.log("Datos recibidos de contraOfertas API:", data)
  }, [data])

  // Cargar información de usuarios
  useEffect(() => {
    if (contraOfertas.length > 0) {
      const loadUsers = async () => {
        const userPromises = contraOfertas.map(async (contraOferta) => {
          try {
            const user = await api.users.getById(contraOferta.userId)
            return { id: contraOferta.userId, user }
          } catch (error) {
            console.error(`Error loading user ${contraOferta.userId}:`, error)
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

      loadUsers()
    }
  }, [contraOfertas])

  const handleAceptarOferta = async (contraOfertaId: number) => {
    try {
      await aceptarOferta(api.contraOfertas.aceptar, contraOfertaId)
      // Recargar la lista después de aceptar
      refetch()
    } catch (error) {
      console.error("Error al aceptar oferta:", error)
    }
  }

  if (loading) {
    return (
      <Layout title="Ver ofertas para clases publicadas">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Cargando ofertas...</div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout title="Ver ofertas para clases publicadas">
        <div className="text-center text-red-600">Error al cargar las ofertas: {error}</div>
      </Layout>
    )
  }

  return (
    <Layout title="Ver ofertas para clases publicadas">
      <div className="space-y-4">
        {contraOfertas.filter(c => c.userId !== 1).length > 0 ? (
        contraOfertas
          .filter(c => c.userId !== 1)
          .map((contraOferta) => {
            const user = users[contraOferta.userId]

            return (
              <div key={contraOferta.id} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-start mb-3">
                  <div className="flex-shrink-0 mr-3">
                    <Image
                      src="https://toppng.com/public/uploads/preview/ensando-especialmente-en-las-personas-con-movilidad-imagenes-de-personas-115628913400renbsc9lk.png"
                      alt={user ? `${user.name} ${user.surname}` : "Usuario"}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-black">{user ? `${user.name} ${user.surname}` : "Cargando..."}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Monto:</span>
                    <p className="font-medium text-gray-600">${contraOferta.new_price}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Duración:</span>
                    <p className="font-medium text-gray-600">{contraOferta.duration}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Fecha y hora:</span>
                    <p className="font-medium text-gray-600">{new Date(contraOferta.date_available).toLocaleString()}</p>
                  </div>
                </div>

                <div className="mb-3 text-sm">
                  <span className="font-medium text-gray-600">Descripción:</span>
                  <p className="font-medium text-gray-600">{contraOferta.description}</p>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="info"
                    fullWidth={false}
                    onClick={() => handleAceptarOferta(contraOferta.id)}
                    disabled={aceptandoOferta}
                  >
                    {aceptandoOferta ? "Aceptando..." : "Aceptar"}
                  </Button>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center text-gray-500 py-8">No hay ofertas pendientes</div>
        )}
      </div>
    </Layout>
  )
}
