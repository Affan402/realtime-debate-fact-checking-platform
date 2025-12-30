import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, HelpCircle, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

type CredibilityLevel = "low" | "medium" | "high" | "unverified"

interface FactCheckBadgeProps {
  level: CredibilityLevel
  className?: string
  showIcon?: boolean
}

export function FactCheckBadge({ level, className, showIcon = true }: FactCheckBadgeProps) {
  const configs = {
    low: {
      label: "Low Credibility",
      icon: AlertTriangle,
      className: "bg-destructive/10 text-destructive border-destructive/20",
    },
    medium: {
      label: "Medium Credibility",
      icon: HelpCircle,
      className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    },
    high: {
      label: "High Credibility",
      icon: CheckCircle,
      className: "bg-green-500/10 text-green-500 border-green-500/20",
    },
    unverified: {
      label: "Unverified",
      icon: Shield,
      className: "bg-muted text-muted-foreground border-border",
    },
  }

  const config = configs[level]
  const Icon = config.icon

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {showIcon && <Icon className="size-3 mr-1" />}
      {config.label}
    </Badge>
  )
}
