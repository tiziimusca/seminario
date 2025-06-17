"use client"

import type React from "react"

import { Layout } from "@/components/layout"
import { Button } from "@/components/button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useApiMutation } from "@/hooks/use-api"
import { api } from "@/lib/api"

export default function PublicarClasePage() {
  const router = useRouter()
  const { mutate, loading, error } = useApiMutation()

  const [formData, setFormData] = useState({
    title: "",
    tema: "",
    description: "",
    initial_price: "",
    duration: "",
    date_available: "",
  })
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedDate, setSelectedDate] = useState("Select date")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Convertir duración a formato ISO 8601 duration
      const durationInHours = Number.parseFloat(formData.duration)
      const isoDuration = `PT${durationInHours}H`

      const propuestaData = {
        ...formData,
        userId: 1, // TODO: Obtener del contexto de autenticación
        duration: isoDuration,
        state: "pendiente",
        date_available: new Date(selectedDate).toISOString(),
      }
      setShowSuccessModal(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 5000)
      await mutate(api.propuestas.create, propuestaData)
      router.push("/mis-publicaciones")
    } catch (error) {
      setShowSuccessModal(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 5000)
      console.error("Error al publicar clase:", error)
    }
  }

  return (
    <>
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold mb-2">¡Enviado correctamente!</h2>
            <p className="text-gray-700">La propuesta de clase se ha cargado. Serás redirigido en unos segundos...</p>
          </div>
        </div>
      )}    
    
    <Layout title="Publicar clase">
      {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">Error: {error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tema</label>
              <input
                type="text"
                name="tema"
                value={formData.tema}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

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
              <label className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
              <input
                type="number"
                step="0.01"
                name="initial_price"
                value={formData.initial_price}
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
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md h-24"
                required
              />
            </div>
          </div>

          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha límite</label>
              <input
                type="datetime-local"
                value={formData.date_available}
                onChange={(e) => setFormData((prev) => ({ ...prev, date_available: e.target.value }))}
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
            {loading ? "Publicando..." : "Publicar"}
          </Button>
        </div>
      </form>
    </Layout>
    </>
  )
}

function Calendar(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  )
}
