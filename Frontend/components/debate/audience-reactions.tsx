"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown, AlertTriangle, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface AudienceReactionsProps {
  reactions: {
    agree: number
    disagree: number
    factCheck: number
    support: number
  }
  onReact?: (type: "agree" | "disagree" | "factCheck" | "support") => void
  userReaction?: string | null
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
      icon: AlertTriangle,
      label: "Fact Check",
      count: reactions.factCheck,
      color: "text-yellow-500",
    },
    {
      type: "support" as const,
      icon: CheckCircle,
      label: "Strong Point",
      count: reactions.support,
      color: "text-accent",
    },
  ]

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-1">Audience Reactions</h3>
          <p className="text-sm text-muted-foreground">React to arguments in real-time</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {reactionButtons.map(({ type, icon: Icon, label, count, color }) => (
            <Button
              key={type}
              variant={userReaction === type ? "default" : "outline"}
              className={cn(
                "flex flex-col items-center gap-2 h-auto py-3",
                userReaction === type && "bg-accent text-accent-foreground",
              )}
              onClick={() => onReact?.(type)}
            >
              <Icon className={cn("size-5", userReaction === type ? "" : color)} />
              <span className="text-xs font-medium">{label}</span>
              <span className="text-lg font-bold">{count}</span>
            </Button>
          ))}
        </div>

        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Reactions</span>
            <span className="font-semibold">{Object.values(reactions).reduce((a, b) => a + b, 0)}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
