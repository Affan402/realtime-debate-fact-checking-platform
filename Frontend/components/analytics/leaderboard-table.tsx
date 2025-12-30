import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface LeaderboardEntry {
  rank: number
  name: string
  avatar?: string
  points: number
  debates: number
  winRate: number
  trend: "up" | "down" | "stable"
  rankChange: number
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
}

export function LeaderboardTable({ entries }: LeaderboardTableProps) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left p-4 text-sm font-semibold">Rank</th>
              <th className="text-left p-4 text-sm font-semibold">Debater</th>
              <th className="text-right p-4 text-sm font-semibold">Points</th>
              <th className="text-right p-4 text-sm font-semibold">Debates</th>
              <th className="text-right p-4 text-sm font-semibold">Win Rate</th>
              <th className="text-right p-4 text-sm font-semibold">Trend</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.rank} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className={cn("font-bold text-lg", entry.rank <= 3 && "text-accent")}>#{entry.rank}</span>
                    {entry.rankChange !== 0 && (
                      <span
                        className={cn(
                          "text-xs",
                          entry.trend === "up" && "text-green-500",
                          entry.trend === "down" && "text-red-500",
                        )}
                      >
                        {entry.trend === "up" && `+${entry.rankChange}`}
                        {entry.trend === "down" && entry.rankChange}
                      </span>
                    )}
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 border-2 border-border">
                      <AvatarImage src={entry.avatar || "/placeholder.svg"} alt={entry.name} />
                      <AvatarFallback>{entry.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="font-semibold">{entry.name}</span>
                  </div>
                </td>

                <td className="p-4 text-right">
                  <span className="font-bold">{entry.points.toLocaleString()}</span>
                </td>

                <td className="p-4 text-right">
                  <span className="text-muted-foreground">{entry.debates}</span>
                </td>

                <td className="p-4 text-right">
                  <Badge
                    variant="outline"
                    className={cn(
                      entry.winRate >= 70 && "bg-green-500/10 text-green-500 border-green-500/20",
                      entry.winRate >= 50 && entry.winRate < 70 && "bg-blue-500/10 text-blue-500 border-blue-500/20",
                      entry.winRate < 50 && "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
                    )}
                  >
                    {entry.winRate}%
                  </Badge>
                </td>

                <td className="p-4 text-right">
                  <div className="flex items-center justify-end">
                    {entry.trend === "up" && <TrendingUp className="size-5 text-green-500" />}
                    {entry.trend === "down" && <TrendingDown className="size-5 text-red-500" />}
                    {entry.trend === "stable" && <Minus className="size-5 text-muted-foreground" />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
