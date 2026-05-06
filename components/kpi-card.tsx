import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface KPICardProps {
  title: string
  value: string | number
  icon?: LucideIcon
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  variant?: "default" | "warning" | "success" | "danger"
  className?: string
}

const variantStyles = {
  default: "border-l-primary",
  warning: "border-l-amber-500",
  success: "border-l-emerald-500",
  danger: "border-l-rose-500"
}

export function KPICard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  variant = "default",
  className
}: KPICardProps) {
  return (
    <Card className={cn(
      "bg-card border border-border/60 shadow-none overflow-hidden",
      "border-l-4",
      variantStyles[variant],
      className
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight tabular-nums">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {trend && (
              <p
                className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-emerald-600" : "text-rose-600"
                )}
              >
                {trend.isPositive ? "+" : ""}{trend.value}% vs mes anterior
              </p>
            )}
          </div>
          {Icon && (
            <div className="rounded-md bg-primary/10 p-2">
              <Icon className="size-4 text-primary" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
