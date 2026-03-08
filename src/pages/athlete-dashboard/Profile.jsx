// src/pages/AthleteProfile.jsx

import { useState } from "react"
import AthleteNavbar from "./../../components/AthleteNavbar"
import DesktopSideNav from "./../../components/athlete-dashboard/TempDesktopSideNav"
import MobileBottomNav from "./../../components/athlete-dashboard/TempMobileBottomNav"
import SportBadge from "./../../components/athlete-dashboard/TempSportsBadge"
import Avatar from "./../../components/athlete-dashboard/TempAvatar"
import {
  MapPin, GraduationCap, Trophy, Eye, Play, Heart,
  Edit3, Share2, Flame, Star, CheckCheck,
  TrendingUp, Award, BookOpen, Calendar, Ruler,
  MessageCircle, UserPlus, Video
} from "lucide-react"

const ACCENT = "#1DA8FF"

const THEME = {
  dark: {
    page:"#0D1117", surface:"#161B22", surfaceHigh:"#1C2128",
    border:"rgba(255,255,255,0.06)", text:"#F0F6FF", textSub:"#9CA3AF",
    textMuted:"#4B5563", hover:"rgba(255,255,255,0.04)",
  },
  light: {
    page:"#F0F4FA", surface:"#FFFFFF", surfaceHigh:"#F8FAFC",
    border:"#E5E7EB", text:"#111827", textSub:"#6B7280",
    textMuted:"#9CA3AF", hover:"rgba(0,0,0,0.03)",
  }
}

const ATHLETE = {
  name:"James Junior", handle:"@jamesjnr_cb", sport:"Soccer",
  position:"Center Back", school:"Achimota School",
  location:"Greater Accra, Ghana", classOf:"2026",
  height:"6'1\"", weight:"76kg", gpa:"3.7",
  bio:"Passionate center back with a strong defensive record and leadership on the pitch. Committed to academic excellence and athletic development. Looking for opportunities at the collegiate level.",
  followers:1842, following:234, profileViews:"14.2k",
  verified:true, recruiterInterest:3,
  stats:[
    { label:"Matches Played", value:"42",   icon:Calendar    },
    { label:"Clean Sheets",   value:"18",   icon:CheckCheck  },
    { label:"Goals",          value:"6",    icon:Trophy      },
    { label:"Assists",        value:"11",   icon:Star        },
    { label:"GPA",            value:"3.7",  icon:BookOpen    },
    { label:"Class",          value:"2026", icon:GraduationCap },
  ],
  achievements:[
    { title:"InterSchools MVP",          year:"2025", icon:"🏆", color:"#F59E0B" },
    { title:"Regional Best Defender",    year:"2024", icon:"🛡️", color:"#10B981" },
    { title:"School Team Captain",       year:"2025", icon:"⭐", color:ACCENT    },
    { title:"National Schools Finalist", year:"2024", icon:"🥈", color:"#A855F7" },
    { title:"Academic Excellence Award", year:"2025", icon:"📚", color:"#F97316" },
    { title:"Community Champion",        year:"2023", icon:"🤝", color:"#06B6D4" },
  ],
  highlights:[
    { id:1, title:"Regional Finals — Defensive Masterclass", views:"12.4k", likes:341, duration:"2:14", videoId:"-5oif_xAwyg", featured:true  },
    { id:2, title:"InterSchools 2025 — Top Plays",           views:"8.9k",  likes:219, duration:"3:02", videoId:"-5oif_xAwyg", featured:false },
    { id:3, title:"Training Session Highlights",             views:"3.2k",  likes:87,  duration:"1:45", videoId:"-5oif_xAwyg", featured:false },
    { id:4, title:"Pre-Season — Ball Distribution",          views:"5.1k",  likes:143, duration:"2:38", videoId:"-5oif_xAwyg", featured:false },
    { id:5, title:"Match Day vs Prempeh College",            views:"7.6k",  likes:198, duration:"2:55", videoId:"-5oif_xAwyg", featured:false },
    { id:6, title:"Heading & Aerial Duels Reel",             views:"4.4k",  likes:112, duration:"1:58", videoId:"-5oif_xAwyg", featured:false },
  ],
  posts:[
    { id:1, text:"Big win for the team today 🔥 Proud of every single one of my guys. Regional finals here we come!", time:"2 hours ago", likes:84,  comments:12 },
    { id:2, text:"Finished my Biology mock with a solid score. Balance on and off the pitch 📚⚽",                      time:"3 days ago", likes:57,  comments:8  },
    { id:3, text:"Honored to be named School Team Captain for the second consecutive year. The work continues 💪",    time:"1 week ago", likes:213, comments:34 },
  ],
  recruiterViews:[
    { name:"University of Ghana",   role:"Head Recruiter",      time:"2h ago", interest:"high"   },
    { name:"KNUST",                 role:"Athletic Director",   time:"5h ago", interest:"high"   },
    { name:"Cape Coast University", role:"Youth Academy Coach", time:"1d ago", interest:"medium" },
  ]
}

const TABS = ["Overview","Highlights","Posts","Achievements"]
const INTEREST_COLOR = {
  high:  { bg:"rgba(16,185,129,0.12)", border:"rgba(16,185,129,0.3)", color:"#10B981" },
  medium:{ bg:"rgba(245,158,11,0.12)", border:"rgba(245,158,11,0.3)", color:"#F59E0B" },
}

function HighlightCard({ clip, dark, featured }) {
  const [playing, setPlaying] = useState(false)
  const [liked,   setLiked]   = useState(false)
  const tk = dark ? THEME.dark : THEME.light
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background:tk.surface, border:`1px solid ${tk.border}` }}>
      {featured && <div className="h-0.5" style={{ background:`linear-gradient(90deg,${ACCENT},#6366F1)` }} />}
      <div className="relative w-full" style={{ aspectRatio:"16/9" }}>
        {!playing ? (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center cursor-pointer relative group" onClick={() => setPlaying(true)}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            {featured && (
              <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background:"rgba(29,168,255,0.85)", color:"#fff" }}>
                <Star className="w-2.5 h-2.5 fill-white" /> Featured
              </div>
            )}
            <div className="absolute top-2 right-2 z-10 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">{clip.duration}</div>
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center z-10 group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            </div>
            <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1 text-white/70 text-xs"><Eye className="w-3 h-3" />{clip.views}</div>
          </div>
        ) : (
          <iframe src={`https://www.youtube.com/embed/${clip.videoId}?autoplay=1&rel=0&modestbranding=1`} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen />
        )}
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold leading-snug mb-2" style={{ color:tk.text }}>{clip.title}</p>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs" style={{ color:tk.textMuted }}><Eye className="w-3 h-3" />{clip.views}</span>
          <button onClick={() => setLiked(!liked)} className="flex items-center gap-1 text-xs transition-colors" style={{ color:liked?"#EC4899":tk.textMuted }}>
            <Heart className={`w-3.5 h-3.5 ${liked?"fill-pink-500":""}`} />{clip.likes+(liked?1:0)}
          </button>
        </div>
      </div>
    </div>
  )
}

function StatPill({ icon:Icon, label, value, dark }) {
  const tk = dark ? THEME.dark : THEME.light
  return (
    <div className="flex flex-col items-center gap-1 px-3 py-3 rounded-2xl" style={{ background:tk.surfaceHigh, border:`1px solid ${tk.border}` }}>
      <Icon className="w-4 h-4" style={{ color:ACCENT }} />
      <p className="font-black text-lg leading-none" style={{ color:tk.text }}>{value}</p>
      <p className="text-xs text-center leading-tight" style={{ color:tk.textMuted }}>{label}</p>
    </div>
  )
}

function OverviewTab({ dark }) {
  const tk = dark ? THEME.dark : THEME.light
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-black text-sm mb-3 flex items-center gap-2" style={{ color:tk.text }}>
          <TrendingUp className="w-4 h-4" style={{ color:ACCENT }} /> Career Stats
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {ATHLETE.stats.map(s => <StatPill key={s.label} {...s} dark={dark} />)}
        </div>
      </div>

      <div className="rounded-2xl p-4" style={{ background:tk.surface, border:`1px solid ${tk.border}` }}>
        <h3 className="font-black text-sm mb-3 flex items-center gap-2" style={{ color:tk.text }}>
          <Ruler className="w-4 h-4" style={{ color:ACCENT }} /> Physical Profile
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[["Height",ATHLETE.height],["Weight",ATHLETE.weight],["Position",ATHLETE.position],["Class Of",ATHLETE.classOf]].map(([k,v]) => (
            <div key={k}>
              <p className="text-xs mb-0.5" style={{ color:tk.textMuted }}>{k}</p>
              <p className="font-bold text-sm" style={{ color:tk.text }}>{v}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl p-4" style={{ background:tk.surface, border:`1px solid ${tk.border}` }}>
        <h3 className="font-black text-sm mb-2 flex items-center gap-2" style={{ color:tk.text }}>
          <BookOpen className="w-4 h-4" style={{ color:ACCENT }} /> About
        </h3>
        <p className="text-sm leading-relaxed" style={{ color:tk.textSub }}>{ATHLETE.bio}</p>
      </div>

      <div className="rounded-2xl p-4" style={{ background:"linear-gradient(135deg,rgba(29,168,255,0.07),rgba(99,102,241,0.07))", border:"1px solid rgba(29,168,255,0.2)" }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-black text-sm flex items-center gap-2" style={{ color:tk.text }}>
            <Flame className="w-4 h-4" style={{ color:"#10B981" }} /> Recruiter Interest
          </h3>
          <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background:"rgba(16,185,129,0.15)", color:"#10B981" }}>
            {ATHLETE.recruiterInterest} Active Scouts
          </span>
        </div>
        <div className="space-y-2">
          {ATHLETE.recruiterViews.map((r,i) => {
            const c = INTEREST_COLOR[r.interest]
            return (
              <div key={i} className="flex items-center justify-between py-2 px-3 rounded-xl"
                style={{ background:dark?"rgba(255,255,255,0.03)":"rgba(0,0,0,0.02)", border:`1px solid ${tk.border}` }}>
                <div className="flex items-center gap-2">
                  <Avatar name={r.name} size={28} />
                  <div>
                    <p className="text-xs font-bold" style={{ color:tk.text }}>{r.name}</p>
                    <p className="text-xs" style={{ color:tk.textMuted }}>{r.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full border font-semibold" style={{ background:c.bg, borderColor:c.border, color:c.color }}>
                    {r.interest==="high"?"High":"Medium"}
                  </span>
                  <span className="text-xs" style={{ color:tk.textMuted }}>{r.time}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="font-black text-sm mb-3 flex items-center gap-2" style={{ color:tk.text }}>
          <Video className="w-4 h-4" style={{ color:ACCENT }} /> Featured Highlight
        </h3>
        <HighlightCard clip={ATHLETE.highlights[0]} dark={dark} featured />
      </div>
    </div>
  )
}

function HighlightsTab({ dark }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {ATHLETE.highlights.map((clip,i) => (
        <div key={clip.id} className="sc-card" style={{ animationDelay:`${i*50}ms` }}>
          <HighlightCard clip={clip} dark={dark} featured={clip.featured} />
        </div>
      ))}
    </div>
  )
}

function PostsTab({ dark }) {
  const tk = dark ? THEME.dark : THEME.light
  return (
    <div className="space-y-3">
      {ATHLETE.posts.map((post,i) => (
        <div key={post.id} className="rounded-2xl p-4 sc-card"
          style={{ background:tk.surface, border:`1px solid ${tk.border}`, animationDelay:`${i*60}ms` }}>
          <div className="flex items-center gap-3 mb-3">
            <Avatar name={ATHLETE.name} size={36} />
            <div>
              <div className="flex items-center gap-1.5">
                <p className="font-bold text-sm" style={{ color:tk.text }}>{ATHLETE.name}</p>
                <span style={{ color:ACCENT }}>✦</span>
              </div>
              <p className="text-xs" style={{ color:tk.textMuted }}>{post.time}</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed mb-3" style={{ color:tk.textSub }}>{post.text}</p>
          <div className="flex items-center gap-4 pt-2" style={{ borderTop:`1px solid ${tk.border}` }}>
            <button className="flex items-center gap-1.5 text-xs" style={{ color:tk.textMuted }}><Heart className="w-3.5 h-3.5" />{post.likes}</button>
            <button className="flex items-center gap-1.5 text-xs" style={{ color:tk.textMuted }}><MessageCircle className="w-3.5 h-3.5" />{post.comments}</button>
            <button className="flex items-center gap-1.5 text-xs ml-auto" style={{ color:tk.textMuted }}><Share2 className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      ))}
    </div>
  )
}

function AchievementsTab({ dark }) {
  const tk = dark ? THEME.dark : THEME.light
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {ATHLETE.achievements.map((a,i) => (
        <div key={i} className="flex items-center gap-4 rounded-2xl p-4 sc-card"
          style={{ background:tk.surface, border:`1px solid ${tk.border}`, animationDelay:`${i*60}ms` }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background:`${a.color}18`, border:`1px solid ${a.color}30` }}>
            {a.icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-sm leading-snug" style={{ color:tk.text }}>{a.title}</p>
            <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color:tk.textMuted }}><Calendar className="w-3 h-3" />{a.year}</p>
          </div>
          <Award className="w-4 h-4 flex-shrink-0" style={{ color:a.color }} />
        </div>
      ))}
    </div>
  )
}

function ProfileHeader({ dark, isOwner }) {
  const [following, setFollowing] = useState(false)
  const tk = dark ? THEME.dark : THEME.light
  return (
    <div className="relative mb-6">
      <div className="w-full overflow-hidden" style={{ height:156 }}>
        <div className="w-full h-full relative" style={{ background:"linear-gradient(135deg,#0D1117 0%,#1a2744 40%,#0f2d4a 70%,#0D1117 100%)" }}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage:"radial-gradient(circle,rgba(29,168,255,0.4) 1px,transparent 1px)", backgroundSize:"28px 28px" }} />
          <div className="absolute inset-0" style={{ background:"linear-gradient(180deg,transparent 40%,rgba(0,0,0,0.6) 100%)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background:`linear-gradient(90deg,transparent,${ACCENT},transparent)` }} />
        </div>
      </div>

      <div className="px-4 sm:px-6">
        <div className="flex items-end justify-between -mt-12 mb-3 relative z-10">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-0.5" style={{ background:`linear-gradient(135deg,${ACCENT},#6366F1)` }}>
              <div className="w-full h-full rounded-xl overflow-hidden flex items-center justify-center" style={{ background:tk.surface }}>
                <Avatar name={ATHLETE.name} size={88} />
              </div>
            </div>
            {ATHLETE.verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center z-10" style={{ background:ACCENT, border:`3px solid ${tk.page}` }}>
                <span className="text-white font-bold" style={{ fontSize:9 }}>✦</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pb-1">
            {isOwner ? (
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold border transition-all"
                style={{ borderColor:ACCENT, color:ACCENT }}
                onMouseEnter={e => e.currentTarget.style.background="rgba(29,168,255,0.08)"}
                onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                <Edit3 className="w-3.5 h-3.5" /> Edit Profile
              </button>
            ) : (
              <>
                <button onClick={() => setFollowing(!following)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold border transition-all"
                  style={{ background:following?"transparent":ACCENT, color:following?ACCENT:"#fff", borderColor:ACCENT }}>
                  <UserPlus className="w-3.5 h-3.5" />{following?"Following":"Follow"}
                </button>
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold border" style={{ borderColor:tk.border, color:tk.textSub }}>
                  <MessageCircle className="w-3.5 h-3.5" /> Message
                </button>
              </>
            )}
            <button className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all"
              style={{ borderColor:tk.border, color:tk.textMuted }}
              onMouseEnter={e => e.currentTarget.style.borderColor=ACCENT}
              onMouseLeave={e => e.currentTarget.style.borderColor=tk.border}>
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="font-black text-xl sm:text-2xl" style={{ color:tk.text }}>{ATHLETE.name}</h1>
            {ATHLETE.verified && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background:"rgba(29,168,255,0.12)", color:ACCENT }}>✦ Verified Athlete</span>
            )}
          </div>
          <p className="text-sm mb-2" style={{ color:tk.textMuted }}>{ATHLETE.handle}</p>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <SportBadge sport={ATHLETE.sport} />
            <span className="text-sm font-semibold" style={{ color:tk.textSub }}>{ATHLETE.position}</span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span className="text-xs flex items-center gap-1" style={{ color:tk.textMuted }}><GraduationCap className="w-3.5 h-3.5" />{ATHLETE.school}</span>
            <span className="text-xs flex items-center gap-1" style={{ color:tk.textMuted }}><MapPin className="w-3.5 h-3.5" />{ATHLETE.location}</span>
            <span className="text-xs flex items-center gap-1" style={{ color:tk.textMuted }}><Calendar className="w-3.5 h-3.5" />Class of {ATHLETE.classOf}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 py-3" style={{ borderTop:`1px solid ${tk.border}`, borderBottom:`1px solid ${tk.border}` }}>
          {[[ATHLETE.followers,"Followers"],[ATHLETE.following,"Following"],[ATHLETE.profileViews,"Profile Views"]].map(([val,label]) => (
            <div key={label} className="text-center">
              <p className="font-black text-base sm:text-lg leading-none" style={{ color:tk.text }}>{val}</p>
              <p className="text-xs mt-0.5" style={{ color:tk.textMuted }}>{label}</p>
            </div>
          ))}
          <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full border" style={{ background:"rgba(16,185,129,0.1)", borderColor:"rgba(16,185,129,0.3)" }}>
            <Flame className="w-3.5 h-3.5" style={{ color:"#10B981" }} />
            <span className="text-xs font-bold" style={{ color:"#10B981" }}>{ATHLETE.recruiterInterest} Scouts</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AthleteProfile({ isOwner = true }) {
  const [dark, setDark]             = useState(false)
  const [activeTab, setActive]      = useState("profile")
  const [profileTab, setProfileTab] = useState("Overview")
  const tk = dark ? THEME.dark : THEME.light

  const tabContent = {
    Overview:     <OverviewTab dark={dark} />,
    Highlights:   <HighlightsTab dark={dark} />,
    Posts:        <PostsTab dark={dark} />,
    Achievements: <AchievementsTab dark={dark} />,
  }

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background:tk.page, fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Bebas+Neue&display=swap');
        .sc-card { animation:scIn .3s cubic-bezier(.4,0,.2,1) both; }
        @keyframes scIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
      `}</style>

      <AthleteNavbar dark={dark} toggleDark={() => setDark(!dark)} />

      <div className="max-w-6xl mx-auto flex lg:gap-6 lg:px-4">
        <div className="lg:w-52 xl:w-60 flex-shrink-0">
          <DesktopSideNav active={activeTab} setActive={setActive} dark={dark} />
        </div>

        <main className="flex-1 min-w-0 pb-28 lg:pb-12" style={{ borderLeft:`1px solid ${tk.border}`, borderRight:`1px solid ${tk.border}` }}>
          <ProfileHeader dark={dark} isOwner={isOwner} />

          <div className="px-4 sm:px-6">
            <div className="flex gap-1 mb-6 overflow-x-auto pb-1" style={{ scrollbarWidth:"none" }}>
              {TABS.map(tab => {
                const active = profileTab === tab
                return (
                  <button key={tab} onClick={() => setProfileTab(tab)}
                    className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all border"
                    style={{ background:active?ACCENT:"transparent", color:active?"#fff":tk.textMuted, borderColor:active?ACCENT:tk.border }}>
                    {tab}
                  </button>
                )
              })}
            </div>
            <div key={profileTab} className="sc-card pb-6">{tabContent[profileTab]}</div>
          </div>
        </main>
      </div>

      <MobileBottomNav active={activeTab} setActive={setActive} dark={dark} />
    </div>
  )
}