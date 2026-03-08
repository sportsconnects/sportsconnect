// src/components/PostCard.jsx

import { useState } from "react"
import { Heart, MessageCircle, Share2, Repeat2, MoreHorizontal, MapPin, GraduationCap, Eye, Play, Bookmark } from "lucide-react"
import SportBadge from "./TempSportsBadge"
import Avatar from "./TempAvatar"

const THEME = {
  dark: {
    border:      "rgba(255,255,255,0.06)",
    text:        "#F0F6FF",
    textSub:     "#9CA3AF",
    textMuted:   "#4B5563",
    hover:       "rgba(255,255,255,0.025)",
  },
  light: {
    border:      "#E5E7EB",
    text:        "#111827",
    textSub:     "#6B7280",
    textMuted:   "#9CA3AF",
    hover:       "rgba(0,0,0,0.025)",
  }
}

const ACCENT = "#1DA8FF"
const fmt = n => n >= 1000 ? (n / 1000).toFixed(1) + "k" : n

export default function PostCard({ post, dark }) {
  const [liked, setLiked]           = useState(post.liked)
  const [likes, setLikes]           = useState(post.likes)
  const [bookmarked, setBookmarked] = useState(false)
  const [playing, setPlaying]       = useState(false)
  const tk = dark ? THEME.dark : THEME.light

  const actions = [
    {
      action: () => { setLiked(!liked); setLikes(l => liked ? l - 1 : l + 1) },
      icon: <Heart className={`w-4 h-4 transition-all group-hover:scale-125 ${liked ? "fill-pink-500" : ""}`} />,
      count: fmt(likes),
      active: liked,
      activeColor: "#EC4899",
      hoverColor: "#EC4899",
    },
    {
      action: null,
      icon: <MessageCircle className="w-4 h-4 group-hover:scale-125 transition-transform" />,
      count: fmt(post.comments),
      active: false,
      hoverColor: ACCENT,
    },
    {
      action: null,
      icon: <Repeat2 className="w-4 h-4 group-hover:scale-125 transition-transform" />,
      count: fmt(post.reposts),
      active: false,
      hoverColor: "#10B981",
    },
    {
      action: () => setBookmarked(!bookmarked),
      icon: <Bookmark className={`w-4 h-4 group-hover:scale-125 transition-transform ${bookmarked ? "fill-[#1DA8FF]" : ""}`} />,
      count: null,
      active: bookmarked,
      activeColor: ACCENT,
      hoverColor: ACCENT,
    },
    {
      action: null,
      icon: <Share2 className="w-4 h-4 group-hover:scale-125 transition-transform" />,
      count: null,
      active: false,
      hoverColor: ACCENT,
    },
  ]

  return (
    <article
      className="px-4 py-4 transition-colors"
      style={{ borderBottom: `1px solid ${tk.border}` }}
      onMouseEnter={e => e.currentTarget.style.background = tk.hover}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      <div className="flex gap-3">
        <Avatar name={post.athlete.name} size={40} />

        <div className="flex-1 min-w-0">

          {/* ── Header ── */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">

              {/* Name + verified + sport */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-sm" style={{ color: tk.text }}>
                  {post.athlete.name}
                </span>
                {post.athlete.verified && (
                  <span style={{ color: ACCENT }} className="text-xs">✦</span>
                )}
                <SportBadge sport={post.athlete.sport} />
              </div>

              {/* Handle + timestamp */}
              <div className="flex flex-wrap items-center gap-2 mt-0.5">
                <span className="text-xs" style={{ color: tk.textMuted }}>{post.athlete.handle}</span>
                <span className="text-xs" style={{ color: tk.textMuted }}>·</span>
                <span className="text-xs" style={{ color: tk.textMuted }}>{post.timestamp}</span>
              </div>

              {/* School + location */}
              <div className="flex flex-wrap items-center gap-2 mt-0.5">
                <span className="text-xs flex items-center gap-1" style={{ color: tk.textMuted }}>
                  <GraduationCap className="w-3 h-3" />{post.athlete.school}
                </span>
                <span className="text-xs flex items-center gap-1" style={{ color: tk.textMuted }}>
                  <MapPin className="w-3 h-3" />{post.athlete.location}
                </span>
              </div>
            </div>

            <button className="flex-shrink-0 transition-colors" style={{ color: tk.textMuted }}>
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* ── Caption ── */}
          <p className="text-sm mt-2 leading-relaxed" style={{ color: tk.textSub }}>
            {post.caption}
          </p>

          {/* ── Video ── */}
          <div
            className="mt-3 rounded-2xl overflow-hidden bg-black relative group"
            style={{ aspectRatio: "16/9" }}
          >
            {!playing ? (
              <div
                className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center cursor-pointer relative"
                onClick={() => setPlaying(true)}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Play button */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center z-10 transition-transform group-hover:scale-110">
                  <Play className="w-6 h-6 text-white fill-white ml-1" />
                </div>

                {/* View count */}
                <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 text-white/80 text-xs">
                  <Eye className="w-3 h-3" />{post.views} views
                </div>

                {/* Sport badge */}
                <div className="absolute top-3 right-3 z-10">
                  <SportBadge sport={post.athlete.sport} />
                </div>

                {/* Position + class */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-xs font-medium">
                    {post.athlete.position} · Class of {post.athlete.classOf}
                  </span>
                </div>
              </div>
            ) : (
              <iframe
                src={`https://www.youtube.com/embed/${post.videoId}?autoplay=1&rel=0&modestbranding=1`}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            )}
          </div>

          {/* ── Actions ── */}
          <div className="flex items-center justify-between mt-3 max-w-xs">
            {actions.map((btn, i) => (
              <button
                key={i}
                onClick={btn.action}
                className="flex items-center gap-1.5 text-xs transition-colors group"
                style={{ color: btn.active ? (btn.activeColor || ACCENT) : tk.textMuted }}
                onMouseEnter={e => e.currentTarget.style.color = btn.hoverColor}
                onMouseLeave={e => e.currentTarget.style.color = btn.active ? (btn.activeColor || ACCENT) : tk.textMuted}
              >
                {btn.icon}
                {btn.count && <span>{btn.count}</span>}
              </button>
            ))}
          </div>

        </div>
      </div>
    </article>
  )
}