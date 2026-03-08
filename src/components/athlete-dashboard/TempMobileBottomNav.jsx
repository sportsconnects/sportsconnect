// src/components/MobileBottomNav.jsx

import { Home, Search, PlusSquare, Bell, User } from "lucide-react"
import { Link } from "react-router"
import { useLocation } from "react-router"

const THEME = {
    dark: {
        bg: "rgba(13,17,23,.95)",
        border: "rgba(255,255,255,0.06)",
        textMuted: "#4B5563",
    },
    light: {
        bg: "rgba(255,255,255,.95)",
        border: "#E5E7EB",
        textMuted: "#9CA3AF",
    }
}

const ACCENT = "#1DA8FF"

const NAV_TABS = [
    { id: "home", icon: Home, label: "Home", to: "/athletedashboard" },
    { id: "search", icon: Search, label: "Explore", to: "/athleteexplore" },
    { id: "post", icon: PlusSquare, label: "Post", to: "/post" },
    { id: "notifications", icon: Bell, label: "Alerts", to: "/notifications" },
    { id: "profile", icon: User, label: "Profile", to: "/profile" },
]

export default function MobileBottomNav({ active, setActive, dark }) {
    const tk = dark ? THEME.dark : THEME.light

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t z-50 lg:hidden"
            style={{
                background: tk.bg,
                borderColor: tk.border,
            }}
        >
            <div className="flex items-center justify-around py-2 px-1">
                {NAV_TABS.map(({ id, icon: Icon, label }) => {
                    const isActive = active === id
                    return (
                        <Link
                            key={id}
                            onClick={() => setActive(id)}
                            className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all"
                            style={{ color: isActive ? ACCENT : tk.textMuted }}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="text-[10px] font-semibold">{label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}