import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Info } from "lucide-react"

type FallacyType =
  | "ad-hominem"
  | "strawman"
  | "false-dichotomy"
  | "slippery-slope"
  | "appeal-to-authority"
  | "hasty-generalization"

interface FallacyDetectorProps {
  fallacy: {
    type: FallacyType
    confidence: number
    explanation: string
    suggestion: string
    quote: string
  }
}

export function FallacyDetector({ fallacy }: FallacyDetectorProps) {
  const fallacyNames: Record<FallacyType, string> = {
    "ad-hominem": "Ad Hominem",
    strawman: "Strawman Fallacy",
    "false-dichotomy": "False Dichotomy",
    "slippery-slope": "Slippery Slope",
    "appeal-to-authority": "Appeal to Authority",
    "hasty-generalization": "Hasty Generalization",
  }

  return (
    <Card className="p-5 border-l-4 border-l-destructive bg-destructive/5">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-destructive flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-destructive">Logical Fallacy Detected</h3>
              <p className="text-sm text-muted-foreground">{fallacyNames[fallacy.type]}</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
            {fallacy.confidence}% confidence
          </Badge>
        </div>

        {/* Quote */}
        <div className="p-3 bg-background border border-border rounded-lg">
          <p className="text-sm italic text-muted-foreground">"{fallacy.quote}"</p>
        </div>

        {/* Explanation */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Info className="size-4 text-muted-foreground" />
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Why This Is An Issue
            </span>
          </div>
          <p className="text-sm leading-relaxed">{fallacy.explanation}</p>
        </div>

        {/* Suggestion */}
        <div className="p-3 bg-accent/5 border border-accent/20 rounded-lg">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-1">Suggestion</p>
          <p className="text-sm leading-relaxed">{fallacy.suggestion}</p>
        </div>
      </div>
    </Card>
  )
}
