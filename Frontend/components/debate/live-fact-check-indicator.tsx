"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LiveFactCheckIndicatorProps {
  isChecking: boolean
  hasIssue?: boolean
  issueType?: "low-credibility" | "needs-verification" | "verified"
  onViewDetails?: () => void
}

export function LiveFactCheckIndicator({
  isChecking,
  hasIssue = false,
  issueType,
  onViewDetails,
}: LiveFactCheckIndicatorProps) {
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    if (hasIssue) {
      setPulse(true)
      const timeout = setTimeout(() => setPulse(false), 1000)
      return () => clearTimeout(timeout)
    }
  }, [hasIssue])

  if (!isChecking && !hasIssue) return null

  return (
    <button
      onClick={onViewDetails}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
        isChecking && "bg-accent/10 text-accent animate-pulse",
        hasIssue && issueType === "low-credibility" && "bg-destructive/10 text-destructive",
        hasIssue && issueType === "needs-verification" && "bg-yellow-500/10 text-yellow-500",
        hasIssue && issueType === "verified" && "bg-green-500/10 text-green-500",
        pulse && "scale-105",
      )}
    >
      {isChecking && <Loader2 className="size-4 animate-spin" />}
      {hasIssue && issueType === "low-credibility" && <AlertTriangle className="size-4" />}
      {hasIssue && issueType === "verified" && <CheckCircle className="size-4" />}

      {isChecking && "Fact-checking..."}
      {hasIssue && issueType === "low-credibility" && "Credibility issue"}
      {hasIssue && issueType === "needs-verification" && "Needs verification"}
      {hasIssue && issueType === "verified" && "Verified"}
    </button>
  )
}
