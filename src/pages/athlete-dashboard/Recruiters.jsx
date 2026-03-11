// src/pages/AthleteRecruiters.jsx

import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import AthleteNavbar from "./../../components/AthleteNavbar"
import DesktopSideNav from "./../../components/athlete-dashboard/TempDesktopSideNav"
import MobileBottomNav from "./../../components/athlete-dashboard/TempMobileBottomNav"
import Avatar from "./../../components/athlete-dashboard/TempAvatar"
import SportBadge from "./../../components/athlete-dashboard/TempSportsBadge"
import {
  Flame, Eye, MessageCircle, Star, MapPin, Building2,
  Trophy, Bell, CheckCheck, Clock, TrendingUp, Users,
  BookOpen, Search, ArrowUpRight, MailOpen, Bookmark,
  Shield, X
} from "lucide-react"
import {
  getCurrentUser, isLoggedIn,
  getAthleteById, getOffers} from "../../api/client"


const ACCENT = "#1DA8FF"

const THEME = {
  dark: {
    page:"#0D1117", surface:"#161B22", border:"rgba(255,255,255,0.06)",
    text:"#F0F6FF", textSub:"#9CA3AF", textMuted:"#4B5563",
    hover:"rgba(255,255,255,0.035)", inputBg:"#161B22", inputBorder:"rgba(255,255,255,0.1)",
    badgeNew:  { bg:"rgba(16,185,129,0.15)",  color:"#10B981" },
    badgeHigh: { bg:"rgba(245,158,11,0.15)",  color:"#F59E0B" },
    badgeMed:  { bg:"rgba(29,168,255,0.15)",  color:ACCENT    },
    badgeLow:  { bg:"rgba(107,114,128,0.15)", color:"#6B7280" },
  },
  light: {
    page:"#F0F4FA", surface:"#FFFFFF", border:"#E5E7EB",
    text:"#111827", textSub:"#6B7280", textMuted:"#9CA3AF",
    hover:"rgba(0,0,0,0.025)", inputBg:"#FFFFFF", inputBorder:"#D1D5DB",
    badgeNew:  { bg:"rgba(16,185,129,0.1)",  color:"#059669" },
    badgeHigh: { bg:"rgba(245,158,11,0.1)",  color:"#D97706" },
    badgeMed:  { bg:"rgba(29,168,255,0.1)",  color:ACCENT    },
    badgeLow:  { bg:"rgba(107,114,128,0.1)", color:"#6B7280" },
  }
}

const INTEREST_META = {
  high:   { label:"High Interest", dot:"#F59E0B", pulse:true  },
  medium: { label:"Interested",    dot:ACCENT,    pulse:false },
  low:    { label:"Viewing",       dot:"#6B7280", pulse:false },
  new:    { label:"New View",      dot:"#10B981", pulse:true  },
}


// SUB-COMPONENTS
function InterestBadge({ level, dark }) {
  const tk   = dark ? THEME.dark : THEME.light
  const meta = INTEREST_META[level] || INTEREST_META.low
  const map  = { high:tk.badgeHigh, medium:tk.badgeMed, low:tk.badgeLow, new:tk.badgeNew }
  const c    = map[level] || tk.badgeLow
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0"
      style={{ background:c.bg, color:c.color }}>
      <span className="w-1.5 h-1.5 rounded-full inline-block"
        style={{ background:meta.dot, animation:meta.pulse ? "scPulse 2s infinite" : "none" }} />
      {meta.label}
    </span>
  )
}

function StatCard({ icon:Icon, label, value, accent, dark }) {
  const tk = dark ? THEME.dark : THEME.light
  return (
    <div className="rounded-2xl p-4 flex items-center gap-3"
      style={{ background:accent ? "rgba(29,168,255,0.08)" : tk.surface, border:`1px solid ${accent ? "rgba(29,168,255,0.25)" : tk.border}` }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background:"rgba(29,168,255,0.1)" }}>
        <Icon className="w-5 h-5" style={{ color:ACCENT }} />
      </div>
      <div>
        <p className="font-black text-xl leading-none" style={{ color:accent ? ACCENT : tk.text }}>{value}</p>
        <p className="text-xs font-semibold mt-0.5" style={{ color:tk.textMuted }}>{label}</p>
      </div>
    </div>
  )
}

function RecruiterCard({ recruiter, dark, onSave, onMessage }) {
  const tk = dark ? THEME.dark : THEME.light
  return (
    <div className="rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        background: tk.surface,
        border:`1px solid ${recruiter.unread ? "rgba(29,168,255,0.2)" : tk.border}`,
        boxShadow: recruiter.unread
          ? `0 0 0 1px rgba(29,168,255,0.1), 0 4px 20px rgba(0,0,0,${dark?.3:.06})`
          : `0 2px 12px rgba(0,0,0,${dark?.2:.04})`,
      }}>
      {recruiter.unread && (
        <div className="h-0.5 w-full" style={{ background:`linear-gradient(90deg,${ACCENT},transparent)` }} />
      )}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="relative flex-shrink-0">
            <Avatar name={recruiter.name} size={44} />
            {recruiter.verified && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background:ACCENT }}>
                <Shield className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm" style={{ color:tk.text }}>{recruiter.name}</span>
                  {recruiter.unread && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:ACCENT }} />}
                </div>
                <p className="text-xs mt-0.5" style={{ color:tk.textSub }}>{recruiter.title}</p>
              </div>
              <InterestBadge level={recruiter.interest} dark={dark} />
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="text-xs flex items-center gap-1" style={{ color:tk.textMuted }}>
                <Building2 className="w-3 h-3" />{recruiter.school}
              </span>
              <span className="text-xs flex items-center gap-1" style={{ color:tk.textMuted }}>
                <MapPin className="w-3 h-3" />{recruiter.location}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <SportBadge sport={recruiter.sport} />
              {recruiter.division && (
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background:tk.hover, color:tk.textSub, border:`1px solid ${tk.border}` }}>
                  {recruiter.division}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Message preview */}
        {recruiter.message && (
          <div className="mt-3 px-3 py-2.5 rounded-xl text-xs leading-relaxed italic"
            style={{ background:dark ? "rgba(255,255,255,0.03)" : "#F8FAFC", border:`1px solid ${tk.border}`, color:tk.textSub }}>
            <MailOpen className="w-3 h-3 inline mr-1.5 mb-0.5" style={{ color:tk.textMuted }} />
            "{recruiter.message.slice(0, 110)}{recruiter.message.length > 110 ? "…" : ""}"
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop:`1px solid ${tk.border}` }}>
          <div className="flex items-center gap-3">
            <span className="text-xs flex items-center gap-1" style={{ color:tk.textMuted }}>
              <Clock className="w-3 h-3" />{recruiter.lastView}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => onSave(recruiter.id)}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all border"
              style={{ background:recruiter.saved ? "rgba(29,168,255,0.1)" : "transparent", borderColor:recruiter.saved ? "rgba(29,168,255,0.3)" : tk.border, color:recruiter.saved ? ACCENT : tk.textMuted }}>
              <Bookmark className={`w-3.5 h-3.5 ${recruiter.saved ? "fill-[#1DA8FF]" : ""}`} />
            </button>
            <button onClick={() => onMessage(recruiter)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-opacity hover:opacity-90"
              style={{ background:ACCENT, color:"#fff" }}>
              <MessageCircle className="w-3.5 h-3.5" />
              {recruiter.message ? "Reply" : "Message"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfileStrength({ profile, dark }) {
  const tk = dark ? THEME.dark : THEME.light
  const items = [
    { label:"Sport set",        done: !!profile?.sport       },
    { label:"Position set",     done: !!profile?.position    },
    { label:"School set",       done: !!profile?.school      },
    { label:"Bio added",        done: !!profile?.bio         },
    { label:"Highlight video",  done: (profile?.highlights?.length || 0) > 0 },
    { label:"Achievement added",done: (profile?.achievements?.length || 0) > 0 },
  ]
  const score = Math.round((items.filter(i => i.done).length / items.length) * 100)
  return (
    <div className="rounded-2xl p-4" style={{ background:tk.surface, border:`1px solid ${tk.border}` }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" style={{ color:ACCENT }} />
          <h3 className="font-bold text-sm" style={{ color:tk.text }}>Profile Strength</h3>
        </div>
        <span className="font-black text-sm" style={{ color:ACCENT }}>{score}%</span>
      </div>
      <div className="w-full h-2 rounded-full mb-4 overflow-hidden" style={{ background:tk.hover }}>
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width:`${score}%`, background:`linear-gradient(90deg,${ACCENT},#6366F1)` }} />
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background:item.done ? "rgba(16,185,129,0.15)" : tk.hover, border:`1px solid ${item.done ? "#10B981" : tk.border}` }}>
              {item.done && <CheckCheck className="w-2.5 h-2.5 text-emerald-500" />}
            </div>
            <span className="text-xs flex-1" style={{ color:item.done ? tk.textSub : tk.textMuted }}>{item.label}</span>
            {!item.done && <span className="text-xs font-bold" style={{ color:ACCENT }}>Add</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

function MessageModal({ recruiter, dark, onClose, onSent }) {
  const [text, setText]       = useState("")
  const [sending, setSending] = useState(false)
  const tk = dark ? THEME.dark : THEME.light

  const handleSend = async () => {
    if (!text.trim()) return toast.error("Please write a message")
    try {
      setSending(true)
      const { data } = await startConversation({ recipientId: recruiter.recruiterId })
      toast.success("Message sent successfully")
      onSent()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background:"rgba(0,0,0,0.6)", backdropFilter:"blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="sc-modal w-full sm:max-w-md rounded-3xl overflow-hidden"
        style={{ background:tk.surface, border:`1px solid ${tk.border}`, boxShadow:"0 24px 64px rgba(0,0,0,0.4)" }}>
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom:`1px solid ${tk.border}` }}>
          <div className="flex items-center gap-3">
            <Avatar name={recruiter.name} size={36} />
            <div>
              <p className="font-bold text-sm" style={{ color:tk.text }}>{recruiter.name}</p>
              <p className="text-xs" style={{ color:tk.textMuted }}>{recruiter.school}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ color:tk.textMuted }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {recruiter.message && (
          <div className="px-5 py-4">
            <div className="rounded-2xl p-3 text-sm leading-relaxed italic"
              style={{ background:dark ? "rgba(255,255,255,0.04)" : "#F8FAFC", color:tk.textSub, border:`1px solid ${tk.border}` }}>
              "{recruiter.message}"
            </div>
          </div>
        )}

        <div className="px-5 pb-5">
          <textarea rows={3} placeholder="Write your reply..."
            value={text} onChange={e => setText(e.target.value)}
            className="w-full rounded-2xl px-4 py-3 text-sm resize-none outline-none"
            style={{ background:dark ? tk.inputBg : "#F8FAFC", border:`1px solid ${tk.inputBorder}`, color:tk.text, caretColor:ACCENT }} />
          <div className="flex gap-2 mt-3">
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold border"
              style={{ color:tk.textSub, borderColor:tk.border }}>
              Cancel
            </button>
            <button onClick={handleSend} disabled={sending}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-60"
              style={{ background:ACCENT }}>
              {sending ? "Sending..." : "Send Reply"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// MAIN PAGE
export default function AthleteRecruiters() {
  const navigate = useNavigate()
  const [dark, setDark]         = useState(false)
  const [activeTab, setActive]  = useState("recruiters")
  const [filter, setFilter]     = useState("all")
  const [query, setQuery]       = useState("")
  const [modal, setModal]       = useState(null)

  // Real data
  const [currentUser,    setCurrentUser]    = useState(null)
  const [athleteProfile, setAthleteProfile] = useState(null)
  const [offers,         setOffers]         = useState([])
  const [recruiters,     setRecruiters]     = useState([])
  const [fetching,       setFetching]       = useState(true)

  const tk = dark ? THEME.dark : THEME.light

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/signin")
      return
    }

    const user = getCurrentUser()
    setCurrentUser(user)

    const fetchData = async () => {
      try {
        const [profileRes, offersRes] = await Promise.allSettled([
          getAthleteById(user.id),
          getOffers(),
        ])

        let profile = null
        if (profileRes.status === "fulfilled") {
          profile = profileRes.value.data.profile
          setAthleteProfile(profile)
        }

        let realOffers = []
        if (offersRes.status === "fulfilled") {
          realOffers = offersRes.value.data.offers || []
          setOffers(realOffers)
        }

       
        const recruiterMap = {}
        realOffers.forEach(offer => {
          const rid = offer.recruiter?._id || offer.recruiter
          if (!recruiterMap[rid]) {
            recruiterMap[rid] = {
              id:          rid,
              recruiterId: rid,
              name:        `${offer.recruiter?.firstName} ${offer.recruiter?.lastName}`,
              title:       "Recruiter",
              school:      offer.institution || "—",
              location:    "Ghana",
              sport:       offer.sport       || "—",
              division:    offer.type        || "—",
              verified:    false,
              interest:    offer.status === "pending" ? "high" : offer.status === "viewed" ? "medium" : "low",
              lastView:    new Date(offer.createdAt).toLocaleDateString(),
              message:     offer.message     || "",
              unread:      offer.status === "pending",
              saved:       false,
            }
          }
        })

        setRecruiters(Object.values(recruiterMap))

      } catch (err) {
        toast.error("Failed to load recruiters data")
      } finally {
        setFetching(false)
      }
    }

    fetchData()
  }, [navigate])

  const handleSave = id => setRecruiters(prev =>
    prev.map(r => r.id === id ? { ...r, saved: !r.saved } : r)
  )

  const FILTERS = [
    { id:"all",    label:"All",          count: recruiters.length },
    { id:"high",   label:"High Interest",count: recruiters.filter(r => r.interest === "high").length },
    { id:"unread", label:"Unread",       count: recruiters.filter(r => r.unread).length },
    { id:"saved",  label:"Saved",        count: recruiters.filter(r => r.saved).length },
  ]

  const filtered = recruiters.filter(r => {
    const matchFilter = filter === "all" ? true : filter === "unread" ? r.unread : filter === "saved" ? r.saved : r.interest === filter
    const matchQuery  = !query || r.name.toLowerCase().includes(query.toLowerCase()) || r.school.toLowerCase().includes(query.toLowerCase())
    return matchFilter && matchQuery
  })

  const unreadCount     = recruiters.filter(r => r.unread).length
  const profileViews    = athleteProfile?.profileViews    || 0
  const recruiterViews  = athleteProfile?.recruiterViews  || 0

  return (
    <div className="min-h-screen transition-colors duration-300"
      style={{ background:tk.page, fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Bebas+Neue&display=swap');
        @keyframes scPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(1.5)} }
        .sc-card { animation:scIn 0.3s cubic-bezier(0.4,0,0.2,1) both; }
        @keyframes scIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        .sc-modal { animation:scModal 0.2s cubic-bezier(0.4,0,0.2,1); }
        @keyframes scModal { from{opacity:0;transform:scale(0.96)} to{opacity:1;transform:none} }
      `}</style>

      <AthleteNavbar dark={dark} toggleDark={() => setDark(!dark)} />

      <div className="max-w-6xl mx-auto flex lg:gap-6 lg:px-4">
        <div className="lg:w-52 xl:w-60 flex-shrink-0">
          <DesktopSideNav active={activeTab} setActive={setActive} dark={dark} />
        </div>

        <main className="flex-1 min-w-0 pb-28 lg:pb-12"
          style={{ borderLeft:`1px solid ${tk.border}`, borderRight:`1px solid ${tk.border}` }}>

          {/* Sticky header */}
          <div className="sticky top-14 sm:top-16 z-30 backdrop-blur-xl px-4 pt-5 pb-4"
            style={{ background:dark ? "rgba(13,17,23,.95)" : "rgba(255,255,255,.95)", borderBottom:`1px solid ${tk.border}` }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="font-black text-2xl sm:text-3xl"
                  style={{ fontFamily:"'Bebas Neue',sans-serif", letterSpacing:"0.05em", color:tk.text }}>
                  RECRUITERS
                </h1>
                <p className="text-xs mt-0.5" style={{ color:tk.textMuted }}>
                  {fetching ? "Loading..." : unreadCount > 0
                    ? `${unreadCount} new ${unreadCount === 1 ? "offer" : "offers"} from scouts`
                    : "Coaches and scouts interested in you"}
                </p>
              </div>
              {unreadCount > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ background:"rgba(29,168,255,0.1)", color:ACCENT, border:"1px solid rgba(29,168,255,0.25)" }}>
                  <Bell className="w-3.5 h-3.5" />{unreadCount} new
                </div>
              )}
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 rounded-2xl px-3 py-2.5 mb-3"
              style={{ background:tk.inputBg, border:`1px solid ${tk.inputBorder}` }}>
              <Search className="w-4 h-4 flex-shrink-0" style={{ color:tk.textMuted }} />
              <input value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search recruiters or schools..."
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color:tk.text }} />
              {query && (
                <button onClick={() => setQuery("")} style={{ color:tk.textMuted }}>
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth:"none" }}>
              {FILTERS.map(f => {
                const isActive = filter === f.id
                return (
                  <button key={f.id} onClick={() => setFilter(f.id)}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border"
                    style={{ background:isActive ? ACCENT : "transparent", color:isActive ? "#fff" : tk.textMuted, borderColor:isActive ? ACCENT : tk.border }}>
                    {f.label}
                    <span className="px-1.5 py-0.5 rounded-full font-black"
                      style={{ background:isActive ? "rgba(255,255,255,0.25)" : tk.hover, color:isActive ? "#fff" : tk.textMuted, fontSize:10 }}>
                      {f.count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Body */}
          <div className="px-4 py-4">

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <StatCard icon={Eye}      label="Profile Views"    value={profileViews}                                          accent dark={dark} />
              <StatCard icon={Users}    label="Total Recruiters" value={recruiters.length}                                     dark={dark} />
              <StatCard icon={Flame}    label="Scout Views"      value={recruiterViews}                                        dark={dark} />
              <StatCard icon={BookOpen} label="Offers Received"  value={offers.length}                                        dark={dark} />
            </div>

            <div className="flex gap-4 items-start">

              {/* Recruiter cards */}
              <div className="flex-1 min-w-0 space-y-3">
                {fetching ? (
                  // Skeleton loader
                  [1,2,3].map(i => (
                    <div key={i} className="rounded-2xl p-4 animate-pulse"
                      style={{ background:tk.surface, border:`1px solid ${tk.border}`, height:140 }} />
                  ))
                ) : filtered.length === 0 ? (
                  <div className="rounded-2xl px-6 py-16 text-center"
                    style={{ background:tk.surface, border:`1px solid ${tk.border}` }}>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                      style={{ background:"rgba(29,168,255,0.1)" }}>
                      <Users className="w-5 h-5" style={{ color:ACCENT }} />
                    </div>
                    <p className="font-bold text-sm mb-1" style={{ color:tk.text }}>No recruiters yet</p>
                    <p className="text-xs" style={{ color:tk.textMuted }}>
                      {filter !== "all"
                        ? "Try switching to 'All' to see everyone"
                        : "Complete your profile and post highlights to attract scouts"}
                    </p>
                  </div>
                ) : (
                  filtered.map((r, i) => (
                    <div key={r.id} className="sc-card" style={{ animationDelay:`${i*60}ms` }}>
                      <RecruiterCard recruiter={r} dark={dark} onSave={handleSave} onMessage={setModal} />
                    </div>
                  ))
                )}
              </div>

              {/* Right sidebar */}
              <div className="hidden lg:flex flex-col gap-4 w-64 flex-shrink-0">
                <ProfileStrength profile={athleteProfile} dark={dark} />

                <div className="rounded-2xl p-4" style={{ background:tk.surface, border:`1px solid ${tk.border}` }}>
                  <div className="flex items-center gap-2 mb-1">
                    <Bell className="w-4 h-4" style={{ color:ACCENT }} />
                    <h3 className="font-bold text-sm" style={{ color:tk.text }}>Offers Received</h3>
                  </div>
                  <p className="text-xs mb-3" style={{ color:tk.textMuted }}>All time</p>
                  {offers.length === 0 ? (
                    <p className="text-xs" style={{ color:tk.textMuted }}>No offers yet</p>
                  ) : (
                    offers.slice(0, 4).map((offer, i) => (
                      <div key={offer._id} className="flex items-center gap-3 py-2.5"
                        style={{ borderBottom: i < Math.min(offers.length, 4)-1 ? `1px solid ${tk.border}` : "none" }}>
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background:"rgba(29,168,255,0.1)" }}>
                          <Trophy className="w-3.5 h-3.5" style={{ color:ACCENT }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate" style={{ color:tk.text }}>{offer.type}</p>
                          <p className="text-xs truncate" style={{ color:tk.textMuted }}>{offer.institution}</p>
                        </div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{
                            background: offer.status === "accepted" ? "rgba(16,185,129,0.15)" : offer.status === "declined" ? "rgba(239,68,68,0.15)" : "rgba(29,168,255,0.15)",
                            color:      offer.status === "accepted" ? "#10B981"               : offer.status === "declined" ? "#EF4444"               : ACCENT,
                          }}>
                          {offer.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <div className="rounded-2xl p-4"
                  style={{ background:"linear-gradient(135deg,rgba(29,168,255,0.1),rgba(99,102,241,0.1))", border:"1px solid rgba(29,168,255,0.2)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-amber-500" />
                    <h3 className="font-bold text-sm" style={{ color:tk.text }}>Recruiter Tip</h3>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color:tk.textSub }}>
                    Respond to recruiter messages within 24 hours. Scouts who don't hear back often move on to the next prospect.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <MobileBottomNav active={activeTab} setActive={setActive} dark={dark} />

      {modal && (
        <MessageModal
          recruiter={modal}
          dark={dark}
          onClose={() => setModal(null)}
          onSent={() => setModal(null)}
        />
      )}
    </div>
  )
}