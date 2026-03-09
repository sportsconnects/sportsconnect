// src/pages/RecruiterAthletes.jsx

import { useState } from "react"
import { Link } from "react-router"
import RecruiterNavbar    from "../../components/RecruiterNavbar"
import RecruiterBottomNav from "../../components/RecruiterBottomNav"
import {
  FilterPill, SportBadge, RAvatar, RecruiterSideNav,
  ACCENT, ACCENT2, THEME
} from "../../components/RecruiterUi"
import {
  Search, X, Bookmark, Eye, MapPin, GraduationCap,
  Trophy, Users, ChevronDown, Check, MessageCircle
} from "lucide-react"

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const ALL_ATHLETES = [
  { id:1,  name:"Kofi Mensah",     sport:"Soccer",        position:"Striker",        region:"Greater Accra", classOf:"2026", gpa:"3.5", height:"5'9\"",  verified:true,  followers:1204, achievement:"Top Scorer InterSchools"   },
  { id:2,  name:"Ama Asante",      sport:"Track & Field", position:"Sprinter",       region:"Central",       classOf:"2025", gpa:"3.9", height:"5'5\"",  verified:false, followers:892,  achievement:"100m Regional Champion"    },
  { id:3,  name:"Kwame Boateng",   sport:"Basketball",    position:"Point Guard",    region:"Ashanti",       classOf:"2026", gpa:"3.7", height:"6'1\"",  verified:true,  followers:2100, achievement:"MVP InterSchools"           },
  { id:4,  name:"Efua Darko",      sport:"Swimming",      position:"Freestyle",      region:"Greater Accra", classOf:"2025", gpa:"4.0", height:"5'7\"",  verified:false, followers:567,  achievement:"School Record Holder"       },
  { id:5,  name:"Abena Osei",      sport:"Volleyball",    position:"Setter",         region:"Greater Accra", classOf:"2026", gpa:"3.6", height:"5'8\"",  verified:false, followers:431,  achievement:"Best Setter Award"          },
  { id:6,  name:"James Junior",    sport:"Soccer",        position:"Center Back",    region:"Eastern",       classOf:"2026", gpa:"3.8", height:"5'7\"",  verified:true,  followers:312,  achievement:"Best Defender InterSchools" },
  { id:7,  name:"Serwaa Boadu",    sport:"Track & Field", position:"400m Runner",    region:"Central",       classOf:"2025", gpa:"3.8", height:"5'6\"",  verified:true,  followers:678,  achievement:"National Schools Bronze"    },
  { id:8,  name:"Nana Acheampong", sport:"Soccer",        position:"Goalkeeper",     region:"Eastern",       classOf:"2026", gpa:"3.3", height:"6'2\"",  verified:false, followers:289,  achievement:"Best GK InterSchools"       },
  { id:9,  name:"Adwoa Frimpong",  sport:"Basketball",    position:"Shooting Guard", region:"Central",       classOf:"2027", gpa:"3.9", height:"5'7\"",  verified:false, followers:512,  achievement:"Rising Star Award"          },
  { id:10, name:"Kojo Asare",      sport:"Track & Field", position:"Long Jump",      region:"Ashanti",       classOf:"2026", gpa:"3.2", height:"5'11\"", verified:false, followers:198,  achievement:"Ashanti Schools Gold"       },
  { id:11, name:"Yaw Darko",       sport:"Swimming",      position:"Backstroke",     region:"Ashanti",       classOf:"2025", gpa:"3.4", height:"6'0\"",  verified:false, followers:334,  achievement:"Ashanti Regional Champ"     },
  { id:12, name:"Fiifi Annan",     sport:"Soccer",        position:"Midfielder",     region:"Greater Accra", classOf:"2026", gpa:"3.6", height:"5'10\"", verified:true,  followers:723,  achievement:"Best Midfielder Award"      },
]

const SPORTS  = ["All","Soccer","Basketball","Track & Field","Swimming","Volleyball"]
const REGIONS = ["All Regions","Greater Accra","Ashanti","Central","Eastern","Western"]
const YEARS   = ["All Years","2025","2026","2027"]
const SORT_BY = ["Most Followers","GPA High–Low","Class Year"]

const fmt = n => n >= 1000 ? (n/1000).toFixed(1)+"k" : n

// ─────────────────────────────────────────────────────────────────────────────
// SMALL DROPDOWN
// ─────────────────────────────────────────────────────────────────────────────
function Dropdown({ value, options, onChange, dark }) {
  const [open, setOpen] = useState(false)
  const tk = dark ? THEME.dark : THEME.light
  const active = value !== options[0]

  return (
    <div className="relative flex-shrink-0">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all"
        style={{
          background:  active ? `${ACCENT}12` : tk.surface,
          borderColor: active ? ACCENT         : tk.border,
          color:       active ? ACCENT         : tk.textSub,
        }}>
        {value}
        <ChevronDown className="w-3 h-3 transition-transform"
          style={{ transform:open?"rotate(180deg)":"none" }} />
      </button>
      {open && (
        <div className="absolute top-10 left-0 z-30 rounded-2xl overflow-hidden min-w-[150px] shadow-xl"
          style={{ background:tk.surface, border:`1px solid ${tk.border}` }}>
          {options.map(opt => (
            <button key={opt} onClick={() => { onChange(opt); setOpen(false) }}
              className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold"
              style={{ color:opt===value?ACCENT:tk.textSub }}
              onMouseEnter={e => e.currentTarget.style.background = tk.hover}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              {opt}
              {opt===value && <Check className="w-3 h-3" style={{ color:ACCENT }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ATHLETE CARD
// ─────────────────────────────────────────────────────────────────────────────
function AthleteCard({ athlete, dark, isSaved, onSave }) {
  const [saved, setSaved] = useState(isSaved)
  const tk = dark ? THEME.dark : THEME.light

  return (
    <div className="rounded-2xl overflow-hidden transition-all"
      style={{ background:tk.surface, border:`1px solid ${athlete.verified ? `${ACCENT}30` : tk.border}` }}>

      {/* Amber top stripe for verified athletes */}
      {athlete.verified && (
        <div className="h-0.5"
          style={{ background:`linear-gradient(90deg,${ACCENT},${ACCENT2})` }} />
      )}

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <RAvatar name={athlete.name} size={44} />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-bold text-sm truncate" style={{ color:tk.text }}>{athlete.name}</p>
                {athlete.verified && <span style={{ color:"#1DA8FF", fontSize:11 }}>✦</span>}
              </div>
              <p className="text-xs" style={{ color:tk.textMuted }}>{athlete.position}</p>
              <div className="mt-1"><SportBadge sport={athlete.sport} /></div>
            </div>
          </div>
          <button
            onClick={() => { setSaved(!saved); onSave(athlete.id) }}
            className="w-8 h-8 rounded-xl flex items-center justify-center border transition-all flex-shrink-0"
            style={{
              background:  saved ? `${ACCENT}15` : "transparent",
              borderColor: saved ? ACCENT         : tk.border,
              color:       saved ? ACCENT         : tk.textMuted,
            }}>
            <Bookmark className={`w-3.5 h-3.5 ${saved?"fill-amber-400":""}`} />
          </button>
        </div>

        {/* Location + year */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
          <span className="text-xs flex items-center gap-1" style={{ color:tk.textMuted }}>
            <MapPin className="w-3 h-3" />{athlete.region}
          </span>
          <span className="text-xs flex items-center gap-1" style={{ color:tk.textMuted }}>
            <GraduationCap className="w-3 h-3" />Class of {athlete.classOf}
          </span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 py-2.5 mb-3"
          style={{ borderTop:`1px solid ${tk.border}`, borderBottom:`1px solid ${tk.border}` }}>
          {[
            [athlete.height,         "Height"],
            [athlete.gpa,            "GPA"],
            [fmt(athlete.followers), "Followers"],
          ].map(([val, label]) => (
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

        {/* Actions */}
        <div className="flex gap-2">
          <Link to={`/recruiter/athlete/${athlete.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-white hover:opacity-90 transition-opacity"
            style={{ background:`linear-gradient(135deg,${ACCENT},${ACCENT2})` }}>
            <Eye className="w-3.5 h-3.5" /> View Profile
          </Link>
          <button
            className="w-9 h-9 flex items-center justify-center rounded-xl border transition-all"
            style={{ borderColor:tk.border, color:tk.textMuted }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=ACCENT; e.currentTarget.style.color=ACCENT }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=tk.border; e.currentTarget.style.color=tk.textMuted }}>
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function RecruiterAthletes() {
  const [dark, setDark]     = useState(false)
  const [query, setQuery]   = useState("")
  const [sport, setSport]   = useState("All")
  const [region, setRegion] = useState("All Regions")
  const [year, setYear]     = useState("All Years")
  const [sort, setSort]     = useState("Most Followers")
  const [savedMap, setSaved]= useState({})
  const tk = dark ? THEME.dark : THEME.light

  const filtered = ALL_ATHLETES
    .filter(a => {
      const q = query.toLowerCase()
      return (
        (!query  || a.name.toLowerCase().includes(q) || a.position.toLowerCase().includes(q)) &&
        (sport  === "All"         || a.sport   === sport)  &&
        (region === "All Regions" || a.region  === region) &&
        (year   === "All Years"   || a.classOf === year)
      )
    })
    .sort((a, b) =>
      sort === "GPA High–Low" ? parseFloat(b.gpa) - parseFloat(a.gpa) :
      sort === "Class Year"   ? a.classOf.localeCompare(b.classOf)     :
      b.followers - a.followers
    )

  const hasFilters = sport !== "All" || region !== "All Regions" || year !== "All Years"
  const clearAll   = () => { setSport("All"); setRegion("All Regions"); setYear("All Years"); setQuery("") }

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
            <div className="flex items-end justify-between mb-6">
              <div>
                <h1 className="font-black text-2xl sm:text-3xl"
                  style={{ fontFamily:"'Bebas Neue',sans-serif", letterSpacing:"0.05em", color:tk.text }}>
                  BROWSE ATHLETES
                </h1>
                <p className="text-sm mt-0.5" style={{ color:tk.textMuted }}>
                  <span className="font-bold" style={{ color:ACCENT }}>{filtered.length}</span> athletes found
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 rounded-2xl px-3 py-2.5 mb-4"
              style={{ background:tk.surface, border:`1px solid ${tk.border}` }}>
              <Search className="w-4 h-4 flex-shrink-0" style={{ color:tk.textMuted }} />
              <input value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search by name or position..."
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color:tk.text }} />
              {query && (
                <button onClick={() => setQuery("")} style={{ color:tk.textMuted }}>
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sport pills + dropdowns */}
            <div className="flex flex-col gap-3 mb-4">
              <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth:"none" }}>
                {SPORTS.map(s => (
                  <FilterPill key={s} label={s} active={sport===s} onClick={() => setSport(s)} dark={dark} />
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
                  <span key={label}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border"
                    style={{ background:`${ACCENT}12`, borderColor:`${ACCENT}40`, color:ACCENT }}>
                    {label}
                    <button onClick={clearAll}><X className="w-3 h-3" /></button>
                  </span>
                ))}
                <button onClick={clearAll} className="text-xs font-semibold" style={{ color:tk.textMuted }}>
                  Clear all
                </button>
              </div>
            )}

            {/* Grid or empty */}
            {filtered.length === 0 ? (
              <div className="rounded-2xl py-16 text-center"
                style={{ background:tk.surface, border:`1px solid ${tk.border}` }}>
                <Users className="w-10 h-10 mx-auto mb-3" style={{ color:tk.textMuted }} />
                <p className="font-bold text-sm mb-1" style={{ color:tk.text }}>No athletes found</p>
                <p className="text-xs mb-4" style={{ color:tk.textMuted }}>Try adjusting your search or filters</p>
                <button onClick={clearAll}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white"
                  style={{ background:`linear-gradient(135deg,${ACCENT},${ACCENT2})` }}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(a => (
                  <AthleteCard key={a.id} athlete={a} dark={dark}
                    isSaved={!!savedMap[a.id]}
                    onSave={id => setSaved(p => ({ ...p, [id]:!p[id] }))} />
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