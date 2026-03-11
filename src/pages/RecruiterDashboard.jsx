// src/pages/RecruiterDashboard.jsx

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"
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
import {
  getCurrentUser, isLoggedIn,
  getRecruiterById, getAthletes,
  getShortlist, getOffers
} from "../../src/api/client"

const SPORT_FILTERS = ["All Sports","Soccer","Basketball","Track & Field","Swimming","Volleyball"]


// PENDING OFFERS WIDGET
function PendingOffers({ offers, dark }) {
  const tk = dark ? THEME.dark : THEME.light
  const STATUS = {
    pending: { color:"#F97316", label:"Awaiting" },
    viewed:  { color:ACCENT,    label:"Viewed"   },
  }

  const pending = offers.filter(o => ["pending","viewed"].includes(o.status)).slice(0, 3)

  if (pending.length === 0) return null

  return (
    <SectionCard icon={Award} title="Pending Offers"
      action="View All" actionTo="/recruiter/offers" dark={dark}>
      {pending.map((o, i) => (
        <div key={o._id} className="flex items-center justify-between gap-3 px-4 py-3"
          style={{ borderBottom: i < pending.length-1 ? `1px solid ${tk.border}` : "none" }}>
          <div className="flex items-center gap-3 min-w-0">
            <RAvatar name={`${o.athlete?.firstName} ${o.athlete?.lastName}`} size={32} />
            <div className="min-w-0">
              <p className="text-sm font-bold truncate" style={{ color:tk.text }}>
                {o.athlete?.firstName} {o.athlete?.lastName}
              </p>
              <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color:tk.textMuted }}>
                <Clock className="w-3 h-3" />
                {o.deadline
                  ? `Deadline: ${new Date(o.deadline).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" })}`
                  : o.type}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{
                background:`${STATUS[o.status]?.color || ACCENT}15`,
                color: STATUS[o.status]?.color || ACCENT
              }}>
              {STATUS[o.status]?.label || o.status}
            </span>
          </div>
        </div>
      ))}
    </SectionCard>
  )
}

// MAIN PAGE
export default function RecruiterDashboard() {
  const navigate = useNavigate()
  const [dark, setDark]   = useState(false)
  const [sport, setSport] = useState("All Sports")
  const tk = dark ? THEME.dark : THEME.light

  // ── Real data state 
  const [currentUser,      setCurrentUser]      = useState(null)
  const [recruiterProfile, setRecruiterProfile] = useState(null)
  const [recentAthletes,   setRecentAthletes]   = useState([])
  const [shortlist,        setShortlist]        = useState([])
  const [offers,           setOffers]           = useState([])
  const [loading,          setLoading]          = useState(true)

  // ── Fetch all data 
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/signin")
      return
    }

    const user = getCurrentUser()

    if (user?.role === "athlete") {
      navigate("/athletedashboard")
      return
    }

    setCurrentUser(user)

    const fetchAll = async () => {
      try {
        // Run all requests in parallel
        const [profileRes, athletesRes, shortlistRes, offersRes] = await Promise.allSettled([
          getRecruiterById(user.id),
          getAthletes({ limit: 5 }),
          getShortlist(),
          getOffers(),
        ])

        if (profileRes.status  === "fulfilled") setRecruiterProfile(profileRes.value.data.profile)
        if (athletesRes.status === "fulfilled") setRecentAthletes(athletesRes.value.data.athletes?.slice(0, 5) || [])
        if (shortlistRes.status === "fulfilled") setShortlist(shortlistRes.value.data.shortlist || [])
        if (offersRes.status   === "fulfilled") setOffers(offersRes.value.data.offers || [])

      } catch (err) {
        toast.error("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [navigate])

  // ── Build greeting name
  const greetingName = currentUser
    ? `Coach ${currentUser.lastName?.toUpperCase()}`
    : "COACH"

  // ── Time-based greeting 
  const hour = new Date().getHours()
  const timeGreeting = hour < 12 ? "GOOD MORNING" : hour < 17 ? "GOOD AFTERNOON" : "GOOD EVENING"

  // ── Sport filter
  const filteredAthletes = recentAthletes.filter(a =>
    sport === "All Sports" || a.sport === sport
  )

  // ── Stats 
  const shortlistCount  = shortlist.length
  const offersCount     = offers.length
  const pendingOffers   = offers.filter(o => ["pending","viewed"].includes(o.status))
  const profileViews    = recruiterProfile?.profileViews || 0

  // ── Loading screen 
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: tk.page, fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
          @keyframes pulse-ring {
            0%   { transform:scale(0.85); opacity:0.6; }
            50%  { transform:scale(1.05); opacity:1;   }
            100% { transform:scale(0.85); opacity:0.6; }
          }
          @keyframes shimmer {
            0%   { background-position:-200% center; }
            100% { background-position: 200% center; }
          }
          @keyframes fade-up {
            from { opacity:0; transform:translateY(12px); }
            to   { opacity:1; transform:translateY(0);    }
          }
          .sc-pulse { animation:pulse-ring 2s ease-in-out infinite; }
          .sc-shimmer {
            background:linear-gradient(90deg,${ACCENT} 0%,#fff 40%,${ACCENT} 80%);
            background-size:200% auto;
            -webkit-background-clip:text;
            -webkit-text-fill-color:transparent;
            background-clip:text;
            animation:shimmer 2.5s linear infinite;
          }
          .sc-fadeup { animation:fade-up 0.6s ease forwards; }
          .dot { display:inline-block; animation:dot-b 1.4s ease-in-out infinite; }
          .dot:nth-child(2) { animation-delay:0.2s; }
          .dot:nth-child(3) { animation-delay:0.4s; }
          @keyframes dot-b {
            0%,80%,100% { transform:translateY(0);    opacity:0.4; }
            40%          { transform:translateY(-6px); opacity:1;   }
          }
        `}</style>

        <div className="sc-fadeup text-center" style={{ animationDelay: "10s" }}>
          <h1 className="sc-shimmer font-black text-2xl mb-1"
            style={{ fontFamily:"'Bebas Neue',sans-serif", letterSpacing:"0.08em" }}>
            SPORTSCONNECT
          </h1>
          <p className="text-xs font-medium tracking-widest uppercase mb-6"
            style={{ color:tk.textMuted, letterSpacing:"0.2em" }}>
            Scout Platform
          </p>
        </div>

        <div className="sc-fadeup flex items-center gap-1" style={{ animationDelay: "10s" }}>
          <span className="dot w-2 h-2 rounded-full" style={{ background:ACCENT }} />
          <span className="dot w-2 h-2 rounded-full" style={{ background:ACCENT }} />
          <span className="dot w-2 h-2 rounded-full" style={{ background:ACCENT }} />
        </div>
        <p className="sc-fadeup text-xs mt-3" style={{ color: tk.textMuted, animationDelay: "10s" }}>
          Loading your dashboard...
        </p>
      </div>
    )
  }

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
                  {timeGreeting}, {greetingName}
                </h1>
                <p className="text-sm" style={{ color:tk.textSub }}>
                  {recentAthletes.length > 0
                    ? <><span className="font-bold" style={{ color:ACCENT }}>{recentAthletes.length} athletes</span> available to scout today. </>
                    : "Welcome to your scout dashboard. "}
                  Your shortlist has{" "}
                  <span className="font-bold" style={{ color:ACCENT }}>{shortlistCount} players</span>.
                </p>
              </div>
            </div>

            {/* Quick search */}
            <Link to="/recruiterathletes"
              className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl mb-6 transition-all"
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

            {/* Stats — real data */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <StatCard icon={Eye}           label="Profile Views"  value={String(profileViews)}    sub="total views"          dark={dark} />
              <StatCard icon={Bookmark}      label="Shortlisted"    value={String(shortlistCount)}  sub="saved athletes"       dark={dark} accent="#1DA8FF" />
              <StatCard icon={MessageCircle} label="Offers Sent"    value={String(offersCount)}     sub="total offers"         dark={dark} accent="#A855F7" />
              <StatCard icon={Award}         label="Pending Offers" value={String(pendingOffers.length)} sub="awaiting reply"  dark={dark} accent="#F97316" />
            </div>

            {/* Content + sidebar */}
            <div className="flex gap-6">

              {/* Main column */}
              <div className="flex-1 min-w-0">

                {/* Recent athletes */}
                <SectionCard icon={TrendingUp} title="Athletes"
                  action="Browse All" actionTo="/recruiterathletes" dark={dark}>
                  <div className="flex gap-2 px-4 py-3 overflow-x-auto"
                    style={{ borderBottom:`1px solid ${tk.border}`, scrollbarWidth:"none" }}>
                    {SPORT_FILTERS.map(s => (
                      <FilterPill key={s} label={s} active={sport===s}
                        onClick={() => setSport(s)} dark={dark} />
                    ))}
                  </div>
                  {filteredAthletes.length > 0
                    ? filteredAthletes.map((a, i) => {
                        // Build athlete object AthleteRow expects
                        const athleteObj = {
                          id:       a.user?._id || a._id,
                          name:     `${a.user?.firstName} ${a.user?.lastName}`,
                          sport:    a.sport    || "—",
                          region:   a.region   || "—",
                          classOf:  a.classOf  || "—",
                          gpa:      a.gpa      || "—",
                          verified: a.verified || false,
                        }
                        return (
                          <AthleteRow key={a._id} athlete={athleteObj} dark={dark}
                            saved={shortlist.some(s => s.athlete?.id === athleteObj.id)}
                            border={i < filteredAthletes.length-1} />
                        )
                      })
                    : (
                      <div className="px-4 py-10 text-center">
                        <p className="text-sm" style={{ color:tk.textMuted }}>
                          {recentAthletes.length === 0
                            ? "No athletes have joined yet."
                            : "No athletes match this filter"}
                        </p>
                      </div>
                    )
                  }
                </SectionCard>

                {/* Pending offers — real data */}
                <PendingOffers offers={offers} dark={dark} />
              </div>

              {/* Desktop right sidebar */}
              <div className="hidden xl:flex flex-col gap-4 w-72 flex-shrink-0">
                <SectionCard icon={Bookmark} title="My Shortlist"
                  action="View All" actionTo="/recruitershortlist" dark={dark}>
                  {shortlist.length > 0
                    ? shortlist.slice(0, 4).map((item, i) => {
                        const athleteObj = {
                          id:       item.athlete?.id,
                          name:     `${item.athlete?.firstName} ${item.athlete?.lastName}`,
                          sport:    item.athlete?.sport    || "—",
                          region:   item.athlete?.region   || "—",
                          classOf:  item.athlete?.classOf  || "—",
                          gpa:      item.athlete?.gpa      || "—",
                          verified: item.athlete?.verified || false,
                        }
                        return (
                          <AthleteRow key={item._id} athlete={athleteObj} dark={dark}
                            saved border={i < Math.min(shortlist.length, 4)-1} />
                        )
                      })
                    : (
                      <div className="px-4 py-6 text-center">
                        <p className="text-sm" style={{ color:tk.textMuted }}>No athletes shortlisted yet</p>
                        <Link to="/recruiterathletes"
                          className="text-xs font-bold mt-2 inline-block"
                          style={{ color:ACCENT }}>
                          Browse Athletes →
                        </Link>
                      </div>
                    )
                  }
                </SectionCard>

                {/* Activity — keep as mock for now */}
                <SectionCard icon={Bell} title="Recent Activity" dark={dark}>
                  {[
                    { icon:Eye,           iconColor:"#1DA8FF", iconBg:"rgba(29,168,255,0.12)", text:"Dashboard loaded successfully",   time:"just now"  },
                    { icon:Bookmark,      iconColor:ACCENT,    iconBg:`${ACCENT}20`,           text:`${shortlistCount} athletes on your shortlist`, time:"now" },
                    { icon:Award,         iconColor:"#F97316", iconBg:"rgba(249,115,22,0.12)", text:`${offersCount} offers sent total`, time:"now" },
                  ].map((item, i) => (
                    <ActivityItem key={i} {...item} dark={dark} />
                  ))}
                </SectionCard>
              </div>
            </div>

            {/* Mobile sidebar */}
            <div className="xl:hidden mt-4 space-y-4">
              <SectionCard icon={Bookmark} title="My Shortlist"
                action="View All" actionTo="/recruitershortlist" dark={dark}>
                {shortlist.length > 0
                  ? shortlist.slice(0, 3).map((item, i) => {
                      const athleteObj = {
                        id:       item.athlete?.id,
                        name:     `${item.athlete?.firstName} ${item.athlete?.lastName}`,
                        sport:    item.athlete?.sport    || "—",
                        region:   item.athlete?.region   || "—",
                        classOf:  item.athlete?.classOf  || "—",
                        gpa:      item.athlete?.gpa      || "—",
                        verified: item.athlete?.verified || false,
                      }
                      return (
                        <AthleteRow key={item._id} athlete={athleteObj} dark={dark}
                          saved border={i < Math.min(shortlist.length, 3)-1} />
                      )
                    })
                  : (
                    <div className="px-4 py-6 text-center">
                      <p className="text-sm" style={{ color:tk.textMuted }}>No athletes shortlisted yet</p>
                    </div>
                  )
                }
              </SectionCard>
            </div>

          </div>
        </main>
      </div>
      <RecruiterBottomNav dark={dark} />
    </div>
  )
}