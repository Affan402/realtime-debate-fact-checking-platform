"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ArgumentStrengthChartProps {
  data: {
    debater: string
    arguments: {
      timestamp: string
      strength: number
      topic: string
    }[]
  }
}

export function ArgumentStrengthChart({ data }: ArgumentStrengthChartProps) {
  const maxStrength = 100

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-1">Argument Strength Over Time</h3>
          <p className="text-sm text-muted-foreground">{data.debater}</p>
        </div>

        {/* Simple Bar Chart */}
        <div className="space-y-3">
          {data.arguments.map((arg, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{arg.topic}</span>
                <span className="font-semibold">{arg.strength}%</span>
              </div>
              <div className="relative h-8 bg-secondary rounded-lg overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent to-accent/70 flex items-center px-2 transition-all duration-500"
                  style={{ width: `${(arg.strength / maxStrength) * 100}%` }}
                >
                  <span className="text-xs font-medium text-accent-foreground">{arg.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">
            Strong (70-100)
          </Badge>
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-xs">
            Medium (40-69)
          </Badge>
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-xs">
            Weak (0-39)
          </Badge>
        </div>
      </div>
    </Card>
  )
}
