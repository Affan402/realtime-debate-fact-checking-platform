import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Filter } from "lucide-react"
import { ArgumentCard } from "@/components/debate/argument-card"
import { ArgumentFlow } from "@/components/debate/argument-flow"

export default function ArgumentsPage() {
  const sampleArguments = [
    {
      id: "1",
      speaker: {
        name: "Sarah Chen",
        avatar: "/professional-woman-diverse.png",
      },
      claim:
        "AI systems require immediate regulatory oversight to prevent potential misuse and ensure ethical deployment",
      evidence: [
        "Recent studies show 67% of AI systems lack proper oversight mechanisms",
        "Historical precedent from other tech regulations (GDPR) shows effectiveness",
        "Industry leaders including OpenAI CEO Sam Altman have called for regulation",
      ],
      conclusion:
        "Therefore, regulatory frameworks must be established now rather than waiting for market self-correction",
      timestamp: "2 minutes ago",
      reactions: 24,
      strength: "strong" as const,
      hasWarning: false,
      factCheckStatus: {
        isChecking: false,
        hasIssue: true,
        issueType: "verified" as const,
      },
    },
    {
      id: "2",
      speaker: {
        name: "Marcus Johnson",
        avatar: "/professional-man.jpg",
      },
      claim: "Over-regulation will stifle innovation and put the US behind in the global AI race",
      evidence: [
        "China's investment in AI has reached $150B annually without heavy regulation",
        "Startup formation in heavily regulated sectors drops by 40% on average",
      ],
      conclusion: "We need to balance innovation with safety through industry-led standards first",
      timestamp: "5 minutes ago",
      reactions: 18,
      strength: "medium" as const,
      hasWarning: true,
      warningType: "fallacy" as const,
      factCheckStatus: {
        isChecking: false,
        hasIssue: true,
        issueType: "low-credibility" as const,
      },
    },
  ]

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
              <Badge variant="secondary">All Arguments</Badge>
              <Badge variant="outline">Strong Points</Badge>
              <Badge variant="outline">Needs Review</Badge>
            </div>

            {sampleArguments.map((arg) => (
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
