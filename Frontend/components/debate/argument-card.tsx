"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, ThumbsUp, AlertTriangle, TrendingUp } from "lucide-react"
import { LiveFactCheckIndicator } from "@/components/debate/live-fact-check-indicator"
import { cn } from "@/lib/utils"

interface ArgumentCardProps {
  argument: {
    id: string
    speaker: {
      name: string
      avatar?: string
    }
    claim: string
    evidence: string[]
    conclusion: string
    timestamp: string
    reactions: number
    strength: "weak" | "medium" | "strong"
    hasWarning?: boolean
    warningType?: "fallacy" | "bias" | "fact-check"
    connectedTo?: string[]
    factCheckStatus?: {
      isChecking: boolean
      hasIssue: boolean
      issueType?: "low-credibility" | "needs-verification" | "verified"
    }
  }
  onViewDetails?: () => void
}

export function ArgumentCard({ argument, onViewDetails }: ArgumentCardProps) {
  const strengthColors = {
    weak: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
    medium: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    strong: "text-green-500 bg-green-500/10 border-green-500/20",
  }

  return (
    <Card className={cn("p-5", argument.hasWarning && "border-destructive/50")}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="size-10 border-2 border-border">
              <AvatarImage src={argument.speaker.avatar || "/placeholder.svg"} alt={argument.speaker.name} />
              <AvatarFallback>{argument.speaker.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">{argument.speaker.name}</p>
              <p className="text-xs text-muted-foreground">{argument.timestamp}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className={strengthColors[argument.strength]}>
              <TrendingUp className="size-3 mr-1" />
              {argument.strength}
            </Badge>
          </div>
        </div>

        {argument.factCheckStatus && (
          <LiveFactCheckIndicator
            isChecking={argument.factCheckStatus.isChecking}
            hasIssue={argument.factCheckStatus.hasIssue}
            issueType={argument.factCheckStatus.issueType}
            onViewDetails={() => console.log("[v0] View fact check details")}
          />
        )}

        {/* Warning Banner */}
        {argument.hasWarning && (
          <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertTriangle className="size-4 text-destructive mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-destructive">
                {argument.warningType === "fallacy" && "Logical Fallacy Detected"}
                {argument.warningType === "bias" && "Potential Bias Warning"}
                {argument.warningType === "fact-check" && "Fact Check Required"}
              </p>
            </div>
          </div>
        )}

        {/* Argument Structure */}
        <div className="space-y-3">
          {/* Claim */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="size-1.5 rounded-full bg-accent" />
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Claim</span>
            </div>
            <p className="text-sm leading-relaxed pl-3.5">{argument.claim}</p>
          </div>

          {/* Evidence */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="size-1.5 rounded-full bg-accent" />
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Evidence</span>
            </div>
            <ul className="space-y-1.5 pl-3.5">
              {argument.evidence.map((item, index) => (
                <li key={index} className="text-sm leading-relaxed text-muted-foreground flex gap-2">
                  <span className="text-accent">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Conclusion */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="size-1.5 rounded-full bg-accent" />
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Conclusion</span>
            </div>
            <p className="text-sm leading-relaxed pl-3.5 font-medium">{argument.conclusion}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <button className="flex items-center gap-1.5 hover:text-foreground transition-colors">
              <ThumbsUp className="size-4" />
              <span>{argument.reactions}</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-foreground transition-colors">
              <MessageSquare className="size-4" />
              <span>Reply</span>
            </button>
          </div>

          <Button variant="ghost" size="sm" onClick={onViewDetails}>
            View Thread
          </Button>
        </div>
      </div>
    </Card>
  )
}
