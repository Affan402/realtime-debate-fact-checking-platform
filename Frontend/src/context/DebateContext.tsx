// Global Debate Data Context
// Provides shared, cached access to debate data across all pages so that
// navigating between pages does not lose state or trigger duplicate fetches.
//
// This replaces the previous pattern where every page held its own local
// useState + useEffect and re-fetched the same data on every navigation.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import {
  debateAPI,
  argumentAPI,
  factCheckAPI,
  analyticsAPI,
  aiAPI,
} from "@/services/api"
import {
  joinRoom,
  emitNewArgument,
  onReceiveArgument,
  disconnectSocket,
} from "@/services/socket"

// Default active debate ID. In a future iteration this should come from a
// route param (:debateId) or be selected from the DebatesPage list.
const DEFAULT_DEBATE_ID = "1786435967997"

interface DebateContextValue {
  // The active debate ID shared across the app.
  activeDebateId: string
  setActiveDebateId: (id: string) => void

  // Debates list (cached)
  debates: any[]
  debatesLoading: boolean
  debatesError: string | null
  refreshDebates: () => Promise<void>

  // Arguments for the active debate (cached + live socket updates)
  arguments: any[]
  argumentsLoading: boolean
  argumentsError: string | null
  refreshArguments: () => Promise<void>
  addArgument: (argument: any) => void
  submitArgument: (payload: {
    speakerName: string
    claim: string
    evidence?: string
  }) => Promise<any>

  // Fact checks (cached)
  factChecks: any[]
  factChecksLoading: boolean
  factChecksError: string | null
  refreshFactChecks: () => Promise<void>

  // Analytics for the active debate (cached)
  analytics: any | null
  analyticsLoading: boolean
  analyticsError: string | null
  refreshAnalytics: () => Promise<void>

  // AI feedback for the active debate (cached)
  aiFeedback: any | null
  aiFeedbackLoading: boolean
  aiFeedbackError: string | null
  refreshAIFeedback: () => Promise<void>

  // Live socket state
  isLive: boolean
  liveArguments: any[]
}

const DebateContext = createContext<DebateContextValue | null>(null)

export function DebateProvider({ children }: { children: ReactNode }) {
  const [activeDebateId, setActiveDebateIdState] = useState<string>(DEFAULT_DEBATE_ID)

  // ---- Debates list ----
  const [debates, setDebates] = useState<any[]>([])
  const [debatesLoading, setDebatesLoading] = useState(false)
  const [debatesError, setDebatesError] = useState<string | null>(null)
  const debatesFetchedRef = useRef(false)

  // ---- Arguments ----
  const [arguments_, setArguments] = useState<any[]>([])
  const [argumentsLoading, setArgumentsLoading] = useState(false)
  const [argumentsError, setArgumentsError] = useState<string | null>(null)
  const argumentsFetchedForRef = useRef<string | null>(null)

  // ---- Fact checks ----
  const [factChecks, setFactChecks] = useState<any[]>([])
  const [factChecksLoading, setFactChecksLoading] = useState(false)
  const [factChecksError, setFactChecksError] = useState<string | null>(null)
  const factChecksFetchedRef = useRef(false)

  // ---- Analytics ----
  const [analytics, setAnalytics] = useState<any>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [analyticsError, setAnalyticsError] = useState<string | null>(null)
  const analyticsFetchedForRef = useRef<string | null>(null)

  // ---- AI feedback ----
  const [aiFeedback, setAiFeedback] = useState<any>(null)
  const [aiFeedbackLoading, setAiFeedbackLoading] = useState(false)
  const [aiFeedbackError, setAiFeedbackError] = useState<string | null>(null)
  const aiFeedbackFetchedForRef = useRef<string | null>(null)

  // ---- Live socket state ----
  const [isLive, setIsLive] = useState(false)
  const [liveArguments, setLiveArguments] = useState<any[]>([])
  // Track the signature of an argument we just submitted so we can ignore
  // the socket echo (the server broadcasts to all clients including sender).
  const pendingEchoRef = useRef<string | null>(null)

  // ---- Setters ----
  const setActiveDebateId = useCallback((id: string) => {
    setActiveDebateIdState(id)
  }, [])

  // ---- Fetch functions (cached: only fetch once per debateId unless refreshed) ----
  const refreshDebates = useCallback(async () => {
    setDebatesLoading(true)
    setDebatesError(null)
    try {
      const response = await debateAPI.getDebates()
      setDebates(response.data || [])
      debatesFetchedRef.current = true
    } catch (err: any) {
      setDebatesError(err.message || "Failed to load debates")
    } finally {
      setDebatesLoading(false)
    }
  }, [])

  const refreshArguments = useCallback(async () => {
    if (!activeDebateId) return
    setArgumentsLoading(true)
    setArgumentsError(null)
    try {
      const response = await argumentAPI.getArgumentsByDebate(activeDebateId)
      setArguments(response.data || [])
      argumentsFetchedForRef.current = activeDebateId
    } catch (err: any) {
      setArgumentsError(err.message || "Failed to load arguments")
    } finally {
      setArgumentsLoading(false)
    }
  }, [activeDebateId])

  const refreshFactChecks = useCallback(async () => {
    setFactChecksLoading(true)
    setFactChecksError(null)
    try {
      const response = await factCheckAPI.getFactChecks()
      setFactChecks(response.data || [])
      factChecksFetchedRef.current = true
    } catch (err: any) {
      setFactChecksError(err.message || "Failed to load fact checks")
    } finally {
      setFactChecksLoading(false)
    }
  }, [])

  const refreshAnalytics = useCallback(async () => {
    if (!activeDebateId) return
    setAnalyticsLoading(true)
    setAnalyticsError(null)
    try {
      const response = await analyticsAPI.getAnalytics(activeDebateId)
      setAnalytics(response.data)
      analyticsFetchedForRef.current = activeDebateId
    } catch (err: any) {
      setAnalyticsError(err.message || "Failed to load analytics")
    } finally {
      setAnalyticsLoading(false)
    }
  }, [activeDebateId])

  const refreshAIFeedback = useCallback(async () => {
    if (!activeDebateId) return
    setAiFeedbackLoading(true)
    setAiFeedbackError(null)
    try {
      const response = await aiAPI.getAIFeedback(activeDebateId)
      setAiFeedback(response.data)
      aiFeedbackFetchedForRef.current = activeDebateId
    } catch (err: any) {
      setAiFeedbackError(err.message || "Failed to load AI feedback")
    } finally {
      setAiFeedbackLoading(false)
    }
  }, [activeDebateId])

  // ---- Add an argument locally (used after submit + socket echo) ----
  const addArgument = useCallback((argument: any) => {
    setArguments((prev) => [...prev, argument])
  }, [])

  // ---- Submit a new argument (API + socket broadcast) ----
  const submitArgument = useCallback(
    async (payload: {
      speakerName: string
      claim: string
      evidence?: string
    }) => {
      const fullPayload = {
        debateId: activeDebateId,
        speakerName: payload.speakerName,
        claim: payload.claim,
        evidence: payload.evidence || "",
      }
      // Mark this argument so we can ignore the socket echo
      pendingEchoRef.current = `${payload.speakerName}::${payload.claim}`
      // Broadcast to the room in real-time
      emitNewArgument(fullPayload)
      const response = await argumentAPI.createArgument(fullPayload)
      const newArg = response.data
      // Add to the shared arguments list immediately
      if (newArg) addArgument(newArg)
      return newArg
    },
    [activeDebateId, addArgument],
  )

  // ---- Socket connection: join the active room and listen for live args ----
  useEffect(() => {
    if (!activeDebateId) return
    joinRoom(activeDebateId)
    setIsLive(true)

    const unsubscribe = onReceiveArgument((argument) => {
      const sig = `${argument?.speakerName}::${argument?.claim}`
      if (pendingEchoRef.current === sig) {
        pendingEchoRef.current = null
        return
      }
      setLiveArguments((prev) => [...prev, argument])
      // Also add to the shared arguments list so other pages see it
      addArgument(argument)
    })

    return () => {
      unsubscribe()
      disconnectSocket()
      setIsLive(false)
    }
  }, [activeDebateId, addArgument])

  // ---- Invalidate cached data when the active debate changes ----
  useEffect(() => {
    if (argumentsFetchedForRef.current !== activeDebateId) {
      argumentsFetchedForRef.current = null
      setArguments([])
    }
    if (analyticsFetchedForRef.current !== activeDebateId) {
      analyticsFetchedForRef.current = null
      setAnalytics(null)
    }
    if (aiFeedbackFetchedForRef.current !== activeDebateId) {
      aiFeedbackFetchedForRef.current = null
      setAiFeedback(null)
    }
    // Clear live arguments when switching debates
    setLiveArguments([])
  }, [activeDebateId])

  const value = useMemo<DebateContextValue>(
    () => ({
      activeDebateId,
      setActiveDebateId,
      debates,
      debatesLoading,
      debatesError,
      refreshDebates,
      arguments: arguments_,
      argumentsLoading,
      argumentsError,
      refreshArguments,
      addArgument,
      submitArgument,
      factChecks,
      factChecksLoading,
      factChecksError,
      refreshFactChecks,
      analytics,
      analyticsLoading,
      analyticsError,
      refreshAnalytics,
      aiFeedback,
      aiFeedbackLoading,
      aiFeedbackError,
      refreshAIFeedback,
      isLive,
      liveArguments,
    }),
    [
      activeDebateId,
      setActiveDebateId,
      debates,
      debatesLoading,
      debatesError,
      refreshDebates,
      arguments_,
      argumentsLoading,
      argumentsError,
      refreshArguments,
      addArgument,
      submitArgument,
      factChecks,
      factChecksLoading,
      factChecksError,
      refreshFactChecks,
      analytics,
      analyticsLoading,
      analyticsError,
      refreshAnalytics,
      aiFeedback,
      aiFeedbackLoading,
      aiFeedbackError,
      refreshAIFeedback,
      isLive,
      liveArguments,
    ],
  )

  return <DebateContext.Provider value={value}>{children}</DebateContext.Provider>
}

// Hook to consume the debate context. Throws if used outside the provider.
export function useDebateData() {
  const ctx = useContext(DebateContext)
  if (!ctx) {
    throw new Error("useDebateData must be used within a DebateProvider")
  }
  return ctx
}
