// src/pages/AthleteDashboard.jsx

import { useState } from "react"

// ── Component imports ──────────────────────────────────────────────────────
import AthleteNavbar   from "../components/AthleteNavbar"
import DesktopSideNav  from "../components/athlete-dashboard/TempDesktopSideNav";
import MobileBottomNav from "../components/athlete-dashboard/TempMobileBottomNav"
import RecruiterBanner from "../components/athlete-dashboard/TempRecruiterBanner"
import PostComposer    from "../components/athlete-dashboard/TempPostComposer"
import PostCard        from "../components/athlete-dashboard/TempPostCard"
import ProfileCard     from "../components/athlete-dashboard/TempProfileCard"
import TrendingCard    from "../components/athlete-dashboard/TempTrendingCard"
import WhoToFollow     from "../components/athlete-dashboard/TempWhoToFollow"

// ── Theme ──────────────────────────────────────────────────────────────────
const ACCENT = "#1DA8FF"

const THEME = {
  dark: {
    page:      "#0D1117",
    border:    "rgba(255,255,255,0.06)",
    text:      "#F0F6FF",
    textMuted: "#4B5563",
  },
  light: {
    page:      "#F0F4FA",
    border:    "#E5E7EB",
    text:      "#111827",
    textMuted: "#9CA3AF",
  }
}

// ── Data ───────────────────────────────────────────────────────────────────
const CURRENT_USER = {
  name:         "James Junior",
  handle:       "@jamesjnr_cb",
  sport:        "Soccer",
  position:     "Center Back",
  school:       "St Peter's Boys",
  location:     "Eastern Region",
  classOf:      "2026",
  age:          16,
  height:       "5'7\"",
  gpa:          "3.8",
  achievements: ["Best Defender InterSchools", "Regional Champion", "MVP 2023"],
  followers:    312,
  following:    89,
  views:        "14.2k",
  verified:     true,
}

const FEED_POSTS = [
  {
    id: 1,
    athlete: {
      name: "Kofi Mensah", handle: "@kofi_striker", sport: "Soccer",
      position: "Striker", school: "Achimota School", location: "Greater Accra",
      classOf: "2026", verified: true,
    },
    videoId:   "-5oif_xAwyg",
    caption:   "Hat-trick in the Inter-Schools finals 🔥 Scouts from Legon Cities were watching 👀 #Soccer #Ghana #Recruit",
    likes:     847,
    comments:  43,
    reposts:   91,
    views:     "12.4k",
    timestamp: "2h ago",
    liked:     false,
  },
  {
    id: 2,
    athlete: {
      name: "Ama Asante", handle: "@ama_track", sport: "Track & Field",
      position: "Sprinter", school: "Wesley Girls", location: "Central Region",
      classOf: "2025", verified: false,
    },
    videoId:   "-5oif_xAwyg",
    caption:   "New PB in the 100m — 11.4s 💨 Pushing every single day. College scouts, the door is open. #Sprint #Athletics",
    likes:     1203,
    comments:  76,
    reposts:   154,
    views:     "28.1k",
    timestamp: "5h ago",
    liked:     true,
  },
  {
    id: 3,
    athlete: {
      name: "Kwame Boateng", handle: "@kwame_hoops", sport: "Basketball",
      position: "Point Guard", school: "Prempeh College", location: "Ashanti Region",
      classOf: "2026", verified: true,
    },
    videoId:   "-5oif_xAwyg",
    caption:   "30pts, 9ast in last night's game 🏀 These handles aren't stopping anytime soon. #Basketball #Hoops",
    likes:     2100,
    comments:  188,
    reposts:   340,
    views:     "41.7k",
    timestamp: "1d ago",
    liked:     false,
  },
  {
    id: 4,
    athlete: {
      name: "Efua Darko", handle: "@efua_swims", sport: "Swimming",
      position: "Freestyle", school: "Ghana Intl School", location: "Greater Accra",
      classOf: "2025", verified: false,
    },
    videoId:   "-5oif_xAwyg",
    caption:   "Broke the school record in the 200m freestyle today 🏊‍♀️ Every lap is a step closer to my dream. #Swimming #Recruit",
    likes:     567,
    comments:  29,
    reposts:   61,
    views:     "8.9k",
    timestamp: "1d ago",
    liked:     false,
  },
]

// ── Dashboard ──────────────────────────────────────────────────────────────
export default function AthleteDashboard() {
  const [dark, setDark]         = useState(false)
  const [activeTab, setActive]  = useState("home")
  const [feedFilter, setFilter] = useState("all")
  const tk = dark ? THEME.dark : THEME.light

  const filters  = ["all", "Soccer", "Basketball", "Track & Field", "Swimming"]
  const filtered = feedFilter === "all"
    ? FEED_POSTS
    : FEED_POSTS.filter(p => p.athlete.sport === feedFilter)

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ background: tk.page, fontFamily: "'DM Sans','Segoe UI',sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Bebas+Neue&display=swap');`}</style>

      {/* 1. NAVBAR */}
      <AthleteNavbar dark={dark} toggleDark={() => setDark(!dark)} />

      <div className="max-w-6xl mx-auto flex lg:gap-6 lg:px-4">

        {/* 2. LEFT SIDEBAR */}
        <div className="lg:w-52 xl:w-60 flex-shrink-0">
          <DesktopSideNav active={activeTab} setActive={setActive} dark={dark} />
        </div>

        {/* 3. MAIN FEED */}
        <main
          className="flex-1 min-w-0"
          style={{ borderLeft: `1px solid ${tk.border}`, borderRight: `1px solid ${tk.border}` }}
        >
          {/* Sticky filter bar */}
          <div
            className="sticky top-14 sm:top-16 z-30 backdrop-blur-xl"
            style={{
              background:   dark ? "rgba(13,17,23,.95)" : "rgba(255,255,255,.95)",
              borderBottom: `1px solid ${tk.border}`,
            }}
          >
            <div className="px-4 pt-3 pb-1">
              <h1 className="font-black text-lg" style={{ color: tk.text }}>Home</h1>
            </div>
            <div
              className="flex gap-1.5 px-4 pb-2.5 pt-1 overflow-x-auto"
              style={{ scrollbarWidth: "none" }}
            >
              {filters.map(f => {
                const isActive = feedFilter === f
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold transition-all border"
                    style={{
                      background:  isActive ? ACCENT       : "transparent",
                      color:       isActive ? "#fff"        : tk.textMuted,
                      borderColor: isActive ? ACCENT        : tk.border,
                    }}
                  >
                    {f === "all" ? "All Sports" : f}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 4. RECRUITER BANNER */}
          <RecruiterBanner dark={dark} />

          {/* 5. POST COMPOSER */}
          <PostComposer dark={dark} />

          {/* 6. FEED POSTS */}
          <div className="pb-24 lg:pb-8">
            {filtered.length === 0 ? (
              <div className="px-4 py-16 text-center">
                <p className="text-sm" style={{ color: tk.textMuted }}>
                  No posts for this sport yet.
                </p>
              </div>
            ) : (
              filtered.map(post => (
                <PostCard key={post.id} post={post} dark={dark} />
              ))
            )}
          </div>
        </main>

        {/* 7. RIGHT SIDEBAR */}
        <aside
          className="hidden xl:flex flex-col gap-4 w-72 flex-shrink-0 pt-4 sticky top-16 overflow-y-auto pb-8"
          style={{ height: "calc(100vh - 4rem)", scrollbarWidth: "none" }}
        >
          <ProfileCard user={CURRENT_USER} dark={dark} />
          <TrendingCard dark={dark} />
          <WhoToFollow dark={dark} />
        </aside>
      </div>

      {/* 8. MOBILE BOTTOM NAV */}
      <MobileBottomNav active={activeTab} setActive={setActive} dark={dark} />
    </div>
  )
}
