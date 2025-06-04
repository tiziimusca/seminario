import type React from "react"
import Image from "next/image"

interface UserCardProps {
  name: string
  image: string
  details?: {
    label: string
    value: string
  }[]
  actions?: React.ReactNode
}

export function UserCard({ name, image, details, actions }: UserCardProps) {
  return (
    <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-4">
          <Image src={image || "/placeholder.svg"} alt={name} width={50} height={50} className="rounded-full" />
        </div>
        <div className="flex-grow">
          <h3 className="font-medium">{name}</h3>
          {details &&
            details.map((detail, index) => (
              <div key={index} className="mt-1 text-sm">
                <span className="font-medium">{detail.label}: </span>
                <span>{detail.value}</span>
              </div>
            ))}
        </div>
      </div>
      {actions && <div className="mt-3 flex space-x-2">{actions}</div>}
    </div>
  )
}
