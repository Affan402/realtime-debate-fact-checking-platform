"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, Send } from "lucide-react"

interface ArgumentInputProps {
  onSubmit: (argument: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ArgumentInput({ onSubmit, disabled = false, placeholder }: ArgumentInputProps) {
  const [argument, setArgument] = useState("")

  const handleSubmit = () => {
    if (argument.trim()) {
      onSubmit(argument)
      setArgument("")
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="size-5 text-accent" />
          <h3 className="font-semibold">Make Your Argument</h3>
        </div>

        <Textarea
          value={argument}
          onChange={(e) => setArgument(e.target.value)}
          placeholder={placeholder || "State your claim, provide evidence, and draw a conclusion..."}
          className="min-h-[120px] resize-none"
          disabled={disabled}
        />

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">AI will analyze your argument for logical structure</p>
          <Button onClick={handleSubmit} disabled={disabled || !argument.trim()}>
            <Send className="size-4 mr-2" />
            Submit
          </Button>
        </div>
      </div>
    </Card>
  )
}
