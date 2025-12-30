import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import DebateRoomPage from "./pages/DebateRoomPage"
import DebatesPage from "./pages/DebatesPage"
import ArgumentsPage from "./pages/ArgumentsPage"
import FactCheckPage from "./pages/FactCheckPage"
import AnalyticsPage from "./pages/AnalyticsPage"
import AIFeedbackPage from "./pages/AIFeedbackPage"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/debate/room" element={<DebateRoomPage />} />
        <Route path="/debates" element={<DebatesPage />} />
        <Route path="/debate/arguments" element={<ArgumentsPage />} />
        <Route path="/debate/fact-check" element={<FactCheckPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/ai-feedback" element={<AIFeedbackPage />} />
      </Routes>
    </Router>
  )
}

export default App
