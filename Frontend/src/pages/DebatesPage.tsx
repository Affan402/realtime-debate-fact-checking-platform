import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users, Clock, Loader2 } from "lucide-react"
import { debateAPI } from "@/services/api"

export default function DebatesPage() {
  const [debates, setDebates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadDebates = async () => {
      try {
        setLoading(true)
        const response = await debateAPI.getDebates()
        setDebates(response.data || [])
      } catch (err: any) {
        setError(err.message || "Failed to load debates")
      } finally {
        setLoading(false)
      }
    }
    loadDebates()
  }, [])

  const formatTimeAgo = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "just now"
    if (mins < 60) return `${mins} min ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

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

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <Card className="p-6 max-w-4xl border-red-500/50">
            <p className="text-red-500">Error: {error}</p>
          </Card>
        )}

        {!loading && !error && debates.length === 0 && (
          <Card className="p-12 max-w-4xl text-center">
            <p className="text-muted-foreground">No debates yet. Start a new debate from the home page!</p>
          </Card>
        )}

        <div className="grid gap-4 max-w-4xl">
          {!loading && !error && debates.map((debate) => (
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
                    {debate.status === "active" && (
                      <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
                        Active
                      </Badge>
                    )}
                    {debate.status === "completed" && <Badge variant="secondary">Completed</Badge>}
                  </div>

                  <h2 className="text-xl font-semibold mb-2 text-balance">{debate.title}</h2>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Users className="size-4" />
                      <span>{debate.viewers || 0} {(debate.status === "live" || debate.status === "active") ? "watching" : "watched"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="size-4" />
                      <span>{formatTimeAgo(debate.createdAt)}</span>
                    </div>
                  </div>

                  {debate.speakers && debate.speakers.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-muted-foreground">{debate.speakers.join(" vs ")}</p>
                    </div>
                  )}
                </div>

                <Button asChild>
                  <Link to="/debate/room">
                    {(debate.status === "live" || debate.status === "active") ? "Join" : debate.status === "scheduled" ? "Set Reminder" : "Watch"}
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
