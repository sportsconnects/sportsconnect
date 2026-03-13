// src/pages/AthleteExplore.jsx

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import AthleteNavbar from "./../../components/AthleteNavbar"
import DesktopSideNav from "./../../components/athlete-dashboard/TempDesktopSideNav"
import MobileBottomNav from "./../../components/athlete-dashboard/TempMobileBottomNav"
import SportBadge from "./../../components/athlete-dashboard/TempSportsBadge"
import Avatar from "./../../components/athlete-dashboard/TempAvatar"
import {
  Search, SlidersHorizontal, MapPin, GraduationCap,
  Trophy, Eye, Play, Heart, UserPlus, X, ChevronDown,
  Flame, Star, TrendingUp, Check, Users
} from "lucide-react"
import { getAthletes, isLoggedIn, toggleFollow, getCurrentUser } from "../../api/client"

const ACCENT = "#1DA8FF"

const THEME = {
  dark: {
    page: "#0D1117", surface: "#161B22", surfaceHigh: "#1C2128",
    border: "rgba(255,255,255,0.06)", text: "#F0F6FF", textSub: "#9CA3AF",
    textMuted: "#4B5563", hover: "rgba(255,255,255,0.035)",
    inputBg: "#161B22", inputBorder: "rgba(255,255,255,0.1)",
    pillBg: "rgba(255,255,255,0.05)", pillBorder: "rgba(255,255,255,0.08)",
    pillColor: "#9CA3AF", activePillBg: "rgba(29,168,255,0.12)",
    activePillBorder: "rgba(29,168,255,0.3)",
  },
  light: {
    page: "#F0F4FA", surface: "#FFFFFF", surfaceHigh: "#F8FAFC",
    border: "#E5E7EB", text: "#111827", textSub: "#6B7280",
    textMuted: "#9CA3AF", hover: "rgba(0,0,0,0.025)",
    inputBg: "#FFFFFF", inputBorder: "#D1D5DB",
    pillBg: "#F3F4F6", pillBorder: "#E5E7EB", pillColor: "#6B7280",
    activePillBg: "rgba(29,168,255,0.08)", activePillBorder: "rgba(29,168,255,0.3)",
  }
}

const SPORTS = ["All Sports", "Soccer", "Basketball", "Track & Field", "Swimming", "Volleyball"]
const REGIONS = ["All Regions", "Greater Accra", "Ashanti", "Central", "Eastern", "Western", "Northern"]
const YEARS = ["All Years", "2025", "2026", "2027", "2028"]
const SORT_BY = ["Most Popular", "Most Viewed", "Newest", "GPA"]

const fmt = n => {
  if (typeof n === "string") return n
  return n >= 1000 ? (n / 1000).toFixed(1) + "k" : n
}

// ── Featured Card 
function FeaturedCard({ athlete, dark, onFollow, followed, loading, onViewProfile }) {
  const [playing, setPlaying] = useState(false)
  const [liked, setLiked] = useState(false)
  const tk = dark ? THEME.dark : THEME.light

  const featuredHighlight = athlete.highlights?.[0]
  const videoId = featuredHighlight?.videoId || null

  return (
    <div className="rounded-2xl overflow-hidden relative"
      style={{
        background: tk.surface, border: `1px solid ${tk.border}`,
        boxShadow: dark ? "0 8px 32px rgba(0,0,0,0.4)" : "0 4px 24px rgba(0,0,0,0.08)"
      }}>
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
        style={{ background: "rgba(29,168,255,0.9)", color: "#fff" }}>
        <Star className="w-3 h-3 fill-white" /> Featured
      </div>

      {/* Video / placeholder */}
      <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
        {!playing ? (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center cursor-pointer relative group"
            onClick={() => videoId && setPlaying(true)}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className={`w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center z-10 transition-transform ${videoId ? "group-hover:scale-110" : "opacity-50"}`}>
              <Play className="w-6 h-6 text-white fill-white ml-0.5" />
            </div>
            <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 text-white/70 text-xs">
              <Eye className="w-3 h-3" />{athlete.profileViews || 0}
            </div>
            {!videoId && (
              <div className="absolute bottom-3 left-3 z-10 text-white/50 text-xs">No highlight yet</div>
            )}
          </div>
        ) : (
          <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen />
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar name={`${athlete.user?.firstName} ${athlete.user?.lastName}`} size={44} />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-sm" style={{ color: tk.text }}>
                  {athlete.user?.firstName} {athlete.user?.lastName}
                </span>
                {athlete.verified && <span style={{ color: ACCENT }}>✦</span>}
              </div>
              <p className="text-xs" style={{ color: tk.textMuted }}>
                {athlete.sport} · {athlete.position}
              </p>
              <div className="mt-1"><SportBadge sport={athlete.sport} /></div>
            </div>
          </div>
          <button onClick={() => onFollow(athlete)} disabled={loading}
            className="flex-shrink-0 flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all"
            style={{ background: followed ? "transparent" : ACCENT, color: followed ? ACCENT : "#fff", border: `1px solid ${ACCENT}`, opacity: loading ? 0.6 : 1 }}>
            {loading ? "..." : followed ? <Check className="w-3 h-3" /> : <UserPlus className="w-3 h-3" />}
            {loading ? "" : followed ? "Following" : "Follow"}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-3">
          <span className="text-xs flex items-center gap-1" style={{ color: tk.textMuted }}>
            <GraduationCap className="w-3 h-3" />{athlete.school || "—"}
          </span>
          <span className="text-xs flex items-center gap-1" style={{ color: tk.textMuted }}>
            <MapPin className="w-3 h-3" />{athlete.region || "—"}
          </span>
          <span className="text-xs font-semibold" style={{ color: tk.textSub }}>
            Class of {athlete.classOf || "—"}
          </span>
        </div>

        {athlete.achievements?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {athlete.achievements.slice(0, 2).map((a, i) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1"
                style={{ background: "rgba(29,168,255,0.1)", color: ACCENT }}>
                <Trophy className="w-2.5 h-2.5" />{a.title || a}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: `1px solid ${tk.border}` }}>
          <div className="flex items-center gap-4">
            <span className="text-xs" style={{ color: tk.textMuted }}>
              <span className="font-bold" style={{ color: tk.text }}>{fmt(athlete.followers || 0)}</span> followers
            </span>
            <span className="text-xs flex items-center gap-1" style={{ color: tk.textMuted }}>
              <Eye className="w-3 h-3" />{athlete.profileViews || 0} views
            </span>
          </div>
          <button onClick={() => setLiked(!liked)} className="flex items-center gap-1 text-xs transition-colors"
            style={{ color: liked ? "#EC4899" : tk.textMuted }}>
            <Heart className={`w-4 h-4 ${liked ? "fill-pink-500" : ""}`} />
          </button>
          <button
            onClick={() => onViewProfile(athlete)}
            className="text-xs font-bold px-3 py-1.5 rounded-xl transition-opacity hover:opacity-90"
            style={{ background: ACCENT, color: "#fff" }}
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  )
}


// ── Filter Pill 
function FilterPill({ label, active, onClick, dark }) {
  const tk = dark ? THEME.dark : THEME.light
  return (
    <button onClick={onClick}
      className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border"
      style={{ background: active ? tk.activePillBg : tk.pillBg, borderColor: active ? tk.activePillBorder : tk.pillBorder, color: active ? ACCENT : tk.pillColor }}>
      {active && <Check className="w-3 h-3" />}
      {label}
    </button>
  )
}

// ── Filter Dropdown 
function FilterDropdown({ label, options, value, onChange, dark }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const tk = dark ? THEME.dark : THEME.light

  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener("mousedown", fn)
    return () => document.removeEventListener("mousedown", fn)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border"
        style={{ background: value !== options[0] ? tk.activePillBg : tk.inputBg, borderColor: value !== options[0] ? tk.activePillBorder : tk.inputBorder, color: value !== options[0] ? ACCENT : tk.textSub }}>
        {value}
        <ChevronDown className="w-3 h-3 transition-transform" style={{ transform: open ? "rotate(180deg)" : "none" }} />
      </button>
      {open && (
        <div className="absolute top-10 left-0 z-50 rounded-2xl overflow-hidden min-w-[140px]"
          style={{ background: tk.surface, border: `1px solid ${tk.border}`, boxShadow: dark ? "0 16px 48px rgba(0,0,0,0.5)" : "0 8px 32px rgba(0,0,0,0.12)" }}>
          {options.map(opt => (
            <button key={opt} onClick={() => { onChange(opt); setOpen(false) }}
              className="w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center justify-between transition-colors"
              style={{ color: opt === value ? ACCENT : tk.textSub }}
              onMouseEnter={e => e.currentTarget.style.background = tk.hover}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              {opt}
              {opt === value && <Check className="w-3 h-3" style={{ color: ACCENT }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Stats Bar 
function StatsBar({ total, dark }) {
  const tk = dark ? THEME.dark : THEME.light
  const stats = [
    { icon: Users, label: "Athletes", value: total },
    { icon: Trophy, label: "Sports", value: "6" },
    { icon: MapPin, label: "Regions", value: "6" },
    { icon: TrendingUp, label: "Recruiting", value: "142" },
  ]
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {stats.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex items-center gap-3 rounded-2xl px-4 py-3"
          style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(29,168,255,0.1)" }}>
            <Icon className="w-4 h-4" style={{ color: ACCENT }} />
          </div>
          <div>
            <p className="font-black text-sm" style={{ color: tk.text }}>{value}</p>
            <p className="text-xs" style={{ color: tk.textMuted }}>{label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Skeleton Card 
function SkeletonCard({ dark }) {
  const tk = dark ? THEME.dark : THEME.light
  return (
    <div className="rounded-2xl overflow-hidden animate-pulse"
      style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
      <div className="w-full bg-gray-700/30" style={{ aspectRatio: "16/9" }} />
      <div className="p-3 space-y-2">
        <div className="h-3 rounded-full w-2/3" style={{ background: tk.border }} />
        <div className="h-3 rounded-full w-1/2" style={{ background: tk.border }} />
        <div className="h-8 rounded-xl mt-3" style={{ background: tk.border }} />
      </div>
    </div>
  )
}

function AthleteProfileModal({ athlete, dark, onClose, onFollow, followed, followLoading }) {
  const tk = dark ? THEME.dark : THEME.light
  const [playing, setPlaying] = useState(false)
  const name = `${athlete.user?.firstName || ""} ${athlete.user?.lastName || ""}`.trim()
  const userId = athlete.user?._id || athlete.user?.id || athlete._id

  // Close on Escape key
  useEffect(() => {
    const fn = e => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", fn)
    return () => document.removeEventListener("keydown", fn)
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden"
        style={{
          background: tk.surface,
          border: `1px solid ${tk.border}`,
          boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 sticky top-0 z-10"
          style={{ background: tk.surface, borderBottom: `1px solid ${tk.border}` }}
        >
          <p className="font-black text-sm" style={{ color: tk.text }}>Athlete Profile</p>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
            style={{ color: tk.textMuted, background: tk.hover }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Highlight video */}
        {athlete.highlights?.length > 0 && (
          <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
            {!playing ? (
              <div
                className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center cursor-pointer relative group"
                onClick={() => setPlaying(true)}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center z-10 group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                </div>
                <div className="absolute bottom-3 left-3 z-10 text-white text-xs font-semibold">
                  {athlete.highlights[0]?.title || "Highlight Reel"}
                </div>
              </div>
            ) : (
              <iframe
                src={`https://www.youtube.com/embed/${athlete.highlights[0].videoId}?autoplay=1&rel=0`}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            )}
          </div>
        )}

        {/* Profile body */}
        <div className="p-4">
          {/* Name + follow */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar name={name} size={52} />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-black text-base" style={{ color: tk.text }}>{name}</p>
                  {athlete.verified && <span style={{ color: ACCENT }}>✦</span>}
                </div>
                <p className="text-xs" style={{ color: tk.textMuted }}>
                  {athlete.position} · {athlete.sport}
                </p>
                <div className="mt-1"><SportBadge sport={athlete.sport} /></div>
              </div>
            </div>
            <button
              onClick={() => onFollow(athlete)}
              disabled={followLoading}
              className="flex-shrink-0 flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all border"
              style={{
                background: followed ? "transparent" : ACCENT,
                color: followed ? ACCENT : "#fff",
                borderColor: ACCENT,
                opacity: followLoading ? 0.6 : 1,
              }}
            >
              {followLoading ? "..." : followed ? <><Check className="w-3 h-3" /> Following</> : <><UserPlus className="w-3 h-3" /> Follow</>}
            </button>
          </div>

          {/* Stats row */}
          <div
            className="grid grid-cols-3 gap-2 mb-4 p-3 rounded-2xl"
            style={{ background: tk.surfaceHigh }}
          >
            {[
              [athlete.height || "—", "Height"],
              [athlete.gpa || "—", "GPA"],
              [fmt(athlete.profileViews || 0), "Views"],
            ].map(([val, label]) => (
              <div key={label} className="text-center">
                <p className="font-black text-sm" style={{ color: tk.text }}>{val}</p>
                <p className="text-xs" style={{ color: tk.textMuted }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Details */}
          <div className="space-y-2 mb-4">
            {[
              [GraduationCap, athlete.school || "—", "School"],
              [MapPin, athlete.region || "—", "Region"],
              [Trophy, `Class of ${athlete.classOf || "—"}`, "Year"],
            ].map(([Icon, val, label]) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(29,168,255,0.1)" }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: ACCENT }} />
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: tk.text }}>{val}</p>
                  <p className="text-xs" style={{ color: tk.textMuted }}>{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bio */}
          {athlete.bio && (
            <div
              className="rounded-xl p-3 mb-4 text-xs leading-relaxed"
              style={{ background: tk.surfaceHigh, color: tk.textSub }}
            >
              {athlete.bio}
            </div>
          )}

          {/* Achievements */}
          {athlete.achievements?.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-bold mb-2" style={{ color: tk.textMuted }}>ACHIEVEMENTS</p>
              <div className="flex flex-wrap gap-1.5">
                {athlete.achievements.map((a, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1"
                    style={{ background: "rgba(245,158,11,0.1)", color: "#F59E0B" }}
                  >
                    <Trophy className="w-2.5 h-2.5" />{a.title || a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* All highlights */}
          {athlete.highlights?.length > 1 && (
            <div>
              <p className="text-xs font-bold mb-2" style={{ color: tk.textMuted }}>ALL HIGHLIGHTS</p>
              <div className="space-y-2">
                {athlete.highlights.slice(1).map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl"
                    style={{ background: tk.surfaceHigh }}
                  >
                    <Play className="w-3.5 h-3.5 flex-shrink-0" style={{ color: ACCENT }} />
                    <p className="text-xs flex-1 truncate" style={{ color: tk.text }}>{h.title || `Highlight ${i + 2}`}</p>
                    <Eye className="w-3 h-3 flex-shrink-0" style={{ color: tk.textMuted }} />
                    <span className="text-xs" style={{ color: tk.textMuted }}>{h.views || 0}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Athlete Grid Card 
function AthleteCard({ athlete, dark, onFollow, followed, index, loading, onViewProfile }) {
  const [liked, setLiked] = useState(false)
  const [playing, setPlaying] = useState(false)
  const tk = dark ? THEME.dark : THEME.light

  const name = `${athlete.user?.firstName || ""} ${athlete.user?.lastName || ""}`.trim()
  const videoId = athlete.highlights?.[0]?.videoId || null

  return (
    <div className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: tk.surface, border: `1px solid ${tk.border}`,
        boxShadow: dark ? "0 4px 16px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)",
        animationDelay: `${index * 60}ms`
      }}>

      {/* Video */}
      <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
        {!playing ? (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center cursor-pointer relative group"
            onClick={() => videoId && setPlaying(true)}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute top-2 right-2 z-10"><SportBadge sport={athlete.sport} /></div>
            <div className="absolute top-2 left-2 z-10">
              <span className="bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-xs font-medium">
                {athlete.position || "Athlete"}
              </span>
            </div>
            <div className={`w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center z-10 transition-transform ${videoId ? "group-hover:scale-110" : "opacity-40"}`}>
              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
            </div>
            <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1 text-white/70 text-xs">
              <Eye className="w-3 h-3" />{athlete.profileViews || 0}
            </div>
            {athlete.verified && (
              <div className="absolute bottom-2 right-2 z-10">
                <span className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                  style={{ background: "rgba(29,168,255,0.85)", color: "#fff" }}>✦ Verified</span>
              </div>
            )}
          </div>
        ) : (
          <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen />
        )}
      </div>

      {/* Body */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar name={name} size={32} />
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-bold text-xs truncate" style={{ color: tk.text }}>{name}</span>
                {athlete.verified && <span style={{ color: ACCENT }} className="text-xs flex-shrink-0">✦</span>}
              </div>
              <p className="text-xs truncate" style={{ color: tk.textMuted }}>
                {athlete.sport} · {athlete.region}
              </p>
            </div>
          </div>
          <button onClick={() => onFollow(athlete)} disabled={loading}
            className="flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-bold transition-all border"
            style={{ background: followed ? "transparent" : ACCENT, color: followed ? ACCENT : "#fff", borderColor: ACCENT, opacity: loading ? 0.6 : 1 }}>
            {loading ? "..." : followed ? "✓" : "+"}
          </button>
        </div>

        <div className="space-y-0.5 mb-2">
          <p className="text-xs flex items-center gap-1 truncate" style={{ color: tk.textMuted }}>
            <GraduationCap className="w-3 h-3 flex-shrink-0" />{athlete.school || "—"}
          </p>
          <p className="text-xs flex items-center gap-1" style={{ color: tk.textMuted }}>
            <MapPin className="w-3 h-3 flex-shrink-0" />{athlete.region || "—"} · Class of {athlete.classOf || "—"}
          </p>
        </div>

        <div className="flex items-center justify-between py-2 mb-2"
          style={{ borderTop: `1px solid ${tk.border}`, borderBottom: `1px solid ${tk.border}` }}>
          {[
            [athlete.height || "—", "Height"],
            [athlete.gpa || "—", "GPA"],
            [fmt(athlete.profileViews || 0), "Views"],
          ].map(([val, label]) => (
            <div key={label} className="text-center">
              <p className="font-bold text-xs" style={{ color: tk.text }}>{val}</p>
              <p className="text-xs" style={{ color: tk.textMuted }}>{label}</p>
            </div>
          ))}
        </div>

        {athlete.achievements?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            <span className="text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 truncate max-w-full"
              style={{ background: "rgba(29,168,255,0.1)", color: ACCENT }}>
              <Trophy className="w-2.5 h-2.5 flex-shrink-0" />
              <span className="truncate">{athlete.achievements[0]?.title || athlete.achievements[0]}</span>
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewProfile(athlete)}
            className="flex-1 text-white rounded-xl py-1.5 text-xs font-bold transition-opacity hover:opacity-90"
            style={{ background: ACCENT }}
          >
            View Profile
          </button>
          <button onClick={() => setLiked(!liked)}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all border"
            style={{ background: liked ? "rgba(236,72,153,0.1)" : "transparent", borderColor: liked ? "#EC4899" : tk.border, color: liked ? "#EC4899" : tk.textMuted }}>
            <Heart className={`w-3.5 h-3.5 ${liked ? "fill-pink-500" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page 
export default function AthleteExplore() {
  const navigate = useNavigate()
  const [dark, setDark] = useState(false)
  const [activeTab, setActive] = useState("search")
  const [query, setQuery] = useState("")
  const [sport, setSport] = useState("All Sports")
  const [region, setRegion] = useState("All Regions")
  const [year, setYear] = useState("All Years")
  const [sortBy, setSortBy] = useState("Most Popular")
  const [followed, setFollowed] = useState({})
  const [followLoading, setFollowLoading] = useState({})
  const [showFilters, setShowFilters] = useState(false)
  const [profileModal, setProfileModal] = useState(null)

  // Real data
  const [athletes, setAthletes] = useState([])
  const [fetching, setFetching] = useState(true)

  const tk = dark ? THEME.dark : THEME.light

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/signin")
      return
    }
    fetchAthletes()
  }, [navigate])


  useEffect(() => {
    fetchAthletes()
    const seedFollowState = async () => {
      try {
        const user = getCurrentUser()
        if (!user?.id && !user?._id) return
      } catch { }
    }
    seedFollowState()
  }, [sport, region, year, sortBy, query])

  const fetchAthletes = async () => {
    setFetching(true)
    try {
      const params = {}
      if (sport !== "All Sports") params.sport = sport
      if (region !== "All Regions") params.region = region
      if (year !== "All Years") params.classOf = year
      if (query) params.search = query
      if (sortBy === "Most Popular") params.sort = "followers"
      if (sortBy === "Most Viewed") params.sort = "profileViews"
      if (sortBy === "GPA") params.sort = "gpa"

      const { data } = await getAthletes(params)
      setAthletes(data.athletes || [])

      const followMap = {}
        ; (data.athletes || []).forEach(a => {
          const uid = a.user?._id || a.user?.id || a._id
          if (a.isFollowing !== undefined) followMap[uid] = a.isFollowing
        })
      setFollowed(prev => ({ ...prev, ...followMap }))
    } catch (err) {
      toast.error("Failed to load athletes")
    } finally {
      setFetching(false)
    }
  }

  const featured = athletes.filter(a => a.highlights?.length > 0).slice(0, 3)

  const handleFollow = async (athlete) => {
    // Get the User._id, not the AthleteProfile._id
    const id = athlete.user?._id || athlete.user?.id || athlete._id || athlete.id
    const profId = athlete._id || athlete.id  // keep for state key

    if (followLoading[id]) return
    setFollowLoading(prev => ({ ...prev, [id]: true }))
    setFollowed(prev => ({ ...prev, [id]: !prev[id] }))
    try {
      await toggleFollow(id)
    } catch {
      setFollowed(prev => ({ ...prev, [id]: !prev[id] }))
      toast.error("Failed to update follow")
    } finally {
      setFollowLoading(prev => ({ ...prev, [id]: false }))
    }
  }

  const hasActiveFilters = sport !== "All Sports" || region !== "All Regions" || year !== "All Years"
  const clearFilters = () => { setSport("All Sports"); setRegion("All Regions"); setYear("All Years"); setQuery("") }

  return (
    <div className="min-h-screen transition-colors duration-300"
      style={{ background: tk.page, fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Bebas+Neue&display=swap');
        .sc-card-enter { animation:scCardIn 0.3s cubic-bezier(0.4,0,0.2,1) both; }
        @keyframes scCardIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        .sc-filters-slide { animation:scSlide .2s cubic-bezier(0.4,0,0.2,1); }
        @keyframes scSlide { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:none} }
      `}</style>

      <AthleteNavbar dark={dark} toggleDark={() => setDark(!dark)} />

      <div className="max-w-6xl mx-auto flex lg:gap-6 lg:px-4">
        <div className="lg:w-52 xl:w-60 flex-shrink-0">
          <DesktopSideNav active={activeTab} setActive={setActive} dark={dark} />
        </div>

        <main className="flex-1 min-w-0 px-4 lg:px-0 pb-28 lg:pb-12"
          style={{ borderLeft: `1px solid ${tk.border}`, borderRight: `1px solid ${tk.border}` }}>

          <div className="px-4 pt-6 pb-4">
            <h1 className="font-black text-2xl sm:text-3xl mb-1"
              style={{ fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "0.05em", color: tk.text }}>
              EXPLORE ATHLETES
            </h1>
            <p className="text-sm" style={{ color: tk.textMuted }}>
              Discover talented student-athletes across Ghana
            </p>
          </div>

          <div className="px-4">
            <StatsBar total={athletes.length} dark={dark} />

            {/* Search + filter bar */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 flex items-center gap-2 rounded-2xl px-3 py-2.5"
                style={{ background: tk.inputBg, border: `1px solid ${tk.inputBorder}` }}>
                <Search className="w-4 h-4 flex-shrink-0" style={{ color: tk.textMuted }} />
                <input value={query} onChange={e => setQuery(e.target.value)}
                  placeholder="Search by name, school, position..."
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ color: tk.text }} />
                {query && (
                  <button onClick={() => setQuery("")} style={{ color: tk.textMuted }}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Mobile filter toggle */}
              <button onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden w-10 h-10 rounded-2xl flex items-center justify-center transition-all border relative"
                style={{ background: hasActiveFilters ? "rgba(29,168,255,0.1)" : tk.inputBg, borderColor: hasActiveFilters ? ACCENT : tk.inputBorder, color: hasActiveFilters ? ACCENT : tk.textMuted }}>
                <SlidersHorizontal className="w-4 h-4" />
                {hasActiveFilters && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-bold"
                    style={{ background: ACCENT, fontSize: 9 }}>
                    {[sport !== "All Sports", region !== "All Regions", year !== "All Years"].filter(Boolean).length}
                  </span>
                )}
              </button>

              {/* Desktop filter dropdowns */}
              <div className="hidden sm:flex items-center gap-2">
                <FilterDropdown label="Sport" options={SPORTS} value={sport} onChange={setSport} dark={dark} />
                <FilterDropdown label="Region" options={REGIONS} value={region} onChange={setRegion} dark={dark} />
                <FilterDropdown label="Year" options={YEARS} value={year} onChange={setYear} dark={dark} />
                <FilterDropdown label="Sort" options={SORT_BY} value={sortBy} onChange={setSortBy} dark={dark} />
              </div>
            </div>

            {/* Mobile filter panel */}
            {showFilters && (
              <div className="sc-filters-slide sm:hidden rounded-2xl p-4 mb-3"
                style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold" style={{ color: tk.text }}>Filters</span>
                  {hasActiveFilters && (
                    <button onClick={clearFilters} className="text-xs font-semibold" style={{ color: ACCENT }}>
                      Clear all
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {[["Sport", SPORTS, sport, setSport], ["Region", REGIONS, region, setRegion], ["Class Year", YEARS, year, setYear], ["Sort by", SORT_BY, sortBy, setSortBy]].map(([title, opts, val, setter]) => (
                    <div key={title}>
                      <p className="text-xs font-semibold mb-2" style={{ color: tk.textMuted }}>{title}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {opts.map(o => (
                          <FilterPill key={o} label={o} active={val === o} onClick={() => setter(o)} dark={dark} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setShowFilters(false)}
                  className="w-full mt-4 py-2 rounded-xl text-sm font-bold text-white"
                  style={{ background: ACCENT }}>
                  Show {athletes.length} Athletes
                </button>
              </div>
            )}

            {/* Active filter chips */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="text-xs" style={{ color: tk.textMuted }}>Active:</span>
                {sport !== "All Sports" && (
                  <button onClick={() => setSport("All Sports")}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border"
                    style={{ background: "rgba(29,168,255,0.1)", borderColor: "rgba(29,168,255,0.3)", color: ACCENT }}>
                    {sport} <X className="w-3 h-3" />
                  </button>
                )}
                {region !== "All Regions" && (
                  <button onClick={() => setRegion("All Regions")}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border"
                    style={{ background: "rgba(29,168,255,0.1)", borderColor: "rgba(29,168,255,0.3)", color: ACCENT }}>
                    {region} <X className="w-3 h-3" />
                  </button>
                )}
                {year !== "All Years" && (
                  <button onClick={() => setYear("All Years")}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border"
                    style={{ background: "rgba(29,168,255,0.1)", borderColor: "rgba(29,168,255,0.3)", color: ACCENT }}>
                    Class of {year} <X className="w-3 h-3" />
                  </button>
                )}
                <button onClick={clearFilters} className="text-xs font-semibold" style={{ color: tk.textMuted }}>
                  Clear all
                </button>
              </div>
            )}

            {/* Sport quick-filter pills */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {SPORTS.map(s => (
                <FilterPill key={s} label={s} active={sport === s} onClick={() => setSport(s)} dark={dark} />
              ))}
            </div>

            {/* Featured Athletes */}
            {!fetching && featured.length > 0 && !query && sport === "All Sports" && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Flame className="w-4 h-4" style={{ color: ACCENT }} />
                  <h2 className="font-black text-base" style={{ color: tk.text }}>Featured Athletes</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featured.map((athlete, i) => (
                    <div key={athlete._id} className="sc-card-enter" style={{ animationDelay: `${i * 80}ms` }}>
                      <FeaturedCard athlete={athlete} dark={dark} onFollow={handleFollow} followed={!!followed[athlete.user?._id || athlete._id]} loading={!!followLoading[athlete.user?._id || athlete._id]}
                        onViewProfile={setProfileModal} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Athletes */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" style={{ color: tk.textMuted }} />
                  <h2 className="font-black text-base" style={{ color: tk.text }}>
                    {query || hasActiveFilters ? "Search Results" : "All Athletes"}
                  </h2>
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{ background: "rgba(29,168,255,0.1)", color: ACCENT }}>
                    {athletes.length}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <FilterDropdown label="Sort" options={SORT_BY} value={sortBy} onChange={setSortBy} dark={dark} />
                </div>
              </div>

              {fetching ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} dark={dark} />)}
                </div>
              ) : athletes.length === 0 ? (
                <div className="rounded-2xl px-6 py-16 text-center"
                  style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: "rgba(29,168,255,0.1)" }}>
                    <Search className="w-6 h-6" style={{ color: ACCENT }} />
                  </div>
                  <p className="font-bold text-sm mb-1" style={{ color: tk.text }}>No athletes found</p>
                  <p className="text-xs mb-4" style={{ color: tk.textMuted }}>
                    Try adjusting your filters or search terms
                  </p>
                  <button onClick={clearFilters}
                    className="text-xs font-bold px-4 py-2 rounded-xl text-white"
                    style={{ background: ACCENT }}>
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {athletes.map((athlete, i) => (
                    <div key={athlete._id} className="sc-card-enter" style={{ animationDelay: `${i * 50}ms` }}>
                      <AthleteCard athlete={athlete} dark={dark} onFollow={handleFollow}
                        followed={!!followed[athlete.user?._id || athlete._id]} index={i} loading={!!followLoading[athlete.user?._id || athlete._id]}
                        onViewProfile={setProfileModal} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {profileModal && (
        <AthleteProfileModal
          athlete={profileModal}
          dark={dark}
          onClose={() => setProfileModal(null)}
          onFollow={handleFollow}
          followed={!!followed[profileModal.user?._id || profileModal._id]}
          followLoading={!!followLoading[profileModal.user?._id || profileModal._id]}
        />
      )}


      <MobileBottomNav active={activeTab} setActive={setActive} dark={dark} />
    </div>
  )
}