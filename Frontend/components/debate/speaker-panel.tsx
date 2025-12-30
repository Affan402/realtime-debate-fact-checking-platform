"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Mic, MicOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface SpeakerPanelProps {
  speakers: {
    id: string
    name: string
    avatar?: string
    isActive: boolean
    timeRemaining: number
    totalTime: number
  }[]
}

export function SpeakerPanel({ speakers }: SpeakerPanelProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {speakers.map((speaker) => {
        const timePercentage = (speaker.timeRemaining / speaker.totalTime) * 100
        const isLowTime = timePercentage < 20

        return (
          <Card
            key={speaker.id}
            className={cn("p-6 transition-all duration-300", speaker.isActive && "ring-2 ring-accent border-accent/50")}
          >
            <div className="flex items-start gap-4">
              <div className="relative">
                <Avatar className="size-16 border-2 border-border">
                  <AvatarImage src={speaker.avatar || "/placeholder.svg"} alt={speaker.name} />
                  <AvatarFallback>{speaker.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                {speaker.isActive && (
                  <div className="absolute -bottom-1 -right-1 size-6 bg-accent rounded-full flex items-center justify-center">
                    <Mic className="size-4 text-accent-foreground" />
                  </div>
                )}
                {!speaker.isActive && (
                  <div className="absolute -bottom-1 -right-1 size-6 bg-muted rounded-full flex items-center justify-center">
                    <MicOff className="size-4 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold truncate">{speaker.name}</h3>
                  {speaker.isActive && (
                    <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                      Speaking
                    </Badge>
                  )}
                </div>

                {/* Timer */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Time Remaining</span>
                    <span className={cn("font-mono font-semibold", isLowTime && "text-destructive")}>
                      {Math.floor(speaker.timeRemaining / 60)}:{String(speaker.timeRemaining % 60).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all duration-1000 rounded-full",
                        isLowTime ? "bg-destructive" : "bg-accent",
                      )}
                      style={{ width: `${timePercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
