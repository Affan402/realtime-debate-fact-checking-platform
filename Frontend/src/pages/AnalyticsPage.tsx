import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Trophy, TrendingUp, Users } from "lucide-react"
import { DebaterScorecard } from "@/components/analytics/debater-scorecard"
import { LeaderboardTable } from "@/components/analytics/leaderboard-table"
import { ArgumentStrengthChart } from "@/components/analytics/argument-strength-chart"
import { Card } from "@/components/ui/card"

export default function AnalyticsPage() {
  const topDebater = {
    name: "Sarah Chen",
    avatar: "/professional-woman-diverse.png",
    rank: 1,
    totalDebates: 47,
    winRate: 78,
    avgArgumentStrength: 8.4,
    specialties: ["Technology", "Ethics", "Policy"],
    stats: {
      strongArguments: 85,
      factCheckScore: 92,
      logicalConsistency: 88,
      audienceEngagement: 76,
    },
  }

  const leaderboardData = [
    {
      rank: 1,
      name: "Sarah Chen",
      avatar: "/professional-woman-diverse.png",
      points: 4825,
      debates: 47,
      winRate: 78,
      trend: "up" as const,
      rankChange: 2,
    },
    {
      rank: 2,
      name: "Marcus Johnson",
      avatar: "/professional-man.jpg",
      points: 4710,
      debates: 52,
      winRate: 73,
      trend: "down" as const,
      rankChange: -1,
    },
    {
      rank: 3,
      name: "Dr. Emily Roberts",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 4580,
      debates: 41,
      winRate: 80,
      trend: "up" as const,
      rankChange: 1,
    },
    {
      rank: 4,
      name: "Prof. James Williams",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 4320,
      debates: 38,
      winRate: 68,
      trend: "stable" as const,
      rankChange: 0,
    },
    {
      rank: 5,
      name: "Alex Rivera",
      avatar: "/placeholder.svg?height=40&width=40",
      points: 4150,
      debates: 45,
      winRate: 71,
      trend: "up" as const,
      rankChange: 3,
    },
  ]

  const argumentStrengthData = {
    debater: "Sarah Chen",
    arguments: [
      { timestamp: "Mon 10am", strength: 85, topic: "AI Regulation" },
      { timestamp: "Wed 2pm", strength: 78, topic: "Climate Policy" },
      { timestamp: "Thu 4pm", strength: 92, topic: "Healthcare Reform" },
      { timestamp: "Fri 11am", strength: 88, topic: "Education System" },
      { timestamp: "Sat 3pm", strength: 81, topic: "Economic Growth" },
    ],
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Performance Analytics</h1>
            <p className="text-muted-foreground mt-1">Track debater performance and rankings</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Debates</p>
                <p className="text-3xl font-bold mt-1">247</p>
                <p className="text-xs text-green-500 mt-1">+12% this week</p>
              </div>
              <Users className="size-10 text-accent" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Argument Quality</p>
                <p className="text-3xl font-bold mt-1">8.2/10</p>
                <p className="text-xs text-green-500 mt-1">+0.4 improvement</p>
              </div>
              <TrendingUp className="size-10 text-accent" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Debaters</p>
                <p className="text-3xl font-bold mt-1">1,247</p>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </div>
              <Trophy className="size-10 text-accent" />
            </div>
          </Card>
        </div>

        {/* Top Debater Scorecard */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Top Ranked Debater</h2>
          <DebaterScorecard debater={topDebater} />
        </div>

        {/* Leaderboard */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
          <LeaderboardTable entries={leaderboardData} />
        </div>

        {/* Argument Strength Chart */}
        <div>
          <h2 className="text-xl font-bold mb-4">Recent Performance</h2>
          <ArgumentStrengthChart data={argumentStrengthData} />
        </div>
      </div>
    </div>
  )
}
