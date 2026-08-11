import { useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, Loader2 } from "lucide-react"
import { FactCheckPanel } from "@/components/debate/fact-check-panel"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useDebateData } from "@/context/DebateContext"

export default function FactCheckPage() {
  const { factChecks: rawChecks, factChecksLoading, factChecksError, refreshFactChecks } = useDebateData()

  // Fetch fact checks on mount if not already cached
  useEffect(() => {
    if (rawChecks.length === 0 && !factChecksError) {
      refreshFactChecks()
    }
  }, [rawChecks.length, factChecksError, refreshFactChecks])

  const loading = factChecksLoading
  const error = factChecksError

  // Map backend fact checks to the shape expected by FactCheckPanel
  const factChecks = rawChecks.map((fc: any) => ({
    id: fc.id,
    claim: fc.claim || fc.reason || "Claim not available",
    credibility: fc.verified ? "high" : fc.confidence >= 50 ? "medium" : "low",
    explanation: fc.reason || "No analysis available",
    sources: [],
    aiConfidence: fc.confidence || 0,
    timestamp: new Date(fc.createdAt).toLocaleString(),
    speaker: fc.speakerName || "Unknown",
  }))

  const stats = {
    total: factChecks.length,
    highCredibility: factChecks.filter((fc) => fc.credibility === "high").length,
    needsReview: factChecks.filter((fc) => fc.credibility !== "high").length,
  }
  const highCredibilityPct = stats.total > 0 ? Math.round((stats.highCredibility / stats.total) * 100) : 0

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/debate/room">
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Fact Check Dashboard</h1>
            <p className="text-muted-foreground mt-1">AI-powered verification of debate claims</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Claims Analyzed</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <TrendingUp className="size-8 text-accent" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Credibility</p>
                <p className="text-2xl font-bold mt-1">{highCredibilityPct}%</p>
              </div>
              <div className="size-3 rounded-full bg-green-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Needs Review</p>
                <p className="text-2xl font-bold mt-1">{stats.needsReview}</p>
              </div>
              <div className="size-3 rounded-full bg-yellow-500" />
            </div>
          </Card>
        </div>

        {/* Fact Checks */}
        <div className="space-y-6 max-w-4xl">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Recent Checks</Badge>
            <Badge variant="outline">Flagged</Badge>
            <Badge variant="outline">Verified</Badge>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {error && (
            <Card className="p-6 border-red-500/50">
              <p className="text-red-500">Error: {error}</p>
            </Card>
          )}

          {!loading && !error && factChecks.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No fact checks yet. Fact checks are created when arguments are analyzed.</p>
            </Card>
          )}

          {!loading && !error && factChecks.map((check) => (
            <div key={check.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{check.speaker}</span>
                  <span>•</span>
                  <span>{check.timestamp}</span>
                </div>
              </div>
              <FactCheckPanel factCheck={check} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
