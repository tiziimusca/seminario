"use client"

import { useState } from "react"
import { Star } from "lucide-react"

interface StarRatingProps {
  initialRating?: number
  onChange?: (rating: number) => void
  readOnly?: boolean
  size?: "sm" | "md" | "lg"
}

export function StarRating({ initialRating = 0, onChange, readOnly = false, size = "md" }: StarRatingProps) {
  const [rating, setRating] = useState(initialRating)
  const [hoverRating, setHoverRating] = useState(0)

  const handleClick = (index: number) => {
    if (readOnly) return
    const newRating = index + 1
    setRating(newRating)
    if (onChange) onChange(newRating)
  }

  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "w-4 h-4"
      case "lg":
        return "w-8 h-8"
      default:
        return "w-6 h-6"
    }
  }

  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => {
        const filled = (hoverRating || rating) > index

        return (
          <Star
            key={index}
            className={`${getSizeClass()} ${
              filled ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            } ${!readOnly && "cursor-pointer"}`}
            onClick={() => handleClick(index)}
            onMouseEnter={() => !readOnly && setHoverRating(index + 1)}
            onMouseLeave={() => !readOnly && setHoverRating(0)}
          />
        )
      })}
    </div>
  )
}
