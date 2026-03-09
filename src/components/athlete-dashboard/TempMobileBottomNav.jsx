// src/components/athlete-dashboard/MobileBottomNav.jsx

import { Home, Search, PlusSquare, Users, User, MessageCircle } from "lucide-react"
import { Link, useLocation } from "react-router"

const THEME = {
    dark: { bg: "rgba(13,17,23,.95)", border: "rgba(255,255,255,0.06)", textMuted: "#4B5563" },
    light: { bg: "rgba(255,255,255,.95)", border: "#E5E7EB", textMuted: "#9CA3AF" },
}

const ACCENT = "#1DA8FF"

const NAV_TABS = [
    { icon: Home, label: "Home", to: "/athletedashboard" },
    { icon: Search, label: "Explore", to: "/athleteexplore" },
    { icon: PlusSquare, label: "Post", to: "/athletepost" },
    { icon: Users, label: "Recruiters", to: "/athleterecruiters" },
    { icon: MessageCircle, label: "Messages", to: "/athletemessages" },
    // { icon: User, label: "Profile", to: "/athleteprofile" },
]

export default function MobileBottomNav({ dark }) {
    const location = useLocation()
    const tk = dark ? THEME.dark : THEME.light

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t z-50 lg:hidden"
            style={{ background: tk.bg, borderColor: tk.border }}
        >
            <div className="flex items-center justify-around py-2 px-1">
                {NAV_TABS.map(({ icon: Icon, label, to }) => {
                    const isActive = location.pathname === to
                    return (
                        <Link
                            key={to}
                            to={to}
                            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all relative"
                            style={{ color: isActive ? ACCENT : tk.textMuted }}
                        >
                            {/* Active indicator dot */}
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