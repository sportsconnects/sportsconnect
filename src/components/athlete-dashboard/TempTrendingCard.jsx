// src/components/TrendingCard.jsx

import { TrendingUp, ChevronRight } from "lucide-react"

const THEME = {
  dark: {
    surface:   "#161B22",
    border:    "rgba(255,255,255,0.06)",
    text:      "#F0F6FF",
    textMuted: "#4B5563",
    hover:     "rgba(255,255,255,0.025)",
  },
  light: {
    surface:   "#FFFFFF",
    border:    "#E5E7EB",
    text:      "#111827",
    textMuted: "#9CA3AF",
    hover:     "rgba(0,0,0,0.025)",
  }
}

const ACCENT = "#1DA8FF"

// Hardcoded for now — swap with an API call later
const TRENDS = [
  { tag: "#InterSchoolsFinals", posts: "2,841", sport: "Soccer"       },
  { tag: "#GhanaAthletics",     posts: "1,203", sport: "Track & Field" },
  { tag: "#RecruitSeason2026",  posts: "4,510", sport: "All Sports"   },
  { tag: "#BasketballGH",       posts: "987",   sport: "Basketball"   },
]

export default function TrendingCard({ dark }) {
  const tk = dark ? THEME.dark : THEME.light

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: tk.surface, border: `1px solid ${tk.border}` }}
    >
      {/* ── Header ── */}
      <div
        className="px-4 py-3 flex items-center gap-2"
        style={{ borderBottom: `1px solid ${tk.border}` }}
      >
        <TrendingUp className="w-4 h-4" style={{ color: ACCENT }} />
        <h3 className="font-bold text-sm" style={{ color: tk.text }}>
          Trending in Sports
        </h3>
      </div>

      {/* ── Trend rows ── */}
      {TRENDS.map((trend, i) => (
        <button
          key={i}
          className="w-full px-4 py-3 flex items-center justify-between transition-colors"
          style={{ borderBottom: `1px solid ${tk.border}` }}
          onMouseEnter={e => e.currentTarget.style.background = tk.hover}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <div className="text-left">
            <p className="font-bold text-sm" style={{ color: ACCENT }}>
              {trend.tag}
            </p>
            <p className="text-xs" style={{ color: tk.textMuted }}>
              {trend.posts} posts · {trend.sport}
            </p>
          </div>
          <ChevronRight className="w-4 h-4" style={{ color: tk.textMuted }} />
        </button>
      ))}

    </div>
  )
}