import { User, Mail, Lock, Calendar, Clock, FileText } from "lucide-react"

interface InputFieldProps {
  label: string
  type?: string
  placeholder?: string
  name: string
  icon?: "user" | "mail" | "lock" | "calendar" | "clock" | "text"
  required?: boolean
}

export function InputField({
  label,
  type = "text",
  placeholder = "Input text",
  name,
  icon,
  required = false,
}: InputFieldProps) {
  const getIcon = () => {
    switch (icon) {
      case "user":
        return <User size={16} className="text-gray-500" />
      case "mail":
        return <Mail size={16} className="text-gray-500" />
      case "lock":
        return <Lock size={16} className="text-gray-500" />
      case "calendar":
        return <Calendar size={16} className="text-gray-500" />
      case "clock":
        return <Clock size={16} className="text-gray-500" />
      case "text":
        return <FileText size={16} className="text-gray-500" />
      default:
        return null
    }
  }

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          required={required}
          className="w-full p-2 pl-8 pr-8 border border-gray-300 rounded-md bg-white"
        />
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">{getIcon()}</div>
        )}
        <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
          <span className="text-gray-400">×</span>
        </div>
      </div>
    </div>
  )
}
