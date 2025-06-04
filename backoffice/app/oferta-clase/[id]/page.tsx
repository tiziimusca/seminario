"use client"

import type React from "react"

import { Layout } from "@/components/layout"
import { Button } from "@/components/button"
import { useRouter, useParams } from "next/navigation"
import { useState } from "react"
import { useApi, useApiMutation } from "@/hooks/use-api"
import { api } from "@/lib/api"

export default function OfertaClasePage() {
  const router = useRouter()
  const params = useParams()
  const propuestaId = Number.parseInt(params.id as string)

  const { data: propuesta, loading: loadingPropuesta } = useApi(() => api.propuestas.getById(propuestaId))

  const { mutate, loading, error } = useApiMutation()

  const [formData, setFormData] = useState({
    new_price: "",
    description: "",
    duration: "",
    date_available: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const durationInHours = Number.parseFloat(formData.duration)
      const isoDuration = `PT${durationInHours}H`

      const contraOfertaData = {
        propuestaId: propuestaId,
        userId: 1, // TODO: Obtener del contexto de autenticación
        new_price: formData.new_price,
        description: formData.description,
        duration: isoDuration,
        date_available: new Date(formData.date_available).toISOString(),
        state: "pendiente",
      }

      await mutate(api.contraOfertas.create, contraOfertaData)
      router.push("/mis-ofertas")
    } catch (error) {
      console.error("Error al enviar oferta:", error)
    }
  }

  if (loadingPropuesta) {
    return (
      <Layout title="Oferta de clase">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Cargando propuesta...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Oferta de clase">
      {propuesta && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
          <h3 className="font-medium mb-2">Propuesta original:</h3>
          <p>
            <strong>Tema:</strong> {propuesta.tema}
          </p>
          <p>
            <strong>Precio solicitado:</strong> ${propuesta.initial_price}
          </p>
          <p>
            <strong>Descripción:</strong> {propuesta.description}
          </p>
        </div>
      )}

      {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">Error: {error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Duración (horas)</label>
              <input
                type="number"
                step="0.5"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md h-24"
                required
              />
            </div>
          </div>

          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y hora</label>
              <input
                type="datetime-local"
                name="date_available"
                value={formData.date_available}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
              <input
                type="number"
                step="0.01"
                name="new_price"
                value={formData.new_price}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <Button variant="danger" icon="x" type="button" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button variant="primary" icon="check" type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Ofertar"}
          </Button>
        </div>
      </form>
    </Layout>
  )
}
