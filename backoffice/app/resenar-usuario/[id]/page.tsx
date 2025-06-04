"use client"

import type React from "react"

import { Layout } from "@/components/layout"
import { InputField } from "@/components/input-field"
import { Button } from "@/components/button"
import { StarRating } from "@/components/star-rating"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ResenarUsuarioPage() {
  const router = useRouter()
  const [rating, setRating] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para enviar la reseña
    router.push("/dashboard")
  }

  return (
    <Layout title="Reseña de usuario">
      <div className="max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <StarRating initialRating={rating} onChange={setRating} size="lg" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label="Descripción" name="descripcion" icon="text" required />

          <div className="pt-8 grid grid-cols-2 gap-4">
            <Button variant="danger" icon="x">
              Cancelar
            </Button>
            <Button variant="primary" icon="star" type="submit">
              Enviar
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
