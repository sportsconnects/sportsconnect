// src/pages/RecruiterProfile.jsx

import { useState } from "react"
import { Link } from "react-router"
import RecruiterNavbar    from "../../components/RecruiterNavbar"
import RecruiterBottomNav from "../../components/RecruiterBottomNav"
import { RecruiterSideNav, SportBadge, ACCENT, ACCENT2, THEME } from "../../components/RecruiterUi"
import {
  MapPin, Mail, Globe, Edit, MessageCircle, Users, Eye,
  Award, ChevronRight, CheckCheck, GraduationCap, Briefcase,
  Star, Shield, Trophy, TrendingUp, Camera, Phone, Share
} from "lucide-react"

const PROFILE = {
  name:"Coach David Mensah", handle:"@coach.mensah",
  role:"Head Scout & Recruitment Officer", institution:"University of Ghana",
  location:"Accra, Greater Accra", email:"d.mensah@ug.edu.gh",
  phone:"+233 24 000 0000", website:"sports.ug.edu.gh", verified:true,
  bio:"15+ years scouting experience across Ghana and West Africa. Passionate about identifying raw talent and giving student-athletes the academic and sporting platform they deserve. Specialise in Soccer and Track & Field.",
  sports:["Soccer","Track & Field","Basketball"], experience:"15 years",
  offersGiven:24, athletesSigned:11, profileViews:"3.2k", shortlisted:18,
  achievements:[
    { title:"Scout of the Year — UGSAA",        year:"2023", icon:"🏆", color:"#F59E0B" },
    { title:"10 Athletes Signed in One Season",  year:"2022", icon:"🎖️", color:"#10B981" },
    { title:"Regional Recruitment Award",        year:"2021", icon:"⭐", color:"#A855F7" },
    { title:"5-Year Service Award — UG",         year:"2020", icon:"🛡️", color:"#1DA8FF" },
  ],
  recentSignings:[
    { name:"Kwaku Antwi",   sport:"Soccer",        year:"2024" },
    { name:"Abena Sarpong", sport:"Track & Field", year:"2024" },
    { name:"Fiifi Asante",  sport:"Basketball",    year:"2023" },
  ],
}

function SectionHeader({ icon:Icon, title, dark }) {
  const tk = dark ? THEME.dark : THEME.light
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon className="w-4 h-4" style={{ color:ACCENT }} />
      <h2 className="font-black text-base" style={{ color:tk.text }}>{title}</h2>
    </div>
  )
}

function StatPill({ label, value, accent, dark }) {
  const tk = dark ? THEME.dark : THEME.light
  return (
    <div className="rounded-2xl p-3 text-center"
      style={{ background:tk.surface, border:`1px solid ${tk.border}` }}>
      <p className="font-black text-lg leading-none" style={{ color:accent||ACCENT }}>{value}</p>
      <p className="text-xs font-semibold mt-1" style={{ color:tk.textSub }}>{label}</p>
    </div>
  )
}

const TABS = ["Overview","Achievements","Signings"]

export default function RecruiterProfile() {
  const [dark, setDark]     = useState(false)
  const [activeTab, setTab] = useState("Overview")
  const tk = dark ? THEME.dark : THEME.light

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
        <RecruiterSideNav dark={dark} />

        <main className="flex-1 min-w-0 pb-28 lg:pb-12"
          style={{ borderLeft:`1px solid ${tk.border}`, borderRight:`1px solid ${tk.border}` }}>

          {/* ── Cover ── */}
          <div className="relative">
            <div className="h-32 sm:h-44 relative overflow-hidden"
              style={{ background:"linear-gradient(135deg,#1A1000,#2A1F00 50%,#D97706)" }}>
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage:"repeating-linear-gradient(45deg,transparent,transparent 20px,rgba(255,255,255,.06) 20px,rgba(255,255,255,.06) 40px)" }} />
              <div className="absolute top-4 right-12 w-24 h-24 rounded-full blur-2xl opacity-30"
                style={{ background:ACCENT }} />
              <button className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
                style={{ background:"rgba(0,0,0,0.4)", color:"rgba(255,255,255,0.8)", backdropFilter:"blur(8px)" }}>
                <Camera className="w-3.5 h-3.5" /> Edit Cover
              </button>
            </div>

            <div className="absolute left-4 sm:left-6" style={{ bottom:"-44px" }}>
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-white font-black text-2xl sm:text-3xl"
                  style={{ background:`linear-gradient(135deg,${ACCENT},${ACCENT2})`, outline:`4px solid ${tk.page}` }}>
                  DM
                </div>
                <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background:ACCENT, border:`2px solid ${tk.page}` }}>
                  <Shield className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* ── Header info ── */}
          <div className="px-4 sm:px-6 pt-14 pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-black text-xl sm:text-2xl"
                    style={{ fontFamily:"'Bebas Neue',sans-serif", letterSpacing:"0.06em", color:tk.text }}>
                    {PROFILE.name}
                  </h1>
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{ background:`${ACCENT}15`, color:ACCENT }}>✦ Verified Scout</span>
                </div>
                <p className="text-sm" style={{ color:tk.textMuted }}>{PROFILE.handle}</p>
                <p className="text-xs mt-0.5" style={{ color:tk.textSub }}>{PROFILE.role} · {PROFILE.institution}</p>
                <div className="flex items-center gap-5 mt-3 flex-wrap">
                  {[[PROFILE.offersGiven,"Offers"],[PROFILE.athletesSigned,"Signed"],[PROFILE.profileViews,"Views"]].map(([val,label]) => (
                    <div key={label}>
                      <span className="font-black text-sm" style={{ color:tk.text }}>{val} </span>
                      <span className="text-xs" style={{ color:tk.textMuted }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <Link to="/recruitersettings"
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-sm font-bold border transition-all"
                  style={{ borderColor:tk.border, color:tk.textSub }}
                  onMouseEnter={e => e.currentTarget.style.borderColor=ACCENT}
                  onMouseLeave={e => e.currentTarget.style.borderColor=tk.border}>
                  <Edit className="w-4 h-4" /><span className="hidden sm:inline">Edit Profile</span>
                </Link>
                <button className="flex items-center gap-1.5 px-3 cursor-pointer sm:px-4 py-2 rounded-xl text-sm font-bold border transition-all"
                  style={{ borderColor:tk.border, color:tk.textSub }}
                  onMouseEnter={e => e.currentTarget.style.borderColor=ACCENT}
                  onMouseLeave={e => e.currentTarget.style.borderColor=tk.border}>
                  <Share className="w-4 h-4" /><span className="hidden sm:inline">Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* ── Tab bar ── */}
          <div className="flex overflow-x-auto sticky z-20"
            style={{
              top:"64px",
              background: dark?"rgba(12,14,20,0.95)":"rgba(250,250,247,0.95)",
              backdropFilter:"blur(12px)", borderBottom:`1px solid ${tk.border}`, scrollbarWidth:"none"
            }}>
            {TABS.map(tab => {
              const isActive = activeTab === tab
              return (
                <button key={tab} onClick={() => setTab(tab)}
                  className="flex-shrink-0 px-5 py-3.5 text-sm font-bold relative transition-colors"
                  style={{ color:isActive?ACCENT:tk.textMuted }}>
                  {tab}
                  {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background:ACCENT }} />}
                </button>
              )
            })}
          </div>

          {/* ── Tab content ── */}
          <div className="px-4 sm:px-6 pt-6 sc-in" key={activeTab}>

            {activeTab === "Overview" && (
              <div>
                <SectionHeader icon={Users} title="About" dark={dark} />
                <p className="text-sm leading-relaxed mb-5" style={{ color:tk.textSub }}>{PROFILE.bio}</p>
                <div className="mb-5">
                  <p className="text-xs font-bold mb-2" style={{ color:tk.textMuted }}>Scouting Sports</p>
                  <div className="flex flex-wrap gap-2">{PROFILE.sports.map(s => <SportBadge key={s} sport={s} />)}</div>
                </div>
                <div className="rounded-2xl overflow-hidden"
                  style={{ background:tk.surface, border:`1px solid ${tk.border}` }}>
                  {[
                    [Briefcase,     "Role",        PROFILE.role],
                    [GraduationCap, "Institution", PROFILE.institution],
                    [MapPin,        "Location",    PROFILE.location],
                    [Mail,          "Email",       PROFILE.email],
                    [Phone,         "Phone",       PROFILE.phone],
                    [Globe,         "Website",     PROFILE.website],
                    [TrendingUp,    "Experience",  PROFILE.experience],
                  ].map(([Icon, label, value], i, arr) => (
                    <div key={label} className="flex items-center gap-3 px-4 py-3"
                      style={{ borderBottom:i<arr.length-1?`1px solid ${tk.border}`:"none" }}>
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color:ACCENT }} />
                      <span className="text-xs w-20 flex-shrink-0" style={{ color:tk.textMuted }}>{label}</span>
                      <span className="text-xs font-semibold truncate" style={{ color:tk.text }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Achievements" && (
              <div>
                <SectionHeader icon={Trophy} title="Awards & Recognition" dark={dark} />
                <div className="space-y-3">
                  {PROFILE.achievements.map((a, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-2xl p-4"
                      style={{ background:tk.surface, border:`1px solid ${tk.border}` }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{ background:`${a.color}15` }}>{a.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm" style={{ color:tk.text }}>{a.title}</p>
                        <p className="text-xs mt-0.5" style={{ color:tk.textMuted }}>{a.year}</p>
                      </div>
                      <CheckCheck className="w-4 h-4 flex-shrink-0" style={{ color:"#10B981" }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Signings" && (
              <div>
                <SectionHeader icon={Star} title="Recent Signings" dark={dark} />
                <div className="rounded-2xl overflow-hidden mb-6"
                  style={{ background:tk.surface, border:`1px solid ${tk.border}` }}>
                  {PROFILE.recentSignings.map((s, i, arr) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3"
                      style={{ borderBottom:i<arr.length-1?`1px solid ${tk.border}`:"none" }}>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background:`${ACCENT}15` }}>
                        <Award className="w-4 h-4" style={{ color:ACCENT }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold" style={{ color:tk.text }}>{s.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <SportBadge sport={s.sport} /><span className="text-xs" style={{ color:tk.textMuted }}>{s.year}</span>
                        </div>
                      </div>
                      <CheckCheck className="w-4 h-4 flex-shrink-0" style={{ color:"#10B981" }} />
                    </div>
                  ))}
                </div>
                <SectionHeader icon={TrendingUp} title="Recruitment Stats" dark={dark} />
                <div className="grid grid-cols-2 gap-3">
                  <StatPill label="Total Offers"    value={PROFILE.offersGiven}    dark={dark} />
                  <StatPill label="Athletes Signed" value={PROFILE.athletesSigned} dark={dark} accent="#10B981" />
                  <StatPill label="Profile Views"   value={PROFILE.profileViews}   dark={dark} accent="#A855F7" />
                  <StatPill label="Shortlisted"     value={PROFILE.shortlisted}    dark={dark} accent="#1DA8FF" />
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