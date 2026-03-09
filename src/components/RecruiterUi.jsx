// src/components/recruiter/RecruiterUI.jsx
// Shared reusable components for all recruiter pages

import { useState } from "react"
import { Link, useLocation } from "react-router"
import {
  Eye, Bookmark, Award, Clock, Bell, MessageCircle,
  Check, ChevronRight, MapPin, Search,
  LayoutDashboard, Users, BookMarked,
  UserCircle, Settings
} from "lucide-react"

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────────────────
export const ACCENT  = "#F59E0B"   // amber gold — distinct from athlete blue
export const ACCENT2 = "#D97706"   // darker amber for gradients

export const THEME = {
  dark: {
    page:        "#0C0E14",          // slightly warmer black than athlete side
    surface:     "#13161F",
    surfaceHigh: "#1A1E2A",
    border:      "rgba(245,158,11,0.08)",
    text:        "#F5F0E8",          // warm white
    textSub:     "#9CA3AF",
    textMuted:   "#4B5563",
    hover:       "rgba(245,158,11,0.05)",
    inputBg:     "#0C0E14",
    inputBorder: "rgba(245,158,11,0.15)",
  },
  light: {
    page:        "#FAFAF7",          // warm off-white
    surface:     "#FFFFFF",
    surfaceHigh: "#FFFDF5",
    border:      "#E8E4D9",
    text:        "#1C1917",
    textSub:     "#78716C",
    textMuted:   "#A8A29E",
    hover:       "rgba(245,158,11,0.04)",
    inputBg:     "#FFFDF5",
    inputBorder: "#D6D0C4",
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SPORT BADGE
// ─────────────────────────────────────────────────────────────────────────────
const SPORT_COLORS = {
  "Soccer":        { bg:"rgba(16,185,129,0.12)",  border:"rgba(16,185,129,0.3)",  color:"#10B981" },
  "Basketball":    { bg:"rgba(245,158,11,0.12)",  border:"rgba(245,158,11,0.3)",  color:"#F59E0B" },
  "Track & Field": { bg:"rgba(249,115,22,0.12)",  border:"rgba(249,115,22,0.3)",  color:"#F97316" },
  "Swimming":      { bg:"rgba(6,182,212,0.12)",   border:"rgba(6,182,212,0.3)",   color:"#06B6D4" },
  "Volleyball":    { bg:"rgba(168,85,247,0.12)",  border:"rgba(168,85,247,0.3)",  color:"#A855F7" },
}
export function SportBadge({ sport }) {
  const c = SPORT_COLORS[sport] || { bg:"rgba(245,158,11,0.12)", border:"rgba(245,158,11,0.3)", color:ACCENT }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border"
      style={{ background:c.bg, borderColor:c.border, color:c.color }}>
      {sport}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// AVATAR
// ─────────────────────────────────────────────────────────────────────────────
const GRADS = [
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-blue-500 to-indigo-600",
  "from-purple-500 to-pink-600",
  "from-cyan-500 to-blue-500",
]
export function RAvatar({ name, size = 40 }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase()
  const g = GRADS[name.charCodeAt(0) % 5]
  return (
    <div
      className={`rounded-full bg-gradient-to-br ${g} flex items-center justify-center text-white font-bold flex-shrink-0`}
      style={{ width:size, height:size, fontSize:size*0.32 }}>
      {initials}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────────────────────
export function StatCard({ icon:Icon, label, value, sub, accent, dark }) {
  const tk = dark ? THEME.dark : THEME.light
  const c  = accent || ACCENT
  return (
    <div className="rounded-2xl p-4 flex items-center gap-3"
      style={{ background:tk.surface, border:`1px solid ${tk.border}` }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background:`${c}18` }}>
        <Icon className="w-5 h-5" style={{ color:c }} />
      </div>
      <div className="min-w-0">
        <p className="font-black text-xl leading-none" style={{ color:c }}>{value}</p>
        <p className="text-xs font-semibold mt-0.5 truncate" style={{ color:tk.text }}>{label}</p>
        {sub && <p className="text-xs truncate" style={{ color:tk.textMuted }}>{sub}</p>}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FILTER PILL
// ─────────────────────────────────────────────────────────────────────────────
export function FilterPill({ label, active, onClick, dark }) {
  const tk = dark ? THEME.dark : THEME.light
  return (
    <button onClick={onClick}
      className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
      style={{
        background:  active ? `${ACCENT}15`   : "transparent",
        borderColor: active ? ACCENT           : tk.border,
        color:       active ? ACCENT           : tk.textMuted,
      }}>
      {active && <Check className="w-3 h-3" />}{label}
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION CARD
// ─────────────────────────────────────────────────────────────────────────────
export function SectionCard({ icon:Icon, title, action, actionTo, children, dark }) {
  const tk = dark ? THEME.dark : THEME.light
  return (
    <div className="rounded-2xl overflow-hidden mb-4"
      style={{ background:tk.surface, border:`1px solid ${tk.border}` }}>
      <div className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom:`1px solid ${tk.border}` }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background:`${ACCENT}15` }}>
            <Icon className="w-3.5 h-3.5" style={{ color:ACCENT }} />
          </div>
          <h3 className="font-black text-sm" style={{ color:tk.text }}>{title}</h3>
        </div>
        {action && (
          <Link to={actionTo||"#"}
            className="flex items-center gap-1 text-xs font-semibold"
            style={{ color:ACCENT }}>
            {action}<ChevronRight className="w-3 h-3" />
          </Link>
        )}
      </div>
      <div>{children}</div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ATHLETE ROW
// ─────────────────────────────────────────────────────────────────────────────
export function AthleteRow({ athlete, dark, onSave, saved:savedProp=false, border=true }) {
  const [saved, setSaved] = useState(savedProp)
  const tk = dark ? THEME.dark : THEME.light
  return (
    <div className="flex items-center gap-3 px-4 py-3 transition-all cursor-pointer"
      style={{ borderBottom:border?`1px solid ${tk.border}`:"none" }}
      onMouseEnter={e => e.currentTarget.style.background = tk.hover}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
      <RAvatar name={athlete.name} size={38} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <p className="text-sm font-bold truncate" style={{ color:tk.text }}>{athlete.name}</p>
          {athlete.verified && <span style={{ color:"#1DA8FF", fontSize:10 }}>✦</span>}
        </div>
        <div className="flex items-center gap-2 flex-wrap mt-0.5">
          <SportBadge sport={athlete.sport} />
          <span className="text-xs flex items-center gap-1" style={{ color:tk.textMuted }}>
            <MapPin className="w-2.5 h-2.5" />{athlete.region}
          </span>
          <span className="text-xs" style={{ color:tk.textMuted }}>Class {athlete.classOf}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-xs font-bold hidden sm:block" style={{ color:tk.textSub }}>GPA {athlete.gpa}</span>
        <button
          onClick={e => { e.stopPropagation(); setSaved(!saved); onSave?.(athlete.id) }}
          className="w-7 h-7 rounded-lg flex items-center justify-center border transition-all"
          style={{
            background:  saved ? `${ACCENT}15` : "transparent",
            borderColor: saved ? ACCENT         : tk.border,
            color:       saved ? ACCENT         : tk.textMuted,
          }}>
          <Bookmark className={`w-3.5 h-3.5 ${saved?"fill-amber-400":""}`} />
        </button>
        <Link to={`/recruiter/athlete/${athlete.id}`}
          className="text-xs font-bold px-2.5 py-1.5 rounded-lg transition-opacity hover:opacity-90"
          style={{ background:`linear-gradient(135deg,${ACCENT},${ACCENT2})`, color:"#fff" }}>
          View
        </Link>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVITY ITEM
// ─────────────────────────────────────────────────────────────────────────────
export function ActivityItem({ icon:Icon, iconColor, iconBg, text, time, dark }) {
  const tk = dark ? THEME.dark : THEME.light
  return (
    <div className="flex items-start gap-3 px-4 py-3"
      style={{ borderBottom:`1px solid ${tk.border}` }}>
      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background:iconBg }}>
        <Icon className="w-4 h-4" style={{ color:iconColor }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs leading-relaxed" style={{ color:tk.textSub }}>{text}</p>
        <p className="text-xs mt-0.5" style={{ color:tk.textMuted }}>{time}</p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SIDE NAV
// ─────────────────────────────────────────────────────────────────────────────
const SIDE_TABS = [
  // { icon:LayoutDashboard, label:"Dashboard",  to:"/recruiterdashboard"  },
  // { icon:Search,          label:"Athletes",   to:"/recruiterathletes"   },
  // { icon:BookMarked,      label:"Shortlists", to:"/recruitershortlist" },
  // { icon:MessageCircle,   label:"Messages",   to:"/recruitermessages"   },
  // { icon:UserCircle,      label:"Profile",    to:"/recruiterprofile"    },
  // { icon:Settings,        label:"Settings",   to:"/recruitersettings"   },
]

export function RecruiterSideNav({ dark }) {
  const { pathname } = useLocation()
  const tk = dark ? THEME.dark : THEME.light
  return (
    <aside className="hidden lg:flex flex-col sticky top-16 h-[calc(100vh-4rem)] py-4 pr-2 w-52 xl:w-60 flex-shrink-0">
      {SIDE_TABS.map(({ icon:Icon, label, to }) => {
        const active = pathname === to
        return (
          <Link key={to} to={to}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all text-sm"
            style={{
              background: active ? `${ACCENT}12`  : "transparent",
              color:      active ? ACCENT          : tk.textMuted,
              fontWeight: active ? 700             : 600,
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = tk.hover }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent" }}>
            <Icon className="w-4 h-4 flex-shrink-0" />{label}
          </Link>
        )
      })}

      {/* Coach info */}
      <div className="mt-auto px-3 py-3 rounded-xl"
        style={{ background:tk.surface, border:`1px solid ${tk.border}` }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0"
            style={{ background:`linear-gradient(135deg,${ACCENT},${ACCENT2})` }}>DM</div>
          <div className="min-w-0">
            <p className="text-xs font-bold truncate" style={{ color:tk.text }}>Coach David Mensah</p>
            <p className="text-xs truncate" style={{ color:tk.textMuted }}>University of Ghana</p>
          </div>
        </div>
      </div>
    </aside>
  )
}