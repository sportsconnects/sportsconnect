// src/pages/AthleteDashboard.jsx

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router"
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
import { getAthleteById, getCurrentUser, isLoggedIn, getFeedPosts, likePost } from "../../src/api/client"
import { Sparkles, ChevronRight, Dumbbell, Activity, Trophy } from "lucide-react"

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


function SCCoachBanner({ dark, profile }) {
  const tk = dark ? THEME.dark : THEME.light
  const sport = profile?.sport || "your sport"
  const position = profile?.position || null

  return (
    <Link
      to="/athleteai"
      className="block mx-4 mb-3 xl:hidden rounded-2xl overflow-hidden transition-all"
      style={{ textDecoration: "none" }}
    >
      <div
        className="relative p-4"
        style={{
          background: "linear-gradient(135deg, #0D1F35 0%, #0A1628 50%, #0D1F35 100%)",
          border: "1px solid rgba(29,168,255,0.25)",
          borderRadius: "16px",
        }}
      >
        {/* Glow blob */}
        <div
          className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(29,168,255,0.15) 0%, transparent 70%)",
            transform: "translate(30%, -30%)",
          }}
        />

        {/* Top row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, rgba(29,168,255,0.3), rgba(99,102,241,0.3))",
                border: "1px solid rgba(29,168,255,0.4)",
              }}
            >
              <Sparkles className="w-4 h-4" style={{ color: ACCENT }} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-black" style={{ color: "#F0F6FF" }}>SC COACH</p>
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full font-black"
                  style={{ background: "rgba(16,185,129,0.15)", color: "#10B981", fontSize: 9 }}
                >
                  AI
                </span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#10B981", animation: "pulse 2s ease infinite" }}
                />
                <p className="text-xs" style={{ color: "#10B981", fontSize: 10 }}>
                  Ready to coach you
                </p>
              </div>
            </div>
          </div>

          <div
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${ACCENT}, #6366F1)`,
              color: "#fff",
            }}
          >
            Start
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* Main text */}
        <p className="text-sm font-bold mb-1" style={{ color: "#F0F6FF" }}>
          Get your personalized{" "}
          <span style={{ color: ACCENT }}>{sport}</span> plan
          {position ? (
            <> built for a <span style={{ color: "#A5B4FC" }}>{position}</span></>
          ) : null}
        </p>
        <p className="text-xs leading-relaxed mb-3" style={{ color: "#4B5563" }}>
          Drills, fitness programs, and recruiting tips — all tailored to your profile.
        </p>

        {/* Category pills */}
        <div className="flex gap-1.5">
          {[
            { icon: Dumbbell,  label: "Drills",     color: ACCENT        },
            { icon: Activity,  label: "Fitness",    color: "#10B981"     },
            { icon: Trophy,    label: "Recruiting", color: "#F59E0B"     },
          ].map(({ icon: Icon, label, color }) => (
            <div
              key={label}
              className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
              style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}
            >
              <Icon className="w-2.5 h-2.5" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </Link>
  )
}



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
  const [feedPosts, setFeedPosts] = useState([])
  const [feedLoading, setFeedLoading] = useState(true)

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

    const fetchFeed = async () => {
    try {
      const { data } = await getFeedPosts({ sport: feedFilter !== "all" ? feedFilter : undefined })
      setFeedPosts(data.posts)
    } catch (err) {
      toast.error("Failed to load feed")
    } finally {
      setFeedLoading(false)
    }
  }
  fetchFeed();
  }, [navigate])

  

  useEffect(() => {
    if (!currentUser) return
    setFeedLoading(true)
    getFeedPosts({ sport: feedFilter !== "all" ? feedFilter : undefined })
      .then(({ data }) => setFeedPosts(data.posts))
      .catch(() => toast.error("Failed to load feed"))
      .finally(() => setFeedLoading(false))
  }, [feedFilter])

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

  const handleLike = async (postId) => {
    // Optimistic update
    setFeedPosts(prev => prev.map(p =>
      p._id === postId
        ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
        : p
    ))
    try {
      await likePost(postId)
    } catch {
      // Revert on failure
      setFeedPosts(prev => prev.map(p =>
        p._id === postId
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      ))
      toast.error("Failed to like post")
    }
  }

  // ── Feed filter
  const filters = ["all", "Soccer", "Basketball", "Track & Field", "Swimming"]
  const filtered = feedPosts

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

          <SCCoachBanner dark={dark} profile={athleteProfile} />

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
              feedLoading
                ? <div className="px-4 py-16 text-center text-sm" style={{ color: tk.textMuted }}>Loading feed...</div>
                : filtered.map(post => (
                  <PostCard key={post._id} post={post} dark={dark} onLike={handleLike} />
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