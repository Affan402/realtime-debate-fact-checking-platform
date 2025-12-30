"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Send, Sparkles } from "lucide-react"

interface ArgumentInputProps {
  onSubmit: (argument: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ArgumentInput({ onSubmit, disabled, placeholder = "Enter your argument..." }: ArgumentInputProps) {
  const [argument, setArgument] = useState("")

  const handleSubmit = () => {
    if (argument.trim()) {
      onSubmit(argument)
      setArgument("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="size-4" />
          <span>AI will analyze your argument for logical fallacies and fact-check claims</span>
        </div>

        <Textarea
          value={argument}
          onChange={(e) => setArgument(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-32 resize-none"
        />

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {argument.length} characters · Press{" "}
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">⌘</kbd> +{" "}
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Enter</kbd> to submit
          </div>

          <Button onClick={handleSubmit} disabled={disabled || !argument.trim()}>
            <Send className="size-4 mr-2" />
            Submit Argument
          </Button>
        </div>
      </div>
    </Card>
  )
}
