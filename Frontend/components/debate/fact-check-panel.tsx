"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FactCheckBadge } from "@/components/debate/fact-check-badge"
import { ExternalLink, Sparkles, AlertCircle } from "lucide-react"

interface FactCheck {
  id: string
  claim: string
  credibility: "low" | "medium" | "high" | "unverified"
  explanation: string
  sources: {
    title: string
    url: string
    domain: string
  }[]
  aiConfidence: number
}

interface FactCheckPanelProps {
  factCheck: FactCheck
  onViewSources?: () => void
}

export function FactCheckPanel({ factCheck, onViewSources }: FactCheckPanelProps) {
  return (
    <Card className="p-5 border-l-4 border-l-accent">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-accent/10 rounded-lg flex items-center justify-center">
              <Sparkles className="size-4 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">AI Fact Check</h3>
              <p className="text-xs text-muted-foreground">Automated verification</p>
            </div>
          </div>
          <FactCheckBadge level={factCheck.credibility} />
        </div>

        {/* Claim */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm font-medium mb-1">Claim:</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{factCheck.claim}</p>
        </div>

        {/* AI Analysis */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="size-4 text-muted-foreground" />
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Analysis</span>
          </div>
          <p className="text-sm leading-relaxed">{factCheck.explanation}</p>
        </div>

        {/* Confidence Score */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">AI Confidence</span>
            <span className="font-semibold">{factCheck.aiConfidence}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${factCheck.aiConfidence}%` }}
            />
          </div>
        </div>

        {/* Sources */}
        {factCheck.sources.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Sources ({factCheck.sources.length})
            </p>
            <div className="space-y-2">
              {factCheck.sources.slice(0, 2).map((source, index) => (
                <a
                  key={index}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 p-2 bg-muted/50 rounded hover:bg-muted transition-colors group"
                >
                  <ExternalLink className="size-4 text-muted-foreground mt-0.5 flex-shrink-0 group-hover:text-accent transition-colors" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{source.title}</p>
                    <p className="text-xs text-muted-foreground">{source.domain}</p>
                  </div>
                </a>
              ))}
            </div>
            {factCheck.sources.length > 2 && (
              <Button variant="ghost" size="sm" className="w-full mt-2" onClick={onViewSources}>
                View all {factCheck.sources.length} sources
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
