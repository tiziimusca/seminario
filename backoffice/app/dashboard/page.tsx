import { Layout } from "@/components/layout"
import Link from "next/link"
import { BookOpen, Send } from "lucide-react"
import { PropuestasList } from "@/components/PropuestasList"

export default function DashboardPage() {
  const menuItems = [
    {
      title: "Mis publicaciones",
      icon: <BookOpen className="w-6 h-6" />,
      href: "/mis-publicaciones",
    },
    {
      title: "Mis ofertas",
      icon: <Send className="w-6 h-6" />,
      href: "/mis-ofertas",
    },
  ]

  return (
  <Layout title="Bienvenido a MatchED" noPadding={true}>
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-100px)]">

      {/* Panel izquierdo */}
      <div className="w-full lg:w-[220px] border-r border-gray-400 px-2 pt-4 bg-[#b5c8ca] shadow-inner">
        <h2 className="text-sm text-gray-600 font-semibold uppercase mb-2">Menú rápido</h2>
        <div className="flex flex-col gap-2">
          {menuItems.map((item, index) => (
            <Link key={index} href={item.href} className="block">
              <div className="bg-white rounded-md p-2 shadow hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#1e2a32] text-white flex items-center justify-center mr-2">
                    {item.icon}
                  </div>
                  <span className="text-sm text-gray-800">{item.title}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6">
          <Link
            href="/publicar-clase"
            className="block bg-[#0a5744] hover:bg-[#084535] text-white text-sm py-2 px-4 rounded-md text-center"
          >
            Publicar clase
          </Link>
        </div>
      </div>

      {/* Panel derecho */}
      <div className="flex-1 px-4 py-4 lg:px-8 lg:py-6 w-[90%] mx-auto">
        <h1 className="text-xl font-semibold mb-4">Clases publicadas</h1>
        <PropuestasList />
      </div>
    </div>
  </Layout>
  )
}
