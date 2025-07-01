import type React from "react"
import Image from "next/image"

interface UserCardProps {
  name: string
  image: string
  details: {
    label: string
    value: string
  }[]
  actions?: React.ReactNode
}

export function UserCard({ name, image, details, actions }: UserCardProps) {
  return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-3">
        <div className="flex items-center gap-3">
          <img src={image} alt={name} className="w-12 h-12 rounded-full object-cover" />
          <h3 className="font-semibold text-black">{name}</h3>
        </div>

      <div className="text-sm text-gray-700 flex flex-wrap gap-x-6 gap-y-2">
        {details.map((detail, i) => (
          <div key={i} className="min-w-[180px]">
            <strong>{detail.label}:</strong> {detail.value}
          </div>
        ))}
      </div>

        {actions && <div className="pt-3 flex justify-end">{actions}</div>}
      </div>
    )
  }
