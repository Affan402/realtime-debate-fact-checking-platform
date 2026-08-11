import { useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Trophy, TrendingUp, Users, Loader2 } from "lucide-react"
import { DebaterScorecard } from "@/components/analytics/debater-scorecard"
import { LeaderboardTable } from "@/components/analytics/leaderboard-table"
import { ArgumentStrengthChart } from "@/components/analytics/argument-strength-chart"
import { Card } from "@/components/ui/card"
import { useDebateData } from "@/context/DebateContext"

export default function AnalyticsPage() {
  const {
    analytics,
    analyticsLoading,
    analyticsError,
    refreshAnalytics,
    arguments: argumentsData,
    refreshArguments,
  } = useDebateData()

  // Fetch analytics and arguments on mount if not already cached
  useEffect(() => {
    if (!analytics && !analyticsError) {
      refreshAnalytics()
    }
    if (argumentsData.length === 0) {
      refreshArguments()
    }
  }, [analytics, analyticsError, argumentsData.length, refreshAnalytics, refreshArguments])

  const loading = analyticsLoading
  const error = analyticsError

  // Compute leaderboard from arguments (group by speaker)
  const leaderboardData = (() => {
    const speakerMap: Record<string, { debates: Set<string>; totalCredibility: number; count: number; strongArgs: number }> = {}
    argumentsData.forEach((arg) => {
      const name = arg.speakerName || "Unknown"
      if (!speakerMap[name]) {
        speakerMap[name] = { debates: new Set(), totalCredibility: 0, count: 0, strongArgs: 0 }
      }
      speakerMap[name].debates.add(arg.debateId)
      speakerMap[name].totalCredibility += arg.credibilityScore || 0
      speakerMap[name].count += 1
      if ((arg.credibilityScore || 0) >= 0.7) speakerMap[name].strongArgs += 1
    })
    return Object.entries(speakerMap)
      .map(([name, data], idx) => ({
        rank: idx + 1,
        name,
        avatar: "/placeholder.svg?height=40&width=40",
        points: Math.round(data.totalCredibility * 1000),
        debates: data.debates.size,
        winRate: data.count > 0 ? Math.round((data.strongArgs / data.count) * 100) : 0,
        trend: "stable" as const,
        rankChange: 0,
      }))
      .sort((a, b) => b.points - a.points)
      .map((entry, idx) => ({ ...entry, rank: idx + 1 }))
  })()

  // Top debater is the first in leaderboard
  const topDebater = leaderboardData[0]
    ? {
        name: leaderboardData[0].name,
        avatar: leaderboardData[0].avatar,
        rank: 1,
        totalDebates: leaderboardData[0].debates,
        winRate: leaderboardData[0].winRate,
        avgArgumentStrength: Math.round((leaderboardData[0].points / 1000) * 10) / 10,
        specialties: ["Debate"],
        stats: {
          strongArguments: leaderboardData[0].winRate,
          factCheckScore: leaderboardData[0].winRate,
          logicalConsistency: leaderboardData[0].winRate,
          audienceEngagement: 0,
        },
      }
    : null

  // Argument strength data from real arguments
  const argumentStrengthData = {
    debater: topDebater?.name || "N/A",
    arguments: argumentsData.slice(0, 5).map((arg) => ({
      timestamp: new Date(arg.createdAt).toLocaleString(),
      strength: Math.round((arg.credibilityScore || 0) * 100),
      topic: arg.claim?.slice(0, 30) + (arg.claim?.length > 30 ? "..." : ""),
    })),
  }

  const totalArguments = analytics?.totalArguments || 0
  const fallaciesDetected = analytics?.fallaciesDetected || 0
  const averageCredibility = analytics?.averageCredibility || 0

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

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <Card className="p-6 border-red-500/50 mb-8">
            <p className="text-red-500">Error: {error}</p>
          </Card>
        )}

        {!loading && !error && (
          <>
            {/* Stats Overview */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Arguments</p>
                    <p className="text-3xl font-bold mt-1">{totalArguments}</p>
                    <p className="text-xs text-muted-foreground mt-1">In current debate</p>
                  </div>
                  <Users className="size-10 text-accent" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Credibility</p>
                    <p className="text-3xl font-bold mt-1">{(averageCredibility * 100).toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground mt-1">Across all arguments</p>
                  </div>
                  <TrendingUp className="size-10 text-accent" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Fallacies Detected</p>
                    <p className="text-3xl font-bold mt-1">{fallaciesDetected}</p>
                    <p className="text-xs text-muted-foreground mt-1">In current debate</p>
                  </div>
                  <Trophy className="size-10 text-accent" />
                </div>
              </Card>
            </div>

            {/* Top Debater Scorecard */}
            {topDebater && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Top Ranked Debater</h2>
                <DebaterScorecard debater={topDebater} />
              </div>
            )}

            {/* Leaderboard */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
              {leaderboardData.length > 0 ? (
                <LeaderboardTable entries={leaderboardData} />
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">No debater data yet. Submit arguments to see rankings.</p>
                </Card>
              )}
            </div>

            {/* Argument Strength Chart */}
            <div>
              <h2 className="text-xl font-bold mb-4">Recent Performance</h2>
              {argumentStrengthData.arguments.length > 0 ? (
                <ArgumentStrengthChart data={argumentStrengthData} />
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">No argument data yet.</p>
                </Card>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
