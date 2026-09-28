import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, Users, Clock, Loader2, Plus, Sparkles } from "lucide-react"
import { useDebateData } from "@/context/DebateContext"

export default function DebatesPage() {
  const { debates, debatesLoading, debatesError, refreshDebates, createDebate, setActiveDebateId } = useDebateData()

  // Fetch debates on mount if not already cached
  useEffect(() => {
    if (debates.length === 0 && !debatesError) {
      refreshDebates()
    }
  }, [debates.length, debatesError, refreshDebates])

  const loading = debatesLoading
  const error = debatesError

  // ---- Create-debate dialog state ----
  const [createOpen, setCreateOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [topic, setTopic] = useState("")
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  const resetForm = () => {
    setTitle("")
    setTopic("")
    setCreateError(null)
  }

  const handleCreate = async () => {
    if (!title.trim() || !topic.trim()) {
      setCreateError("Title and topic are required")
      return
    }
    setCreating(true)
    setCreateError(null)
    try {
      const newDebate = await createDebate({ title: title.trim(), topic: topic.trim() })
      setCreateOpen(false)
      resetForm()
      // If the API returned the new debate, set it active so the user can
      // jump straight into the room and start submitting arguments.
      if (newDebate?.id || newDebate?._id) {
        setActiveDebateId(newDebate.id || newDebate._id)
      }
    } catch (err: any) {
      setCreateError(err.message || "Failed to create debate")
    } finally {
      setCreating(false)
    }
  }

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
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Browse Debates</h1>
            <p className="text-muted-foreground mt-1">Join live debates or explore past discussions</p>
          </div>
          <Dialog open={createOpen} onOpenChange={(open) => { setCreateOpen(open); if (!open) resetForm() }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="size-4 mr-2" />
                New Debate
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="size-5 text-accent" />
                  Start a New Debate
                </DialogTitle>
                <DialogDescription>
                  Create a new debate room. Fill in a title and topic to get started.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="debate-title">Title</Label>
                  <Input
                    id="debate-title"
                    placeholder="e.g. The Future of AI Regulation"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={creating}
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="debate-topic">Topic</Label>
                  <Input
                    id="debate-topic"
                    placeholder="e.g. Technology"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    disabled={creating}
                  />
                </div>
                {createError && (
                  <p className="text-sm text-red-500">{createError}</p>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => { setCreateOpen(false); resetForm() }}
                  disabled={creating}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={creating || !title.trim() || !topic.trim()}>
                  {creating ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Creating…
                    </>
                  ) : (
                    "Create Debate"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
            <Sparkles className="size-10 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No debates yet</h3>
            <p className="text-muted-foreground mb-6">Be the first to start a debate on this platform.</p>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="size-4 mr-2" />
              Create Your First Debate
            </Button>
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
                  <Link to={`/debate/room/${debate.id}`}>
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
