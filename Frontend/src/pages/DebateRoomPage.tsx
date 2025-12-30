"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { SpeakerPanel } from "@/components/debate/speaker-panel"
import { ArgumentInput } from "@/components/debate/argument-input"
import { AudienceReactions } from "@/components/debate/audience-reactions"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users, BarChart3 } from "lucide-react"

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

  const handleSubmitArgument = (argument: string) => {
    console.log("[v0] New argument submitted:", argument)
    // Handle argument submission
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
              disabled={false}
              placeholder="Make your point with evidence and reasoning..."
            />
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
