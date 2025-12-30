import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Mic, TrendingUp, Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-6">
              <Sparkles className="size-4 text-accent" />
              <span className="text-sm text-accent font-medium">AI-Powered Debate Platform</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-balance">
              The future of <span className="text-accent">intelligent</span> debate
            </h1>

            <p className="text-xl text-muted-foreground mb-8 text-pretty leading-relaxed">
              Experience real-time fact-checking, AI-powered argument analysis, and structured discourse that elevates
              every conversation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-base">
                <Link to="/debate/room">Start Debating</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base bg-transparent">
                <Link to="/debates">Browse Debates</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="container mx-auto px-4 pb-20">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="size-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Mic className="size-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Live Debate Rooms</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Turn-based speaking with real-time timers and audience engagement
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="size-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="size-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI Fact-Checking</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Instant credibility scores and source verification for every claim
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="size-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="size-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Performance Analytics</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Track argument strength, detect fallacies, and climb the leaderboard
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Explore Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" asChild className="h-auto py-4 flex-col gap-2 bg-transparent">
              <Link to="/debate/arguments">
                <span className="font-semibold">Argument Analysis</span>
                <span className="text-xs text-muted-foreground">Structured breakdown</span>
              </Link>
            </Button>

            <Button variant="outline" asChild className="h-auto py-4 flex-col gap-2 bg-transparent">
              <Link to="/debate/fact-check">
                <span className="font-semibold">Fact Checks</span>
                <span className="text-xs text-muted-foreground">Credibility scores</span>
              </Link>
            </Button>

            <Button variant="outline" asChild className="h-auto py-4 flex-col gap-2 bg-transparent">
              <Link to="/analytics">
                <span className="font-semibold">Analytics</span>
                <span className="text-xs text-muted-foreground">Performance tracking</span>
              </Link>
            </Button>

            <Button variant="outline" asChild className="h-auto py-4 flex-col gap-2 bg-transparent">
              <Link to="/ai-feedback">
                <span className="font-semibold">AI Insights</span>
                <span className="text-xs text-muted-foreground">Fallacies & bias</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
