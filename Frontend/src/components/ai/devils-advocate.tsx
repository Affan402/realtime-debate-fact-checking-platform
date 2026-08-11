import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Zap } from "lucide-react"

interface DevilsAdvocateProps {
  response: {
    originalClaim: string
    counterArgument: string
    evidence: string[]
    conclusion: string
    strength: number
  }
}

export function DevilsAdvocate({ response }: DevilsAdvocateProps) {
  return (
    <Card className="p-5 border-l-4 border-l-accent bg-accent/5">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-accent/10 rounded-lg flex items-center justify-center">
              <Sparkles className="size-4 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-accent">AI Devil's Advocate</h3>
              <p className="text-sm text-muted-foreground">Alternative perspective generated</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
            <Zap className="size-3 mr-1" />
            {response.strength}% strength
          </Badge>
        </div>

        {/* Original Claim */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Original Claim</p>
          <p className="text-sm italic">{response.originalClaim}</p>
        </div>

        {/* Counter Argument */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="size-1.5 rounded-full bg-accent" />
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Counter Argument
            </span>
          </div>
          <p className="text-sm leading-relaxed pl-3.5">{response.counterArgument}</p>
        </div>

        {/* Evidence */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="size-1.5 rounded-full bg-accent" />
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Supporting Evidence
            </span>
          </div>
          <ul className="space-y-1.5 pl-3.5">
            {response.evidence.map((item, index) => (
              <li key={index} className="text-sm text-muted-foreground flex gap-2">
                <span className="text-accent">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Conclusion */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="size-1.5 rounded-full bg-accent" />
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Conclusion</span>
          </div>
          <p className="text-sm leading-relaxed pl-3.5 font-medium">{response.conclusion}</p>
        </div>
      </div>
    </Card>
  )
}
