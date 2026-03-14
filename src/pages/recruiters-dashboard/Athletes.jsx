// src/pages/RecruiterAthletes.jsx

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import RecruiterNavbar    from "../../components/RecruiterNavbar"
import RecruiterBottomNav from "../../components/RecruiterBottomNav"
import {
  FilterPill, SportBadge, RAvatar, RecruiterSideNav,
  ACCENT, ACCENT2, THEME
} from "../../components/RecruiterUi"
import {
  Search, X, Bookmark, Eye, MapPin, GraduationCap,
  Trophy, Users, ChevronDown, Check, MessageCircle,
  Play, Star, Award
} from "lucide-react"
import {
  getAthletes, getShortlist, addToShortlist,
  removeFromShortlist, startConversation,
  isLoggedIn, getCurrentUser
} from "../../api/client"


const SPORTS  = ["All", "Soccer", "Basketball", "Track & Field", "Swimming", "Volleyball"]
const REGIONS = ["All Regions", "Greater Accra", "Ashanti", "Central", "Eastern", "Western"]
const YEARS   = ["All Years", "2025", "2026", "2027"]
const SORT_BY = ["Most Followers", "GPA High–Low", "Class Year"]

const fmt = n => {
  if (!n && n !== 0) return "—"
  if (typeof n === "string") return n
  return n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n)
}


// ATHLETE PROFILE MODAL
function AthleteProfileModal({ athlete, dark, onClose, isSaved, onSave, onMessage }) {
  const tk = dark ? THEME.dark : THEME.light
  const [playing, setPlaying] = useState(false)

  const name     = athlete.name     || `${athlete.user?.firstName || ""} ${athlete.user?.lastName || ""}`.trim()
  const sport    = athlete.sport    || "—"
  const position = athlete.position || "—"
  const school   = athlete.school   || "—"
  const region   = athlete.region   || "—"
  const classOf  = athlete.classOf  || "—"
  const gpa      = athlete.gpa      || "—"
  const height   = athlete.height   || "—"
  const bio      = athlete.bio      || null
  const videoId  = athlete.highlights?.[0]?.videoId || null
  const achievements = athlete.achievements || []

  // Close on Escape
  useEffect(() => {
    const fn = e => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", fn)
    return () => document.removeEventListener("keydown", fn)
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden"
        style={{
          background: tk.surface,
          border:     `1px solid ${tk.border}`,
          boxShadow:  "0 24px 64px rgba(0,0,0,0.4)",
          maxHeight:  "90vh",
          overflowY:  "auto",
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
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ color: tk.textMuted, background: tk.hover }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video */}
        {videoId && (
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
                  {athlete.highlights?.[0]?.title || "Highlight Reel"}
                </div>
              </div>
            ) : (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            )}
          </div>
        )}

        {/* Body */}
        <div className="p-4">
          {/* Name + actions */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <RAvatar name={name} size={52} />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-black text-base" style={{ color: tk.text }}>{name}</p>
                  {athlete.verified && <span style={{ color: ACCENT, fontSize: 11 }}>✦</span>}
                </div>
                <p className="text-xs" style={{ color: tk.textMuted }}>{position} · {sport}</p>
                <div className="mt-1"><SportBadge sport={sport} /></div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => onSave(athlete)}
                className="w-8 h-8 rounded-xl flex items-center justify-center border transition-all"
                style={{
                  background:  isSaved ? `${ACCENT}15` : "transparent",
                  borderColor: isSaved ? ACCENT         : tk.border,
                  color:       isSaved ? ACCENT         : tk.textMuted,
                }}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-amber-400" : ""}`} />
              </button>
              <button
                onClick={() => { onMessage(athlete); onClose() }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: `linear-gradient(135deg,${ACCENT},${ACCENT2})` }}
              >
                <MessageCircle className="w-3.5 h-3.5" /> Message
              </button>
            </div>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-3 gap-2 mb-4 p-3 rounded-2xl"
            style={{ background: tk.surfaceHigh || (dark ? "#1C2128" : "#F8FAFC") }}
          >
            {[
              [height,                "Height"],
              [gpa,                   "GPA"   ],
              [fmt(athlete.followers || 0), "Followers"],
            ].map(([val, label]) => (
              <div key={label} className="text-center">
                <p className="font-black text-sm" style={{ color: tk.text }}>{val}</p>
                <p className="text-xs"             style={{ color: tk.textMuted }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Details */}
          <div className="space-y-2 mb-4">
            {[
              [GraduationCap, school,          "School" ],
              [MapPin,        region,          "Region" ],
              [Trophy,        `Class of ${classOf}`, "Year"],
            ].map(([Icon, val, label]) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${ACCENT}10` }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: ACCENT }} />
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: tk.text }}>{val}</p>
                  <p className="text-xs"               style={{ color: tk.textMuted }}>{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bio */}
          {bio && (
            <div
              className="rounded-xl p-3 mb-4 text-xs leading-relaxed"
              style={{ background: dark ? "rgba(255,255,255,0.03)" : "#F8FAFC", color: tk.textSub, border: `1px solid ${tk.border}` }}
            >
              {bio}
            </div>
          )}

          {/* Achievements */}
          {achievements.length > 0 && (
            <div>
              <p className="text-xs font-bold mb-2" style={{ color: tk.textMuted }}>ACHIEVEMENTS</p>
              <div className="flex flex-wrap gap-1.5">
                {achievements.map((a, i) => (
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
        </div>
      </div>
    </div>
  )
}


// DROPDOWN
function Dropdown({ value, options, onChange, dark }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const tk  = dark ? THEME.dark : THEME.light
  const active = value !== options[0]

  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener("mousedown", fn)
    return () => document.removeEventListener("mousedown", fn)
  }, [])

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all"
        style={{
          background:  active ? `${ACCENT}12` : tk.surface,
          borderColor: active ? ACCENT         : tk.border,
          color:       active ? ACCENT         : tk.textSub,
        }}
      >
        {value}
        <ChevronDown className="w-3 h-3 transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "none" }} />
      </button>
      {open && (
        <div
          className="absolute top-10 left-0 z-30 rounded-2xl overflow-hidden min-w-[150px] shadow-xl"
          style={{ background: tk.surface, border: `1px solid ${tk.border}` }}
        >
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false) }}
              className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold"
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


// SKELETON CARD
function SkeletonCard({ dark }) {
  const tk = dark ? THEME.dark : THEME.light
  return (
    <div className="rounded-2xl overflow-hidden animate-pulse"
      style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full flex-shrink-0" style={{ background: tk.border }} />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 rounded-full w-28" style={{ background: tk.border }} />
            <div className="h-2.5 rounded-full w-20" style={{ background: tk.border }} />
          </div>
        </div>
        <div className="h-2.5 rounded-full w-full" style={{ background: tk.border }} />
        <div className="grid grid-cols-3 gap-2">
          {[0,1,2].map(i => <div key={i} className="h-8 rounded-xl" style={{ background: tk.border }} />)}
        </div>
        <div className="h-9 rounded-xl" style={{ background: tk.border }} />
      </div>
    </div>
  )
}


// ATHLETE CARD
function AthleteCard({ athlete, dark, isSaved, onSave, onView, onMessage }) {
  const tk   = dark ? THEME.dark : THEME.light
  const name = athlete.name ||
    `${athlete.user?.firstName || ""} ${athlete.user?.lastName || ""}`.trim() ||
    "Athlete"

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all"
      style={{ background: tk.surface, border: `1px solid ${athlete.verified ? `${ACCENT}30` : tk.border}` }}
    >
      {athlete.verified && (
        <div className="h-0.5" style={{ background: `linear-gradient(90deg,${ACCENT},${ACCENT2})` }} />
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <RAvatar name={name} size={44} />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-bold text-sm truncate" style={{ color: tk.text }}>{name}</p>
                {athlete.verified && <span style={{ color: ACCENT, fontSize: 11 }}>✦</span>}
              </div>
              <p className="text-xs" style={{ color: tk.textMuted }}>{athlete.position || "—"}</p>
              <div className="mt-1"><SportBadge sport={athlete.sport} /></div>
            </div>
          </div>
          <button
            onClick={() => onSave(athlete)}
            className="w-8 h-8 rounded-xl flex items-center justify-center border transition-all flex-shrink-0"
            style={{
              background:  isSaved ? `${ACCENT}15` : "transparent",
              borderColor: isSaved ? ACCENT         : tk.border,
              color:       isSaved ? ACCENT         : tk.textMuted,
            }}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-amber-400" : ""}`} />
          </button>
        </div>

        {/* Location + year */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
          <span className="text-xs flex items-center gap-1" style={{ color: tk.textMuted }}>
            <MapPin className="w-3 h-3" />{athlete.region || "—"}
          </span>
          <span className="text-xs flex items-center gap-1" style={{ color: tk.textMuted }}>
            <GraduationCap className="w-3 h-3" />Class of {athlete.classOf || "—"}
          </span>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-3 gap-2 py-2.5 mb-3"
          style={{ borderTop: `1px solid ${tk.border}`, borderBottom: `1px solid ${tk.border}` }}
        >
          {[
            [athlete.height   || "—",           "Height"   ],
            [athlete.gpa      || "—",           "GPA"      ],
            [fmt(athlete.followers || 0),        "Followers"],
          ].map(([val, label]) => (
            <div key={label} className="text-center">
              <p className="font-black text-sm" style={{ color: tk.text }}>{val}</p>
              <p className="text-xs"             style={{ color: tk.textMuted }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Achievement */}
        {(athlete.achievements?.[0] || athlete.achievement) && (
          <div className="flex items-center gap-1.5 mb-3">
            <Trophy className="w-3 h-3 flex-shrink-0" style={{ color: ACCENT }} />
            <p className="text-xs truncate" style={{ color: tk.textSub }}>
              {athlete.achievements?.[0]?.title || athlete.achievements?.[0] || athlete.achievement}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onView(athlete)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-white hover:opacity-90 transition-opacity"
            style={{ background: `linear-gradient(135deg,${ACCENT},${ACCENT2})` }}
          >
            <Eye className="w-3.5 h-3.5" /> View Profile
          </button>
          <button
            onClick={() => onMessage(athlete)}
            className="w-9 h-9 flex items-center justify-center rounded-xl border transition-all"
            style={{ borderColor: tk.border, color: tk.textMuted }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.color = ACCENT }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = tk.border; e.currentTarget.style.color = tk.textMuted }}
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}


// MAIN PAGE
export default function RecruiterAthletes() {
  const navigate = useNavigate()
  const [dark, setDark]     = useState(false)
  const [query, setQuery]   = useState("")
  const [sport, setSport]   = useState("All")
  const [region, setRegion] = useState("All Regions")
  const [year, setYear]     = useState("All Years")
  const [sort, setSort]     = useState("Most Followers")
  const tk = dark ? THEME.dark : THEME.light

  // Real data
  const [athletes, setAthletes]           = useState([])
  const [fetching, setFetching]           = useState(true)
  const [savedMap, setSavedMap]           = useState({})  
  const [saveLoading, setSaveLoading]     = useState({})   
  const [profileModal, setProfileModal]   = useState(null) 
  const [messagingId, setMessagingId]     = useState(null) 

  useEffect(() => {
    if (!isLoggedIn()) { navigate("/signin"); return }
    fetchAthletes()
    fetchShortlist()
  }, [])

  useEffect(() => {
    fetchAthletes()
  }, [sport, region, year, sort, query])

  const fetchAthletes = async () => {
    setFetching(true)
    try {
      const params = {}
      if (sport  !== "All")         params.sport   = sport
      if (region !== "All Regions") params.region  = region
      if (year   !== "All Years")   params.classOf = year
      if (query)                    params.search  = query
      if (sort === "Most Followers") params.sort   = "followers"
      if (sort === "GPA High–Low")   params.sort   = "gpa"

      const { data } = await getAthletes(params)
      setAthletes(data.athletes || [])
    } catch {
      toast.error("Failed to load athletes")
    } finally {
      setFetching(false)
    }
  }

  const fetchShortlist = async () => {
    try {
      const { data } = await getShortlist()
      const map = {}
      ;(data.shortlist || []).forEach(item => {
        const uid = item.athlete?.id || item.athlete?._id
        if (uid) map[uid] = true
      })
      setSavedMap(map)
    } catch {
      
    }
  }

  // Get user ID from athlete object
  const getUserId = (athlete) =>
    athlete.user?._id || athlete.user?.id || athlete._id || athlete.id

 const handleSave = async (athlete) => {
  const uid = getUserId(athlete)
  console.log("uid being sent:", uid)

  if (!uid) {
    toast.error("No athlete ID found")
    return
  }

  const wasSaved = !!savedMap[uid]
  setSavedMap(prev    => ({ ...prev, [uid]: !wasSaved }))
  setSaveLoading(prev => ({ ...prev, [uid]: true }))

  try {
    if (wasSaved) {
      await removeFromShortlist(uid)
      toast.success("Removed from shortlist")
    } else {
      console.log("calling addToShortlist with:", uid)
      const result = await addToShortlist(uid)
      console.log("result:", result)
      toast.success("Added to shortlist")
    }
  } catch (err) {
    console.error("Full error:", err)
    console.error("Response:", err.response?.data)
    console.error("Status:", err.response?.status)
    setSavedMap(prev => ({ ...prev, [uid]: wasSaved }))
    toast.error("Failed to update shortlist")
  } finally {
    setSaveLoading(prev => ({ ...prev, [uid]: false }))
  }
}

  const handleMessage = async (athlete) => {
    const uid = getUserId(athlete)
    if (!uid) return toast.error("Could not find athlete ID")

    setMessagingId(uid)
    try {
      const { data } = await startConversation(uid)
      const convoId  = data.conversation._id
      navigate(`/recruitermessages?convo=${convoId}`)
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start conversation")
    } finally {
      setMessagingId(null)
    }
  }

  const hasFilters = sport !== "All" || region !== "All Regions" || year !== "All Years"
  const clearAll   = () => { setSport("All"); setRegion("All Regions"); setYear("All Years"); setQuery("") }

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ background: tk.page, fontFamily: "'DM Sans','Segoe UI',sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800;900&family=Bebas+Neue&display=swap');`}</style>

      <RecruiterNavbar dark={dark} toggleDark={() => setDark(!dark)} />

      <div className="max-w-6xl mx-auto flex lg:gap-6 lg:px-4">
        <RecruiterSideNav dark={dark} />

        <main
          className="flex-1 min-w-0 pb-28 lg:pb-12"
          style={{ borderLeft: `1px solid ${tk.border}`, borderRight: `1px solid ${tk.border}` }}
        >
          <div className="px-4 pt-6 pb-4">

            {/* Header */}
            <div className="flex items-end justify-between mb-6">
              <div>
                <h1
                  className="font-black text-2xl sm:text-3xl"
                  style={{ fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "0.05em", color: tk.text }}
                >
                  BROWSE ATHLETES
                </h1>
                <p className="text-sm mt-0.5" style={{ color: tk.textMuted }}>
                  <span className="font-bold" style={{ color: ACCENT }}>
                    {fetching ? "..." : athletes.length}
                  </span> athletes found
                </p>
              </div>
            </div>

            {/* Search */}
            <div
              className="flex items-center gap-2 rounded-2xl px-3 py-2.5 mb-4"
              style={{ background: tk.surface, border: `1px solid ${tk.border}` }}
            >
              <Search className="w-4 h-4 flex-shrink-0" style={{ color: tk.textMuted }} />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by name or position..."
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: tk.text }}
              />
              {query && (
                <button onClick={() => setQuery("")} style={{ color: tk.textMuted }}>
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sport pills + dropdowns */}
            <div className="flex flex-col gap-3 mb-4">
              <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {SPORTS.map(s => (
                  <FilterPill key={s} label={s} active={sport === s} onClick={() => setSport(s)} dark={dark} />
                ))}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Dropdown value={region} options={REGIONS} onChange={setRegion} dark={dark} />
                <Dropdown value={year}   options={YEARS}   onChange={setYear}   dark={dark} />
                <div className="ml-auto">
                  <Dropdown value={sort} options={SORT_BY} onChange={setSort} dark={dark} />
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {hasFilters && (
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {[
                  sport  !== "All"         && sport,
                  region !== "All Regions" && region,
                  year   !== "All Years"   && `Class ${year}`,
                ].filter(Boolean).map(label => (
                  <span
                    key={label}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border"
                    style={{ background: `${ACCENT}12`, borderColor: `${ACCENT}40`, color: ACCENT }}
                  >
                    {label}
                    <button onClick={clearAll}><X className="w-3 h-3" /></button>
                  </span>
                ))}
                <button onClick={clearAll} className="text-xs font-semibold" style={{ color: tk.textMuted }}>
                  Clear all
                </button>
              </div>
            )}

            {/* Grid */}
            {fetching ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} dark={dark} />)}
              </div>
            ) : athletes.length === 0 ? (
              <div
                className="rounded-2xl py-16 text-center"
                style={{ background: tk.surface, border: `1px solid ${tk.border}` }}
              >
                <Users className="w-10 h-10 mx-auto mb-3" style={{ color: tk.textMuted }} />
                <p className="font-bold text-sm mb-1" style={{ color: tk.text }}>No athletes found</p>
                <p className="text-xs mb-4" style={{ color: tk.textMuted }}>Try adjusting your search or filters</p>
                <button
                  onClick={clearAll}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white"
                  style={{ background: `linear-gradient(135deg,${ACCENT},${ACCENT2})` }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {athletes.map(a => {
                  const uid = getUserId(a)
                  return (
                    <AthleteCard
                      key={a._id || uid}
                      athlete={a}
                      dark={dark}
                      isSaved={!!savedMap[uid]}
                      onSave={handleSave}
                      onView={setProfileModal}
                      onMessage={handleMessage}
                    />
                  )
                })}
              </div>
            )}

          </div>
        </main>
      </div>

      <RecruiterBottomNav dark={dark} />

      {/* Profile modal */}
      {profileModal && (
        <AthleteProfileModal
          athlete={profileModal}
          dark={dark}
          onClose={() => setProfileModal(null)}
          isSaved={!!savedMap[getUserId(profileModal)]}
          onSave={handleSave}
          onMessage={handleMessage}
        />
      )}
    </div>
  )
}