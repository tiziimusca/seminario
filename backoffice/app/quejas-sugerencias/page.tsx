"use client"

import type React from "react"

import { Layout } from "@/components/layout"
import { Button } from "@/components/button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useApiMutation } from "@/hooks/use-api"
import { api } from "@/lib/api"

export default function QuejasSugerenciasPage() {
  const router = useRouter()
  const { mutate, loading, error } = useApiMutation()

  const [formData, setFormData] = useState({
    asunto: "",
    descripcion: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const quejaData = {
        queja: `Asunto: ${formData.asunto}\nEmail: ${formData.email}\nDescripción: ${formData.descripcion}`,
      }
      setShowSuccessModal(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 5000)
      await mutate(api.quejas.create, quejaData)
      router.push("/dashboard")
    } catch (error) {
      console.error("Error al enviar queja:", error)
    }
  }

  return (
  <>
    {showSuccessModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
          <h2 className="text-lg font-semibold mb-2">¡Enviado correctamente!</h2>
          <p className="text-gray-700">Gracias por tu sugerencia. Serás redirigido en unos segundos...</p>
        </div>
      </div>
    )}
    <Layout title="Quejas y Sugerencias">
      {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">Error: {error}</div>}

      <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
            <input
              type="text"
              name="asunto"
              value={formData.asunto}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData((prev) => ({ ...prev, descripcion: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md h-24"
              required
            />
          </div>

          <div className="pt-8 grid grid-cols-2 gap-4">
            <Button variant="danger" icon="x" type="button" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button variant="primary" icon="send" type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
    </>
  )
}
