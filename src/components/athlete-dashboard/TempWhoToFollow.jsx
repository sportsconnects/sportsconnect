// src/components/athlete-dashboard/TempWhoToFollow.jsx

import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import { Link } from "react-router"
import SportBadge from "./TempSportsBadge"
import Avatar from "./TempAvatar"
import { getAthletes, toggleFollow, getCurrentUser } from "../../api/client"

const THEME = {
  dark: {
    surface:   "#161B22",
    border:    "rgba(255,255,255,0.06)",
    text:      "#F0F6FF",
    textMuted: "#4B5563",
    hover:     "rgba(255,255,255,0.03)",
  },
  light: {
    surface:   "#FFFFFF",
    border:    "#E5E7EB",
    text:      "#111827",
    textMuted: "#9CA3AF",
    hover:     "#F9FAFB",
  }
}

const ACCENT = "#1DA8FF"

// Full name from whatever shape the API returns
function extractName(athlete) {
  if (athlete.firstName && athlete.lastName)
    return `${athlete.firstName} ${athlete.lastName}`
  if (athlete.user?.firstName && athlete.user?.lastName)
    return `${athlete.user.firstName} ${athlete.user.lastName}`
  if (athlete.name) return athlete.name
  return "Athlete"
}

// ID for profile page links (/athlete/:id) — the AthleteProfile _id
function extractId(athlete) {
  return athlete._id || athlete.id || athlete.user?._id || athlete.user?.id
}

// ID for the follow API — must be the User._id, not AthleteProfile._id
function extractUserId(athlete) {
  if (athlete.user?._id) return athlete.user._id
  if (athlete.user?.id)  return athlete.user.id
  return athlete._id || athlete.id
}

function extractProfile(athlete) {
  return athlete.profile || athlete
}

export default function WhoToFollow({ dark }) {
  const tk = dark ? THEME.dark : THEME.light

  const [athletes, setAthletes]           = useState([])
  const [loading, setLoading]             = useState(true)
  const [followed, setFollowed]           = useState({})
  const [followLoading, setFollowLoading] = useState({})

  const currentUser   = getCurrentUser()
  const currentUserId = currentUser?._id || currentUser?.id

  useEffect(() => {
    getAthletes({ limit: 6 })
      .then(({ data }) => {
        const raw = data.athletes || data.users || data || []

        // Filter out the currently logged-in user — check both id locations
        const filtered = raw.filter(a => {
          const uid = extractUserId(a)
          const pid = extractId(a)
          return uid !== currentUserId && pid !== currentUserId
        }).slice(0, 3)

        setAthletes(filtered)

        // Seed follow state if API returns isFollowing per athlete
        const initialFollowed = {}
        filtered.forEach(a => {
          const uid = extractUserId(a)
          if (a.isFollowing !== undefined) initialFollowed[uid] = a.isFollowing
        })
        setFollowed(initialFollowed)
      })
      .catch(() => setAthletes([]))
      .finally(() => setLoading(false))
  }, [])

  const handleFollow = async (userId) => {
    if (followLoading[userId]) return
    setFollowed(prev      => ({ ...prev, [userId]: !prev[userId] }))
    setFollowLoading(prev => ({ ...prev, [userId]: true }))
    try {
      await toggleFollow(userId)
    } catch {
      // Revert on failure
      setFollowed(prev => ({ ...prev, [userId]: !prev[userId] }))
    } finally {
      setFollowLoading(prev => ({ ...prev, [userId]: false }))
    }
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: tk.surface, border: `1px solid ${tk.border}` }}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-2"
        style={{ borderBottom: `1px solid ${tk.border}` }}>
        <Star className="w-4 h-4 text-amber-500" />
        <h3 className="font-bold text-sm" style={{ color: tk.text }}>Athletes to Watch</h3>
      </div>

      {/* Loading skeletons */}
      {loading && [0, 1, 2].map(i => (
        <div key={i} className="px-4 py-3 flex items-center gap-3 animate-pulse"
          style={{ borderBottom: `1px solid ${tk.border}` }}>
          <div className="w-8 h-8 rounded-full flex-shrink-0" style={{ background: tk.border }} />
          <div className="flex-1 space-y-1.5">
            <div className="h-2.5 rounded-full w-24" style={{ background: tk.border }} />
            <div className="h-2 rounded-full w-32"   style={{ background: tk.border }} />
          </div>
          <div className="w-14 h-6 rounded-full flex-shrink-0" style={{ background: tk.border }} />
        </div>
      ))}

      {/* Empty state */}
      {!loading && athletes.length === 0 && (
        <div className="px-4 py-6 text-center">
          <p className="text-xs" style={{ color: tk.textMuted }}>No suggestions yet</p>
        </div>
      )}

      {/* Athlete rows */}
      {!loading && athletes.map((athlete, i) => {
        const profileId  = extractId(athlete)      // for /athlete/:id link
        const userId     = extractUserId(athlete)  // for toggleFollow API call
        const name       = extractName(athlete)
        const profile    = extractProfile(athlete)
        const sport      = profile.sport  || "—"
        const school     = profile.school || "—"
        const handle     = profile.handle || `@${name.split(" ")[0].toLowerCase()}`
        const isFollowed = !!followed[userId]
        const isLoading  = !!followLoading[userId]
        const isLast     = i === athletes.length - 1

        return (
          <div
            key={profileId}
            className="px-4 py-3 flex items-center gap-3 transition-colors"
            style={{ borderBottom: isLast ? "none" : `1px solid ${tk.border}` }}
            onMouseEnter={e => e.currentTarget.style.background = tk.hover}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            {/* Avatar — links to profile page */}
            <Link to={`/athlete/${profileId}`} className="flex-shrink-0">
              <Avatar name={name} size={32} />
            </Link>

            {/* Info — links to profile page */}
            <Link to={`/athlete/${profileId}`} className="flex-1 min-w-0" style={{ textDecoration: "none" }}>
              <p className="text-xs font-semibold truncate" style={{ color: tk.text }}>{name}</p>
              <p className="text-xs truncate" style={{ color: tk.textMuted }}>
                {handle} · {school}
              </p>
              {sport !== "—" && (
                <div className="mt-0.5"><SportBadge sport={sport} /></div>
              )}
            </Link>

            {/* Follow button — uses userId not profileId */}
            <button
              onClick={() => handleFollow(userId)}
              disabled={isLoading}
              className="flex-shrink-0 rounded-full px-3 py-1 text-xs font-bold transition-all border"
              style={{
                background:  isFollowed ? ACCENT        : "transparent",
                borderColor: ACCENT,
                color:       isFollowed ? "#fff"        : ACCENT,
                opacity:     isLoading  ? 0.6           : 1,
                cursor:      isLoading  ? "not-allowed" : "pointer",
                minWidth:    "60px",
              }}
              onMouseEnter={e => {
                if (!isFollowed && !isLoading) {
                  e.currentTarget.style.background = ACCENT
                  e.currentTarget.style.color = "#fff"
                }
              }}
              onMouseLeave={e => {
                if (!isFollowed && !isLoading) {
                  e.currentTarget.style.background = "transparent"
                  e.currentTarget.style.color = ACCENT
                }
              }}
            >
              {isLoading ? "..." : isFollowed ? "Following" : "Follow"}
            </button>
          </div>
        )
      })}

      {/* See more */}
      {!loading && athletes.length > 0 && (
        <Link
          to="/athleteexplore"
          className="block px-4 py-2.5 text-xs font-semibold text-center transition-colors"
          style={{ color: ACCENT, borderTop: `1px solid ${tk.border}`, textDecoration: "none" }}
          onMouseEnter={e => e.currentTarget.style.background = tk.hover}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          See all athletes →
        </Link>
      )}
    </div>
  )
}