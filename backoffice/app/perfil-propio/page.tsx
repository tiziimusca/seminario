import { Layout } from "@/components/layout"
import { StarRating } from "@/components/star-rating"
import Image from "next/image"

export default function PerfilPropioPage() {
  const usuario = {
    id: 1,
    nombre: "Tiziano Musca",
    imagen: "https://th.bing.com/th/id/R.7c8764880cfb470445950fbdaf9aede0?rik=1i%2fQrayLFQcoUg&pid=ImgRaw&r=0",
    fechaRegistro: "August 2024",
    correo: "tizianomusca@gmail.com",
    calificacion: 4.6,
    resenas: [
      {
        id: 1,
        autor: "Maria Perez",
        calificacion: 4,
        descripcion: "Divertido y educativo.",
      },
      {
        id: 2,
        autor: "Juan Lopez",
        calificacion: 5,
        descripcion: "Muy buena experiencia, lo recomiendo.",
      },
      {
        id: 3,
        autor: "Ana Gomez",
        calificacion: 5,
        descripcion: "Excelente profesor, aprendí mucho.",
      },
    ],
  }

  return (
    <Layout title="Perfil propio">
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 mb-2">
          <Image
            src="https://th.bing.com/th/id/OIP.HBdW0soa6fQZVCR3DWGlqQHaG5?rs=1&pid=ImgDetMain"
            alt={usuario.nombre}
            width={100}
            height={100}
            className="rounded-full"
          />
        </div>
        <h2 className="text-xl font-medium">{usuario.nombre}</h2>
        <p className="text-sm text-gray-500">Joined in {usuario.fechaRegistro}</p>

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
                <span className="font-medium text-black">{resena.autor}</span>
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
