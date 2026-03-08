// src/components/RecruiterBanner.jsx

import { Flame, ChevronRight } from "lucide-react"

const THEME = {
  dark: {
    text:      "#F0F6FF",
    textMuted: "#4B5563",
    recruiter: {
      bg:     "linear-gradient(135deg, rgba(29,168,255,.12), rgba(79,70,229,.12))",
      border: "rgba(29,168,255,.25)",
    },
  },
  light: {
    text:      "#1E3A5F",
    textMuted: "#9CA3AF",
    recruiter: {
      bg:     "linear-gradient(135deg, #EFF6FF, #EEF2FF)",
      border: "#BFDBFE",
    },
  }
}

const ACCENT = "#1DA8FF"

export default function RecruiterBanner({ dark }) {
  const tk = dark ? THEME.dark : THEME.light

  return (
    <div
      className="mx-4 mt-4 mb-2 rounded-2xl px-4 py-3 flex items-center gap-3 border"
      style={{
        background:   tk.recruiter.bg,
        borderColor:  tk.recruiter.border,
      }}
    >
      {/* ── Icon ── */}
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(29,168,255,.15)" }}
      >
        <Flame className="w-4 h-4" style={{ color: ACCENT }} />
      </div>

      {/* ── Text ── */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold" style={{ color: tk.text }}>
          🔥 High Recruiter Interest
        </p>
        <p className="text-xs" style={{ color: tk.textMuted }}>
          3 scouts viewed your profile this week
        </p>
      </div>

      {/* ── CTA ── */}
      <button
        className="text-xs font-bold flex-shrink-0 flex items-center gap-0.5 transition-opacity hover:opacity-70"
        style={{ color: ACCENT }}
      >
        View <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  )
}