"use client"

import { Layout } from "@/components/layout"
import { Button } from "@/components/button"
import { useApi, useApiMutation } from "@/hooks/use-api"
import { api, type User } from "@/lib/api"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function MisPublicacionesPage() {
  const [users, setUsers] = useState<Record<number, User>>({})
  const { mutate: cancelarPropuesta, loading: cancelando } = useApiMutation()
  const { mutate: eliminarPropuesta, loading: eliminando } = useApiMutation()

  // TODO: Filtrar por userId del usuario actual cuando se implemente autenticación
  const { data, loading, error, refetch } = useApi(() => api.propuestas.getAll())
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Asegurarse de que propuestas sea siempre un array
  console.log("Datos recibidos de la API:", data)
  const propuestas = Array.isArray(data) ? data : []

  // Debugging
  useEffect(() => {
    console.log("Datos recibidos de la API:", data)
  }, [data])

  // Cargar información de usuarios
  useEffect(() => {
    if (propuestas.length > 0) {
      const loadUsers = async () => {
        const userPromises = propuestas.map(async (propuesta) => {
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

      loadUsers()
    }
  }, [propuestas])

  const handleCancelar = async (propuestaId: number) => {
    try {
      await cancelarPropuesta(api.propuestas.delete, propuestaId)
      setShowSuccessModal(true)

      // Después de mostrar el modal por un tiempo, recargar la página
      setTimeout(() => {
        setShowSuccessModal(false)
        window.location.reload()
      }, 2000) // 2 segundos de feedback visual
    } catch (error) {
      setShowSuccessModal(true)
      console.log("aca")
      // Después de mostrar el modal por un tiempo, recargar la página
      setTimeout(() => {
        setShowSuccessModal(false)
        window.location.reload()
      }, 2000) // 2 segundos de feedback visual
      console.error("Error al cancelar propuesta:", error)
    }
  }

  const handleEliminar = async (propuestaId: number) => {
    try {
      await eliminarPropuesta(api.propuestas.delete, propuestaId)
      refetch()
    } catch (error) {
      console.error("Error al eliminar propuesta:", error)
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "text-yellow-600"
      case "ofertada":
        return "text-blue-600"
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
      <Layout
        title="Ver clases publicadas por mí"
        rightContent={
          <Link href="/publicar-clase">
            <button className="bg-white text-black px-2 py-1 rounded text-sm">Publicar</button>
          </Link>
        }
      >
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Cargando publicaciones...</div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout
        title="Ver clases publicadas por mí"
        rightContent={
          <Link href="/publicar-clase">
            <button className="bg-white text-black px-2 py-1 rounded text-sm">Publicar</button>
          </Link>
        }
      >
        <div className="text-center text-red-600">Error al cargar las publicaciones: {error}</div>
      </Layout>
    )
  }
  {showSuccessModal && (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 text-center">
      <h2 className="text-lg font-semibold text-green-700">¡Propuesta cancelada correctamente!</h2>
    </div>
  </div>
  )}
  return (
    <Layout
      title="Ver clases publicadas por mí"
      rightContent={
        <Link href="/publicar-clase">
          <button className="bg-white text-black px-2 py-1 rounded text-sm">Publicar</button>
        </Link>
      }
    >
      <div className="space-y-4">
        {propuestas.filter(p => p.userId === 1).length > 0 ? (
          propuestas
            .filter(p => p.userId === 1)
            .map((propuesta) => {
            const user = users[propuesta.userId]

            return (
              <div key={propuesta.id} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      <Image
                        src="https://th.bing.com/th/id/OIP.HBdW0soa6fQZVCR3DWGlqQHaG5?rs=1&pid=ImgDetMain"
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
                  <div className={`text-sm font-medium ${getEstadoColor(propuesta.state)}`}>
                    {propuesta.state.charAt(0).toUpperCase() + propuesta.state.slice(1)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <div>
                    <span className="font-medium text-black">Tema:</span>
                    <p className="text-sm text-gray-600">{propuesta.tema}</p>
                  </div>
                  <div>
                    <span className="font-medium text-black">Monto:</span>
                    <p className="text-sm text-gray-600">${propuesta.initial_price}</p>
                  </div>
                  <div>
                    <span className="font-medium text-black">Duración:</span>
                    <p className="text-sm text-gray-600">{propuesta.duration}</p>
                  </div>
                  <div>
                    <span className="font-medium text-black">Fecha límite:</span>
                    <p className="text-sm text-gray-600">{new Date(propuesta.date_available).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="mb-3 text-sm">
                  <span className="font-medium text-black">Descripción:</span>
                  <p className="text-sm text-gray-600">{propuesta.description}</p>
                </div>

                <div className="flex space-x-2">
                  {propuesta.state === "pendiente" && (
                    <Button
                      variant="danger"
                      icon="x"
                      fullWidth={false}
                      className="flex-1"
                      onClick={() => handleCancelar(propuesta.id)}
                      disabled={cancelando}
                    >
                      {cancelando ? "Cancelando..." : "Cancelar"}
                    </Button>
                  )}

                  {(propuesta.state === "cancelado" || propuesta.state === "expirado") && (
                    <Button
                      variant="danger"
                      icon="trash"
                      fullWidth={false}
                      className="flex-1"
                      onClick={() => handleEliminar(propuesta.id)}
                      disabled={eliminando}
                    >
                      {eliminando ? "Eliminando..." : "Eliminar"}
                    </Button>
                  )}

                  {propuesta.state === "ofertada" && (
                    <Link href={`/ofertas-recibidas?propuesta=${propuesta.id}`} className="flex-1">
                      <Button variant="info" icon="eye" fullWidth className="w-full">
                        Ver Ofertas
                      </Button>
                    </Link>
                  )}

                  {propuesta.state === "pendiente" && (
                    <Link href={`/publicar-clase?edit=${propuesta.id}`} className="flex-1">
                      <Button variant="primary" icon="edit" fullWidth className="w-full">
                        Editar
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center text-gray-500 py-8">No tienes publicaciones</div>
        )}
      </div>
    </Layout>
  )
}
