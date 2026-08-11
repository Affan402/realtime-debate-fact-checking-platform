import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Award, Target, Zap } from "lucide-react"

interface DebaterScorecardProps {
  debater: {
    name: string
    avatar?: string
    rank: number
    totalDebates: number
    winRate: number
    avgArgumentStrength: number
    specialties: string[]
    stats: {
      strongArguments: number
      factCheckScore: number
      logicalConsistency: number
      audienceEngagement: number
    }
  }
}

export function DebaterScorecard({ debater }: DebaterScorecardProps) {
  const statBars = [
    { label: "Strong Arguments", value: debater.stats.strongArguments, color: "bg-accent" },
    { label: "Fact Check Score", value: debater.stats.factCheckScore, color: "bg-green-500" },
    { label: "Logical Consistency", value: debater.stats.logicalConsistency, color: "bg-blue-500" },
    { label: "Audience Engagement", value: debater.stats.audienceEngagement, color: "bg-yellow-500" },
  ]

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="size-16 border-2 border-border">
              <AvatarImage src={debater.avatar || "/placeholder.svg"} alt={debater.name} />
              <AvatarFallback>{debater.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            {debater.rank <= 3 && (
              <div className="absolute -top-1 -right-1 size-6 bg-accent rounded-full flex items-center justify-center border-2 border-background">
                <Award className="size-3 text-accent-foreground" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg">{debater.name}</h3>
              <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                #{debater.rank}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {debater.specialties.map((specialty) => (
                <Badge key={specialty} variant="outline" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="size-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">{debater.totalDebates}</p>
            <p className="text-xs text-muted-foreground">Debates</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="size-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">{debater.winRate}%</p>
            <p className="text-xs text-muted-foreground">Win Rate</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Zap className="size-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">{debater.avgArgumentStrength}</p>
            <p className="text-xs text-muted-foreground">Avg Strength</p>
          </div>
        </div>

        {/* Performance Bars */}
        <div className="space-y-3">
          {statBars.map((stat) => (
            <div key={stat.label}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-muted-foreground">{stat.label}</span>
                <span className="font-semibold">{stat.value}/100</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full ${stat.color} rounded-full transition-all duration-500`}
                  style={{ width: `${stat.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
