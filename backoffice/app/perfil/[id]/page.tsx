import { Layout } from "@/components/layout"
import { Button } from "@/components/button"
import { StarRating } from "@/components/star-rating"
import Image from "next/image"

export default function PerfilUsuarioPage() {
  const usuario = {
    id: 1,
    nombre: "Jesse Leos",
    imagen: "/placeholder.svg?height=100&width=100",
    fechaRegistro: "August 2014",
    correo: "**********",
    calificacion: 5,
    resenas: [
      {
        id: 1,
        autor: "Nombre y Apellido del publicante",
        calificacion: 5,
        descripcion: "Descripción",
      },
    ],
  }

  return (
    <Layout title="Perfil usuario">
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 mb-2">
          <Image
            src={usuario.imagen || "/placeholder.svg"}
            alt={usuario.nombre}
            width={100}
            height={100}
            className="rounded-full"
          />
        </div>
        <h2 className="text-xl font-medium">{usuario.nombre}</h2>
        <p className="text-sm text-gray-500">Joined in {usuario.fechaRegistro}</p>

        <div className="mt-2 flex space-x-2">
          <Button variant="info" fullWidth={false} className="text-sm py-1">
            Calificar
          </Button>
          <Button variant="danger" fullWidth={false} className="text-sm py-1">
            Reportar
          </Button>
        </div>

        <div className="w-full max-w-md mt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Correo electrónico:</h3>
            <span>{usuario.correo}</span>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Calificación:</h3>
            <StarRating initialRating={usuario.calificacion} readOnly />
          </div>

          <h3 className="font-medium mb-2">Reseñas</h3>

          {usuario.resenas.map((resena) => (
            <div key={resena.id} className="bg-white rounded-lg p-3 mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{resena.autor}</span>
                <StarRating initialRating={resena.calificacion} readOnly size="sm" />
              </div>
              <p className="text-sm text-gray-600">{resena.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
