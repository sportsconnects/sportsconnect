// src/components/athlete-dashboard/TempPostCard.jsx

import { useState } from "react"
import {
  Heart, MessageCircle, Share2, MoreHorizontal,
  MapPin, GraduationCap, Eye, Play, X, Send, Trash2
} from "lucide-react"
import SportBadge from "./TempSportsBadge"
import Avatar from "./TempAvatar"
import { commentOnPost, sharePost, deletePost, getCurrentUser } from "../../api/client"
import { toast } from "sonner"

const THEME = {
  dark: {
    border:     "rgba(255,255,255,0.06)",
    text:       "#F0F6FF",
    textSub:    "#9CA3AF",
    textMuted:  "#4B5563",
    hover:      "rgba(255,255,255,0.025)",
    surface:    "#161B22",
    page:       "#0D1117",
  },
  light: {
    border:     "#E5E7EB",
    text:       "#111827",
    textSub:    "#6B7280",
    textMuted:  "#9CA3AF",
    hover:      "rgba(0,0,0,0.025)",
    surface:    "#FFFFFF",
    page:       "#F0F4FA",
  }
}

const ACCENT = "#1DA8FF"
const fmt = n => n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n ?? 0)

// ─────────────────────────────────────────────────────────────────────────────
// SHARE MODAL
// ─────────────────────────────────────────────────────────────────────────────
function ShareModal({ post, dark, onClose, onShared }) {
  const tk = dark ? THEME.dark : THEME.light
  const [caption, setCaption]   = useState("")
  const [sharing, setSharing]   = useState(false)

  const handleShare = async () => {
    setSharing(true)
    try {
      await sharePost(post._id, caption)
      onShared()
      toast.success("Post shared!")
      onClose()
    } catch {
      toast.error("Failed to share post")
    } finally {
      setSharing(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden"
        style={{ background: tk.surface, border: `1px solid ${tk.border}`, boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }}
      >
        <div className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: `1px solid ${tk.border}` }}>
          <p className="font-black text-sm" style={{ color: tk.text }}>Share Post</p>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ color: tk.textMuted, background: tk.hover }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Original preview */}
        <div className="mx-4 my-3 p-3 rounded-xl"
          style={{ background: tk.page, border: `1px solid ${tk.border}` }}>
          <p className="text-xs font-bold mb-1" style={{ color: ACCENT }}>
            {post.author?.firstName} {post.author?.lastName}
          </p>
          <p className="text-xs leading-relaxed line-clamp-2" style={{ color: tk.textSub }}>
            {post.caption || "Video highlight"}
          </p>
        </div>

        <div className="px-4 pb-4">
          <textarea
            value={caption}
            onChange={e => setCaption(e.target.value)}
            placeholder="Add your thoughts... (optional)"
            rows={2}
            autoFocus
            className="w-full bg-transparent text-sm outline-none resize-none leading-relaxed mb-3 px-3 py-2 rounded-xl"
            style={{ color: tk.text, background: tk.page, border: `1px solid ${tk.border}` }}
          />
          <button
            onClick={handleShare}
            disabled={sharing}
            className="w-full py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50"
            style={{ background: `linear-gradient(135deg,${ACCENT},#1a8fd1)` }}
          >
            {sharing ? "Sharing..." : "Share Now"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN POST CARD
// ─────────────────────────────────────────────────────────────────────────────
export default function PostCard({ post, dark, onLike, onDelete }) {
  const tk = dark ? THEME.dark : THEME.light

  // ── Use props as source of truth — NO internal liked/likes state
  // Parent controls these via optimistic updates
  const [playing,      setPlaying]     = useState(false)
  const [showComments, setShowCom]     = useState(false)
  const [showShare,    setShowShare]   = useState(false)
  const [showMenu,     setShowMenu]    = useState(false)
  const [comments,     setComments]    = useState(post.comments || [])
  const [commentsCount,setComCount]    = useState(post.commentsCount ?? post.comments?.length ?? 0)
  const [commentText,  setComText]     = useState("")
  const [submitting,   setSubmitting]  = useState(false)
  const [shares,       setShares]      = useState(post.shares || 0)
  const [deleting,     setDeleting]    = useState(false)

  const currentUser = getCurrentUser()
  const currentUserId = currentUser?._id || currentUser?.id
  const authorId = post.author?.id || post.author?._id
  const isOwn = authorId?.toString() === currentUserId?.toString()
  const isRecruiter = post.author?.role === "recruiter"

  const authorName = `${post.author?.firstName || ""} ${post.author?.lastName || ""}`.trim()

  // ── Comment
  const handleComment = async () => {
    if (!commentText.trim() || submitting) return
    setSubmitting(true)
    try {
      const { data } = await commentOnPost(post._id, commentText.trim())
      setComments(prev => [...prev, data.comment])
      setComCount(data.commentsCount)
      setComText("")
    } catch {
      toast.error("Failed to post comment")
    } finally {
      setSubmitting(false)
    }
  }

  // ── Share
  const handleShared = () => {
    setShares(s => s + 1)
  }

  // ── Delete
  const handleDelete = async () => {
    if (deleting) return
    setDeleting(true)
    try {
      await deletePost(post._id)
      onDelete?.(post._id)
      toast.success("Post deleted")
    } catch {
      toast.error("Failed to delete post")
      setDeleting(false)
    }
  }

  return (
    <article
      className="px-4 py-4 transition-colors"
      style={{ borderBottom: `1px solid ${tk.border}` }}
      onMouseEnter={e => e.currentTarget.style.background = tk.hover}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      {/* Shared from banner */}
      {post.sharedFrom && (
        <div className="flex items-center gap-1.5 mb-2">
          <Share2 className="w-3 h-3 flex-shrink-0" style={{ color: tk.textMuted }} />
          <p className="text-xs" style={{ color: tk.textMuted }}>
            Shared from{" "}
            <span className="font-semibold" style={{ color: tk.textSub }}>
              {post.sharedFrom.authorName}
            </span>
          </p>
        </div>
      )}

      {/* Looking for badge (recruiter posts) */}
      {post.lookingFor && (
        <div className="mb-2">
          <span
            className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ background: "rgba(245,158,11,0.12)", color: "#F59E0B" }}
          >
            🔍 Looking for: {post.lookingFor}
          </span>
        </div>
      )}

      <div className="flex gap-3">
        <Avatar name={authorName} size={40} />

        <div className="flex-1 min-w-0">

          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-sm" style={{ color: tk.text }}>{authorName}</span>
                {post.author?.verified && (
                  <span style={{ color: ACCENT }} className="text-xs">✦</span>
                )}
                {isRecruiter ? (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                    style={{ background: "rgba(245,158,11,0.12)", color: "#F59E0B" }}
                  >
                    Scout
                  </span>
                ) : (
                  <SportBadge sport={post.author?.sport} />
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-0.5">
                {isRecruiter ? (
                  <span className="text-xs" style={{ color: tk.textMuted }}>
                    {post.author?.position} · {post.author?.school}
                  </span>
                ) : (
                  <>
                    <span className="text-xs flex items-center gap-1" style={{ color: tk.textMuted }}>
                      <GraduationCap className="w-3 h-3" />{post.author?.school}
                    </span>
                    <span className="text-xs flex items-center gap-1" style={{ color: tk.textMuted }}>
                      <MapPin className="w-3 h-3" />{post.author?.region || post.author?.location}
                    </span>
                  </>
                )}
                <span className="text-xs" style={{ color: tk.textMuted }}>
                  {post.createdAt
                    ? new Date(post.createdAt).toLocaleDateString("en-GB", { day:"numeric", month:"short" })
                    : ""}
                </span>
              </div>
            </div>

            {/* Three-dot menu — only for own posts */}
            {isOwn && (
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setShowMenu(s => !s)}
                  className="transition-colors"
                  style={{ color: tk.textMuted }}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                {showMenu && (
                  <div
                    className="absolute top-6 right-0 z-30 rounded-xl overflow-hidden min-w-[140px]"
                    style={{ background: tk.surface, border: `1px solid ${tk.border}`, boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}
                  >
                    <button
                      onClick={() => { setShowMenu(false); handleDelete() }}
                      disabled={deleting}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-left"
                      style={{ color: "#EF4444" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {deleting ? "Deleting..." : "Delete Post"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Caption */}
          {post.caption && (
            <p className="text-sm mt-2 leading-relaxed" style={{ color: tk.textSub }}>
              {post.caption}
            </p>
          )}

          {/* Shared original caption preview */}
          {post.sharedFrom?.originalCaption && (
            <div
              className="mt-2 p-2.5 rounded-xl"
              style={{ background: tk.page, border: `1px solid ${tk.border}` }}
            >
              <p className="text-xs leading-relaxed line-clamp-2" style={{ color: tk.textSub }}>
                {post.sharedFrom.originalCaption}
              </p>
            </div>
          )}

          {/* Video */}
          {post.videoId && (
            <div
              className="mt-3 rounded-2xl overflow-hidden bg-black relative group"
              style={{ aspectRatio: "16/9" }}
            >
              {!playing ? (
                <div
                  className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center cursor-pointer relative"
                  onClick={() => setPlaying(true)}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center z-10 transition-transform group-hover:scale-110">
                    <Play className="w-6 h-6 text-white fill-white ml-1" />
                  </div>
                  <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 text-white/80 text-xs">
                    <Eye className="w-3 h-3" />{post.views || 0} views
                  </div>
                  {post.author?.sport && !isRecruiter && (
                    <div className="absolute top-3 right-3 z-10">
                      <SportBadge sport={post.author.sport} />
                    </div>
                  )}
                  {post.videoTitle && (
                    <div className="absolute bottom-3 right-3 z-10">
                      <span className="bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-xs font-medium">
                        {post.videoTitle}
                      </span>
                    </div>
                  )}
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
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-3 max-w-xs">

            {/* Like */}
            <button
              onClick={() => onLike?.(post._id)}
              className="flex items-center gap-1.5 text-xs transition-colors group"
              style={{ color: post.liked ? "#EC4899" : tk.textMuted }}
              onMouseEnter={e => e.currentTarget.style.color = "#EC4899"}
              onMouseLeave={e => e.currentTarget.style.color = post.liked ? "#EC4899" : tk.textMuted}
            >
              <Heart className={`w-4 h-4 transition-all group-hover:scale-125 ${post.liked ? "fill-pink-500" : ""}`} />
              <span>{fmt(post.likes)}</span>
            </button>

            {/* Comment */}
            <button
              onClick={() => setShowCom(s => !s)}
              className="flex items-center gap-1.5 text-xs transition-colors group"
              style={{ color: showComments ? ACCENT : tk.textMuted }}
              onMouseEnter={e => e.currentTarget.style.color = ACCENT}
              onMouseLeave={e => e.currentTarget.style.color = showComments ? ACCENT : tk.textMuted}
            >
              <MessageCircle className="w-4 h-4 group-hover:scale-125 transition-transform" />
              <span>{fmt(commentsCount)}</span>
            </button>

            {/* Share */}
            <button
              onClick={() => setShowShare(true)}
              className="flex items-center gap-1.5 text-xs transition-colors group"
              style={{ color: tk.textMuted }}
              onMouseEnter={e => e.currentTarget.style.color = "#10B981"}
              onMouseLeave={e => e.currentTarget.style.color = tk.textMuted}
            >
              <Share2 className="w-4 h-4 group-hover:scale-125 transition-transform" />
              {shares > 0 && <span>{fmt(shares)}</span>}
            </button>

          </div>

          {/* Comments section */}
          {showComments && (
            <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${tk.border}` }}>
              {comments.slice(-3).map((c, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <Avatar
                    name={c.user?.firstName ? `${c.user.firstName} ${c.user.lastName}` : "U"}
                    size={24}
                  />
                  <div className="flex-1 min-w-0 px-2.5 py-1.5 rounded-xl" style={{ background: tk.hover }}>
                    <span className="text-xs font-bold mr-1.5" style={{ color: tk.text }}>
                      {c.user?.firstName} {c.user?.lastName}
                      {c.user?.role === "recruiter" && (
                        <span className="ml-1 font-normal" style={{ color: "#F59E0B" }}>· Scout</span>
                      )}
                    </span>
                    <span className="text-xs" style={{ color: tk.textSub }}>{c.text}</span>
                  </div>
                </div>
              ))}

              {/* Comment input */}
              <div className="flex gap-2 mt-2">
                <div
                  className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{ background: tk.hover, border: `1px solid ${tk.border}` }}
                >
                  <input
                    value={commentText}
                    onChange={e => setComText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleComment()}
                    placeholder="Write a comment..."
                    className="flex-1 bg-transparent text-xs outline-none"
                    style={{ color: tk.text }}
                  />
                  {commentText && (
                    <button onClick={() => setComText("")} style={{ color: tk.textMuted }}>
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <button
                  onClick={handleComment}
                  disabled={!commentText.trim() || submitting}
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    background: commentText.trim() ? ACCENT : tk.hover,
                    color:      commentText.trim() ? "#fff"  : tk.textMuted,
                  }}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share modal */}
      {showShare && (
        <ShareModal
          post={post}
          dark={dark}
          onClose={() => setShowShare(false)}
          onShared={handleShared}
        />
      )}
    </article>
  )
}