// src/pages/RecruiterProfile.jsx

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"
import RecruiterNavbar    from "../../components/RecruiterNavbar"
import RecruiterBottomNav from "../../components/RecruiterBottomNav"
import { RecruiterSideNav, SportBadge, ACCENT, ACCENT2, THEME } from "../../components/RecruiterUi"
import {
  MapPin, Mail, Globe, Edit, Eye,
  Award, CheckCheck, GraduationCap, Briefcase,
  Star, Shield, Trophy, TrendingUp, Camera, Phone, Share, Users
} from "lucide-react"
import {
  getRecruiterById, getOffers, getShortlist,
  getCurrentUser, isLoggedIn
} from "../../api/client"


// SUB COMPONENTS
function SectionHeader({ icon: Icon, title, dark }) {
  const tk = dark ? THEME.dark : THEME.light
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon className="w-4 h-4" style={{ color: ACCENT }} />
      <h2 className="font-black text-base" style={{ color: tk.text }}>{title}</h2>
    </div>
  )
}

function StatPill({ label, value, accent, dark }) {
  const tk = dark ? THEME.dark : THEME.light
  return (
    <div className="rounded-2xl p-3 text-center"
      style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
      <p className="font-black text-lg leading-none" style={{ color: accent || ACCENT }}>{value ?? "—"}</p>
      <p className="text-xs font-semibold mt-1" style={{ color: tk.textSub }}>{label}</p>
    </div>
  )
}

function ProfileSkeleton({ dark }) {
  const tk = dark ? THEME.dark : THEME.light
  return (
    <div className="animate-pulse">
      <div className="h-32 sm:h-44" style={{ background: tk.border }} />
      <div className="px-4 pt-14 pb-4 space-y-3">
        <div className="h-6 rounded-full w-48" style={{ background: tk.border }} />
        <div className="h-4 rounded-full w-32" style={{ background: tk.border }} />
        <div className="h-4 rounded-full w-56" style={{ background: tk.border }} />
      </div>
    </div>
  )
}

const TABS = ["Overview", "Achievements", "Signings"]


// MAIN PAGE
export default function RecruiterProfile() {
  const navigate  = useNavigate()
  const [dark, setDark]         = useState(false)
  const [activeTab, setTab]     = useState("Overview")
  const [loading, setLoading]   = useState(true)
  const tk = dark ? THEME.dark : THEME.light

  // Real data
  const [user, setUser]             = useState(null)
  const [profile, setProfile]       = useState(null)
  const [offers, setOffers]         = useState([])
  const [shortlistCount, setShortlistCount] = useState(0)

  useEffect(() => {
    if (!isLoggedIn()) { navigate("/signin"); return }

    const currentUser = getCurrentUser()
    if (!currentUser) { navigate("/signin"); return }

    const id = currentUser._id || currentUser.id

    const fetchAll = async () => {
      try {
        const [profileRes, offersRes, shortlistRes] = await Promise.allSettled([
          getRecruiterById(id),
          getOffers(),
          getShortlist(),
        ])

        if (profileRes.status === "fulfilled") {
          setUser(profileRes.value.data.user)
          setProfile(profileRes.value.data.profile)
        }
        if (offersRes.status === "fulfilled") {
          setOffers(offersRes.value.data.offers || [])
        }
        if (shortlistRes.status === "fulfilled") {
          setShortlistCount((shortlistRes.value.data.shortlist || []).length)
        }
      } catch {
        toast.error("Failed to load profile")
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

  if (loading) return <ProfileSkeleton dark={dark} />

  // ── Build display values from real data
  const fullName    = user ? `${user.firstName} ${user.lastName}` : "—"
  const initials    = user ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() : "SC"
  const handle      = profile?.handle      || `@${user?.firstName?.toLowerCase() || "recruiter"}`
  const role        = profile?.role        || "Recruiter"
  const institution = profile?.organization || profile?.institution || "—"
  const location    = profile?.location    || "—"
  const email       = user?.email          || "—"
  const phone       = user?.phone          || profile?.phone || "—"
  const website     = profile?.website     || "—"
  const bio         = profile?.bio         || "No bio added yet."
  const experience  = profile?.experience  || "—"
  const sports      = profile?.sports      || []
  const achievements = profile?.achievements || []
  const recentSignings = profile?.recentSignings || []
  const profileViews = profile?.profileViews || 0
  const offersGiven  = profile?.offersGiven  || offers.length
  const athletesSigned = profile?.athletesSigned || 0
  const verified     = profile?.verified || false

  const fmt = n => n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n)

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ background: tk.page, fontFamily: "'DM Sans','Segoe UI',sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800;900&family=Bebas+Neue&display=swap');
        @keyframes scIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        .sc-in { animation:scIn .3s cubic-bezier(.4,0,.2,1) both; }
      `}</style>

      <RecruiterNavbar dark={dark} toggleDark={() => setDark(!dark)} />

      <div className="max-w-6xl mx-auto flex lg:gap-6 lg:px-4">
        <RecruiterSideNav dark={dark} />

        <main
          className="flex-1 min-w-0 pb-28 lg:pb-12"
          style={{ borderLeft: `1px solid ${tk.border}`, borderRight: `1px solid ${tk.border}` }}
        >
          {/* Cover */}
          <div className="relative">
            <div
              className="h-32 sm:h-44 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg,#1A1000,#2A1F00 50%,#D97706)" }}
            >
              <div
                className="absolute inset-0 opacity-10"
                style={{ backgroundImage: "repeating-linear-gradient(45deg,transparent,transparent 20px,rgba(255,255,255,.06) 20px,rgba(255,255,255,.06) 40px)" }}
              />
              <div
                className="absolute top-4 right-12 w-24 h-24 rounded-full blur-2xl opacity-30"
                style={{ background: ACCENT }}
              />
              <button
                className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
                style={{ background: "rgba(0,0,0,0.4)", color: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)" }}
              >
                <Camera className="w-3.5 h-3.5" /> Edit Cover
              </button>
            </div>

            <div className="absolute left-4 sm:left-6" style={{ bottom: "-44px" }}>
              <div className="relative">
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-white font-black text-2xl sm:text-3xl"
                  style={{ background: `linear-gradient(135deg,${ACCENT},${ACCENT2})`, outline: `4px solid ${tk.page}` }}
                >
                  {initials}
                </div>
                {verified && (
                  <div
                    className="absolute bottom-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: ACCENT, border: `2px solid ${tk.page}` }}
                  >
                    <Shield className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Header info */}
          <div className="px-4 sm:px-6 pt-14 pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1
                    className="font-black text-xl sm:text-2xl"
                    style={{ fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "0.06em", color: tk.text }}
                  >
                    {fullName}
                  </h1>
                  {verified && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-bold"
                      style={{ background: `${ACCENT}15`, color: ACCENT }}
                    >✦ Verified Scout</span>
                  )}
                </div>
                <p className="text-sm" style={{ color: tk.textMuted }}>{handle}</p>
                <p className="text-xs mt-0.5" style={{ color: tk.textSub }}>{role} · {institution}</p>
                <div className="flex items-center gap-5 mt-3 flex-wrap">
                  {[
                    [offersGiven,    "Offers" ],
                    [athletesSigned, "Signed" ],
                    [fmt(profileViews), "Views"],
                  ].map(([val, label]) => (
                    <div key={label}>
                      <span className="font-black text-sm" style={{ color: tk.text }}>{val} </span>
                      <span className="text-xs"            style={{ color: tk.textMuted }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 flex-shrink-0">
                <Link
                  to="/recruitersettings"
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-sm font-bold border transition-all"
                  style={{ borderColor: tk.border, color: tk.textSub }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = ACCENT}
                  onMouseLeave={e => e.currentTarget.style.borderColor = tk.border}
                >
                  <Edit className="w-4 h-4" /><span className="hidden sm:inline">Edit Profile</span>
                </Link>
                <button
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-sm font-bold border transition-all"
                  style={{ borderColor: tk.border, color: tk.textSub }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = ACCENT}
                  onMouseLeave={e => e.currentTarget.style.borderColor = tk.border}
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    toast.success("Profile link copied!")
                  }}
                >
                  <Share className="w-4 h-4" /><span className="hidden sm:inline">Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tab bar */}
          <div
            className="flex overflow-x-auto sticky z-20"
            style={{
              top: "64px",
              background:      dark ? "rgba(12,14,20,0.95)" : "rgba(250,250,247,0.95)",
              backdropFilter:  "blur(12px)",
              borderBottom:    `1px solid ${tk.border}`,
              scrollbarWidth:  "none",
            }}
          >
            {TABS.map(tab => {
              const isActive = activeTab === tab
              return (
                <button
                  key={tab}
                  onClick={() => setTab(tab)}
                  className="flex-shrink-0 px-5 py-3.5 text-sm font-bold relative transition-colors"
                  style={{ color: isActive ? ACCENT : tk.textMuted }}
                >
                  {tab}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background: ACCENT }} />
                  )}
                </button>
              )
            })}
          </div>

          {/* Tab content */}
          <div className="px-4 sm:px-6 pt-6 sc-in" key={activeTab}>

            {/* ── OVERVIEW ── */}
            {activeTab === "Overview" && (
              <div>
                <SectionHeader icon={Users} title="About" dark={dark} />
                <p className="text-sm leading-relaxed mb-5" style={{ color: tk.textSub }}>{bio}</p>

                {sports.length > 0 && (
                  <div className="mb-5">
                    <p className="text-xs font-bold mb-2" style={{ color: tk.textMuted }}>Scouting Sports</p>
                    <div className="flex flex-wrap gap-2">
                      {sports.map(s => <SportBadge key={s} sport={s} />)}
                    </div>
                  </div>
                )}

                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ background: tk.surface, border: `1px solid ${tk.border}` }}
                >
                  {[
                    [Briefcase,     "Role",        role       ],
                    [GraduationCap, "Institution", institution],
                    [MapPin,        "Location",    location   ],
                    [Mail,          "Email",       email      ],
                    [Phone,         "Phone",       phone      ],
                    [Globe,         "Website",     website    ],
                    [TrendingUp,    "Experience",  experience ],
                  ].map(([Icon, label, value], i, arr) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 px-4 py-3"
                      style={{ borderBottom: i < arr.length - 1 ? `1px solid ${tk.border}` : "none" }}
                    >
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: ACCENT }} />
                      <span className="text-xs w-20 flex-shrink-0" style={{ color: tk.textMuted }}>{label}</span>
                      <span className="text-xs font-semibold truncate"  style={{ color: tk.text }}>{value || "—"}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── ACHIEVEMENTS ── */}
            {activeTab === "Achievements" && (
              <div>
                <SectionHeader icon={Trophy} title="Awards & Recognition" dark={dark} />
                {achievements.length === 0 ? (
                  <div
                    className="rounded-2xl py-12 text-center"
                    style={{ background: tk.surface, border: `1px solid ${tk.border}` }}
                  >
                    <Trophy className="w-8 h-8 mx-auto mb-2" style={{ color: tk.textMuted }} />
                    <p className="text-sm" style={{ color: tk.textMuted }}>No achievements added yet</p>
                    <Link to="/recruitersettings" className="text-xs font-bold mt-2 inline-block" style={{ color: ACCENT }}>
                      Add in Settings →
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {achievements.map((a, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded-2xl p-4"
                        style={{ background: tk.surface, border: `1px solid ${tk.border}` }}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                          style={{ background: `${ACCENT}15` }}
                        >
                          {a.icon || "🏆"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm" style={{ color: tk.text }}>{a.title}</p>
                          <p className="text-xs mt-0.5"   style={{ color: tk.textMuted }}>{a.year}</p>
                        </div>
                        <CheckCheck className="w-4 h-4 flex-shrink-0" style={{ color: "#10B981" }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── SIGNINGS ── */}
            {activeTab === "Signings" && (
              <div>
                <SectionHeader icon={Star} title="Recent Signings" dark={dark} />
                {recentSignings.length === 0 ? (
                  <div
                    className="rounded-2xl py-12 text-center mb-6"
                    style={{ background: tk.surface, border: `1px solid ${tk.border}` }}
                  >
                    <Award className="w-8 h-8 mx-auto mb-2" style={{ color: tk.textMuted }} />
                    <p className="text-sm" style={{ color: tk.textMuted }}>No signings recorded yet</p>
                  </div>
                ) : (
                  <div
                    className="rounded-2xl overflow-hidden mb-6"
                    style={{ background: tk.surface, border: `1px solid ${tk.border}` }}
                  >
                    {recentSignings.map((s, i, arr) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 px-4 py-3"
                        style={{ borderBottom: i < arr.length - 1 ? `1px solid ${tk.border}` : "none" }}
                      >
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: `${ACCENT}15` }}
                        >
                          <Award className="w-4 h-4" style={{ color: ACCENT }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold" style={{ color: tk.text }}>{s.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <SportBadge sport={s.sport} />
                            <span className="text-xs" style={{ color: tk.textMuted }}>{s.year}</span>
                          </div>
                        </div>
                        <CheckCheck className="w-4 h-4 flex-shrink-0" style={{ color: "#10B981" }} />
                      </div>
                    ))}
                  </div>
                )}

                <SectionHeader icon={TrendingUp} title="Recruitment Stats" dark={dark} />
                <div className="grid grid-cols-2 gap-3">
                  <StatPill label="Total Offers"    value={offersGiven}              dark={dark} />
                  <StatPill label="Athletes Signed" value={athletesSigned}           dark={dark} accent="#10B981" />
                  <StatPill label="Profile Views"   value={fmt(profileViews)}        dark={dark} accent="#A855F7" />
                  <StatPill label="Shortlisted"     value={shortlistCount}           dark={dark} accent="#1DA8FF" />
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      <RecruiterBottomNav dark={dark} />
    </div>
  )
}