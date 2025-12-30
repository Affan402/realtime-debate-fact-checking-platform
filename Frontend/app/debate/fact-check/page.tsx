import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp } from "lucide-react"
import { FactCheckPanel } from "@/components/debate/fact-check-panel"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function FactCheckPage() {
  const factChecks = [
    {
      id: "1",
      claim: "China's investment in AI has reached $150B annually",
      credibility: "medium" as const,
      explanation:
        "While China has made significant AI investments, the exact figure is disputed. Multiple sources estimate between $75B-$150B annually when including both public and private sector investments. The claim uses the upper bound estimate.",
      sources: [
        {
          title: "China AI Investment Report 2024",
          url: "https://example.com/report",
          domain: "techpolicy.org",
        },
        {
          title: "Global AI Funding Tracker",
          url: "https://example.com/tracker",
          domain: "aiindex.org",
        },
        {
          title: "Analysis of Chinese Tech Spending",
          url: "https://example.com/analysis",
          domain: "reuters.com",
        },
      ],
      aiConfidence: 72,
      timestamp: "2 minutes ago",
      speaker: "Marcus Johnson",
    },
    {
      id: "2",
      claim: "67% of AI systems lack proper oversight mechanisms",
      credibility: "high" as const,
      explanation:
        "This statistic is from a peer-reviewed Stanford HAI study published in March 2024, which surveyed 500+ AI systems across industries. The methodology is sound and the finding is widely cited in academic literature.",
      sources: [
        {
          title: "Stanford HAI AI Oversight Study",
          url: "https://example.com/stanford",
          domain: "hai.stanford.edu",
        },
        {
          title: "AI Governance Report 2024",
          url: "https://example.com/governance",
          domain: "nature.com",
        },
      ],
      aiConfidence: 94,
      timestamp: "5 minutes ago",
      speaker: "Sarah Chen",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/debate/room">
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
                <p className="text-2xl font-bold mt-1">24</p>
              </div>
              <TrendingUp className="size-8 text-accent" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Credibility</p>
                <p className="text-2xl font-bold mt-1">67%</p>
              </div>
              <div className="size-3 rounded-full bg-green-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Needs Review</p>
                <p className="text-2xl font-bold mt-1">8</p>
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

          {factChecks.map((check) => (
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
