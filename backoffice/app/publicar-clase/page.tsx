"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Layout } from "@/components/layout"
import { Button } from "@/components/button"
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const durationInHours = Number.parseFloat(formData.duration)
      const isoDuration = `PT${durationInHours}H`

      const propuestaData = {
        ...formData,
        userId: 1, // Reemplazar por ID del usuario autenticado
        duration: isoDuration,
        state: "pendiente",
        date_available: new Date(formData.date_available).toISOString(),
      }

      await mutate(api.propuestas.create, propuestaData)
      setShowSuccessModal(true)

      setTimeout(() => {
        router.push("/mis-publicaciones")
      }, 4000)
    } catch (error) {
      console.error("Error al publicar clase:", error)
    }
  }

  return (
    <>
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h2 className="text-xl font-semibold mb-2 text-green-600">¡Clase publicada!</h2>
            <p className="text-gray-700">Serás redirigido en unos segundos...</p>
          </div>
        </div>
      )}

      <Layout title="Publicar clase">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            Error: {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Columna izquierda */}
            <div className="space-y-4">
              <InputField
                label="Título"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
              />

              <InputField
                label="Tema"
                name="tema"
                type="text"
                value={formData.tema}
                onChange={handleInputChange}
              />

              <InputField
                label="Duración (horas)"
                name="duration"
                type="number"
                step="0.5"
                value={formData.duration}
                onChange={handleInputChange}
              />

              <InputField
                label="Monto"
                name="initial_price"
                type="number"
                step="0.01"
                value={formData.initial_price}
                onChange={handleInputChange}
              />
            </div>

            {/* Columna derecha */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha límite</label>
                <input
                  type="datetime-local"
                  name="date_available"
                  value={formData.date_available}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md h-36 resize-none"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mt-10 max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button variant="danger" icon="x" type="button" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button variant="primary" icon="check" type="submit" disabled={loading}>
              {loading ? "Publicando..." : "Publicar clase"}
            </Button>
          </div>
        </form>
      </Layout>
    </>
  )
}

type InputFieldProps = {
  label: string
  name: string
  type: string
  step?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function InputField({ label, name, type, value, onChange, step }: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        name={name}
        type={type}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 rounded-md"
        required
      />
    </div>
  )
}

