import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users, Clock } from "lucide-react"

export default function DebatesPage() {
  const debates = [
    {
      id: "1",
      title: "The Future of AI Regulation",
      topic: "Technology",
      status: "live",
      viewers: 247,
      speakers: ["Sarah Chen", "Marcus Johnson"],
      startedAt: "15 min ago",
    },
    {
      id: "2",
      title: "Universal Basic Income: Necessity or Luxury?",
      topic: "Economics",
      status: "scheduled",
      viewers: 0,
      speakers: ["Dr. Emily Roberts", "Prof. James Williams"],
      startedAt: "Starts in 30 min",
    },
    {
      id: "3",
      title: "Climate Action: Individual vs Corporate Responsibility",
      topic: "Environment",
      status: "completed",
      viewers: 1203,
      speakers: ["Alex Rivera", "Jordan Smith"],
      startedAt: "2 hours ago",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Browse Debates</h1>
            <p className="text-muted-foreground mt-1">Join live debates or explore past discussions</p>
          </div>
        </div>

        <div className="grid gap-4 max-w-4xl">
          {debates.map((debate) => (
            <Card key={debate.id} className="p-6 hover:border-accent/50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{debate.topic}</Badge>
                    {debate.status === "live" && (
                      <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                        Live
                      </Badge>
                    )}
                    {debate.status === "scheduled" && <Badge variant="secondary">Upcoming</Badge>}
                  </div>

                  <h2 className="text-xl font-semibold mb-2 text-balance">{debate.title}</h2>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Users className="size-4" />
                      <span>
                        {debate.viewers} {debate.status === "live" ? "watching" : "watched"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="size-4" />
                      <span>{debate.startedAt}</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-sm text-muted-foreground">{debate.speakers.join(" vs ")}</p>
                  </div>
                </div>

                <Button asChild>
                  <Link to="/debate/room">
                    {debate.status === "live" ? "Join" : debate.status === "scheduled" ? "Set Reminder" : "Watch"}
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
