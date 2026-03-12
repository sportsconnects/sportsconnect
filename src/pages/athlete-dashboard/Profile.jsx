// src/pages/AthleteProfile.jsx

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router"
import { toast } from "sonner"
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
import { getAthleteById, getCurrentUser, isLoggedIn, getAthletePostsById, toggleFollow, getFollowStatus, getFollowers, getFollowing } from "../../api/client"

const ACCENT = "#1DA8FF"

const THEME = {
  dark: {
    page: "#0D1117", surface: "#161B22", surfaceHigh: "#1C2128",
    border: "rgba(255,255,255,0.06)", text: "#F0F6FF", textSub: "#9CA3AF",
    textMuted: "#4B5563", hover: "rgba(255,255,255,0.04)",
  },
  light: {
    page: "#F0F4FA", surface: "#FFFFFF", surfaceHigh: "#F8FAFC",
    border: "#E5E7EB", text: "#111827", textSub: "#6B7280",
    textMuted: "#9CA3AF", hover: "rgba(0,0,0,0.03)",
  }
}

const TABS = ["Overview", "Highlights", "Posts", "Achievements"]
const INTEREST_COLOR = {
  high: { bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)", color: "#10B981" },
  medium: { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)", color: "#F59E0B" },
}

// ── Highlight Card 
function HighlightCard({ clip, dark, featured }) {
  const [playing, setPlaying] = useState(false)
  const [liked, setLiked] = useState(false)
  const tk = dark ? THEME.dark : THEME.light
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
      {featured && <div className="h-0.5" style={{ background: `linear-gradient(90deg,${ACCENT},#6366F1)` }} />}
      <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
        {!playing ? (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center cursor-pointer relative group" onClick={() => setPlaying(true)}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            {featured && (
              <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(29,168,255,0.85)", color: "#fff" }}>
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
        <p className="text-sm font-semibold leading-snug mb-2" style={{ color: tk.text }}>{clip.title}</p>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs" style={{ color: tk.textMuted }}><Eye className="w-3 h-3" />{clip.views}</span>
          <button onClick={() => setLiked(!liked)} className="flex items-center gap-1 text-xs transition-colors" style={{ color: liked ? "#EC4899" : tk.textMuted }}>
            <Heart className={`w-3.5 h-3.5 ${liked ? "fill-pink-500" : ""}`} />{clip.likes + (liked ? 1 : 0)}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Stat Pill
function StatPill({ icon: Icon, label, value, dark }) {
  const tk = dark ? THEME.dark : THEME.light
  return (
    <div className="flex flex-col items-center gap-1 px-3 py-3 rounded-2xl" style={{ background: tk.surfaceHigh, border: `1px solid ${tk.border}` }}>
      <Icon className="w-4 h-4" style={{ color: ACCENT }} />
      <p className="font-black text-lg leading-none" style={{ color: tk.text }}>{value}</p>
      <p className="text-xs text-center leading-tight" style={{ color: tk.textMuted }}>{label}</p>
    </div>
  )
}

// ── Overview Tab 
function OverviewTab({ athlete, profile, dark }) {
  const tk = dark ? THEME.dark : THEME.light

  // Build stats from real profile data
  const stats = profile ? [
    { label: "GPA", value: profile.gpa || "—", icon: BookOpen },
    { label: "Class", value: profile.classOf || "—", icon: GraduationCap },
    { label: "Height", value: profile.height || "—", icon: Ruler },
    { label: "Sport", value: profile.sport || "—", icon: Trophy },
    { label: "Position", value: profile.position || "—", icon: Star },
    { label: "Views", value: profile.profileViews || 0, icon: Eye },
  ] : []

  const featuredHighlight = profile?.highlights?.find(h => h.featured) || profile?.highlights?.[0]

  return (
    <div className="space-y-6">
      {/* Stats */}
      {stats.length > 0 && (
        <div>
          <h3 className="font-black text-sm mb-3 flex items-center gap-2" style={{ color: tk.text }}>
            <TrendingUp className="w-4 h-4" style={{ color: ACCENT }} /> Profile Stats
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {stats.map(s => <StatPill key={s.label} {...s} dark={dark} />)}
          </div>
        </div>
      )}

      {/* Physical profile */}
      <div className="rounded-2xl p-4" style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
        <h3 className="font-black text-sm mb-3 flex items-center gap-2" style={{ color: tk.text }}>
          <Ruler className="w-4 h-4" style={{ color: ACCENT }} /> Physical Profile
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            ["Height", profile?.height || "—"],
            ["Weight", profile?.weight || "—"],
            ["Position", profile?.position || "—"],
            ["Class Of", profile?.classOf || "—"],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="text-xs mb-0.5" style={{ color: tk.textMuted }}>{k}</p>
              <p className="font-bold text-sm" style={{ color: tk.text }}>{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bio */}
      {profile?.bio && (
        <div className="rounded-2xl p-4" style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
          <h3 className="font-black text-sm mb-2 flex items-center gap-2" style={{ color: tk.text }}>
            <BookOpen className="w-4 h-4" style={{ color: ACCENT }} /> About
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: tk.textSub }}>{profile.bio}</p>
        </div>
      )}

      {/* Recruiter interest */}
      <div className="rounded-2xl p-4" style={{ background: "linear-gradient(135deg,rgba(29,168,255,0.07),rgba(99,102,241,0.07))", border: "1px solid rgba(29,168,255,0.2)" }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-black text-sm flex items-center gap-2" style={{ color: tk.text }}>
            <Flame className="w-4 h-4" style={{ color: "#10B981" }} /> Recruiter Interest
          </h3>
          <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}>
            {profile?.recruiterViews || 0} Scout Views
          </span>
        </div>
        {profile?.recruiterViews > 0 ? (
          <p className="text-sm" style={{ color: tk.textSub }}>
            Your profile has been viewed by <span className="font-bold" style={{ color: ACCENT }}>{profile.recruiterViews} scouts</span>. Keep updating your highlights to attract more interest.
          </p>
        ) : (
          <p className="text-sm" style={{ color: tk.textMuted }}>
            No recruiter views yet. Post highlights and complete your profile to attract scouts.
          </p>
        )}
      </div>

      {/* Featured highlight */}
      {featuredHighlight && (
        <div>
          <h3 className="font-black text-sm mb-3 flex items-center gap-2" style={{ color: tk.text }}>
            <Video className="w-4 h-4" style={{ color: ACCENT }} /> Featured Highlight
          </h3>
          <HighlightCard clip={featuredHighlight} dark={dark} featured />
        </div>
      )}
    </div>
  )
}

// ── Highlights Tab
function HighlightsTab({ profile, dark }) {
  const tk = dark ? THEME.dark : THEME.light
  const highlights = profile?.highlights || []

  if (highlights.length === 0) {
    return (
      <div className="py-16 text-center">
        <Video className="w-10 h-10 mx-auto mb-3" style={{ color: tk.textMuted }} />
        <p className="text-sm font-bold mb-1" style={{ color: tk.text }}>No highlights yet</p>
        <p className="text-xs" style={{ color: tk.textMuted }}>Post your first highlight to attract recruiters</p>
        <Link to="/athletepost"
          className="inline-block mt-4 px-4 py-2 rounded-xl text-sm font-bold text-white"
          style={{ background: ACCENT }}>
          Post Highlights
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {highlights.map((clip, i) => (
        <div key={clip._id || i} className="sc-card" style={{ animationDelay: `${i * 50}ms` }}>
          <HighlightCard clip={clip} dark={dark} featured={clip.featured} />
        </div>
      ))}
    </div>
  )
}

// ── Posts Tab — keep mock for now
function PostsTab({ athlete, dark, posts, loading }) {
  const tk = dark ? THEME.dark : THEME.light

  if (loading) {
    return <div className="py-16 text-center text-sm" style={{ color: tk.textMuted }}>Loading posts...</div>
  }

  if (!posts.length) {
    return (
      <div className="py-16 text-center">
        <Video className="w-10 h-10 mx-auto mb-3" style={{ color: tk.textMuted }} />
        <p className="text-sm font-bold mb-1" style={{ color: tk.text }}>No posts yet</p>
        <p className="text-xs" style={{ color: tk.textMuted }}>Share your highlights to get noticed</p>
        <Link to="/athletepost"
          className="inline-block mt-4 px-4 py-2 rounded-xl text-sm font-bold text-white"
          style={{ background: ACCENT }}>
          Create Post
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {posts.map((post, i) => (
        <div key={post._id} className="rounded-2xl p-4 sc-card"
          style={{ background: tk.surface, border: `1px solid ${tk.border}`, animationDelay: `${i * 60}ms` }}>
          <div className="flex items-center gap-3 mb-3">
            <Avatar name={athlete?.name || "Athlete"} size={36} />
            <div>
              <div className="flex items-center gap-1.5">
                <p className="font-bold text-sm" style={{ color: tk.text }}>{athlete?.name}</p>
                {athlete?.verified && <span style={{ color: ACCENT }}>✦</span>}
              </div>
              <p className="text-xs" style={{ color: tk.textMuted }}>
                {post.createdAt ? new Date(post.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : ""}
              </p>
            </div>
          </div>
          {post.caption && (
            <p className="text-sm leading-relaxed mb-3" style={{ color: tk.textSub }}>{post.caption}</p>
          )}
          {post.videoId && (
            <div className="rounded-xl overflow-hidden mb-3" style={{ aspectRatio: "16/9" }}>
              <iframe
                src={`https://www.youtube.com/embed/${post.videoId}?rel=0&modestbranding=1`}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          )}
          <div className="flex items-center gap-4 pt-2" style={{ borderTop: `1px solid ${tk.border}` }}>
            <span className="flex items-center gap-1.5 text-xs" style={{ color: tk.textMuted }}>
              <Heart className="w-3.5 h-3.5" />{post.likes?.length ?? 0}
            </span>
            <span className="flex items-center gap-1.5 text-xs" style={{ color: tk.textMuted }}>
              <MessageCircle className="w-3.5 h-3.5" />{post.comments?.length ?? 0}
            </span>
            <span className="flex items-center gap-1.5 text-xs" style={{ color: tk.textMuted }}>
              <Eye className="w-3.5 h-3.5" />{post.views ?? 0}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Achievements Tab 
function AchievementsTab({ profile, dark }) {
  const tk = dark ? THEME.dark : THEME.light
  const achievements = profile?.achievements || []

  if (achievements.length === 0) {
    return (
      <div className="py-16 text-center">
        <Award className="w-10 h-10 mx-auto mb-3" style={{ color: tk.textMuted }} />
        <p className="text-sm font-bold mb-1" style={{ color: tk.text }}>No achievements yet</p>
        <p className="text-xs" style={{ color: tk.textMuted }}>Add achievements in your profile settings</p>
        <Link to="/athletesettings"
          className="inline-block mt-4 px-4 py-2 rounded-xl text-sm font-bold text-white"
          style={{ background: ACCENT }}>
          Edit Profile
        </Link>
      </div>
    )
  }

  const ACHIEVEMENT_COLORS = ["#F59E0B", "#10B981", "#1DA8FF", "#A855F7", "#F97316", "#06B6D4"]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {achievements.map((a, i) => {
        const color = ACHIEVEMENT_COLORS[i % ACHIEVEMENT_COLORS.length]
        return (
          <div key={a._id || i} className="flex items-center gap-4 rounded-2xl p-4 sc-card"
            style={{ background: tk.surface, border: `1px solid ${tk.border}`, animationDelay: `${i * 60}ms` }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
              🏆
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-sm leading-snug" style={{ color: tk.text }}>{a.title}</p>
              {a.year && (
                <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: tk.textMuted }}>
                  <Calendar className="w-3 h-3" />{a.year}
                </p>
              )}
            </div>
            <Award className="w-4 h-4 flex-shrink-0" style={{ color }} />
          </div>
        )
      })}
    </div>
  )
}

// ── Profile Header
function ProfileHeader({ athlete, profile, dark, isOwner, athleteId }) {
  const [following, setFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  const [followerCount, setFollowerCount] = useState(profile?.followers || 0)
  const [followingCount, setFollowingCount] = useState(profile?.following || 0)

  const tk = dark ? THEME.dark : THEME.light

  const name = athlete ? `${athlete.firstName} ${athlete.lastName}` : "Athlete"
  const handle = profile?.handle || `@${athlete?.firstName?.toLowerCase() || "athlete"}`
  const sport = profile?.sport || "—"
  const position = profile?.position || "—"
  const school = profile?.school || "—"
  const location = profile?.region || "—"
  const classOf = profile?.classOf || "—"
  const followers = profile?.followers || 0
  const following2 = profile?.following || 0
  const views = profile?.profileViews || 0
  const verified = profile?.verified || false
  const recruiterViews = profile?.recruiterViews || 0

  useEffect(() => {
    if (isOwner || !athleteId) return

    // Get follow status
    getFollowStatus(athleteId)
      .then(({ data }) => setFollowing(data.isFollowing))
      .catch(() => { })

    // Get real follower/following counts
    Promise.all([getFollowers(athleteId), getFollowing(athleteId)])
      .then(([f1, f2]) => {
        setFollowerCount(f1.data.count ?? f1.data.followers?.length ?? 0)
        setFollowingCount(f2.data.count ?? f2.data.following?.length ?? 0)
      })
      .catch(() => { })
  }, [athleteId, isOwner])

  const handleFollow = async () => {
    setFollowLoading(true)
    try {
      await toggleFollow(athleteId)
      setFollowing(prev => !prev)
      setFollowerCount(c => following ? c - 1 : c + 1)
    } catch {
      toast.error("Failed to update follow")
    } finally {
      setFollowLoading(false)
    }
  }

  return (
    <div className="relative mb-6">
      {/* Cover */}
      <div className="w-full overflow-hidden" style={{ height: 156 }}>
        <div className="w-full h-full relative" style={{ background: "linear-gradient(135deg,#0D1117 0%,#1a2744 40%,#0f2d4a 70%,#0D1117 100%)" }}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle,rgba(29,168,255,0.4) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,transparent 40%,rgba(0,0,0,0.6) 100%)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg,transparent,${ACCENT},transparent)` }} />
        </div>
      </div>

      <div className="px-4 sm:px-6">
        <div className="flex items-end justify-between -mt-12 mb-3 relative z-10">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-0.5" style={{ background: `linear-gradient(135deg,${ACCENT},#6366F1)` }}>
              <div className="w-full h-full rounded-xl overflow-hidden flex items-center justify-center" style={{ background: tk.surface }}>
                <Avatar name={name} size={88} />
              </div>
            </div>
            {verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center z-10"
                style={{ background: ACCENT, border: `3px solid ${tk.page}` }}>
                <span className="text-white font-bold" style={{ fontSize: 9 }}>✦</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pb-1">
            {isOwner ? (
              <Link to="/athletesettings"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold border transition-all"
                style={{ borderColor: ACCENT, color: ACCENT }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(29,168,255,0.08)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <Edit3 className="w-3.5 h-3.5" /> Edit Profile
              </Link>
            ) : (
              <>
                <button onClick={handleFollow} disabled={followLoading}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold border transition-all"
                  style={{ background: following ? "transparent" : ACCENT, color: following ? ACCENT : "#fff", borderColor: ACCENT }}>
                  <UserPlus className="w-3.5 h-3.5" />{following ? "Following" : "Follow"}
                </button>
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold border"
                  style={{ borderColor: tk.border, color: tk.textSub }}>
                  <MessageCircle className="w-3.5 h-3.5" /> Message
                </button>
              </>
            )}
            <button className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all"
              style={{ borderColor: tk.border, color: tk.textMuted }}
              onMouseEnter={e => e.currentTarget.style.borderColor = ACCENT}
              onMouseLeave={e => e.currentTarget.style.borderColor = tk.border}>
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="font-black text-xl sm:text-2xl" style={{ color: tk.text }}>{name}</h1>
            {verified && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(29,168,255,0.12)", color: ACCENT }}>
                ✦ Verified Athlete
              </span>
            )}
          </div>
          <p className="text-sm mb-2" style={{ color: tk.textMuted }}>{handle}</p>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <SportBadge sport={sport} />
            <span className="text-sm font-semibold" style={{ color: tk.textSub }}>{position}</span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span className="text-xs flex items-center gap-1" style={{ color: tk.textMuted }}><GraduationCap className="w-3.5 h-3.5" />{school}</span>
            <span className="text-xs flex items-center gap-1" style={{ color: tk.textMuted }}><MapPin className="w-3.5 h-3.5" />{location}</span>
            <span className="text-xs flex items-center gap-1" style={{ color: tk.textMuted }}><Calendar className="w-3.5 h-3.5" />Class of {classOf}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 py-3"
          style={{ borderTop: `1px solid ${tk.border}`, borderBottom: `1px solid ${tk.border}` }}>
          {[[followerCount, "Followers"], [followingCount, "Following"], [views, "Profile Views"]].map(([val, label]) => (
            <div key={label} className="text-center">
              <p className="font-black text-base sm:text-lg leading-none" style={{ color: tk.text }}>{val}</p>
              <p className="text-xs mt-0.5" style={{ color: tk.textMuted }}>{label}</p>
            </div>
          ))}
          <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full border"
            style={{ background: "rgba(16,185,129,0.1)", borderColor: "rgba(16,185,129,0.3)" }}>
            <Flame className="w-3.5 h-3.5" style={{ color: "#10B981" }} />
            <span className="text-xs font-bold" style={{ color: "#10B981" }}>{recruiterViews} Scout Views</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Page 
export default function AthleteProfile() {
  const navigate = useNavigate()
  const [dark, setDark] = useState(false)
  const [activeTab, setActive] = useState("profile")
  const [profileTab, setProfileTab] = useState("Overview")

  // Real data state
  const [currentUser, setCurrentUser] = useState(null)
  const [athleteProfile, setAthleteProfile] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [posts, setPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(false)

  const tk = dark ? THEME.dark : THEME.light

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/signin")
      return
    }

    const user = getCurrentUser()
    setCurrentUser(user)

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

    const fetchPosts = async () => {
      setLoadingPosts(true)
      try {
        const { data } = await getAthletePostsById(user.id)
        setPosts(data.posts || [])
      } catch {
        // non-critical, silently fail
      } finally {
        setLoadingPosts(false)
      }
    }
    fetchPosts()
  }, [navigate])

  // Build athlete object for components
  const athleteObj = currentUser ? {
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    name: `${currentUser.firstName} ${currentUser.lastName}`,
    email: currentUser.email,
    verified: athleteProfile?.verified || false,
  } : null


  const tabContent = {
    Overview: <OverviewTab athlete={athleteObj} profile={athleteProfile} dark={dark} />,
    Highlights: <HighlightsTab profile={athleteProfile} dark={dark} />,
    Posts: <PostsTab athlete={athleteObj} dark={dark} posts={posts} loading={loadingPosts} />,
    Achievements: <AchievementsTab profile={athleteProfile} dark={dark} />,
  }

  return (
    <div className="min-h-screen transition-colors duration-300"
      style={{ background: tk.page, fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
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

        <main className="flex-1 min-w-0 pb-28 lg:pb-12"
          style={{ borderLeft: `1px solid ${tk.border}`, borderRight: `1px solid ${tk.border}` }}>

          <ProfileHeader
            athlete={athleteObj}
            profile={athleteProfile}
            dark={dark}
            isOwner={true}
            athleteId={currentUser?.id}
          />

          <div className="px-4 sm:px-6">
            <div className="flex gap-1 mb-6 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {TABS.map(tab => {
                const active = profileTab === tab
                return (
                  <button key={tab} onClick={() => setProfileTab(tab)}
                    className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all border"
                    style={{ background: active ? ACCENT : "transparent", color: active ? "#fff" : tk.textMuted, borderColor: active ? ACCENT : tk.border }}>
                    {tab}
                  </button>
                )
              })}
            </div>
            <div key={profileTab} className="sc-card pb-6">
              {tabContent[profileTab]}
            </div>
          </div>
        </main>
      </div>

      <MobileBottomNav active={activeTab} setActive={setActive} dark={dark} />
    </div>
  )
}