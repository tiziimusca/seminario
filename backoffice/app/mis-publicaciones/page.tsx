"use client"

import { Layout } from "@/components/layout"
import { Button } from "@/components/button"
import { useApi, useApiMutation } from "@/hooks/use-api"
import { api, PaginatedResponse, Propuesta, type User } from "@/lib/api"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { link } from "fs"

export default function MisPublicacionesPage() {
  const [users, setUsers] = useState<Record<number, User>>({})
  const { mutate: cancelarPropuesta, loading: cancelando } = useApiMutation()
  const { mutate: editarPropuesta, loading: editado } = useApiMutation()

  // TODO: Filtrar por userId del usuario actual cuando se implemente autenticación
  const { data, loading, error, refetch } = useApi<PaginatedResponse<Propuesta>>(() =>
  api.propuestas.getAll()
)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Asegurarse de que propuestas sea siempre un array
  const propuestas = data?.results ?? []
  
  // Debugging
  useEffect(() => {
    console.log("Datos recibidos de la API2:", data)
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

  const handleCancelar = async (propuestaId: Number) => {
    try {
      await cancelarPropuesta(api.propuestas.cancel, propuestaId)
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

const handleEditar = async (propuesta: Propuesta) => {
  try {
    const { id, ...dataSinId } = propuesta
    await editarPropuesta(api.propuestas.update, id, dataSinId) 
    refetch()
  } catch (error) {
    console.error("Error al editar propuesta:", error)
  }
}


const getEstadoColor = (estado: string) => {
  switch (estado) {
    case "pendiente":
      return "text-yellow-700 bg-yellow-100 border-yellow-400"
    case "ofertada":
      return "text-blue-700 bg-blue-100 border-blue-400"
    case "aceptada":
      return "text-green-700 bg-green-100 border-green-400"
    case "cancelado":
      return "text-red-700 bg-red-100 border-red-400"
    case "expirado":
      return "text-gray-700 bg-gray-100 border-gray-400"
    default:
      return "text-gray-600 bg-gray-100 border-gray-300"
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
    <Layout title="Ver clases publicadas por mí">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Mis publicaciones</h2>
          <div className="flex gap-3">
            <Link href="/publicar-clase">
              <Button variant="success" icon="plus">
                Publicar
              </Button>
            </Link>
            <Link href="/ofertas-recibidas">
              <Button variant="info" icon="eye">
                Ver Ofertas
              </Button>
            </Link>
          </div>
        </div>
      <div className="space-y-4">
        {propuestas.filter(p => p.userId === 1).length > 0 ? (
          propuestas
            .filter(p => p.userId === 1)
            .map((propuesta) => {
            const user = users[propuesta.userId]
            if (propuesta.state === "pendiente" || propuesta.state === "ofertada") {
              return (
                <div key={propuesta.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-md mb-6">
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
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${getEstadoColor(propuesta.state)} bg-opacity-20 border border-current`}>
                      {propuesta.state.charAt(0).toUpperCase() + propuesta.state.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <span className="font-medium text-black">📘 Título</span>
                      <p className="text-sm text-gray-600">{propuesta.title}</p>
                    </div>
                    <div>
                      <span className="font-medium text-black">📚 Tema</span>
                      <p className="text-sm text-gray-600">{propuesta.tema}</p>
                    </div>
                    <div>
                      <span className="font-medium text-black">💰 Monto</span>
                      <p className="text-sm text-gray-600">${propuesta.initial_price}</p>
                    </div>
                    <div>
                      <span className="font-medium text-black">⏱ Duración</span>
                      <p className="text-sm text-gray-600">{propuesta.duration}</p>
                    </div>
                    <div>
                      <span className="font-medium text-black">📅 Fecha límite</span>
                      <p className="text-sm text-gray-600">{new Date(propuesta.date_available).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="text-sm mb-4">
                    <span className="font-medium text-black">📝 Descripción</span>
                    <p className="text-sm text-gray-600">{propuesta.description}</p>
                  </div>


                  <div className="flex flex-wrap gap-2">
                    {propuesta.state === "pendiente" && (
                      <Button
                        variant="danger"
                        icon="x"
                        fullWidth={false}
                        className="flex-1"
                        onClick={() => handleCancelar(Number(propuesta.id))}
                        disabled={cancelando}
                      >
                        {cancelando ? "Cancelando..." : "Cancelar"}
                      </Button>
                    )}

                    {/* (propuesta.state === "cancelado" || propuesta.state === "expirado") && (
                      <Button variant="primary" icon="edit" fullWidth className="w-full"
                        onClick={() =>
                          handleEditar(Number(propuesta.id), {
                            title: propuesta.title,
                            tema: propuesta.tema,
                            duration: propuesta.duration,
                            initial_price: propuesta.initial_price,
                            description: propuesta.description,
                            date_available: propuesta.date_available,
                            state: "pendiente", // o el nuevo estado que querés poner
                            userId: propuesta.userId,
                          })
                        }
                        disabled={editado}
                      >
                        {editado ? "Editando..." : "Editar"}
                      </Button>
                    ) */}

                    {propuesta.state === "ofertada" && (
                      <Link href={`/ofertas-recibidas?propuesta=${propuesta.id}`} className="flex-1">
                        <Button variant="info" icon="eye" fullWidth className="w-full">
                          Ver Ofertas
                        </Button>
                      </Link>
                    )}

                    {propuesta.state === "pendiente" && (
                      <Link href={`/publicar-clase?edit=${propuesta.id}`} className="flex-1">
                        <Button variant="primary" icon="edit" fullWidth className="w-full"
                        onClick={() => handleCancelar(Number(propuesta.id))}>
                          Editar
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              )
            }
          })
        ) : (
          <div className="text-center text-gray-500 py-8">No tienes publicaciones</div>
        )}
      </div>
    </Layout>
  )
}
