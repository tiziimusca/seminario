"use client"

import type React from "react"

import { Layout } from "@/components/layout"
import { Button } from "@/components/button"
import { useRouter } from "next/navigation"
import { DollarSign } from "lucide-react"

export default function PagarPage() {
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para procesar el pago
    router.push("/historial-pagos")
  }

  return (
    <Layout title="Pagar">
      <div className="max-w-md mx-auto flex flex-col items-center justify-center min-h-[50vh]">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <DollarSign size={32} className="text-blue-500" />
            </div>
          </div>
          <h2 className="text-xl font-medium mb-2">Se solicita la info necesaria para el pago</h2>
          <p className="text-gray-600">
            Aquí se integraría un formulario de pago o se redireccionaría a un procesador de pagos externo.
          </p>
        </div>

        <div className="w-full grid grid-cols-2 gap-4">
          <Button variant="danger" icon="x">
            Cancelar
          </Button>
          <Button variant="info" icon="send" onClick={handleSubmit}>
            Pagar
          </Button>
        </div>
      </div>
    </Layout>
  )
}
