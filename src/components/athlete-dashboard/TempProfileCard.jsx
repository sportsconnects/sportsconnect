// src/components/ProfileCard.jsx

import { Trophy, GraduationCap, MapPin, Eye } from "lucide-react"
import SportBadge from "./TempSportsBadge"
import Avatar from "./TempAvatar"

const THEME = {
  dark: {
    surface:   "#161B22",
    border:    "rgba(255,255,255,0.06)",
    text:      "#F0F6FF",
    textSub:   "#9CA3AF",
    textMuted: "#4B5563",
  },
  light: {
    surface:   "#FFFFFF",
    border:    "#E5E7EB",
    text:      "#111827",
    textSub:   "#6B7280",
    textMuted: "#9CA3AF",
  }
}

const ACCENT = "#1DA8FF"

export default function ProfileCard({ user, dark }) {
  const tk = dark ? THEME.dark : THEME.light

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: tk.surface, border: `1px solid ${tk.border}` }}
    >
      {/* ── Banner ── */}
      <div
        className="h-14 relative"
        style={{ background: "linear-gradient(135deg, #1DA8FF, #3B4FE0)" }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)",
          }}
        />
      </div>

      <div className="px-4 pb-4">

        {/* ── Avatar ── */}
        <div className="-mt-7 mb-3 relative z-10">
          <div style={{ outline: `4px solid ${tk.surface}`, borderRadius: "50%", width: "fit-content" }}>
            <Avatar name={user.name} size={56} />
          </div>
        </div>

        {/* ── Name + sport badge ── */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-sm" style={{ color: tk.text }}>
                {user.name}
              </span>
              {user.verified && (
                <span style={{ color: ACCENT }} className="text-xs">✦</span>
              )}
            </div>
            <p className="text-xs" style={{ color: tk.textMuted }}>{user.handle}</p>
          </div>
          <SportBadge sport={user.sport} />
        </div>

        {/* ── Position + school + location ── */}
        <div className="mt-2 space-y-1">
          <p className="text-xs flex items-center gap-1.5" style={{ color: tk.textSub }}>
            <GraduationCap className="w-3 h-3" style={{ color: tk.textMuted }} />
            {user.position} · {user.school}
          </p>
          <p className="text-xs flex items-center gap-1.5" style={{ color: tk.textSub }}>
            <MapPin className="w-3 h-3" style={{ color: tk.textMuted }} />
            {user.location}
          </p>
        </div>

        {/* ── Stats row ── */}
        <div
          className="flex items-center gap-4 mt-3 py-2"
          style={{
            borderTop:    `1px solid ${tk.border}`,
            borderBottom: `1px solid ${tk.border}`,
          }}
        >
          {[
            [user.height,  "Height"],
            [user.classOf, "Class"],
            [user.gpa,     "GPA"],
          ].map(([val, label]) => (
            <div key={label} className="text-center">
              <p className="font-bold text-sm" style={{ color: tk.text }}>{val}</p>
              <p className="text-xs"           style={{ color: tk.textMuted }}>{label}</p>
            </div>
          ))}
        </div>

        {/* ── Followers / following / views ── */}
        <div className="flex items-center gap-4 mt-3 mb-3">
          <div>
            <span className="font-bold text-sm" style={{ color: tk.text }}>
              {user.followers}
            </span>
            <span className="text-xs ml-1" style={{ color: tk.textMuted }}>Followers</span>
          </div>
          <div>
            <span className="font-bold text-sm" style={{ color: tk.text }}>
              {user.following}
            </span>
            <span className="text-xs ml-1" style={{ color: tk.textMuted }}>Following</span>
          </div>
          <div className="ml-auto flex items-center gap-1 text-xs" style={{ color: tk.textMuted }}>
            <Eye className="w-3 h-3" />{user.views}
          </div>
        </div>

        {/* ── Achievements ── */}
        <div className="flex flex-wrap gap-1 mb-3">
          {user.achievements.map((achievement, i) => (
            <span
              key={i}
              className="text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1"
              style={{ background: "rgba(29,168,255,.1)", color: ACCENT }}
            >
              <Trophy className="w-2.5 h-2.5" />
              {achievement}
            </span>
          ))}
        </div>

        {/* ── Edit profile button ── */}
        <button
          className="w-full text-white rounded-xl py-2 text-sm font-bold transition-opacity hover:opacity-90"
          style={{ background: ACCENT }}
        >
          Edit Profile
        </button>

      </div>
    </div>
  )
}