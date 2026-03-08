// src/components/WhoToFollow.jsx

import { Star } from "lucide-react"
import SportBadge from "./TempSportsBadge"
import Avatar from "./TempAvatar"

const THEME = {
  dark: {
    surface:   "#161B22",
    border:    "rgba(255,255,255,0.06)",
    text:      "#F0F6FF",
    textMuted: "#4B5563",
  },
  light: {
    surface:   "#FFFFFF",
    border:    "#E5E7EB",
    text:      "#111827",
    textMuted: "#9CA3AF",
  }
}

const ACCENT = "#1DA8FF"

// Hardcoded for now — swap with an API call later
const SUGGESTIONS = [
  { name: "Abena Osei",   handle: "@abena_vol",   sport: "Volleyball",    school: "GISS"       },
  { name: "Yaw Darko",    handle: "@yaw_swim",    sport: "Swimming",      school: "KNUST Prep" },
  { name: "Serwaa Boadu", handle: "@serwaa_runs", sport: "Track & Field", school: "Mfantsipim" },
]

export default function WhoToFollow({ dark }) {
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
        <Star className="w-4 h-4 text-amber-500" />
        <h3 className="font-bold text-sm" style={{ color: tk.text }}>
          Athletes to Watch
        </h3>
      </div>

      {/* ── Athlete rows ── */}
      {SUGGESTIONS.map((athlete, i) => (
        <div
          key={i}
          className="px-4 py-3 flex items-center gap-3"
          style={{ borderBottom: `1px solid ${tk.border}` }}
        >
          {/* Avatar */}
          <Avatar name={athlete.name} size={32} />

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: tk.text }}>
              {athlete.name}
            </p>
            <p className="text-xs truncate" style={{ color: tk.textMuted }}>
              {athlete.handle} · {athlete.school}
            </p>
            <div className="mt-0.5">
              <SportBadge sport={athlete.sport} />
            </div>
          </div>

          {/* Follow button */}
          <button
            className="flex-shrink-0 rounded-full px-3 py-1 text-xs font-bold transition-all border"
            style={{ borderColor: ACCENT, color: ACCENT }}
            onMouseEnter={e => {
              e.currentTarget.style.background = ACCENT
              e.currentTarget.style.color = "#fff"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent"
              e.currentTarget.style.color = ACCENT
            }}
          >
            Follow
          </button>
        </div>
      ))}

    </div>
  )
}