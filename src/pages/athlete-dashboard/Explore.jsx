// src/pages/AthleteExplore.jsx

import { useState, useEffect, useRef } from "react"
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


const ACCENT = "#1DA8FF"

const THEME = {
  dark: {
    page:        "#0D1117",
    surface:     "#161B22",
    surfaceHigh: "#1C2128",
    border:      "rgba(255,255,255,0.06)",
    text:        "#F0F6FF",
    textSub:     "#9CA3AF",
    textMuted:   "#4B5563",
    hover:       "rgba(255,255,255,0.035)",
    inputBg:     "#161B22",
    inputBorder: "rgba(255,255,255,0.1)",
    pillBg:      "rgba(255,255,255,0.05)",
    pillBorder:  "rgba(255,255,255,0.08)",
    pillColor:   "#9CA3AF",
    activePillBg:"rgba(29,168,255,0.12)",
    activePillBorder:"rgba(29,168,255,0.3)",
  },
  light: {
    page:        "#F0F4FA",
    surface:     "#FFFFFF",
    surfaceHigh: "#F8FAFC",
    border:      "#E5E7EB",
    text:        "#111827",
    textSub:     "#6B7280",
    textMuted:   "#9CA3AF",
    hover:       "rgba(0,0,0,0.025)",
    inputBg:     "#FFFFFF",
    inputBorder: "#D1D5DB",
    pillBg:      "#F3F4F6",
    pillBorder:  "#E5E7EB",
    pillColor:   "#6B7280",
    activePillBg:"rgba(29,168,255,0.08)",
    activePillBorder:"rgba(29,168,255,0.3)",
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK ATHLETE DATA
// ─────────────────────────────────────────────────────────────────────────────
const ALL_ATHLETES = [
  { id:1,  name:"Kofi Mensah",     handle:"@kofi_striker",  sport:"Soccer",        position:"Striker",        school:"Achimota School",   region:"Greater Accra", classOf:"2026", age:17, height:"5'9\"",  gpa:"3.5", followers:1204, views:"41.2k", verified:true,  featured:true,  achievements:["Top Scorer InterSchools","Regional MVP"],         videoId:"-5oif_xAwyg" },
  { id:2,  name:"Ama Asante",      handle:"@ama_track",     sport:"Track & Field", position:"Sprinter",       school:"Wesley Girls",      region:"Central",       classOf:"2025", age:17, height:"5'5\"",  gpa:"3.9", followers:892,  views:"28.1k", verified:false, featured:true,  achievements:["100m Regional Champion","National Qualifier"],    videoId:"-5oif_xAwyg" },
  { id:3,  name:"Kwame Boateng",   handle:"@kwame_hoops",   sport:"Basketball",    position:"Point Guard",    school:"Prempeh College",   region:"Ashanti",       classOf:"2026", age:16, height:"6'1\"",  gpa:"3.7", followers:2100, views:"67.4k", verified:true,  featured:true,  achievements:["MVP InterSchools","All-Star Selection"],          videoId:"-5oif_xAwyg" },
  { id:4,  name:"Efua Darko",      handle:"@efua_swims",    sport:"Swimming",      position:"Freestyle",      school:"Ghana Intl School", region:"Greater Accra", classOf:"2025", age:17, height:"5'7\"",  gpa:"4.0", followers:567,  views:"8.9k",  verified:false, featured:false, achievements:["School Record Holder","Regional Champ"],          videoId:"-5oif_xAwyg" },
  { id:5,  name:"Abena Osei",      handle:"@abena_vol",     sport:"Volleyball",    position:"Setter",         school:"GISS",              region:"Greater Accra", classOf:"2026", age:16, height:"5'8\"",  gpa:"3.6", followers:431,  views:"12.3k", verified:false, featured:false, achievements:["Best Setter Award","Regional Finalist"],          videoId:"-5oif_xAwyg" },
  { id:6,  name:"Yaw Darko",       handle:"@yaw_swim",      sport:"Swimming",      position:"Backstroke",     school:"KNUST Prep",        region:"Ashanti",       classOf:"2025", age:17, height:"6'0\"",  gpa:"3.4", followers:334,  views:"9.1k",  verified:false, featured:false, achievements:["Ashanti Regional Champ","School Captain"],        videoId:"-5oif_xAwyg" },
  { id:7,  name:"Serwaa Boadu",    handle:"@serwaa_runs",   sport:"Track & Field", position:"400m Runner",    school:"Mfantsipim",        region:"Central",       classOf:"2025", age:17, height:"5'6\"",  gpa:"3.8", followers:678,  views:"19.2k", verified:true,  featured:false, achievements:["National Schools Bronze","Central Region Gold"],  videoId:"-5oif_xAwyg" },
  { id:8,  name:"Nana Acheampong", handle:"@nana_keeper",   sport:"Soccer",        position:"Goalkeeper",     school:"St Peter's Boys",   region:"Eastern",       classOf:"2026", age:16, height:"6'2\"",  gpa:"3.3", followers:289,  views:"7.4k",  verified:false, featured:false, achievements:["Best GK InterSchools","Clean Sheet Record"],      videoId:"-5oif_xAwyg" },
  { id:9,  name:"Adwoa Frimpong",  handle:"@adwoa_hoop",    sport:"Basketball",    position:"Shooting Guard", school:"Holy Child",        region:"Central",       classOf:"2027", age:15, height:"5'7\"",  gpa:"3.9", followers:512,  views:"14.6k", verified:false, featured:false, achievements:["Rising Star Award","Central Schools MVP"],        videoId:"-5oif_xAwyg" },
  { id:10, name:"Kojo Asare",      handle:"@kojo_field",    sport:"Track & Field", position:"Long Jump",      school:"Opoku Ware",        region:"Ashanti",       classOf:"2026", age:16, height:"5'11\"", gpa:"3.2", followers:198,  views:"5.2k",  verified:false, featured:false, achievements:["Ashanti Schools Gold","Personal Best 7.2m"],      videoId:"-5oif_xAwyg" },
  { id:11, name:"Akosua Mensah",   handle:"@akosua_swim",   sport:"Swimming",      position:"Breaststroke",   school:"Wesley Girls",      region:"Central",       classOf:"2025", age:17, height:"5'5\"",  gpa:"3.7", followers:445,  views:"11.8k", verified:false, featured:false, achievements:["200m Breaststroke Record","National Finals"],     videoId:"-5oif_xAwyg" },
  { id:12, name:"Fiifi Annan",     handle:"@fiifi_soccer",  sport:"Soccer",        position:"Midfielder",     school:"Legon Presec",      region:"Greater Accra", classOf:"2026", age:16, height:"5'10\"", gpa:"3.6", followers:723,  views:"22.1k", verified:true,  featured:false, achievements:["Best Midfielder Award","Greater Accra Champ"],    videoId:"-5oif_xAwyg" },
]

const SPORTS   = ["All Sports","Soccer","Basketball","Track & Field","Swimming","Volleyball"]
const REGIONS  = ["All Regions","Greater Accra","Ashanti","Central","Eastern","Western","Northern"]
const YEARS    = ["All Years","2025","2026","2027","2028"]
const SORT_BY  = ["Most Popular","Most Viewed","Newest","GPA"]

const fmt = n => {
  if (typeof n === "string") return n
  return n >= 1000 ? (n / 1000).toFixed(1) + "k" : n
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURED ATHLETE CARD  (large horizontal card at the top)
// ─────────────────────────────────────────────────────────────────────────────
function FeaturedCard({ athlete, dark, onFollow, followed }) {
  const [playing, setPlaying] = useState(false)
  const [liked, setLiked]     = useState(false)
  const tk = dark ? THEME.dark : THEME.light

  return (
    <div
      className="rounded-2xl overflow-hidden relative"
      style={{
        background: tk.surface,
        border: `1px solid ${tk.border}`,
        boxShadow: dark ? "0 8px 32px rgba(0,0,0,0.4)" : "0 4px 24px rgba(0,0,0,0.08)"
      }}
    >
      {/* Featured label */}
      <div
        className="absolute top-3 left-3 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
        style={{ background: "rgba(29,168,255,0.9)", color: "#fff" }}
      >
        <Star className="w-3 h-3 fill-white" /> Featured
      </div>

      {/* Video thumbnail */}
      <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
        {!playing ? (
          <div
            className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center cursor-pointer relative group"
            onClick={() => setPlaying(true)}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center z-10 group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 text-white fill-white ml-0.5" />
            </div>
            <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 text-white/70 text-xs">
              <Eye className="w-3 h-3" />{athlete.views}
            </div>
          </div>
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${athlete.videoId}?autoplay=1&rel=0&modestbranding=1`}
            className="w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar name={athlete.name} size={44} />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-sm" style={{ color: tk.text }}>{athlete.name}</span>
                {athlete.verified && <span style={{ color: ACCENT }}>✦</span>}
              </div>
              <p className="text-xs" style={{ color: tk.textMuted }}>{athlete.handle}</p>
              <div className="mt-1"><SportBadge sport={athlete.sport} /></div>
            </div>
          </div>
          <button
            onClick={() => onFollow(athlete.id)}
            className="flex-shrink-0 flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all"
            style={{
              background: followed ? "transparent" : ACCENT,
              color:       followed ? ACCENT        : "#fff",
              border:      `1px solid ${ACCENT}`,
            }}
          >
            {followed ? <Check className="w-3 h-3" /> : <UserPlus className="w-3 h-3" />}
            {followed ? "Following" : "Follow"}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-3">
          <span className="text-xs flex items-center gap-1" style={{ color: tk.textMuted }}>
            <GraduationCap className="w-3 h-3" />{athlete.position} · {athlete.school}
          </span>
          <span className="text-xs flex items-center gap-1" style={{ color: tk.textMuted }}>
            <MapPin className="w-3 h-3" />{athlete.region}
          </span>
          <span className="text-xs font-semibold" style={{ color: tk.textSub }}>
            Class of {athlete.classOf}
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mt-3">
          {athlete.achievements.map((a, i) => (
            <span
              key={i}
              className="text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1"
              style={{ background: "rgba(29,168,255,0.1)", color: ACCENT }}
            >
              <Trophy className="w-2.5 h-2.5" />{a}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: `1px solid ${tk.border}` }}>
          <div className="flex items-center gap-4">
            <span className="text-xs" style={{ color: tk.textMuted }}>
              <span className="font-bold" style={{ color: tk.text }}>{fmt(athlete.followers)}</span> followers
            </span>
            <span className="text-xs flex items-center gap-1" style={{ color: tk.textMuted }}>
              <Eye className="w-3 h-3" />{athlete.views} views
            </span>
          </div>
          <button
            onClick={() => setLiked(!liked)}
            className="flex items-center gap-1 text-xs transition-colors"
            style={{ color: liked ? "#EC4899" : tk.textMuted }}
          >
            <Heart className={`w-4 h-4 ${liked ? "fill-pink-500" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ATHLETE GRID CARD
// ─────────────────────────────────────────────────────────────────────────────
function AthleteCard({ athlete, dark, onFollow, followed, index }) {
  const [liked, setLiked]   = useState(false)
  const [playing, setPlaying] = useState(false)
  const tk = dark ? THEME.dark : THEME.light

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: tk.surface,
        border: `1px solid ${tk.border}`,
        boxShadow: dark ? "0 4px 16px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)",
        animationDelay: `${index * 60}ms`,
      }}
    >
      {/* Video */}
      <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
        {!playing ? (
          <div
            className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center cursor-pointer relative group"
            onClick={() => setPlaying(true)}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

            {/* Sport badge top right */}
            <div className="absolute top-2 right-2 z-10">
              <SportBadge sport={athlete.sport} />
            </div>

            {/* Position + class top left */}
            <div className="absolute top-2 left-2 z-10">
              <span className="bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-xs font-medium">
                {athlete.position}
              </span>
            </div>

            {/* Play button */}
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center z-10 group-hover:scale-110 transition-transform">
              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
            </div>

            {/* Views bottom */}
            <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1 text-white/70 text-xs">
              <Eye className="w-3 h-3" />{athlete.views}
            </div>

            {/* Verified badge */}
            {athlete.verified && (
              <div className="absolute bottom-2 right-2 z-10">
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                  style={{ background: "rgba(29,168,255,0.85)", color: "#fff" }}
                >✦ Verified</span>
              </div>
            )}
          </div>
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${athlete.videoId}?autoplay=1&rel=0&modestbranding=1`}
            className="w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        )}
      </div>

      {/* Card body */}
      <div className="p-3">
        {/* Name row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar name={athlete.name} size={32} />
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-bold text-xs truncate" style={{ color: tk.text }}>{athlete.name}</span>
                {athlete.verified && <span style={{ color: ACCENT }} className="text-xs flex-shrink-0">✦</span>}
              </div>
              <p className="text-xs truncate" style={{ color: tk.textMuted }}>{athlete.handle}</p>
            </div>
          </div>
          <button
            onClick={() => onFollow(athlete.id)}
            className="flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-bold transition-all border"
            style={{
              background:  followed ? "transparent" : ACCENT,
              color:       followed ? ACCENT        : "#fff",
              borderColor: ACCENT,
            }}
          >
            {followed ? "✓" : "+"}
          </button>
        </div>

        {/* School + region */}
        <div className="space-y-0.5 mb-2">
          <p className="text-xs flex items-center gap-1 truncate" style={{ color: tk.textMuted }}>
            <GraduationCap className="w-3 h-3 flex-shrink-0" />{athlete.school}
          </p>
          <p className="text-xs flex items-center gap-1" style={{ color: tk.textMuted }}>
            <MapPin className="w-3 h-3 flex-shrink-0" />{athlete.region} · Class of {athlete.classOf}
          </p>
        </div>

        {/* Stats row */}
        <div
          className="flex items-center justify-between py-2 mb-2"
          style={{ borderTop: `1px solid ${tk.border}`, borderBottom: `1px solid ${tk.border}` }}
        >
          {[
            [athlete.height, "Height"],
            [athlete.gpa,    "GPA"],
            [fmt(athlete.followers), "Followers"],
          ].map(([val, label]) => (
            <div key={label} className="text-center">
              <p className="font-bold text-xs" style={{ color: tk.text }}>{val}</p>
              <p className="text-xs" style={{ color: tk.textMuted }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div className="flex flex-wrap gap-1 mb-3">
          {athlete.achievements.slice(0, 1).map((a, i) => (
            <span
              key={i}
              className="text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 truncate max-w-full"
              style={{ background: "rgba(29,168,255,0.1)", color: ACCENT }}
            >
              <Trophy className="w-2.5 h-2.5 flex-shrink-0" />
              <span className="truncate">{a}</span>
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            className="flex-1 text-white rounded-xl py-1.5 text-xs font-bold transition-opacity hover:opacity-90"
            style={{ background: ACCENT }}
          >
            View Profile
          </button>
          <button
            onClick={() => setLiked(!liked)}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all border"
            style={{
              background:  liked ? "rgba(236,72,153,0.1)" : "transparent",
              borderColor: liked ? "#EC4899"               : tk.border,
              color:       liked ? "#EC4899"               : tk.textMuted,
            }}
          >
            <Heart className={`w-3.5 h-3.5 ${liked ? "fill-pink-500" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FILTER PILL
// ─────────────────────────────────────────────────────────────────────────────
function FilterPill({ label, active, onClick, dark }) {
  const tk = dark ? THEME.dark : THEME.light
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border"
      style={{
        background:  active ? tk.activePillBg     : tk.pillBg,
        borderColor: active ? tk.activePillBorder  : tk.pillBorder,
        color:       active ? ACCENT               : tk.pillColor,
      }}
    >
      {active && <Check className="w-3 h-3" />}
      {label}
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FILTER DROPDOWN
// ─────────────────────────────────────────────────────────────────────────────
function FilterDropdown({ label, options, value, onChange, dark }) {
  const [open, setOpen] = useState(false)
  const ref             = useRef(null)
  const tk              = dark ? THEME.dark : THEME.light

  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener("mousedown", fn)
    return () => document.removeEventListener("mousedown", fn)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border"
        style={{
          background:  value !== options[0] ? tk.activePillBg     : tk.inputBg,
          borderColor: value !== options[0] ? tk.activePillBorder  : tk.inputBorder,
          color:       value !== options[0] ? ACCENT               : tk.textSub,
        }}
      >
        {value}
        <ChevronDown
          className="w-3 h-3 transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "none" }}
        />
      </button>

      {open && (
        <div
          className="absolute top-10 left-0 z-50 rounded-2xl overflow-hidden min-w-[140px]"
          style={{
            background:  tk.surface,
            border:      `1px solid ${tk.border}`,
            boxShadow:   dark ? "0 16px 48px rgba(0,0,0,0.5)" : "0 8px 32px rgba(0,0,0,0.12)",
          }}
        >
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false) }}
              className="w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center justify-between transition-colors"
              style={{ color: opt === value ? ACCENT : tk.textSub }}
              onMouseEnter={e => e.currentTarget.style.background = tk.hover}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              {opt}
              {opt === value && <Check className="w-3 h-3" style={{ color: ACCENT }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STATS BAR
// ─────────────────────────────────────────────────────────────────────────────
function StatsBar({ total, dark }) {
  const tk = dark ? THEME.dark : THEME.light
  const stats = [
    { icon: Users,     label: "Athletes",  value: total },
    { icon: Trophy,    label: "Sports",    value: "6"   },
    { icon: MapPin,    label: "Regions",   value: "6"   },
    { icon: TrendingUp,label: "Recruiting",value: "142" },
  ]
  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
    >
      {stats.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="flex items-center gap-3 rounded-2xl px-4 py-3"
          style={{ background: tk.surface, border: `1px solid ${tk.border}` }}
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(29,168,255,0.1)" }}
          >
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

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPLORE PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function AthleteExplore() {
  const [dark, setDark]         = useState(false)
  const [activeTab, setActive]  = useState("search")
  const [query, setQuery]       = useState("")
  const [sport, setSport]       = useState("All Sports")
  const [region, setRegion]     = useState("All Regions")
  const [year, setYear]         = useState("All Years")
  const [sortBy, setSortBy]     = useState("Most Popular")
  const [followed, setFollowed] = useState({})
  const [showFilters, setShowFilters] = useState(false)
  const [activeView, setActiveView]   = useState("grid") // grid | list

  const tk = dark ? THEME.dark : THEME.light

  // ── Filter logic ──────────────────────────────────────────────────────────
  const filtered = ALL_ATHLETES.filter(a => {
    const matchQuery  = !query  || a.name.toLowerCase().includes(query.toLowerCase()) || a.school.toLowerCase().includes(query.toLowerCase()) || a.position.toLowerCase().includes(query.toLowerCase())
    const matchSport  = sport  === "All Sports"  || a.sport  === sport
    const matchRegion = region === "All Regions" || a.region === region
    const matchYear   = year   === "All Years"   || a.classOf === year
    return matchQuery && matchSport && matchRegion && matchYear
  }).sort((a, b) => {
    if (sortBy === "Most Popular") return b.followers - a.followers
    if (sortBy === "Most Viewed")  return parseInt(b.views) - parseInt(a.views)
    if (sortBy === "GPA")          return parseFloat(b.gpa) - parseFloat(a.gpa)
    return 0
  })

  const featured = filtered.filter(a => a.featured).slice(0, 3)

  const handleFollow = id => {
    setFollowed(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const hasActiveFilters = sport !== "All Sports" || region !== "All Regions" || year !== "All Years"
  const clearFilters = () => { setSport("All Sports"); setRegion("All Regions"); setYear("All Years"); setQuery("") }

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ background: tk.page, fontFamily: "'DM Sans','Segoe UI',sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Bebas+Neue&display=swap');
        .sc-card-enter { animation: scCardIn 0.3s cubic-bezier(0.4,0,0.2,1) both; }
        @keyframes scCardIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
        .sc-filters-slide { animation: scSlide .2s cubic-bezier(0.4,0,0.2,1); }
        @keyframes scSlide { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:none} }
      `}</style>

      {/* ── Navbar ── */}
      <AthleteNavbar dark={dark} toggleDark={() => setDark(!dark)} />

      <div className="max-w-6xl mx-auto flex lg:gap-6 lg:px-4">

        {/* ── Desktop Left Nav ── */}
        <div className="lg:w-52 xl:w-60 flex-shrink-0">
          <DesktopSideNav active={activeTab} setActive={setActive} dark={dark} />
        </div>

        {/* ── Main Content ── */}
        <main
          className="flex-1 min-w-0 px-4 lg:px-0 pb-28 lg:pb-12"
          style={{ borderLeft: `1px solid ${tk.border}`, borderRight: `1px solid ${tk.border}` }}
        >

          {/* ── Page Header ── */}
          <div className="px-4 pt-6 pb-4">
            <h1
              className="font-black text-2xl sm:text-3xl mb-1"
              style={{ fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "0.05em", color: tk.text }}
            >
              EXPLORE ATHLETES
            </h1>
            <p className="text-sm" style={{ color: tk.textMuted }}>
              Discover talented student-athletes across Ghana
            </p>
          </div>

          <div className="px-4">

            {/* ── Stats Bar ── */}
            <StatsBar total={filtered.length} dark={dark} />

            {/* ── Search + Filter Bar ── */}
            <div className="flex items-center gap-2 mb-3">

              {/* Search input */}
              <div
                className="flex-1 flex items-center gap-2 rounded-2xl px-3 py-2.5"
                style={{ background: tk.inputBg, border: `1px solid ${tk.inputBorder}` }}
              >
                <Search className="w-4 h-4 flex-shrink-0" style={{ color: tk.textMuted }} />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search by name, school, position..."
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ color: tk.text }}
                />
                {query && (
                  <button onClick={() => setQuery("")} style={{ color: tk.textMuted }}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Filter toggle (mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden w-10 h-10 rounded-2xl flex items-center justify-center transition-all border relative"
                style={{
                  background:  hasActiveFilters ? "rgba(29,168,255,0.1)" : tk.inputBg,
                  borderColor: hasActiveFilters ? ACCENT                  : tk.inputBorder,
                  color:       hasActiveFilters ? ACCENT                  : tk.textMuted,
                }}
              >
                <SlidersHorizontal className="w-4 h-4" />
                {hasActiveFilters && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-bold"
                    style={{ background: ACCENT, fontSize: 9 }}
                  >
                    {[sport !== "All Sports", region !== "All Regions", year !== "All Years"].filter(Boolean).length}
                  </span>
                )}
              </button>

              {/* Desktop filter dropdowns */}
              <div className="hidden sm:flex items-center gap-2">
                <FilterDropdown label="Sport"  options={SPORTS}  value={sport}  onChange={setSport}  dark={dark} />
                <FilterDropdown label="Region" options={REGIONS} value={region} onChange={setRegion} dark={dark} />
                <FilterDropdown label="Year"   options={YEARS}   value={year}   onChange={setYear}   dark={dark} />
                <FilterDropdown label="Sort"   options={SORT_BY} value={sortBy} onChange={setSortBy} dark={dark} />
              </div>
            </div>

            {/* ── Mobile Filter Panel ── */}
            {showFilters && (
              <div
                className="sc-filters-slide sm:hidden rounded-2xl p-4 mb-3"
                style={{ background: tk.surface, border: `1px solid ${tk.border}` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold" style={{ color: tk.text }}>Filters</span>
                  {hasActiveFilters && (
                    <button onClick={clearFilters} className="text-xs font-semibold" style={{ color: ACCENT }}>
                      Clear all
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {/* Sport pills */}
                  <div>
                    <p className="text-xs font-semibold mb-2" style={{ color: tk.textMuted }}>Sport</p>
                    <div className="flex flex-wrap gap-1.5">
                      {SPORTS.map(s => (
                        <FilterPill key={s} label={s} active={sport === s} onClick={() => setSport(s)} dark={dark} />
                      ))}
                    </div>
                  </div>

                  {/* Region pills */}
                  <div>
                    <p className="text-xs font-semibold mb-2" style={{ color: tk.textMuted }}>Region</p>
                    <div className="flex flex-wrap gap-1.5">
                      {REGIONS.map(r => (
                        <FilterPill key={r} label={r} active={region === r} onClick={() => setRegion(r)} dark={dark} />
                      ))}
                    </div>
                  </div>

                  {/* Year pills */}
                  <div>
                    <p className="text-xs font-semibold mb-2" style={{ color: tk.textMuted }}>Class Year</p>
                    <div className="flex flex-wrap gap-1.5">
                      {YEARS.map(y => (
                        <FilterPill key={y} label={y} active={year === y} onClick={() => setYear(y)} dark={dark} />
                      ))}
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <p className="text-xs font-semibold mb-2" style={{ color: tk.textMuted }}>Sort by</p>
                    <div className="flex flex-wrap gap-1.5">
                      {SORT_BY.map(s => (
                        <FilterPill key={s} label={s} active={sortBy === s} onClick={() => setSortBy(s)} dark={dark} />
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full mt-4 py-2 rounded-xl text-sm font-bold text-white"
                  style={{ background: ACCENT }}
                >
                  Show {filtered.length} Athletes
                </button>
              </div>
            )}

            {/* ── Active filter chips ── */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="text-xs" style={{ color: tk.textMuted }}>Active:</span>
                {sport !== "All Sports" && (
                  <button
                    onClick={() => setSport("All Sports")}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border"
                    style={{ background: "rgba(29,168,255,0.1)", borderColor: "rgba(29,168,255,0.3)", color: ACCENT }}
                  >
                    {sport} <X className="w-3 h-3" />
                  </button>
                )}
                {region !== "All Regions" && (
                  <button
                    onClick={() => setRegion("All Regions")}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border"
                    style={{ background: "rgba(29,168,255,0.1)", borderColor: "rgba(29,168,255,0.3)", color: ACCENT }}
                  >
                    {region} <X className="w-3 h-3" />
                  </button>
                )}
                {year !== "All Years" && (
                  <button
                    onClick={() => setYear("All Years")}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border"
                    style={{ background: "rgba(29,168,255,0.1)", borderColor: "rgba(29,168,255,0.3)", color: ACCENT }}
                  >
                    Class of {year} <X className="w-3 h-3" />
                  </button>
                )}
                <button onClick={clearFilters} className="text-xs font-semibold" style={{ color: tk.textMuted }}>
                  Clear all
                </button>
              </div>
            )}

            {/* ── Sport quick-filter pills (scrollable row) ── */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {SPORTS.map(s => (
                <FilterPill key={s} label={s} active={sport === s} onClick={() => setSport(s)} dark={dark} />
              ))}
            </div>

            {/* ── Featured Athletes ── */}
            {featured.length > 0 && !query && sport === "All Sports" && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Flame className="w-4 h-4" style={{ color: ACCENT }} />
                  <h2 className="font-black text-base" style={{ color: tk.text }}>Featured Athletes</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featured.map((athlete, i) => (
                    <div key={athlete.id} className="sc-card-enter" style={{ animationDelay: `${i * 80}ms` }}>
                      <FeaturedCard
                        athlete={athlete}
                        dark={dark}
                        onFollow={handleFollow}
                        followed={!!followed[athlete.id]}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── All Athletes ── */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" style={{ color: tk.textMuted }} />
                  <h2 className="font-black text-base" style={{ color: tk.text }}>
                    {query || hasActiveFilters ? "Search Results" : "All Athletes"}
                  </h2>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{ background: "rgba(29,168,255,0.1)", color: ACCENT }}
                  >
                    {filtered.length}
                  </span>
                </div>

                {/* Sort dropdown (desktop only — also shown in filter bar) */}
                <div className="hidden sm:block">
                  <FilterDropdown label="Sort" options={SORT_BY} value={sortBy} onChange={setSortBy} dark={dark} />
                </div>
              </div>

              {/* Empty state */}
              {filtered.length === 0 ? (
                <div
                  className="rounded-2xl px-6 py-16 text-center"
                  style={{ background: tk.surface, border: `1px solid ${tk.border}` }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: "rgba(29,168,255,0.1)" }}
                  >
                    <Search className="w-6 h-6" style={{ color: ACCENT }} />
                  </div>
                  <p className="font-bold text-sm mb-1" style={{ color: tk.text }}>No athletes found</p>
                  <p className="text-xs mb-4" style={{ color: tk.textMuted }}>
                    Try adjusting your filters or search terms
                  </p>
                  <button
                    onClick={clearFilters}
                    className="text-xs font-bold px-4 py-2 rounded-xl text-white"
                    style={{ background: ACCENT }}
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                /* ── Grid ── */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.map((athlete, i) => (
                    <div key={athlete.id} className="sc-card-enter" style={{ animationDelay: `${i * 50}ms` }}>
                      <AthleteCard
                        athlete={athlete}
                        dark={dark}
                        onFollow={handleFollow}
                        followed={!!followed[athlete.id]}
                        index={i}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </main>
      </div>

      {/* ── Mobile Bottom Nav ── */}
      <MobileBottomNav active={activeTab} setActive={setActive} dark={dark} />
    </div>
  )
}