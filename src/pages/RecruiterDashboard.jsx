// src/pages/RecruiterDashboard.jsx

import { useState } from "react"
import { Link } from "react-router"
import RecruiterNavbar from "../components/RecruiterNavbar"
import {
  StatCard, SectionCard, AthleteRow, ActivityItem, FilterPill,
  RecruiterSideNav, ACCENT, ACCENT2, THEME, RAvatar
} from "../components/RecruiterUi"
import {
  Eye, Bookmark, Award, MessageCircle, Bell,
  Flame, Search, Clock, Star, TrendingUp
} from "lucide-react"
import RecruiterBottomNav from "../components/RecruiterBottomNav"

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────
const RECENT_ATHLETES = [
  { id:1, name:"Kofi Mensah",   sport:"Soccer",        region:"Greater Accra", classOf:"2026", gpa:"3.5", verified:true  },
  { id:2, name:"Ama Asante",    sport:"Track & Field", region:"Central",       classOf:"2025", gpa:"3.9", verified:false },
  { id:3, name:"Kwame Boateng", sport:"Basketball",    region:"Ashanti",       classOf:"2026", gpa:"3.7", verified:true  },
  { id:4, name:"Efua Darko",    sport:"Swimming",      region:"Greater Accra", classOf:"2025", gpa:"4.0", verified:false },
  { id:5, name:"Serwaa Boadu",  sport:"Track & Field", region:"Central",       classOf:"2025", gpa:"3.8", verified:true  },
]

const SHORTLISTED = [
  { id:1, name:"Kofi Mensah",   sport:"Soccer",     region:"Greater Accra", classOf:"2026", gpa:"3.5", verified:true },
  { id:3, name:"Kwame Boateng", sport:"Basketball", region:"Ashanti",       classOf:"2026", gpa:"3.7", verified:true },
  { id:6, name:"James Junior",  sport:"Soccer",     region:"Eastern",       classOf:"2026", gpa:"3.8", verified:true },
]

const PENDING_OFFERS = [
  { athlete:"James Junior",  type:"Full Scholarship", deadline:"Mar 30, 2026", status:"pending" },
  { athlete:"Kofi Mensah",   type:"Trial Invitation", deadline:"Apr 5, 2026",  status:"viewed"  },
]

const ACTIVITY = [
  { icon:Eye,           iconColor:"#1DA8FF",  iconBg:"rgba(29,168,255,0.12)", text:"You viewed James Junior's profile",                  time:"2 hours ago"  },
  { icon:MessageCircle, iconColor:ACCENT,     iconBg:`${ACCENT}20`,           text:"Your message to Kofi Mensah was delivered",          time:"5 hours ago"  },
  { icon:Award,         iconColor:"#A855F7",  iconBg:"rgba(168,85,247,0.12)", text:"Scholarship offer sent to James Junior",             time:"1 day ago"    },
  { icon:Star,          iconColor:ACCENT,     iconBg:`${ACCENT}18`,           text:"Kwame Boateng added to your shortlist",              time:"2 days ago"   },
  { icon:Bell,          iconColor:"#F97316",  iconBg:"rgba(249,115,22,0.12)", text:"3 new athletes match your Soccer filter today",      time:"3 days ago"   },
]

const SPORT_FILTERS = ["All Sports","Soccer","Basketball","Track & Field","Swimming","Volleyball"]

// ─────────────────────────────────────────────────────────────────────────────
// PENDING OFFERS WIDGET
// ─────────────────────────────────────────────────────────────────────────────
function PendingOffers({ dark }) {
  const tk = dark ? THEME.dark : THEME.light
  const STATUS = {
    pending: { color:"#F97316", label:"Awaiting" },
    viewed:  { color:ACCENT,    label:"Viewed"   },
  }
  return (
    <SectionCard icon={Award} title="Pending Offers"
      action="View All" actionTo="/recruiter/offers" dark={dark}>
      {PENDING_OFFERS.map((o, i) => (
        <div key={i} className="flex items-center justify-between gap-3 px-4 py-3"
          style={{ borderBottom: i < PENDING_OFFERS.length-1 ? `1px solid ${tk.border}` : "none" }}>
          <div className="flex items-center gap-3 min-w-0">
            <RAvatar name={o.athlete} size={32} />
            <div className="min-w-0">
              <p className="text-sm font-bold truncate" style={{ color:tk.text }}>{o.athlete}</p>
              <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color:tk.textMuted }}>
                <Clock className="w-3 h-3" />Deadline: {o.deadline}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background:`${STATUS[o.status].color}15`, color:STATUS[o.status].color }}>
              {STATUS[o.status].label}
            </span>
          </div>
        </div>
      ))}
    </SectionCard>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function RecruiterDashboard() {
  const [dark, setDark]     = useState(false)
  const [sport, setSport]   = useState("All Sports")
  const tk = dark ? THEME.dark : THEME.light

  const filtered = RECENT_ATHLETES.filter(a =>
    sport === "All Sports" || a.sport === sport
  )

  return (
    <div className="min-h-screen transition-colors duration-300"
      style={{ background:tk.page, fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800;900&family=Bebas+Neue&display=swap');
        @keyframes scIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        .sc-in { animation:scIn .3s cubic-bezier(.4,0,.2,1) both; }
      `}</style>

      <RecruiterNavbar dark={dark} toggleDark={() => setDark(!dark)} />

      <div className="max-w-6xl mx-auto flex lg:gap-6 lg:px-4">

        {/* Sidenav */}
        <RecruiterSideNav dark={dark} />

        {/* Main */}
        <main className="flex-1 min-w-0 pb-20 lg:pb-12"
          style={{ borderLeft:`1px solid ${tk.border}`, borderRight:`1px solid ${tk.border}` }}>
          <div className="px-4 pt-6 pb-4">

            {/* Greeting banner */}
            <div className="rounded-2xl p-5 mb-6 relative overflow-hidden"
              style={{
                background: dark
                  ? "linear-gradient(135deg,#1A1500,#2A1F00)"
                  : "linear-gradient(135deg,#FFFBEB,#FEF3C7)",
                border:`1px solid ${ACCENT}25`
              }}>
              {/* Glow */}
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl"
                style={{ background:`${ACCENT}20` }} />
              <div className="relative">
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="w-5 h-5" style={{ color:ACCENT }} />
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color:ACCENT }}>
                    Scout Dashboard
                  </p>
                </div>
                <h1 className="font-black text-2xl sm:text-3xl mb-1"
                  style={{ fontFamily:"'Bebas Neue',sans-serif", letterSpacing:"0.05em", color:tk.text }}>
                  GOOD MORNING, COACH MENSAH
                </h1>
                <p className="text-sm" style={{ color:tk.textSub }}>
                  <span className="font-bold" style={{ color:ACCENT }}>3 new athletes</span> match your filters today.
                  Your shortlist has <span className="font-bold" style={{ color:ACCENT }}>{SHORTLISTED.length} players</span>.
                </p>
              </div>
            </div>

            {/* Quick search */}
            <Link to="/recruiterathletes"
              className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl mb-6 transition-all group"
              style={{ background:tk.surface, border:`1px solid ${tk.border}` }}
              onMouseEnter={e => e.currentTarget.style.borderColor = ACCENT}
              onMouseLeave={e => e.currentTarget.style.borderColor = tk.border}>
              <Search className="w-4 h-4 flex-shrink-0" style={{ color:tk.textMuted }} />
              <span className="text-sm flex-1" style={{ color:tk.textMuted }}>
                Search athletes by name, sport, region...
              </span>
              <span className="text-xs font-bold px-2.5 py-1.5 rounded-xl"
                style={{ background:`${ACCENT}15`, color:ACCENT }}>
                Find Athletes →
              </span>
            </Link>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <StatCard icon={Eye}           label="Profiles Viewed" value="142" sub="this month"         dark={dark} />
              <StatCard icon={Bookmark}      label="Shortlisted"     value="18"  sub="saved athletes"     dark={dark} accent="#1DA8FF" />
              <StatCard icon={MessageCircle} label="Messages"        value="24"  sub="sent this month"    dark={dark} accent="#A855F7" />
              <StatCard icon={Award}         label="Offers Sent"     value="3"   sub="2 awaiting reply"   dark={dark} accent="#F97316" />
            </div>

            {/* Content + sidebar */}
            <div className="flex gap-6">

              {/* Main column */}
              <div className="flex-1 min-w-0">

                {/* Recent athletes */}
                <SectionCard icon={TrendingUp} title="Recently Viewed"
                  action="Browse All" actionTo="/recruiterathletes" dark={dark}>
                  {/* Sport filter pills */}
                  <div className="flex gap-2 px-4 py-3 overflow-x-auto"
                    style={{ borderBottom:`1px solid ${tk.border}`, scrollbarWidth:"none" }}>
                    {SPORT_FILTERS.map(s => (
                      <FilterPill key={s} label={s} active={sport===s}
                        onClick={() => setSport(s)} dark={dark} />
                    ))}
                  </div>
                  {filtered.length > 0
                    ? filtered.map((a, i) => (
                        <AthleteRow key={a.id} athlete={a} dark={dark}
                          saved={i===0} border={i < filtered.length-1} />
                      ))
                    : (
                      <div className="px-4 py-10 text-center">
                        <p className="text-sm" style={{ color:tk.textMuted }}>No athletes match this filter</p>
                      </div>
                    )
                  }
                </SectionCard>

                <PendingOffers dark={dark} />
              </div>

              {/* Desktop right sidebar */}
              <div className="hidden xl:flex flex-col gap-4 w-72 flex-shrink-0">
                <SectionCard icon={Bookmark} title="My Shortlist"
                  action="View All" actionTo="/recruitershortlist" dark={dark}>
                  {SHORTLISTED.map((a, i) => (
                    <AthleteRow key={a.id} athlete={a} dark={dark}
                      saved border={i < SHORTLISTED.length-1} />
                  ))}
                </SectionCard>
                <SectionCard icon={Bell} title="Recent Activity" dark={dark}>
                  {ACTIVITY.map((item, i) => (
                    <ActivityItem key={i} {...item} dark={dark} />
                  ))}
                </SectionCard>
              </div>
            </div>

            {/* Mobile sidebar */}
            <div className="xl:hidden mt-4 space-y-4">
              <SectionCard icon={Bookmark} title="My Shortlist"
                action="View All" actionTo="/recruiter/shortlists" dark={dark}>
                {SHORTLISTED.map((a, i) => (
                  <AthleteRow key={a.id} athlete={a} dark={dark}
                    saved border={i < SHORTLISTED.length-1} />
                ))}
              </SectionCard>
              <SectionCard icon={Bell} title="Recent Activity" dark={dark}>
                {ACTIVITY.map((item, i) => (
                  <ActivityItem key={i} {...item} dark={dark} />
                ))}
              </SectionCard>
            </div>

          </div>
        </main>
      </div>
      <RecruiterBottomNav dark={dark} />
    </div>
  )
}