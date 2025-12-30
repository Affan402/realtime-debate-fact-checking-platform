import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Mic, MicOff } from "lucide-react"

interface Speaker {
  id: string
  name: string
  avatar: string
  isActive: boolean
  timeRemaining: number
  totalTime: number
}

interface SpeakerPanelProps {
  speakers: Speaker[]
}

export function SpeakerPanel({ speakers }: SpeakerPanelProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {speakers.map((speaker) => (
        <Card
          key={speaker.id}
          className={`p-6 transition-all ${speaker.isActive ? "border-accent shadow-lg shadow-accent/20" : ""}`}
        >
          <div className="flex items-start gap-4">
            <Avatar className="size-16">
              <AvatarImage src={speaker.avatar || "/placeholder.svg"} alt={speaker.name} />
              <AvatarFallback>{speaker.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">{speaker.name}</h3>
                {speaker.isActive ? (
                  <div className="flex items-center gap-1.5 text-accent">
                    <Mic className="size-4" />
                    <span className="text-sm font-medium">Speaking</span>
                  </div>
                ) : (
                  <MicOff className="size-4 text-muted-foreground" />
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Time Remaining</span>
                  <span className={`font-mono font-semibold ${speaker.isActive ? "text-accent" : ""}`}>
                    {formatTime(speaker.timeRemaining)}
                  </span>
                </div>
                <Progress value={(speaker.timeRemaining / speaker.totalTime) * 100} className="h-2" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
