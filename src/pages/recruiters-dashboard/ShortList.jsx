// src/pages/RecruiterShortList.jsx

import { useState } from "react"
import { Link } from "react-router"
import RecruiterNavbar    from "../../components/RecruiterNavbar"
import RecruiterBottomNav from "../../components/RecruiterBottomNav"
import {
  FilterPill, SportBadge, RAvatar, RecruiterSideNav,
  ACCENT, ACCENT2, THEME
} from "../../components/RecruiterUi"
import {
  Bookmark, Trash2, Eye, MessageCircle, MapPin,
  GraduationCap, Trophy, Plus, Search, X,
  Users, FolderOpen, ChevronRight, Star, Check
} from "lucide-react"

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const LISTS = [
  { id:"all",      label:"All Saved",     count:6 },
  { id:"soccer",   label:"Soccer Targets", count:3 },
  { id:"priority", label:"High Priority",  count:2 },
  { id:"2026",     label:"Class of 2026",  count:4 },
]

const SHORTLISTED = [
  { id:1,  name:"Kofi Mensah",     sport:"Soccer",        position:"Striker",     region:"Greater Accra", classOf:"2026", gpa:"3.5", height:"5'9\"",  verified:true,  priority:true,  achievement:"Top Scorer InterSchools",   note:"Strong striker, excellent positioning" },
  { id:3,  name:"Kwame Boateng",   sport:"Basketball",    position:"Point Guard", region:"Ashanti",       classOf:"2026", gpa:"3.7", height:"6'1\"",  verified:true,  priority:true,  achievement:"MVP InterSchools",           note:"Court vision is exceptional"          },
  { id:6,  name:"James Junior",    sport:"Soccer",        position:"Center Back", region:"Eastern",       classOf:"2026", gpa:"3.8", height:"5'7\"",  verified:true,  priority:false, achievement:"Best Defender InterSchools", note:"Offered full scholarship"             },
  { id:2,  name:"Ama Asante",      sport:"Track & Field", position:"Sprinter",   region:"Central",       classOf:"2025", gpa:"3.9", height:"5'5\"",  verified:false, priority:false, achievement:"100m Regional Champion",     note:""                                     },
  { id:7,  name:"Serwaa Boadu",    sport:"Track & Field", position:"400m Runner", region:"Central",      classOf:"2025", gpa:"3.8", height:"5'6\"",  verified:true,  priority:false, achievement:"National Schools Bronze",    note:"Follow up after regionals"            },
  { id:12, name:"Fiifi Annan",     sport:"Soccer",        position:"Midfielder",  region:"Greater Accra", classOf:"2026", gpa:"3.6", height:"5'10\"", verified:true,  priority:false, achievement:"Best Midfielder Award",      note:""                                     },
]

const fmt = n => n >= 1000 ? (n/1000).toFixed(1)+"k" : n

// ─────────────────────────────────────────────────────────────────────────────
// ATHLETE SHORTLIST CARD
// ─────────────────────────────────────────────────────────────────────────────
function ShortlistCard({ athlete, dark, onRemove, onTogglePriority }) {
  const [note, setNote]         = useState(athlete.note)
  const [editNote, setEditNote] = useState(false)
  const [priority, setPriority] = useState(athlete.priority)
  const tk = dark ? THEME.dark : THEME.light

  return (
    <div className="rounded-2xl overflow-hidden transition-all"
      style={{
        background: tk.surface,
        border:     `1px solid ${priority ? `${ACCENT}35` : tk.border}`,
        boxShadow:  priority && dark ? `0 0 20px ${ACCENT}08` : "none",
      }}>

      {/* Priority stripe */}
      {priority && (
        <div className="h-0.5"
          style={{ background:`linear-gradient(90deg,${ACCENT},${ACCENT2})` }} />
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <RAvatar name={athlete.name} size={44} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="font-bold text-sm" style={{ color:tk.text }}>{athlete.name}</p>
              {athlete.verified && <span style={{ color:"#1DA8FF", fontSize:11 }}>✦</span>}
              {priority && (
                <span className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                  style={{ background:`${ACCENT}15`, color:ACCENT }}>⭐ Priority</span>
              )}
            </div>
            <p className="text-xs" style={{ color:tk.textMuted }}>{athlete.position}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <SportBadge sport={athlete.sport} />
              <span className="text-xs flex items-center gap-1" style={{ color:tk.textMuted }}>
                <MapPin className="w-3 h-3" />{athlete.region}
              </span>
              <span className="text-xs" style={{ color:tk.textMuted }}>Class {athlete.classOf}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 py-2.5 mb-3"
          style={{ borderTop:`1px solid ${tk.border}`, borderBottom:`1px solid ${tk.border}` }}>
          {[["Height",athlete.height],["GPA",athlete.gpa],["Class",athlete.classOf]].map(([label,val]) => (
            <div key={label} className="text-center">
              <p className="font-black text-sm" style={{ color:tk.text }}>{val}</p>
              <p className="text-xs" style={{ color:tk.textMuted }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Achievement */}
        <div className="flex items-center gap-1.5 mb-3">
          <Trophy className="w-3 h-3 flex-shrink-0" style={{ color:ACCENT }} />
          <p className="text-xs truncate" style={{ color:tk.textSub }}>{athlete.achievement}</p>
        </div>

        {/* Scout note */}
        <div className="mb-3 rounded-xl p-3"
          style={{ background: dark?"rgba(255,255,255,0.03)":tk.surfaceHigh||"#F8FAFC", border:`1px solid ${tk.border}` }}>
          <p className="text-xs font-semibold mb-1.5" style={{ color:tk.textMuted }}>Scout Note</p>
          {editNote ? (
            <div className="flex items-end gap-2">
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={2}
                autoFocus
                className="flex-1 bg-transparent text-xs outline-none resize-none leading-relaxed"
                style={{ color:tk.text }}
              />
              <button onClick={() => setEditNote(false)}>
                <Check className="w-4 h-4" style={{ color:ACCENT }} />
              </button>
            </div>
          ) : (
            <p className="text-xs leading-relaxed cursor-pointer"
              style={{ color: note ? tk.textSub : tk.textMuted, fontStyle: note?"normal":"italic" }}
              onClick={() => setEditNote(true)}>
              {note || "Tap to add a note..."}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link to={`/recruiterathletes/${athlete.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-white hover:opacity-90 transition-opacity"
            style={{ background:`linear-gradient(135deg,${ACCENT},${ACCENT2})` }}>
            <Eye className="w-3.5 h-3.5" /> View
          </Link>
          <button
            className="flex items-center justify-center w-9 h-9 rounded-xl border transition-all"
            style={{ borderColor:tk.border, color:tk.textMuted }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=ACCENT; e.currentTarget.style.color=ACCENT }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=tk.border; e.currentTarget.style.color=tk.textMuted }}>
            <MessageCircle className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setPriority(!priority); onTogglePriority(athlete.id) }}
            className="flex items-center justify-center w-9 h-9 rounded-xl border transition-all"
            style={{
              borderColor: priority ? ACCENT         : tk.border,
              color:       priority ? ACCENT         : tk.textMuted,
              background:  priority ? `${ACCENT}10`  : "transparent",
            }}>
            <Star className={`w-4 h-4 ${priority?"fill-amber-400":""}`} />
          </button>
          <button
            onClick={() => onRemove(athlete.id)}
            className="flex items-center justify-center w-9 h-9 rounded-xl border transition-all"
            style={{ borderColor:tk.border, color:tk.textMuted }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="#EF4444"; e.currentTarget.style.color="#EF4444" }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=tk.border; e.currentTarget.style.color=tk.textMuted }}>
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function RecruiterShortList() {
  const [dark, setDark]         = useState(false)
  const [athletes, setAthletes] = useState(SHORTLISTED)
  const [activeList, setList]   = useState("all")
  const [query, setQuery]       = useState("")
  const tk = dark ? THEME.dark : THEME.light

  const handleRemove         = id => setAthletes(prev => prev.filter(a => a.id !== id))
  const handleTogglePriority = id => setAthletes(prev =>
    prev.map(a => a.id === id ? { ...a, priority:!a.priority } : a)
  )

  const filtered = athletes.filter(a => {
    const matchQuery = !query || a.name.toLowerCase().includes(query.toLowerCase())
    const matchList  =
      activeList === "all"      ? true :
      activeList === "soccer"   ? a.sport === "Soccer" :
      activeList === "priority" ? a.priority :
      activeList === "2026"     ? a.classOf === "2026" :
      true
    return matchQuery && matchList
  })

  const priorityCount = athletes.filter(a => a.priority).length

  return (
    <div className="min-h-screen transition-colors duration-300"
      style={{ background:tk.page, fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800;900&family=Bebas+Neue&display=swap');`}</style>

      <RecruiterNavbar dark={dark} toggleDark={() => setDark(!dark)} />

      <div className="max-w-6xl mx-auto flex lg:gap-6 lg:px-4">
        <RecruiterSideNav dark={dark} />

        <main className="flex-1 min-w-0 pb-28 lg:pb-12"
          style={{ borderLeft:`1px solid ${tk.border}`, borderRight:`1px solid ${tk.border}` }}>
          <div className="px-4 pt-6 pb-4">

            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-6">
              <div>
                <h1 className="font-black text-2xl sm:text-3xl"
                  style={{ fontFamily:"'Bebas Neue',sans-serif", letterSpacing:"0.05em", color:tk.text }}>
                  MY SHORTLIST
                </h1>
                <p className="text-sm mt-0.5" style={{ color:tk.textMuted }}>
                  <span className="font-bold" style={{ color:ACCENT }}>{athletes.length}</span> saved ·{" "}
                  <span className="font-bold" style={{ color:ACCENT }}>{priorityCount}</span> priority
                </p>
              </div>
              <Link to="/recruiterathletes"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white flex-shrink-0"
                style={{ background:`linear-gradient(135deg,${ACCENT},${ACCENT2})` }}>
                <Plus className="w-3.5 h-3.5" /> Add Athletes
              </Link>
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 rounded-2xl px-3 py-2.5 mb-4"
              style={{ background:tk.surface, border:`1px solid ${tk.border}` }}>
              <Search className="w-4 h-4 flex-shrink-0" style={{ color:tk.textMuted }} />
              <input value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search your shortlist..."
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color:tk.text }} />
              {query && (
                <button onClick={() => setQuery("")} style={{ color:tk.textMuted }}>
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* List tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1" style={{ scrollbarWidth:"none" }}>
              {LISTS.map(l => {
                const active = activeList === l.id
                return (
                  <button key={l.id} onClick={() => setList(l.id)}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all"
                    style={{
                      background:  active ? `${ACCENT}15` : "transparent",
                      borderColor: active ? ACCENT         : tk.border,
                      color:       active ? ACCENT         : tk.textMuted,
                    }}>
                    {active && <Check className="w-3 h-3" />}
                    {l.label}
                    <span className="px-1.5 py-0.5 rounded-full text-xs"
                      style={{ background:active?"rgba(255,255,255,0.15)":tk.hover, color:active?"#fff":tk.textMuted }}>
                      {l.id === "all" ? athletes.length
                        : l.id === "priority" ? athletes.filter(a=>a.priority).length
                        : l.id === "soccer"   ? athletes.filter(a=>a.sport==="Soccer").length
                        : athletes.filter(a=>a.classOf==="2026").length}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Cards grid or empty */}
            {filtered.length === 0 ? (
              <div className="rounded-2xl py-16 text-center"
                style={{ background:tk.surface, border:`1px solid ${tk.border}` }}>
                <FolderOpen className="w-10 h-10 mx-auto mb-3" style={{ color:tk.textMuted }} />
                <p className="font-bold text-sm mb-1" style={{ color:tk.text }}>
                  {query ? "No athletes match your search" : "This list is empty"}
                </p>
                <p className="text-xs mb-4" style={{ color:tk.textMuted }}>
                  {query ? "Try a different name" : "Browse athletes and save them to your shortlist"}
                </p>
                <Link to="/recruiter/athletes"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white"
                  style={{ background:`linear-gradient(135deg,${ACCENT},${ACCENT2})` }}>
                  <Plus className="w-3.5 h-3.5" /> Browse Athletes
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(a => (
                  <ShortlistCard
                    key={a.id}
                    athlete={a}
                    dark={dark}
                    onRemove={handleRemove}
                    onTogglePriority={handleTogglePriority}
                  />
                ))}
              </div>
            )}

          </div>
        </main>
      </div>

      <RecruiterBottomNav dark={dark} />
    </div>
  )
}