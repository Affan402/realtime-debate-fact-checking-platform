import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp, Users, Award } from "lucide-react"

interface DebateSummaryProps {
  summary: {
    topic: string
    duration: string
    speakers: string[]
    keyPoints: {
      speaker: string
      point: string
      impact: "high" | "medium" | "low"
    }[]
    winner: string | null
    winReason?: string
    audienceStats: {
      totalReactions: number
      mostEngaging: string
    }
    aiInsight: string
  }
}

export function DebateSummary({ summary }: DebateSummaryProps) {
  const impactColors = {
    high: "bg-green-500/10 text-green-500 border-green-500/20",
    medium: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    low: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="size-8 bg-accent/10 rounded-lg flex items-center justify-center">
              <Sparkles className="size-4 text-accent" />
            </div>
            <h2 className="text-xl font-bold">AI Debate Summary</h2>
          </div>
          <p className="text-muted-foreground text-balance">{summary.topic}</p>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-muted-foreground" />
            <span className="text-muted-foreground">{summary.speakers.join(" vs ")}</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-muted-foreground" />
            <span className="text-muted-foreground">{summary.duration}</span>
          </div>
        </div>

        {/* Winner */}
        {summary.winner && (
          <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Award className="size-5 text-accent" />
              <h3 className="font-semibold">Debate Winner</h3>
            </div>
            <p className="text-lg font-bold mb-1">{summary.winner}</p>
            {summary.winReason && <p className="text-sm text-muted-foreground">{summary.winReason}</p>}
          </div>
        )}

        {/* Key Points */}
        <div>
          <h3 className="font-semibold mb-3">Key Points</h3>
          <div className="space-y-3">
            {summary.keyPoints.map((point, index) => (
              <div key={index} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{point.speaker}</span>
                  <Badge variant="outline" className={impactColors[point.impact]}>
                    {point.impact} impact
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{point.point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Audience Stats */}
        <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Reactions</p>
            <p className="text-2xl font-bold">{summary.audienceStats.totalReactions}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Most Engaging</p>
            <p className="text-lg font-semibold">{summary.audienceStats.mostEngaging}</p>
          </div>
        </div>

        {/* AI Insight */}
        <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="size-4 text-accent" />
            <h3 className="font-semibold text-accent">AI Insight</h3>
          </div>
          <p className="text-sm leading-relaxed">{summary.aiInsight}</p>
        </div>
      </div>
    </Card>
  )
}
