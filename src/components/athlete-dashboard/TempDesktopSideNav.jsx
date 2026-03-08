// src/components/DesktopSideNav.jsx

import { useState } from "react"
import { Home, Search, Bell, Bookmark, User, Settings, Video, MoreHorizontal } from "lucide-react"

const THEME = {
  dark: {
    text:      "#F0F6FF",
    textMuted: "#4B5563",
    hover:     "rgba(255,255,255,0.025)",
  },
  light: {
    text:      "#111827",
    textMuted: "#9CA3AF",
    hover:     "rgba(0,0,0,0.025)",
  }
}

const ACCENT = "#1DA8FF"

const NAV_TABS = [
  // { id: "home",          icon: Home,     label: "Home", to: "/athletedashboard"          },
  // { id: "search",        icon: Search,   label: "Explore", to: "/athleteexplore"      },
  // { id: "notifications", icon: Bell,     label: "Notifications" },
  // { id: "bookmarks",     icon: Bookmark, label: "Bookmarks"     },
  // { id: "profile",       icon: User,     label: "Profile"       },
  // { id: "settings",      icon: Settings, label: "Settings"      },
]

export default function DesktopSideNav({ active, setActive, dark }) {
  const tk = dark ? THEME.dark : THEME.light

  return (
    <aside
      className="hidden lg:flex flex-col gap-0.5 pt-6 sticky top-16 pr-4 overflow-y-auto pb-8"
      style={{ height: "calc(100vh - 4rem)", scrollbarWidth: "none" }}
    >

      {/* ── Nav tabs ── */}
      {NAV_TABS.map(({ id, icon: Icon, label }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            onClick={() => setActive(id)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold text-left w-full"
            style={{
              background: isActive ? "rgba(29,168,255,.1)" : "transparent",
              color:      isActive ? ACCENT : tk.textMuted,
            }}
            onMouseEnter={e => {
              if (!isActive) {
                e.currentTarget.style.background = tk.hover
                e.currentTarget.style.color      = tk.text
              }
            }}
            onMouseLeave={e => {
              if (!isActive) {
                e.currentTarget.style.background = "transparent"
                e.currentTarget.style.color      = tk.textMuted
              }
            }}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {label}
          </button>
        )
      })}

      {/* ── Post highlights button ── */}
      <button
        className="mt-4 text-white rounded-xl py-2.5 px-3 text-sm font-bold flex items-center gap-2 transition-opacity hover:opacity-90 w-full"
        style={{ background: ACCENT }}
      >
        <Video className="w-4 h-4 flex-shrink-0" />
        Post Highlights
      </button>

      {/* ── Mini profile ── */}
      <div
        className="mt-auto flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-colors w-full"
        onMouseEnter={e => e.currentTarget.style.background = tk.hover}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
          JJ
        </div>

        {/* Name + handle */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold truncate" style={{ color: tk.text }}>
            James Junior
          </p>
          <p className="text-xs truncate" style={{ color: tk.textMuted }}>
            @jamesjnr_cb
          </p>
        </div>

        <MoreHorizontal className="w-4 h-4 flex-shrink-0" style={{ color: tk.textMuted }} />
      </div>

    </aside>
  )
}