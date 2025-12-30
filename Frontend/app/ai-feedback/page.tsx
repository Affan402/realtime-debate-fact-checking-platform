import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { FallacyDetector } from "@/components/ai/fallacy-detector"
import { BiasWarning } from "@/components/ai/bias-warning"
import { DevilsAdvocate } from "@/components/ai/devils-advocate"
import { DebateSummary } from "@/components/ai/debate-summary"

export default function AIFeedbackPage() {
  const fallacyExample = {
    type: "strawman" as const,
    confidence: 87,
    explanation:
      "The argument misrepresents the opponent's position by exaggerating it to an extreme that wasn't actually claimed. The original argument was about regulation timing, but this characterizes it as complete prohibition.",
    suggestion:
      "Address the actual argument about regulatory timing rather than the extreme position. Acknowledge the nuance in the opponent's stance.",
    quote: "My opponent wants to completely ban AI development and destroy American innovation",
  }

  const biasExample = {
    type: "confirmation" as const,
    severity: "medium" as const,
    description:
      "The argument selectively presents evidence that supports a pre-existing belief while ignoring contradictory data about successful technology regulations.",
    examples: [
      "Citing only failed regulation attempts while ignoring GDPR and other successful frameworks",
      "Focusing on China's spending without discussing their quality or outcomes",
    ],
    mitigation:
      "Acknowledge counter-examples and discuss why certain regulations succeeded while others failed. Present a more balanced view of international AI development.",
  }

  const devilsAdvocateExample = {
    originalClaim: "Over-regulation will stifle innovation and put the US behind in the global AI race",
    counterArgument:
      "Strategic regulation can actually accelerate responsible innovation by providing clear guidelines and building public trust",
    evidence: [
      "GDPR increased EU tech investment by creating a clear legal framework",
      "Medical device regulations led to higher quality innovation, not less",
      "Public trust increases when safety frameworks exist, enabling faster adoption",
    ],
    conclusion: "Well-designed regulation serves as a catalyst for sustainable innovation rather than an impediment",
    strength: 82,
  }

  const summaryExample = {
    topic: "The Future of AI Regulation",
    duration: "45 minutes",
    speakers: ["Sarah Chen", "Marcus Johnson"],
    keyPoints: [
      {
        speaker: "Sarah Chen",
        point: "Historical precedent from GDPR shows effective tech regulation is possible and beneficial",
        impact: "high" as const,
      },
      {
        speaker: "Marcus Johnson",
        point: "Current regulatory proposals lack technical understanding of AI systems",
        impact: "high" as const,
      },
      {
        speaker: "Sarah Chen",
        point: "Industry self-regulation has consistently failed in social media and requires government oversight",
        impact: "medium" as const,
      },
    ],
    winner: "Sarah Chen",
    winReason: "Stronger factual support, better logical consistency, and more effective rebuttals",
    audienceStats: {
      totalReactions: 247,
      mostEngaging: "Sarah Chen",
    },
    aiInsight:
      "Both debaters presented compelling arguments, but Sarah Chen's case benefited from stronger empirical evidence and more effective use of historical precedents. Marcus Johnson raised valid concerns about implementation complexity but could have strengthened his position with more concrete alternative proposals.",
  }

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
            <h1 className="text-3xl font-bold">AI Feedback Dashboard</h1>
            <p className="text-muted-foreground mt-1">Real-time analysis and insights powered by AI</p>
          </div>
        </div>

        <div className="space-y-6 max-w-4xl">
          {/* Debate Summary */}
          <DebateSummary summary={summaryExample} />

          {/* Fallacy Detection */}
          <div>
            <h2 className="text-xl font-bold mb-4">Logical Fallacies</h2>
            <FallacyDetector fallacy={fallacyExample} />
          </div>

          {/* Bias Warnings */}
          <div>
            <h2 className="text-xl font-bold mb-4">Bias Analysis</h2>
            <BiasWarning bias={biasExample} />
          </div>

          {/* Devil's Advocate */}
          <div>
            <h2 className="text-xl font-bold mb-4">Alternative Perspectives</h2>
            <DevilsAdvocate response={devilsAdvocateExample} />
          </div>
        </div>
      </div>
    </div>
  )
}
