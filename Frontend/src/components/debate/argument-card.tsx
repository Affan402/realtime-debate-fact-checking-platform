import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FactCheckBadge } from "./fact-check-badge"
import { AlertTriangle, ThumbsUp } from "lucide-react"

interface ArgumentCardProps {
  argument: {
    id: string
    speaker: {
      name: string
      avatar: string
    }
    claim: string
    evidence: string[]
    conclusion: string
    timestamp: string
    reactions: number
    strength: "strong" | "medium" | "weak"
    hasWarning?: boolean
    warningType?: "fallacy" | "bias"
    factCheckStatus?: {
      isChecking: boolean
      hasIssue: boolean
      issueType?: "verified" | "disputed" | "low-credibility"
    }
  }
}

export function ArgumentCard({ argument }: ArgumentCardProps) {
  const strengthColors = {
    strong: "bg-green-500/10 text-green-500 border-green-500/20",
    medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    weak: "bg-red-500/10 text-red-500 border-red-500/20",
  }

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4 mb-4">
        <Avatar>
          <AvatarImage src={argument.speaker.avatar || "/placeholder.svg"} alt={argument.speaker.name} />
          <AvatarFallback>{argument.speaker.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold">{argument.speaker.name}</h4>
            <span className="text-sm text-muted-foreground">{argument.timestamp}</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={strengthColors[argument.strength]}>
              {argument.strength} argument
            </Badge>
            {argument.factCheckStatus && <FactCheckBadge status={argument.factCheckStatus} />}
            {argument.hasWarning && (
              <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                <AlertTriangle className="size-3 mr-1" />
                {argument.warningType}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h5 className="text-sm font-semibold text-muted-foreground mb-1">Claim</h5>
          <p className="text-balance leading-relaxed">{argument.claim}</p>
        </div>

        <div>
          <h5 className="text-sm font-semibold text-muted-foreground mb-2">Evidence</h5>
          <ul className="space-y-1.5">
            {argument.evidence.map((item, idx) => (
              <li key={idx} className="text-sm flex gap-2 leading-relaxed">
                <span className="text-accent mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="text-sm font-semibold text-muted-foreground mb-1">Conclusion</h5>
          <p className="text-balance leading-relaxed">{argument.conclusion}</p>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <ThumbsUp className="size-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{argument.reactions} reactions</span>
        </div>
      </div>
    </Card>
  )
}
