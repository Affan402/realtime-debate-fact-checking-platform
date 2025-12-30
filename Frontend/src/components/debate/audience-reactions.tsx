"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown, AlertCircle, Heart } from "lucide-react"

interface AudienceReactionsProps {
  reactions: {
    agree: number
    disagree: number
    factCheck: number
    support: number
  }
  onReact: (type: "agree" | "disagree" | "factCheck" | "support") => void
  userReaction: string | null
}

export function AudienceReactions({ reactions, onReact, userReaction }: AudienceReactionsProps) {
  const reactionButtons = [
    { type: "agree" as const, icon: ThumbsUp, label: "Agree", count: reactions.agree, color: "text-green-500" },
    {
      type: "disagree" as const,
      icon: ThumbsDown,
      label: "Disagree",
      count: reactions.disagree,
      color: "text-red-500",
    },
    {
      type: "factCheck" as const,
      icon: AlertCircle,
      label: "Fact Check",
      count: reactions.factCheck,
      color: "text-yellow-500",
    },
    { type: "support" as const, icon: Heart, label: "Support", count: reactions.support, color: "text-accent" },
  ]

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Audience Reactions</h3>
      <div className="space-y-3">
        {reactionButtons.map(({ type, icon: Icon, label, count, color }) => (
          <Button
            key={type}
            variant={userReaction === type ? "default" : "outline"}
            className="w-full justify-between h-auto py-3"
            onClick={() => onReact(type)}
          >
            <div className="flex items-center gap-2">
              <Icon className={`size-5 ${userReaction === type ? "" : color}`} />
              <span>{label}</span>
            </div>
            <span className="font-semibold">{count}</span>
          </Button>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-sm text-muted-foreground text-center">
          React in real-time to show your support or request fact-checking
        </p>
      </div>
    </Card>
  )
}
