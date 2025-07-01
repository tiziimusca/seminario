// components/PropuestasList.tsx
"use client"

import { UserCard } from "@/components/user-card"
import { Button } from "@/components/button"
import { useApi } from "@/hooks/use-api"
import { api, type User } from "@/lib/api"
import Link from "next/link"
import { useState, useEffect } from "react"

export  function PropuestasList() {
  const [users, setUsers] = useState<Record<number, User>>({})

  const { data: propuestas, loading, error } = useApi(() => api.propuestas.getAll())

  // Asegurarse de que propuestas sea siempre un array
  const propuestasArray = propuestas?.results ?? []

  // Cargar información de usuarios
useEffect(() => {
  if (propuestas) {
    const loadUsers = async () => {
      // Obtener solo los userId únicos
      const uniqueUserIds = Array.from(
        new Set(propuestas.results.map((propuesta) => propuesta.userId))
      );

      const userPromises = uniqueUserIds.map(async (userId) => {
        try {
          const user = await api.users.getById(userId);
          return { id: userId, user };
        } catch (error) {
          console.error(`Error loading user ${userId}:`, error);
          return null;
        }
      });

      const userResults = await Promise.all(userPromises);
      const usersMap: Record<number, User> = {};

      userResults.forEach((result) => {
        if (result) {
          usersMap[result.id] = result.user;
        }
      });

      setUsers(usersMap);
    };

    loadUsers();
  }
}, [propuestas]);

if (loading) return <div className="text-lg">Cargando propuestas...</div>
if (error) return <div className="text-red-600">Error al cargar las propuestas: {error}</div>

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {propuestas?.results?.map((propuesta) => {
          const user = users[propuesta.userId]
          console.log("USER DE PROPUESTA", user)


          if (propuesta.state === "pendiente" || propuesta.state === "ofertada") {
            return (
              <UserCard
                key={propuesta.id}
                name={user ? `${user.name} ${user.surname}` : "Cargando..."}
                image="https://th.bing.com/th/id/OIP.HBdW0soa6fQZVCR3DWGlqQHaG5?rs=1&pid=ImgDetMain"
                details={[
                  { label: "📘 Título", value: propuesta.title },
                  { label: "📚 Tema", value: propuesta.tema },
                  { label: "💰 Monto", value: `$${propuesta.initial_price}` },
                  { label: "⏱ Duración", value: propuesta.duration },
                  { label: "📅 Fecha límite", value: new Date(propuesta.date_available).toLocaleDateString() },
                  { label: "📝 Descripción", value: propuesta.description },
                ]}
                actions={
                  <Link href={`/oferta-clase/${propuesta.id}`} className="w-full">
                    <span className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm px-4 py-2 rounded-full font-medium transition">
                    Ofertar
                    </span>
                  </Link>
                }
              />
            )
          }
      })}

        {propuestas?.results?.length === 0 && (
          <div className="text-center text-gray-500 py-8">No hay clases publicadas disponibles</div>
        )}
      </div>
  )
}
