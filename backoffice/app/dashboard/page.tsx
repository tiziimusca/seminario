import { Layout } from "@/components/layout"
import Link from "next/link"
import { BookOpen, Send, Clock, DollarSign, User, MessageSquare } from "lucide-react"
import { PropuestasList } from "@/components/PropuestasList"

export default function DashboardPage() {
  const menuItems = [
    {
      title: "Mis publicaciones",
      icon: <BookOpen className="w-6 h-6" />,
      href: "/mis-publicaciones",
      description: "Gestiona tus clases publicadas",
    },
    {
      title: "Mis ofertas",
      icon: <Send className="w-6 h-6" />,
      href: "/mis-ofertas",
      description: "Revisa las ofertas que has enviado",
    }] /*,
    {
      title: "Ofertas recibidas",
      icon: <Send className="w-6 h-6" />,
      href: "/ofertas-recibidas",
      description: "Revisa ofertas para tus clases",
    },
    {
      title: "Historial de pagos",
      icon: <DollarSign className="w-6 h-6" />,
      href: "/historial-pagos",
      description: "Consulta tus pagos y cobros",
    },
    {
      title: "Mi perfil",
      icon: <User className="w-6 h-6" />,
      href: "/perfil-propio",
      description: "Gestiona tu información personal",
    },
    {
      title: "Quejas y sugerencias",
      icon: <MessageSquare className="w-6 h-6" />,
      href: "/quejas-sugerencias",
      description: "Envía tus comentarios",
    },
  ]

    <Layout title="Dashboard" showBackButton={false}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item, index) => (
          <Link key={index} href={item.href} className="block">
            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-[#1e2a32] flex items-center justify-center text-white mr-3">
                  {item.icon}
                </div>
                <h3 className="font-medium text-lg text-gray-900">{item.title}</h3>
              </div>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          </Link>
        ))}
      </div> */
return (
    <Layout title="Página principal">
      <h1 className="text-2xl font-bold mb-4">Bienvenido a mactED</h1>
      <div className="mt-8 text-center">
        <Link
          href="/publicar-clase"
          className="inline-block bg-[#0a5744] hover:bg-[#084535] text-white py-3 px-6 rounded-md font-medium">
          Publicar nueva clase
        </Link>
      </div>
      <hr className="my-6 border-gray-300 w-full max-w-md" />
      <div className="flex gap-4 flex-wrap"> 
        {menuItems.map((item, index) => (            //falta boton para publicar clase
          <Link key={index} href={item.href}>
            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow w-auto">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-[#1e2a32] flex items-center justify-center text-white mr-3">
                  {item.icon}
                </div>
                <h3 className="font-medium text-lg text-gray-900">{item.title}</h3>
              </div>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Clases publicadas</h2>
        <PropuestasList />
      </section>
    </Layout>
  )
}
