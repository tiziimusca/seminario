"use client"

import { Layout } from "@/components/layout"
import { UserCard } from "@/components/user-card"
import { Button } from "@/components/button"
import { useApi } from "@/hooks/use-api"
import { api, type User } from "@/lib/api"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function ClasesPublicadasPage() {
  const [users, setUsers] = useState<Record<number, User>>({})

  const { data: propuestas, loading, error } = useApi(() => api.propuestas.getAll({ state: "pendiente" }))

  // Cargar información de usuarios
  useEffect(() => {
    if (propuestas) {
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

  if (loading) {
    return (
      <Layout title="Ver clases publicadas">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Cargando clases...</div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout title="Ver clases publicadas">
        <div className="text-center text-red-600">Error al cargar las clases: {error}</div>
      </Layout>
    )
  }

  return (
    <Layout title="Ver clases publicadas">
      <div className="space-y-4">
        {propuestas?.map((propuesta) => {
          const user = users[propuesta.userId]

          return (
            <UserCard
              key={propuesta.id}
              name={user ? `${user.name} ${user.surname}` : "Cargando..."}
              image="/placeholder.svg?height=50&width=50"
              details={[
                { label: "Tema", value: propuesta.tema },
                { label: "Monto", value: `$${propuesta.initial_price}` },
                { label: "Duración", value: propuesta.duration },
                { label: "Fecha límite", value: new Date(propuesta.date_available).toLocaleDateString() },
                { label: "Descripción", value: propuesta.description },
              ]}
              actions={
                <Link href={`/oferta-clase/${propuesta.id}`} className="w-full">
                  <Button variant="info" fullWidth={false}>
                    Ofertar
                  </Button>
                </Link>
              }
            />
          )
        })}

        {propuestas?.length === 0 && (
          <div className="text-center text-gray-500 py-8">No hay clases publicadas disponibles</div>
        )}
      </div>
    </Layout>
  )
}
