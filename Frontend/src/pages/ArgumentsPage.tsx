import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Filter, Loader2 } from "lucide-react"
import { ArgumentCard } from "@/components/debate/argument-card"
import { ArgumentFlow } from "@/components/debate/argument-flow"
import { argumentAPI } from "@/services/api"

export default function ArgumentsPage() {
  const [arguments_, setArguments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | "strong" | "review">("all")

  useEffect(() => {
    const loadArguments = async () => {
      try {
        setLoading(true)
        const response = await argumentAPI.getArgumentsByDebate("1786435967997")
        const rawArgs = response.data || []
        // Map backend arguments to the shape expected by ArgumentCard
        const mapped = rawArgs.map((arg: any) => ({
          id: arg.id,
          speaker: {
            name: arg.speakerName,
            avatar: "/placeholder.svg?height=40&width=40",
          },
          claim: arg.claim,
          evidence: arg.evidence ? [arg.evidence] : [],
          conclusion: "",
          timestamp: new Date(arg.createdAt).toLocaleString(),
          reactions: 0,
          strength: arg.credibilityScore >= 0.7 ? "strong" : arg.credibilityScore >= 0.4 ? "medium" : "weak",
          hasWarning: arg.fallacy && arg.fallacy !== "None" && !(typeof arg.fallacy === "object" && Object.keys(arg.fallacy).length === 0),
          warningType: arg.fallacy && arg.fallacy !== "None" && !(typeof arg.fallacy === "object" && Object.keys(arg.fallacy).length === 0) ? "fallacy" : undefined,
          factCheckStatus: {
            isChecking: false,
            hasIssue: arg.credibilityScore < 0.7,
            issueType: arg.credibilityScore >= 0.7 ? "verified" : arg.credibilityScore >= 0.4 ? "disputed" : "low-credibility",
          },
          fallacy: arg.fallacy,
          credibilityScore: arg.credibilityScore,
        }))
        setArguments(mapped)
      } catch (err: any) {
        setError(err.message || "Failed to load arguments")
      } finally {
        setLoading(false)
      }
    }
    loadArguments()
  }, [])

  const filteredArguments = arguments_.filter((arg) => {
    if (filter === "strong") return arg.strength === "strong"
    if (filter === "review") return arg.hasWarning || arg.strength !== "strong"
    return true
  })

  const argumentThread = {
    id: "1",
    speaker: "Sarah Chen",
    claim: "AI systems require immediate regulatory oversight",
    type: "claim" as const,
    children: [
      {
        id: "2",
        speaker: "Marcus Johnson",
        claim: "This would stifle innovation and hurt competitiveness",
        type: "rebuttal" as const,
        children: [
          {
            id: "3",
            speaker: "Sarah Chen",
            claim: "Innovation without ethics leads to harmful outcomes as seen in social media",
            type: "counter" as const,
          },
          {
            id: "4",
            speaker: "Audience Member",
            claim: "Both perspectives have merit - we need balanced approach",
            type: "support" as const,
          },
        ],
      },
    ],
  }

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
            <h1 className="text-3xl font-bold">Argument Analysis</h1>
            <p className="text-muted-foreground mt-1">Structured breakdown of debate arguments</p>
          </div>

          <Button variant="outline">
            <Filter className="size-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Argument Cards */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge
                variant={filter === "all" ? "secondary" : "outline"}
                className="cursor-pointer"
                onClick={() => setFilter("all")}
              >
                All Arguments
              </Badge>
              <Badge
                variant={filter === "strong" ? "secondary" : "outline"}
                className="cursor-pointer"
                onClick={() => setFilter("strong")}
              >
                Strong Points
              </Badge>
              <Badge
                variant={filter === "review" ? "secondary" : "outline"}
                className="cursor-pointer"
                onClick={() => setFilter("review")}
              >
                Needs Review
              </Badge>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="size-8 animate-spin text-muted-foreground" />
              </div>
            )}

            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-red-500">Error: {error}</p>
              </div>
            )}

            {!loading && !error && filteredArguments.length === 0 && (
              <div className="p-12 text-center text-muted-foreground">
                {arguments_.length === 0
                  ? "No arguments yet. Submit one from the debate room!"
                  : "No arguments match this filter."}
              </div>
            )}

            {!loading && !error && filteredArguments.map((arg) => (
              <ArgumentCard key={arg.id} argument={arg} />
            ))}
          </div>

          {/* Argument Flow Visualization */}
          <div className="lg:col-span-1">
            <ArgumentFlow rootArgument={argumentThread} />
          </div>
        </div>
      </div>
    </div>
  )
}
