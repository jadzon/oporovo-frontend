import { Icon } from "./Icon"

const statusMapping = {
    scheduled: { text: "Zaplanowana", color: "bg-gray-50 text-black", icon: "calendar" },
    confirmed: { text: "Potwierdzona", color: "bg-green-50 text-green-600", icon: "check-circle" },
    in_progress: { text: "W trakcie", color: "bg-gray-50 text-black", icon: "play" },
    done: { text: "Zakończona", color: "bg-gray-50 text-gray-600", icon: "check" },
    failed: { text: "Nieudana", color: "bg-red-50 text-red-600", icon: "x-circle" },
    cancelled: { text: "Anulowana", color: "bg-gray-100 text-gray-600", icon: "x" },
}

export const StatusBadge = ({ status, showIcon = true, size = "md" }) => {
    const statusInfo = statusMapping[status] || { text: "Nieznany", color: "bg-gray-100 text-gray-600", icon: "info" }

    const sizeClasses = {
        xs: "text-xs py-0.5 px-2",
        sm: "text-xs py-1 px-2.5",
        md: "text-sm py-1 px-2.5",
        lg: "text-sm py-1.5 px-3",
    }

    const iconSizes = {
        xs: "h-3 w-3",
        sm: "h-3.5 w-3.5",
        md: "h-4 w-4",
        lg: "h-4.5 w-4.5",
    }

    return (
        <span
            className={`rounded-full font-medium inline-flex items-center gap-1.5 ${statusInfo.color} ${sizeClasses[size]}`}
        >
      {showIcon && statusInfo.icon && <Icon name={statusInfo.icon} className={iconSizes[size]} />}
            {statusInfo.text}
    </span>
    )
}
