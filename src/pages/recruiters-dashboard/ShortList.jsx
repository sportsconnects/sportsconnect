// src/pages/RecruiterShortList.jsx
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"
import RecruiterNavbar    from "../../components/RecruiterNavbar"
import RecruiterBottomNav from "../../components/RecruiterBottomNav"
import {
  FilterPill, SportBadge, RAvatar, RecruiterSideNav,
  ACCENT, ACCENT2, THEME
} from "../../components/RecruiterUi"
import {
  Bookmark, Trash2, Eye, MessageCircle, MapPin,
  GraduationCap, Trophy, Plus, Search, X,
  Users, FolderOpen, Star, Check, Play
} from "lucide-react"
import {
  getShortlist, removeFromShortlist, updateShortlistItem,
  startConversation, isLoggedIn
} from "../../api/client"


// ATHLETE PROFILE MODAL
function AthleteProfileModal({ athlete, dark, onClose, onMessage }) {
  const tk = dark ? THEME.dark : THEME.light
  const [playing, setPlaying] = useState(false)

  const name     = athlete.name     || "Athlete"
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

        <div className="p-4">
          {/* Name + message */}
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
            <button
              onClick={() => { onMessage(athlete); onClose() }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white flex-shrink-0 hover:opacity-90 transition-opacity"
              style={{ background: `linear-gradient(135deg,${ACCENT},${ACCENT2})` }}
            >
              <MessageCircle className="w-3.5 h-3.5" /> Message
            </button>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-3 gap-2 mb-4 p-3 rounded-2xl"
            style={{ background: dark ? "#1C2128" : "#F8FAFC" }}
          >
            {[
              [height, "Height"],
              [gpa,    "GPA"   ],
              [classOf, "Class"],
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
              [GraduationCap, school, "School"],
              [MapPin,        region, "Region"],
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


// SHORTLIST CARD
function ShortlistCard({ item, dark, onRemove, onTogglePriority, onNoteUpdate, onView, onMessage }) {
  const tk = dark ? THEME.dark : THEME.light

  const [note, setNote]         = useState(item.note || "")
  const [editNote, setEditNote] = useState(false)
  const [priority, setPriority] = useState(item.priority || false)
  const [saving, setSaving]     = useState(false)

  const athlete = item.athlete
  const name    = `${athlete.firstName} ${athlete.lastName}`
  const athleteId = athlete.id || athlete._id

  const handleSaveNote = async () => {
    setSaving(true)
    try {
      await updateShortlistItem(athleteId, { note })
      onNoteUpdate(athleteId, note)
      setEditNote(false)
      toast.success("Note saved")
    } catch {
      toast.error("Failed to save note")
    } finally {
      setSaving(false)
    }
  }

  const handlePriority = async () => {
    const newPriority = !priority
    setPriority(newPriority)
    try {
      await updateShortlistItem(athleteId, { priority: newPriority })
      onTogglePriority(athleteId, newPriority)
    } catch {
      setPriority(!newPriority) 
      toast.error("Failed to update priority")
    }
  }

  // Build athlete object for modal
  const athleteForModal = {
    name,
    sport:        athlete.sport     || "—",
    position:     athlete.position  || "—",
    region:       athlete.region    || "—",
    classOf:      athlete.classOf   || "—",
    gpa:          athlete.gpa       || "—",
    height:       athlete.height    || "—",
    verified:     athlete.verified  || false,
    achievements: athlete.achievements || [],
    highlights:   athlete.highlights   || [],
    bio:          athlete.bio          || null,
  }

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all"
      style={{
        background: tk.surface,
        border:     `1px solid ${priority ? `${ACCENT}35` : tk.border}`,
        boxShadow:  priority && dark ? `0 0 20px ${ACCENT}08` : "none",
      }}
    >
      {priority && (
        <div className="h-0.5" style={{ background: `linear-gradient(90deg,${ACCENT},${ACCENT2})` }} />
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <RAvatar name={name} size={44} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="font-bold text-sm" style={{ color: tk.text }}>{name}</p>
              {athlete.verified && <span style={{ color: "#1DA8FF", fontSize: 11 }}>✦</span>}
              {priority && (
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                  style={{ background: `${ACCENT}15`, color: ACCENT }}
                >⭐ Priority</span>
              )}
            </div>
            <p className="text-xs" style={{ color: tk.textMuted }}>{athlete.position || "—"}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <SportBadge sport={athlete.sport} />
              <span className="text-xs flex items-center gap-1" style={{ color: tk.textMuted }}>
                <MapPin className="w-3 h-3" />{athlete.region || "—"}
              </span>
              <span className="text-xs" style={{ color: tk.textMuted }}>
                Class {athlete.classOf || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-3 gap-2 py-2.5 mb-3"
          style={{ borderTop: `1px solid ${tk.border}`, borderBottom: `1px solid ${tk.border}` }}
        >
          {[
            ["Height", athlete.height  || "—"],
            ["GPA",    athlete.gpa     || "—"],
            ["Class",  athlete.classOf || "—"],
          ].map(([label, val]) => (
            <div key={label} className="text-center">
              <p className="font-black text-sm" style={{ color: tk.text }}>{val}</p>
              <p className="text-xs"             style={{ color: tk.textMuted }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Achievement */}
        {athlete.achievements?.[0] && (
          <div className="flex items-center gap-1.5 mb-3">
            <Trophy className="w-3 h-3 flex-shrink-0" style={{ color: ACCENT }} />
            <p className="text-xs truncate" style={{ color: tk.textSub }}>
              {athlete.achievements[0]?.title || athlete.achievements[0]}
            </p>
          </div>
        )}

        {/* Scout note */}
        <div
          className="mb-3 rounded-xl p-3"
          style={{ background: dark ? "rgba(255,255,255,0.03)" : "#F8FAFC", border: `1px solid ${tk.border}` }}
        >
          <p className="text-xs font-semibold mb-1.5" style={{ color: tk.textMuted }}>Scout Note</p>
          {editNote ? (
            <div className="flex items-end gap-2">
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={2}
                autoFocus
                className="flex-1 bg-transparent text-xs outline-none resize-none leading-relaxed"
                style={{ color: tk.text }}
              />
              <button onClick={handleSaveNote} disabled={saving}>
                <Check className="w-4 h-4" style={{ color: saving ? tk.textMuted : ACCENT }} />
              </button>
            </div>
          ) : (
            <p
              className="text-xs leading-relaxed cursor-pointer"
              style={{ color: note ? tk.textSub : tk.textMuted, fontStyle: note ? "normal" : "italic" }}
              onClick={() => setEditNote(true)}
            >
              {note || "Tap to add a note..."}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onView(athleteForModal)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-white hover:opacity-90 transition-opacity"
            style={{ background: `linear-gradient(135deg,${ACCENT},${ACCENT2})` }}
          >
            <Eye className="w-3.5 h-3.5" /> View
          </button>
          <button
            onClick={() => onMessage(athleteForModal, athleteId)}
            className="flex items-center justify-center w-9 h-9 rounded-xl border transition-all"
            style={{ borderColor: tk.border, color: tk.textMuted }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.color = ACCENT }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = tk.border; e.currentTarget.style.color = tk.textMuted }}
          >
            <MessageCircle className="w-4 h-4" />
          </button>
          <button
            onClick={handlePriority}
            className="flex items-center justify-center w-9 h-9 rounded-xl border transition-all"
            style={{
              borderColor: priority ? ACCENT        : tk.border,
              color:       priority ? ACCENT        : tk.textMuted,
              background:  priority ? `${ACCENT}10` : "transparent",
            }}
          >
            <Star className={`w-4 h-4 ${priority ? "fill-amber-400" : ""}`} />
          </button>
          <button
            onClick={() => onRemove(athleteId)}
            className="flex items-center justify-center w-9 h-9 rounded-xl border transition-all"
            style={{ borderColor: tk.border, color: tk.textMuted }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#EF4444"; e.currentTarget.style.color = "#EF4444" }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = tk.border; e.currentTarget.style.color = tk.textMuted }}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}


// SKELETON
function SkeletonCard({ dark }) {
  const tk = dark ? THEME.dark : THEME.light
  return (
    <div className="rounded-2xl p-4 animate-pulse"
      style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-11 h-11 rounded-full flex-shrink-0" style={{ background: tk.border }} />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 rounded-full w-28" style={{ background: tk.border }} />
          <div className="h-2.5 rounded-full w-20" style={{ background: tk.border }} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[0,1,2].map(i => <div key={i} className="h-10 rounded-xl" style={{ background: tk.border }} />)}
      </div>
      <div className="h-16 rounded-xl mb-3" style={{ background: tk.border }} />
      <div className="h-9 rounded-xl"       style={{ background: tk.border }} />
    </div>
  )
}


// MAIN PAGE
export default function RecruiterShortList() {
  const navigate = useNavigate()
  const [dark, setDark]         = useState(false)
  const [items, setItems]       = useState([])   
  const [loading, setLoading]   = useState(true)
  const [activeList, setList]   = useState("all")
  const [query, setQuery]       = useState("")
  const [profileModal, setProfileModal] = useState(null)
  const [messagingId, setMessagingId]   = useState(null)
  const tk = dark ? THEME.dark : THEME.light

  useEffect(() => {
    if (!isLoggedIn()) { navigate("/signin"); return }
    fetchShortlist()
  }, [])

  const fetchShortlist = async () => {
    setLoading(true)
    try {
      const { data } = await getShortlist()
      setItems(data.shortlist || [])
    } catch {
      toast.error("Failed to load shortlist")
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (athleteId) => {
    // Optimistic
    setItems(prev => prev.filter(i => (i.athlete?.id || i.athlete?._id) !== athleteId))
    try {
      await removeFromShortlist(athleteId)
      toast.success("Removed from shortlist")
    } catch {
      toast.error("Failed to remove — please refresh")
      fetchShortlist() 
    }
  }

  const handleTogglePriority = (athleteId, newPriority) => {
    setItems(prev => prev.map(i =>
      (i.athlete?.id || i.athlete?._id) === athleteId
        ? { ...i, priority: newPriority }
        : i
    ))
  }

  const handleNoteUpdate = (athleteId, newNote) => {
    setItems(prev => prev.map(i =>
      (i.athlete?.id || i.athlete?._id) === athleteId
        ? { ...i, note: newNote }
        : i
    ))
  }

  const handleMessage = async (athlete, athleteId) => {
    if (!athleteId) return toast.error("Could not find athlete ID")
    setMessagingId(athleteId)
    try {
      const { data } = await startConversation(athleteId)
      navigate(`/recruitermessages?convo=${data.conversation._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start conversation")
    } finally {
      setMessagingId(null)
    }
  }

  // Dynamic list tabs based on real data
  const LISTS = [
    { id: "all",      label: "All Saved",      count: items.length },
    { id: "priority", label: "High Priority",  count: items.filter(i => i.priority).length },
    { id: "soccer",   label: "Soccer Targets", count: items.filter(i => i.athlete?.sport === "Soccer").length },
    { id: "2026",     label: "Class of 2026",  count: items.filter(i => i.athlete?.classOf === "2026").length },
  ]

  const filtered = items.filter(item => {
    const a = item.athlete
    const name = `${a?.firstName || ""} ${a?.lastName || ""}`.toLowerCase()
    const matchQuery = !query || name.includes(query.toLowerCase())
    const matchList  =
      activeList === "all"      ? true :
      activeList === "priority" ? item.priority :
      activeList === "soccer"   ? a?.sport === "Soccer" :
      activeList === "2026"     ? a?.classOf === "2026" :
      true
    return matchQuery && matchList
  })

  const priorityCount = items.filter(i => i.priority).length

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
            <div className="flex items-start justify-between gap-3 mb-6">
              <div>
                <h1
                  className="font-black text-2xl sm:text-3xl"
                  style={{ fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "0.05em", color: tk.text }}
                >
                  MY SHORTLIST
                </h1>
                <p className="text-sm mt-0.5" style={{ color: tk.textMuted }}>
                  <span className="font-bold" style={{ color: ACCENT }}>{items.length}</span> saved ·{" "}
                  <span className="font-bold" style={{ color: ACCENT }}>{priorityCount}</span> priority
                </p>
              </div>
              <Link
                to="/recruiterathletes"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white flex-shrink-0"
                style={{ background: `linear-gradient(135deg,${ACCENT},${ACCENT2})` }}
              >
                <Plus className="w-3.5 h-3.5" /> Add Athletes
              </Link>
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
                placeholder="Search your shortlist..."
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: tk.text }}
              />
              {query && (
                <button onClick={() => setQuery("")} style={{ color: tk.textMuted }}>
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* List tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {LISTS.map(l => {
                const active = activeList === l.id
                return (
                  <button
                    key={l.id}
                    onClick={() => setList(l.id)}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all"
                    style={{
                      background:  active ? `${ACCENT}15` : "transparent",
                      borderColor: active ? ACCENT         : tk.border,
                      color:       active ? ACCENT         : tk.textMuted,
                    }}
                  >
                    {active && <Check className="w-3 h-3" />}
                    {l.label}
                    <span
                      className="px-1.5 py-0.5 rounded-full text-xs"
                      style={{ background: active ? "rgba(255,255,255,0.15)" : tk.hover, color: active ? "#fff" : tk.textMuted }}
                    >
                      {l.count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Cards */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1,2,3].map(i => <SkeletonCard key={i} dark={dark} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div
                className="rounded-2xl py-16 text-center"
                style={{ background: tk.surface, border: `1px solid ${tk.border}` }}
              >
                <FolderOpen className="w-10 h-10 mx-auto mb-3" style={{ color: tk.textMuted }} />
                <p className="font-bold text-sm mb-1" style={{ color: tk.text }}>
                  {query ? "No athletes match your search" : "This list is empty"}
                </p>
                <p className="text-xs mb-4" style={{ color: tk.textMuted }}>
                  {query ? "Try a different name" : "Browse athletes and save them to your shortlist"}
                </p>
                <Link
                  to="/recruiterathletes"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white"
                  style={{ background: `linear-gradient(135deg,${ACCENT},${ACCENT2})` }}
                >
                  <Plus className="w-3.5 h-3.5" /> Browse Athletes
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(item => (
                  <ShortlistCard
                    key={item._id}
                    item={item}
                    dark={dark}
                    onRemove={handleRemove}
                    onTogglePriority={handleTogglePriority}
                    onNoteUpdate={handleNoteUpdate}
                    onView={setProfileModal}
                    onMessage={handleMessage}
                  />
                ))}
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
          onMessage={handleMessage}
        />
      )}
    </div>
  )
}