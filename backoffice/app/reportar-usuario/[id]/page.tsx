"use client"

import type React from "react"

import { Layout } from "@/components/layout"
import { InputField } from "@/components/input-field"
import { Button } from "@/components/button"
import { useRouter } from "next/navigation"

export default function ReportarUsuarioPage() {
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para enviar el reporte
    router.push("/dashboard")
  }

  return (
    <Layout title="Reporte de usuario">
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label="Nombre y Apellido del usuario" name="nombreUsuario" icon="user" required />

          <InputField label="Asunto" name="asunto" icon="text" required />

          <InputField label="Descripción" name="descripcion" icon="text" required />

          <div className="pt-8 grid grid-cols-2 gap-4">
            <Button variant="danger" icon="x">
              Cancelar
            </Button>
            <Button variant="primary" icon="send" type="submit">
              Enviar
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
