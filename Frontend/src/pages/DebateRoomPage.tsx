"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { SpeakerPanel } from "@/components/debate/speaker-panel"
import { ArgumentInput } from "@/components/debate/argument-input"
import { AudienceReactions } from "@/components/debate/audience-reactions"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users, BarChart3, Loader2, CheckCircle2 } from "lucide-react"
import { argumentAPI } from "@/services/api"

export default function DebateRoomPage() {
  const [speakers, setSpeakers] = useState([
    {
      id: "1",
      name: "Sarah Chen",
      avatar: "/professional-woman-diverse.png",
      isActive: true,
      timeRemaining: 180,
      totalTime: 300,
    },
    {
      id: "2",
      name: "Marcus Johnson",
      avatar: "/professional-man.jpg",
      isActive: false,
      timeRemaining: 300,
      totalTime: 300,
    },
  ])

  const [reactions, setReactions] = useState({
    agree: 42,
    disagree: 18,
    factCheck: 7,
    support: 33,
  })

  const [userReaction, setUserReaction] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [lastArgument, setLastArgument] = useState<any>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Simulate timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeakers((prev) =>
        prev.map((speaker) => {
          if (speaker.isActive && speaker.timeRemaining > 0) {
            return { ...speaker, timeRemaining: speaker.timeRemaining - 1 }
          }
          return speaker
        }),
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleReaction = (type: "agree" | "disagree" | "factCheck" | "support") => {
    setUserReaction(type)
    setReactions((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }))
  }

  const handleSubmitArgument = async (argument: string) => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      const response = await argumentAPI.createArgument({
        debateId: "1786435967997",
        speakerName: speakers.find((s) => s.isActive)?.name || "Anonymous",
        claim: argument,
        evidence: "",
      })
      setLastArgument(response.data)
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit argument")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/">
                  <ArrowLeft className="size-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-bold">The Future of AI Regulation</h1>
                <div className="flex items-center gap-3 mt-1">
                  <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                    Live
                  </Badge>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Users className="size-4" />
                    <span>247 watching</span>
                  </div>
                </div>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link to="/debate/arguments">
                <BarChart3 className="size-4 mr-2" />
                View Arguments
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Speakers & Argument Input */}
          <div className="lg:col-span-2 space-y-6">
            <SpeakerPanel speakers={speakers} />
            <ArgumentInput
              onSubmit={handleSubmitArgument}
              disabled={submitting}
              placeholder="Make your point with evidence and reasoning..."
            />
            {submitting && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                <span>Analyzing your argument for fallacies...</span>
              </div>
            )}
            {submitError && (
              <div className="text-sm text-red-500">
                Error: {submitError}
              </div>
            )}
            {lastArgument && !submitting && (
              <div className="flex items-start gap-2 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <CheckCircle2 className="size-5 text-green-500 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-green-500">Argument submitted & analyzed!</p>
                  {lastArgument.fallacy && lastArgument.fallacy !== "None" && (
                    <p className="text-muted-foreground mt-1">
                      Fallacy detected: <span className="font-medium text-yellow-500">{lastArgument.fallacy}</span>
                    </p>
                  )}
                  {lastArgument.credibilityScore !== undefined && (
                    <p className="text-muted-foreground mt-0.5">
                      Credibility score: <span className="font-medium">{(lastArgument.credibilityScore * 100).toFixed(0)}%</span>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Audience Reactions */}
          <div className="lg:col-span-1">
            <AudienceReactions reactions={reactions} onReact={handleReaction} userReaction={userReaction} />
          </div>
        </div>
      </div>
    </div>
  )
}
