// src/components/recruiter/RecruiterBottomNav.jsx

import { Link, useLocation } from "react-router"
import { LayoutDashboard, Search, BookMarked, MessageCircle, UserCircle } from "lucide-react"
import { ACCENT, THEME } from "../components/RecruiterUi"

const NAV_TABS = [
  { icon: LayoutDashboard, label: "Dashboard",  to: "/recruiterdashboard"  },
  { icon: Search,          label: "Athletes",   to: "/recruiterathletes"   },
  { icon: BookMarked,      label: "Shortlists", to: "/recruitershortlist" },
  { icon: MessageCircle,   label: "Messages",   to: "/recruitermessages"   },
  { icon: UserCircle,      label: "Profile",    to: "/recruiterprofile"    },
]

export default function     RecruiterBottomNav({ dark }) {
  const { pathname } = useLocation()
  const tk = dark ? THEME.dark : THEME.light

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden backdrop-blur-xl border-t"
      style={{
        background:  dark ? "rgba(12,14,20,0.95)" : "rgba(250,250,247,0.95)",
        borderColor: tk.border,
      }}
    >
      <div className="flex items-center justify-around py-2 px-1">
        {NAV_TABS.map(({ icon: Icon, label, to }) => {
          const isActive = pathname === to
          return (
            <Link
              key={to}
              to={to}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all relative"
              style={{ color: isActive ? ACCENT : tk.textMuted }}
            >
              {isActive && (
                <span
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ background: ACCENT }}
                />
              )}
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-[10px] font-semibold">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}