// src/components/athlete-dashboard/TempDesktopSideNav.jsx

import { useState, useEffect } from "react"
import { Home, Search, Bell, Bookmark, User, Settings, Video, MoreHorizontal, Sparkles } from "lucide-react"
import { Link, useNavigate } from "react-router"
import { getCurrentUser, getAthleteById } from "../../api/client"

const THEME = {
  dark: {
    text: "#F0F6FF",
    textMuted: "#4B5563",
    hover: "rgba(255,255,255,0.025)",
  },
  light: {
    text: "#111827",
    textMuted: "#9CA3AF",
    hover: "rgba(0,0,0,0.025)",
  }
}

const ACCENT = "#1DA8FF"

const NAV_TABS = [
  // { id: "home",    icon: Home,     label: "Home",    to: "/athletedashboard" },
  // { id: "explore", icon: Search,   label: "Explore", to: "/athleteexplore"   },
  { id: "ai",      icon: Sparkles, label: "SC Coach", to: "/athleteai"       },
]

export default function DesktopSideNav({ active, setActive, dark }) {
  const tk = dark ? THEME.dark : THEME.light
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) return
    const id = user._id || user.id

    getAthleteById(id)
      .then(({ data }) => {
        const u = data.user ?? user
        const p = data.profile
        const initials = `${u.firstName?.[0] ?? ""}${u.lastName?.[0] ?? ""}`.toUpperCase()
        const handle = `@${u.firstName?.toLowerCase()}${u.lastName?.toLowerCase()}_${p?.position?.slice(0,2).toLowerCase() ?? "sc"}`
        setProfile({
          name: `${u.firstName} ${u.lastName}`,
          handle,
          initials,
        })
      })
      .catch(() => {
        const user = getCurrentUser()
        if (!user) return
        setProfile({
          name: `${user.firstName} ${user.lastName}`,
          handle: `@${user.firstName?.toLowerCase()}`,
          initials: `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase(),
        })
      })
  }, [])

  return (
    <aside
      className="hidden lg:flex flex-col gap-0.5 pt-6 sticky top-16 pr-4 overflow-y-auto pb-8"
      style={{ height: "calc(100vh - 4rem)", scrollbarWidth: "none" }}
    >
      {/* ── Nav tabs ── */}
      {NAV_TABS.map(({ id, icon: Icon, label, to }) => {
        const isActive = active === id
        return (
          <Link
            key={id}
            to={to}
            onClick={() => setActive(id)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold text-left w-full"
            style={{
              background: isActive ? "rgba(29,168,255,.1)" : "transparent",
              color: isActive ? ACCENT : tk.textMuted,
              textDecoration: "none",
            }}
            onMouseEnter={e => {
              if (!isActive) {
                e.currentTarget.style.background = tk.hover
                e.currentTarget.style.color = tk.text
              }
            }}
            onMouseLeave={e => {
              if (!isActive) {
                e.currentTarget.style.background = "transparent"
                e.currentTarget.style.color = tk.textMuted
              }
            }}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {label}
          </Link>
        )
      })}

      <Link
        to="/athletepost"
        className="mt-4 text-white rounded-xl py-2.5 px-3 text-sm font-bold flex items-center gap-2 transition-opacity hover:opacity-90 w-full justify-center"
        style={{ background: ACCENT }}
      >
        <Video className="w-4 h-4 flex-shrink-0" />
        Post Highlights
      </Link>

      {/* ── Mini profile ── */}
      <div
        className="mt-auto flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-colors w-full"
        onMouseEnter={e => e.currentTarget.style.background = tk.hover}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
          {profile?.initials ?? "SC"}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold truncate" style={{ color: tk.text }}>
            {profile?.name ?? "Loading..."}
          </p>
          <p className="text-xs truncate" style={{ color: tk.textMuted }}>
            {profile?.handle ?? ""}
          </p>
        </div>

        {/* <MoreHorizontal className="w-4 h-4 flex-shrink-0" style={{ color: tk.textMuted }} /> */}
      </div>
    </aside>
  )
}