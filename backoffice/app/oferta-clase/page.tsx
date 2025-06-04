"use client"

import type React from "react"

import { Layout } from "@/components/layout"
import { InputField } from "@/components/input-field"
import { Button } from "@/components/button"
import { useRouter } from "next/navigation"

export default function OfertaClasePage() {
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para enviar la oferta
    router.push("/mis-ofertas")
  }

  return (
    <Layout title="Oferta de clase">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <InputField label="Duración" name="duracion" icon="clock" required />

          <InputField label="Descripción" name="descripcion" icon="text" required />
        </div>

        <div>
          <InputField label="Fecha y hora" name="fecha_hora" icon="calendar" required />

          <InputField label="Monto" name="monto" icon="text" required />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <Button variant="danger" icon="x">
          Cancelar
        </Button>
        <Button variant="primary" icon="check" onClick={handleSubmit}>
          Ofertar
        </Button>
      </div>
    </Layout>
  )
}
