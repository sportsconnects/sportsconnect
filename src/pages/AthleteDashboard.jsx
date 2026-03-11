// src/pages/AthleteDashboard.jsx

import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import AthleteNavbar from "../components/AthleteNavbar"
import DesktopSideNav from "../components/athlete-dashboard/TempDesktopSideNav"
import MobileBottomNav from "../components/athlete-dashboard/TempMobileBottomNav"
import RecruiterBanner from "../components/athlete-dashboard/TempRecruiterBanner"
import PostComposer from "../components/athlete-dashboard/TempPostComposer"
import PostCard from "../components/athlete-dashboard/TempPostCard"
import ProfileCard from "../components/athlete-dashboard/TempProfileCard"
import TrendingCard from "../components/athlete-dashboard/TempTrendingCard"
import WhoToFollow from "../components/athlete-dashboard/TempWhoToFollow"

// ── API 
import { getAthleteById, getCurrentUser, isLoggedIn } from "../../src/api/client"

// ── Theme 
const ACCENT = "#1DA8FF"

const THEME = {
  dark: {
    page: "#0D1117",
    border: "rgba(255,255,255,0.06)",
    text: "#F0F6FF",
    textMuted: "#4B5563",
  },
  light: {
    page: "#F0F4FA",
    border: "#E5E7EB",
    text: "#111827",
    textMuted: "#9CA3AF",
  }
}

const FEED_POSTS = [
  {
    id: 1,
    athlete: {
      name: "Kofi Mensah", handle: "@kofi_striker", sport: "Soccer",
      position: "Striker", school: "Achimota School", location: "Greater Accra",
      classOf: "2026", verified: true,
    },
    videoId: "-5oif_xAwyg",
    caption: "Hat-trick in the Inter-Schools finals 🔥 Scouts from Legon Cities were watching 👀 #Soccer #Ghana #Recruit",
    likes: 847, comments: 43, reposts: 91, views: "12.4k",
    timestamp: "2h ago", liked: false,
  },
  {
    id: 2,
    athlete: {
      name: "Ama Asante", handle: "@ama_track", sport: "Track & Field",
      position: "Sprinter", school: "Wesley Girls", location: "Central Region",
      classOf: "2025", verified: false,
    },
    videoId: "-5oif_xAwyg",
    caption: "New PB in the 100m — 11.4s 💨 Pushing every single day. College scouts, the door is open. #Sprint #Athletics",
    likes: 1203, comments: 76, reposts: 154, views: "28.1k",
    timestamp: "5h ago", liked: true,
  },
  {
    id: 3,
    athlete: {
      name: "Kwame Boateng", handle: "@kwame_hoops", sport: "Basketball",
      position: "Point Guard", school: "Prempeh College", location: "Ashanti Region",
      classOf: "2026", verified: true,
    },
    videoId: "-5oif_xAwyg",
    caption: "30pts, 9ast in last night's game 🏀 These handles aren't stopping anytime soon. #Basketball #Hoops",
    likes: 2100, comments: 188, reposts: 340, views: "41.7k",
    timestamp: "1d ago", liked: false,
  },
  {
    id: 4,
    athlete: {
      name: "Efua Darko", handle: "@efua_swims", sport: "Swimming",
      position: "Freestyle", school: "Ghana Intl School", location: "Greater Accra",
      classOf: "2025", verified: false,
    },
    videoId: "-5oif_xAwyg",
    caption: "Broke the school record in the 200m freestyle today 🏊‍♀️ Every lap is a step closer to my dream. #Swimming #Recruit",
    likes: 567, comments: 29, reposts: 61, views: "8.9k",
    timestamp: "1d ago", liked: false,
  },
]

// ── Dashboard 
export default function AthleteDashboard() {
  const navigate = useNavigate()
  const [dark, setDark] = useState(false)
  const [activeTab, setActive] = useState("home")
  const [feedFilter, setFilter] = useState("all")

  // Real user state
  const [currentUser, setCurrentUser] = useState(null)
  const [athleteProfile, setAthleteProfile] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(true)

  const tk = dark ? THEME.dark : THEME.light


  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/signin")
      return
    }

    const user = getCurrentUser()
    if (user?.role === "recruiter") {
      navigate("/recruiterdashboard")
      return
    }

    setCurrentUser(user)

    // Fetch full athlete profile
    const fetchProfile = async () => {
      try {
        const { data } = await getAthleteById(user.id)
        setAthleteProfile(data.profile)
      } catch (err) {
        if (err.response?.status !== 404) {
          toast.error("Failed to load profile")
        }
      } finally {
        setLoadingProfile(false)
      }
    }

    fetchProfile()
  }, [navigate])

  const profileCardUser = currentUser ? {
    name: `${currentUser.firstName} ${currentUser.lastName}`,
    handle: athleteProfile?.handle || `@${currentUser.firstName.toLowerCase()}`,
    sport: athleteProfile?.sport || "—",
    position: athleteProfile?.position || "—",
    school: athleteProfile?.school || "—",
    location: athleteProfile?.region || "—",
    classOf: athleteProfile?.classOf || "—",
    height: athleteProfile?.height || "—",
    gpa: athleteProfile?.gpa || "—",
    achievements: athleteProfile?.achievements?.map(a => a.title) || [],
    followers: athleteProfile?.followers || 0,
    following: athleteProfile?.following || 0,
    views: athleteProfile?.profileViews
      ? athleteProfile.profileViews >= 1000
        ? `${(athleteProfile.profileViews / 1000).toFixed(1)}k`
        : String(athleteProfile.profileViews)
      : "0",
    verified: athleteProfile?.verified || false,
  } : null

  // ── Feed filter
  const filters = ["all", "Soccer", "Basketball", "Track & Field", "Swimming"]
  const filtered = feedFilter === "all"
    ? FEED_POSTS
    : FEED_POSTS.filter(p => p.athlete.sport === feedFilter)

  // ── Loading state 
  if (loadingProfile) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: tk.page, fontFamily: "'DM Sans','Segoe UI',sans-serif" }}
      >
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Bebas+Neue&display=swap');
        @keyframes pulse-ring {
          0%   { transform: scale(0.85); opacity: 0.6; }
          50%  { transform: scale(1.05); opacity: 1;   }
          100% { transform: scale(0.85); opacity: 0.6; }
        }
        @keyframes fade-up {
          0%   { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0);    }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .logo-pulse   { animation: pulse-ring 2s ease-in-out infinite; }
        .fade-up      { animation: fade-up 0.6s ease forwards; }
        .shimmer-text {
          background: linear-gradient(90deg, #1DA8FF 0%, #ffffff 40%, #1DA8FF 80%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 2.5s linear infinite;
        }
        .dot-bounce {
          display: inline-block;
          animation: dot-bounce 1.4s ease-in-out infinite;
        }
        .dot-bounce:nth-child(2) { animation-delay: 0.2s; }
        .dot-bounce:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dot-bounce {
          0%, 80%, 100% { transform: translateY(0);    opacity: 0.4; }
          40%            { transform: translateY(-6px); opacity: 1;   }
        }
      `}</style>
        {/* Brand name */}
        <div className="fade-up text-center" style={{ animationDelay: "10s" }}>
          <h1
            className="shimmer-text font-black text-2xl tracking-wide mb-1"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em" }}
          >
            SPORTSCONNECT
          </h1>
          {/*  */}
        </div>

        {/* Loading dots */}
        <div className="fade-up flex items-center gap-1" style={{ animationDelay: "10s" }}>
          <span className="dot-bounce w-2 h-2 rounded-full inline-block"
            style={{ background: ACCENT }} />
          <span className="dot-bounce w-2 h-2 rounded-full inline-block"
            style={{ background: ACCENT }} />
          <span className="dot-bounce w-2 h-2 rounded-full inline-block"
            style={{ background: ACCENT }} />
        </div>

        {/* Loading text */}
        <p className="fade-up text-xs mt-3" style={{ color: tk.textMuted, animationDelay: "10s" }}>
          Loading your dashboard...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen transition-colors duration-300"
      style={{ background: tk.page, fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Bebas+Neue&display=swap');`}</style>

      {/* 1. NAVBAR */}
      <AthleteNavbar dark={dark} toggleDark={() => setDark(!dark)} />

      <div className="max-w-6xl mx-auto flex lg:gap-6 lg:px-4">

        {/* 2. LEFT SIDEBAR */}
        <div className="lg:w-52 xl:w-60 flex-shrink-0">
          <DesktopSideNav active={activeTab} setActive={setActive} dark={dark} />
        </div>

        {/* 3. MAIN FEED */}
        <main className="flex-1 min-w-0"
          style={{ borderLeft: `1px solid ${tk.border}`, borderRight: `1px solid ${tk.border}` }}>

          {/* Sticky filter bar */}
          <div className="sticky top-14 sm:top-16 z-30 backdrop-blur-xl"
            style={{
              background: dark ? "rgba(13,17,23,.95)" : "rgba(255,255,255,.95)",
              borderBottom: `1px solid ${tk.border}`,
            }}>
            <div className="px-4 pt-3 pb-1">
              {/* Greeting with real name */}
              <h1 className="font-black text-lg" style={{ color: tk.text }}>
                {currentUser
                  ? `Welcome, ${currentUser.firstName} 👋`
                  : "Home"}
              </h1>
            </div>
            <div className="flex gap-1.5 px-4 pb-2.5 pt-1 overflow-x-auto"
              style={{ scrollbarWidth: "none" }}>
              {filters.map(f => {
                const isActive = feedFilter === f
                return (
                  <button key={f} onClick={() => setFilter(f)}
                    className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold transition-all border"
                    style={{
                      background: isActive ? ACCENT : "transparent",
                      color: isActive ? "#fff" : tk.textMuted,
                      borderColor: isActive ? ACCENT : tk.border,
                    }}>
                    {f === "all" ? "All Sports" : f}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 4. RECRUITER BANNER */}
          <RecruiterBanner dark={dark} />

          {/* 5. POST COMPOSER */}
          <PostComposer dark={dark} user={profileCardUser} />

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
          className="hidden xl:flex flex-col gap-4 w-72 flex-shrink-0 pt-4"
          style={{
            position: "sticky",
            top: "4rem",
            height: "calc(100vh - 4rem)",
            overflowY: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            paddingBottom: "2rem",
            alignSelf: "flex-start",
          }}
        >
          {profileCardUser
            ? <ProfileCard user={profileCardUser} dark={dark} />
            : (
              <div className="rounded-2xl p-4 animate-pulse"
                style={{ background: tk.border, height: 200 }} />
            )
          }
          <TrendingCard dark={dark} />
          <WhoToFollow dark={dark} />
        </aside>
      </div>

      {/* 8. MOBILE BOTTOM NAV */}
      <MobileBottomNav active={activeTab} setActive={setActive} dark={dark} />
    </div>
  )
}