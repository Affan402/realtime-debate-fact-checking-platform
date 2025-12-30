"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, GitBranch } from "lucide-react"
import { cn } from "@/lib/utils"

interface ArgumentNode {
  id: string
  speaker: string
  claim: string
  type: "claim" | "rebuttal" | "support" | "counter"
  children?: ArgumentNode[]
}

interface ArgumentFlowProps {
  rootArgument: ArgumentNode
}

function ArgumentNode({ node, depth = 0 }: { node: ArgumentNode; depth?: number }) {
  const typeColors = {
    claim: "bg-accent/10 text-accent border-accent/20",
    rebuttal: "bg-destructive/10 text-destructive border-destructive/20",
    support: "bg-green-500/10 text-green-500 border-green-500/20",
    counter: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  }

  return (
    <div className="space-y-3">
      <div className={cn("flex items-start gap-3", depth > 0 && "ml-8")}>
        {depth > 0 && (
          <div className="flex flex-col items-center pt-2">
            <ArrowDown className="size-4 text-muted-foreground" />
          </div>
        )}

        <Card className={cn("flex-1 p-4", depth > 0 && "bg-card/50")}>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Badge variant="outline" className={typeColors[node.type]}>
                {node.type}
              </Badge>
              <span className="text-xs text-muted-foreground">{node.speaker}</span>
            </div>
            <p className="text-sm leading-relaxed">{node.claim}</p>
          </div>
        </Card>
      </div>

      {node.children && node.children.length > 0 && (
        <div className="space-y-3">
          {node.children.length > 1 && (
            <div className="flex items-center gap-2 ml-8 text-xs text-muted-foreground">
              <GitBranch className="size-4" />
              <span>Multiple responses</span>
            </div>
          )}
          {node.children.map((child) => (
            <ArgumentNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export function ArgumentFlow({ rootArgument }: ArgumentFlowProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-1">Argument Thread</h3>
          <p className="text-sm text-muted-foreground">Visual flow of claims and responses</p>
        </div>

        <ArgumentNode node={rootArgument} />
      </div>
    </Card>
  )
}
