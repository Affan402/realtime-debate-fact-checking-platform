import { useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { FallacyDetector } from "@/components/ai/fallacy-detector.tsx"
import { BiasWarning } from "@/components/ai/bias-warning.tsx"
import { DevilsAdvocate } from "@/components/ai/devils-advocate.tsx"
import { DebateSummary } from "@/components/ai/debate-summary.tsx"
import { Card } from "@/components/ui/card"
import { useDebateData } from "@/context/DebateContext"

export default function AIFeedbackPage() {
  const { aiFeedback: feedback, aiFeedbackLoading, aiFeedbackError, refreshAIFeedback } = useDebateData()

  // Fetch AI feedback on mount if not already cached
  useEffect(() => {
    if (!feedback && !aiFeedbackError) {
      refreshAIFeedback()
    }
  }, [feedback, aiFeedbackError, refreshAIFeedback])

  const loading = aiFeedbackLoading
  const error = aiFeedbackError

  // Map backend feedback to component-expected shapes
  const summaryData = feedback
    ? {
        topic: `Debate ${feedback.debateId}`,
        duration: "Live",
        speakers: feedback.speakers || [],
        keyPoints: (feedback.keyPoints || []).map((kp: any) => ({
          speaker: kp.speaker,
          point: kp.point,
          impact: kp.impact as "high" | "medium" | "low",
        })),
        winner: feedback.winner || "N/A",
        winReason: "Based on average credibility score across arguments",
        audienceStats: {
          totalReactions: 0,
          mostEngaging: feedback.winner || "N/A",
        },
        aiInsight: feedback.summary || "No summary available",
      }
    : null

  const fallacyData =
    feedback?.fallacies && feedback.fallacies.length > 0
      ? {
          type: (feedback.fallacies[0].fallacy || "unknown").toLowerCase().replace(/\s+/g, "") as any,
          confidence: feedback.fallacies[0].confidence || 50,
          explanation:
            feedback.fallacies[0].explanation ||
            `Fallacy detected in argument by ${feedback.fallacies[0].speaker}`,
          suggestion: "Review the argument and address the logical issue identified.",
          quote: feedback.fallacies[0].claim || "",
        }
      : null

  const biasData = {
    type: "confirmation" as const,
    severity: "low" as const,
    description:
      "Bias analysis is based on argument credibility scores. Arguments with lower credibility may indicate selective evidence use.",
    examples: feedback?.fallacies?.map((f: any) => `${f.speaker}: ${f.claim}`) || [],
    mitigation:
      "Encourage debaters to present balanced evidence and acknowledge counter-arguments.",
  }

  const devilsAdvocateData = {
    originalClaim: feedback?.keyPoints?.[0]?.point || "No arguments available",
    counterArgument:
      "Counter-argument generation requires the devil's advocate endpoint. Use the button below to generate one.",
    evidence: [],
    conclusion: "",
    strength: 0,
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
            <h1 className="text-3xl font-bold">AI Feedback Dashboard</h1>
            <p className="text-muted-foreground mt-1">Real-time analysis and insights powered by AI</p>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <Card className="p-6 border-red-500/50 mb-6">
            <p className="text-red-500">Error: {error}</p>
          </Card>
        )}

        {!loading && !error && (
          <div className="space-y-6 max-w-4xl">
            {/* Debate Summary */}
            {summaryData && <DebateSummary summary={summaryData} />}

            {/* Fallacy Detection */}
            <div>
              <h2 className="text-xl font-bold mb-4">Logical Fallacies</h2>
              {fallacyData ? (
                <FallacyDetector fallacy={fallacyData} />
              ) : (
                <Card className="p-6">
                  <p className="text-muted-foreground">
                    No fallacies detected in the current debate arguments.
                  </p>
                </Card>
              )}
            </div>

            {/* Bias Warnings */}
            <div>
              <h2 className="text-xl font-bold mb-4">Bias Analysis</h2>
              <BiasWarning bias={biasData} />
            </div>

            {/* Devil's Advocate */}
            <div>
              <h2 className="text-xl font-bold mb-4">Alternative Perspectives</h2>
              <DevilsAdvocate response={devilsAdvocateData} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
