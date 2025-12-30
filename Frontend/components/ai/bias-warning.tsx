import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Lightbulb } from "lucide-react"

type BiasType = "confirmation" | "selection" | "framing" | "anchoring" | "availability"

interface BiasWarningProps {
  bias: {
    type: BiasType
    severity: "low" | "medium" | "high"
    description: string
    examples: string[]
    mitigation: string
  }
}

export function BiasWarning({ bias }: BiasWarningProps) {
  const biasNames: Record<BiasType, string> = {
    confirmation: "Confirmation Bias",
    selection: "Selection Bias",
    framing: "Framing Bias",
    anchoring: "Anchoring Bias",
    availability: "Availability Bias",
  }

  const severityColors = {
    low: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    medium: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    high: "bg-destructive/10 text-destructive border-destructive/20",
  }

  return (
    <Card className="p-5 border-l-4 border-l-yellow-500 bg-yellow-500/5">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-5 text-yellow-500 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-500">Potential Bias Detected</h3>
              <p className="text-sm text-muted-foreground">{biasNames[bias.type]}</p>
            </div>
          </div>
          <Badge variant="outline" className={severityColors[bias.severity]}>
            {bias.severity} severity
          </Badge>
        </div>

        {/* Description */}
        <div>
          <p className="text-sm leading-relaxed">{bias.description}</p>
        </div>

        {/* Examples */}
        {bias.examples.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Examples in Argument
            </p>
            <ul className="space-y-1.5">
              {bias.examples.map((example, index) => (
                <li key={index} className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-yellow-500">•</span>
                  <span>{example}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Mitigation */}
        <div className="p-3 bg-accent/5 border border-accent/20 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb className="size-4 text-accent" />
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">How to Address This</p>
          </div>
          <p className="text-sm leading-relaxed">{bias.mitigation}</p>
        </div>
      </div>
    </Card>
  )
}
