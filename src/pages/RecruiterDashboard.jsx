// src/pages/RecruiterDashboard.jsx

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"
import RecruiterNavbar from "../components/RecruiterNavbar"
import {
  StatCard, SectionCard, AthleteRow, ActivityItem, FilterPill,
  RecruiterSideNav, ACCENT, ACCENT2, THEME, RAvatar, SportBadge
} from "../components/RecruiterUi"
import {
  Eye, Bookmark, Award, MessageCircle, Bell,
  Flame, Search, Clock, TrendingUp, X, GraduationCap,
  Trophy, MapPin, Play, Heart, MessageSquare, Share2,
  Send, ChevronDown, Users, Briefcase, Plus,
  Trash2
} from "lucide-react"
import RecruiterBottomNav from "../components/RecruiterBottomNav"
import {
  getCurrentUser, isLoggedIn,
  getRecruiterById, getAthletes,
  getShortlist, getOffers,
  startConversation, getFeedPosts,
  likePost, commentOnPost, sharePost, createPost, deletePost
} from "../api/client"

const SPORT_FILTERS = ["All Sports", "Soccer", "Basketball", "Track & Field", "Swimming", "Volleyball"]
const FEED_FILTERS = ["All", "Athletes", "Recruiters"]


// HELPERS
function formatTime(dateStr) {
  if (!dateStr) return ""
  const diff = (Date.now() - new Date(dateStr)) / 1000
  if (diff < 60) return "just now"
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d`
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
}


// POST COMPOSER — 
function PostComposer({ dark, currentUser, recruiterProfile, onPost }) {
  const tk = dark ? THEME.dark : THEME.light
  const [open, setOpen] = useState(false)
  const [caption, setCaption] = useState("")
  const [sport, setSport] = useState("")
  const [lookingFor, setLooking] = useState("")
  const [posting, setPosting] = useState(false)

  const name = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Recruiter"
  const initials = currentUser ? `${currentUser.firstName?.[0]}${currentUser.lastName?.[0]}`.toUpperCase() : "SC"
  const org = recruiterProfile?.organization || ""

  const handlePost = async () => {
    if (!caption.trim()) return toast.error("Write something first")
    setPosting(true)
    try {
      const { data } = await createPost({
        caption: caption.trim(),
        sport: sport || null,
        lookingFor: lookingFor || null,
      })
      onPost(data.post)
      setCaption("")
      setSport("")
      setLooking("")
      setOpen(false)
      toast.success("Posted!")
    } catch {
      toast.error("Failed to post")
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="rounded-2xl mb-4 overflow-hidden"
      style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
      {/* Collapsed state */}
      {!open ? (
        <div className="flex items-center gap-3 px-4 py-3.5 cursor-pointer"
          onClick={() => setOpen(true)}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
            style={{ background: `linear-gradient(135deg,${ACCENT},${ACCENT2})` }}>
            {initials}
          </div>
          <div className="flex-1 px-3 py-2 rounded-xl text-sm"
            style={{ background: tk.page, color: tk.textMuted, border: `1px solid ${tk.border}` }}>
            Share a scout update, position you're looking for...
          </div>
          <button
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white flex-shrink-0"
            style={{ background: `linear-gradient(135deg,${ACCENT},${ACCENT2})` }}>
            <Plus className="w-3.5 h-3.5" /> Post
          </button>
        </div>
      ) : (
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
              style={{ background: `linear-gradient(135deg,${ACCENT},${ACCENT2})` }}>
              {initials}
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: tk.text }}>{name}</p>
              {org && <p className="text-xs" style={{ color: tk.textMuted }}>{org}</p>}
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto"
              style={{ color: tk.textMuted }}>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Caption */}
          <textarea
            value={caption}
            onChange={e => setCaption(e.target.value)}
            placeholder="Share a scouting update, position you're looking to fill, or anything on your mind..."
            rows={3}
            autoFocus
            className="w-full bg-transparent text-sm outline-none resize-none leading-relaxed mb-3"
            style={{ color: tk.text }}
          />

          {/* Optional tags */}
          <div className="flex gap-2 mb-3 flex-wrap">
            <select
              value={sport}
              onChange={e => setSport(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-xl outline-none font-semibold"
              style={{ background: tk.page, border: `1px solid ${tk.border}`, color: tk.textSub }}
            >
              <option value="">Tag a sport</option>
              {["Soccer", "Basketball", "Track & Field", "Swimming", "Volleyball"].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <input
              value={lookingFor}
              onChange={e => setLooking(e.target.value)}
              placeholder="Looking for position (e.g. Striker)"
              className="text-xs px-3 py-1.5 rounded-xl outline-none flex-1 min-w-[140px]"
              style={{ background: tk.page, border: `1px solid ${tk.border}`, color: tk.text }}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2">
            <button onClick={() => setOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold border"
              style={{ borderColor: tk.border, color: tk.textMuted }}>
              Cancel
            </button>
            <button
              onClick={handlePost}
              disabled={!caption.trim() || posting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white disabled:opacity-50"
              style={{ background: `linear-gradient(135deg,${ACCENT},${ACCENT2})` }}>
              <Send className="w-3.5 h-3.5" />
              {posting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}


// COMMENT INPUT
function CommentInput({ dark, postId, currentUser, onComment }) {
  const tk = dark ? THEME.dark : THEME.light
  const [text, setText] = useState("")
  const [sending, setSending] = useState(false)
  const initials = currentUser
    ? `${currentUser.firstName?.[0]}${currentUser.lastName?.[0]}`.toUpperCase()
    : "SC"

  const handleSend = async () => {
    if (!text.trim() || sending) return
    setSending(true)
    try {
      const { data } = await commentOnPost(postId, text.trim())
      onComment(postId, data.comment, data.commentsCount)
      setText("")
    } catch {
      toast.error("Failed to add comment")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex items-center gap-2 px-4 pb-3">
      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
        style={{ background: `linear-gradient(135deg,${ACCENT},${ACCENT2})` }}>
        {initials}
      </div>
      <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-xl"
        style={{ background: tk.page, border: `1px solid ${tk.border}` }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") handleSend() }}
          placeholder="Add a comment..."
          className="flex-1 bg-transparent text-xs outline-none"
          style={{ color: tk.text }}
        />
        <button onClick={handleSend} disabled={!text.trim() || sending}>
          <Send className="w-3.5 h-3.5" style={{ color: text.trim() ? ACCENT : tk.textMuted }} />
        </button>
      </div>
    </div>
  )
}


// SHARE MODAL
function ShareModal({ dark, post, onClose, onShared }) {
  const tk = dark ? THEME.dark : THEME.light
  const [caption, setCaption] = useState("")
  const [sharing, setSharing] = useState(false)

  const handleShare = async () => {
    setSharing(true)
    try {
      await sharePost(post._id, caption)
      onShared(post._id)
      toast.success("Post shared!")
      onClose()
    } catch {
      toast.error("Failed to share post")
    } finally {
      setSharing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden"
        style={{ background: tk.surface, border: `1px solid ${tk.border}`, boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }}>
        <div className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: `1px solid ${tk.border}` }}>
          <p className="font-black text-sm" style={{ color: tk.text }}>Share Post</p>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ color: tk.textMuted, background: tk.hover }}>
            <X className="w-4 h-4" />
          </button>
        </div>
        {/* Original post preview */}
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
            style={{ background: `linear-gradient(135deg,${ACCENT},${ACCENT2})` }}>
            {sharing ? "Sharing..." : "Share Now"}
          </button>
        </div>
      </div>
    </div>
  )
}


// POST CARD
function FeedPostCard({ post, dark, currentUser, onLike, onComment, onShare, onDelete }) {
  const tk = dark ? THEME.dark : THEME.light
  const [playing, setPlaying] = useState(false)
  const [showComments, setShowCom] = useState(false)
  const [showShare, setShowShare] = useState(false)

  const authorName = `${post.author?.firstName} ${post.author?.lastName}`
  const isRecruiter = post.author?.role === "recruiter"
  const isLookingFor = !!post.lookingFor

  const isOwn = (post.author?.id || post.author?._id)?.toString() ===
    (currentUser?._id || currentUser?.id)?.toString()

  return (
    <div className="mb-4 rounded-2xl overflow-hidden"
      style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>

      {/* Looking-for badge for recruiter posts */}
      {isLookingFor && (
        <div className="px-4 pt-3 pb-0">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ background: `${ACCENT}15`, color: ACCENT }}>
            <Search className="w-3 h-3" /> Looking for: {post.lookingFor}
          </span>
        </div>
      )}

      {/* Shared from banner */}
      {post.sharedFrom && (
        <div className="flex items-center gap-2 px-4 pt-3 pb-1">
          <Share2 className="w-3 h-3 flex-shrink-0" style={{ color: tk.textMuted }} />
          <p className="text-xs" style={{ color: tk.textMuted }}>
            Shared from <span className="font-semibold" style={{ color: tk.textSub }}>
              {post.sharedFrom.authorName}
            </span>
          </p>
        </div>
      )}

      {/* Author header */}
      <div className="flex items-center gap-3 px-4 pt-3 pb-2">
        <RAvatar name={authorName} size={38} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-sm font-bold" style={{ color: tk.text }}>{authorName}</p>
            {post.author?.verified && <span style={{ color: "#1DA8FF", fontSize: 10 }}>✦</span>}
            {isRecruiter && (
              <span className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                style={{ background: `${ACCENT}15`, color: ACCENT }}>Scout</span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {isRecruiter ? (
              <p className="text-xs" style={{ color: tk.textMuted }}>
                {post.author?.position} · {post.author?.school}
              </p>
            ) : (
              <p className="text-xs" style={{ color: tk.textMuted }}>
                {post.author?.position} · {post.author?.sport}
              </p>
            )}
            {post.sport && <SportBadge sport={post.sport} />}
            <span className="text-xs" style={{ color: tk.textMuted }}>{formatTime(post.createdAt)}</span>
          </div>
        </div>

        {isOwn && (
          <button
            onClick={() => onDelete(post._id)}
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
            style={{ color: tk.textMuted }}
            onMouseEnter={e => { e.currentTarget.style.color = "#EF4444"; e.currentTarget.style.background = "rgba(239,68,68,0.08)" }}
            onMouseLeave={e => { e.currentTarget.style.color = tk.textMuted; e.currentTarget.style.background = "transparent" }}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Caption */}
      {post.caption && (
        <p className="px-4 pb-2 text-sm leading-relaxed" style={{ color: tk.text }}>
          {post.caption}
        </p>
      )}

      {/* Shared post original caption preview */}
      {post.sharedFrom?.originalCaption && (
        <div className="mx-4 mb-2 p-3 rounded-xl"
          style={{ background: tk.page, border: `1px solid ${tk.border}` }}>
          <p className="text-xs leading-relaxed line-clamp-2" style={{ color: tk.textSub }}>
            {post.sharedFrom.originalCaption}
          </p>
        </div>
      )}

      {/* Video */}
      {post.videoId && (
        <div className="mx-4 mb-2 rounded-xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
          {!playing ? (
            <div
              className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center cursor-pointer relative group"
              onClick={() => setPlaying(true)}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center z-10 group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
              </div>
              {post.videoTitle && (
                <p className="absolute bottom-2 left-3 z-10 text-white text-xs font-semibold">
                  {post.videoTitle}
                </p>
              )}
            </div>
          ) : (
            <iframe
              src={`https://www.youtube.com/embed/${post.videoId}?autoplay=1&rel=0`}
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          )}
        </div>
      )}

      {/* Stats row */}
      {/* <div className="flex items-center gap-4 px-4 py-1.5"
        style={{ borderTop: `1px solid ${tk.border}` }}>
        <span className="text-xs" style={{ color: tk.textMuted }}>{post.likes} likes</span>
        <span className="text-xs" style={{ color: tk.textMuted }}>{post.commentsCount} comments</span>
        {post.shares > 0 && (
          <span className="text-xs" style={{ color: tk.textMuted }}>{post.shares} shares</span>
        )}
      </div> */}

    
      {/* Action buttons */}
      <div className="flex items-center gap-1 px-3 py-2"
        style={{ borderTop: `1px solid ${tk.border}` }}>

        <button
          onClick={() => onLike(post._id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all"
          style={{
            color: post.liked ? "#EF4444" : tk.textMuted,
            background: post.liked ? "rgba(239,68,68,0.08)" : "transparent",
          }}
          onMouseEnter={e => e.currentTarget.style.background = tk.hover}
          onMouseLeave={e => e.currentTarget.style.background = post.liked ? "rgba(239,68,68,0.08)" : "transparent"}
        >
          <Heart className={`w-4 h-4 ${post.liked ? "fill-red-500 text-red-500" : ""}`} />
          {post.likes}
        </button>

        <button
          onClick={() => setShowCom(s => !s)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all"
          style={{
            color: showComments ? ACCENT : tk.textMuted,
            background: showComments ? `${ACCENT}10` : "transparent",
          }}
          onMouseEnter={e => e.currentTarget.style.background = tk.hover}
          onMouseLeave={e => e.currentTarget.style.background = showComments ? `${ACCENT}10` : "transparent"}
        >
          <MessageSquare className="w-4 h-4" />
          {post.commentsCount}
        </button>

        <button
          onClick={() => setShowShare(true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all"
          style={{ color: tk.textMuted, background: "transparent" }}
          onMouseEnter={e => e.currentTarget.style.background = tk.hover}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <Share2 className="w-4 h-4" />
          {post.shares > 0 ? post.shares : "Share"}
        </button>

      </div>

      {/* Comments */}
      {showComments && (
        <>
          {post.comments?.slice(0, 3).map((c, i) => (
            <div key={i} className="flex items-start gap-2 px-4 py-2">
              <RAvatar name={`${c.user?.firstName} ${c.user?.lastName}`} size={26} />
              <div className="flex-1 px-3 py-1.5 rounded-xl"
                style={{ background: tk.page }}>
                <p className="text-xs font-bold" style={{ color: tk.text }}>
                  {c.user?.firstName} {c.user?.lastName}
                  {c.user?.role === "recruiter" && (
                    <span className="ml-1 text-xs font-normal" style={{ color: ACCENT }}>· Scout</span>
                  )}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: tk.textSub }}>{c.text}</p>
              </div>
            </div>
          ))}
          <CommentInput
            dark={dark}
            postId={post._id}
            currentUser={currentUser}
            onComment={onComment}
          />
        </>
      )}

      {showShare && (
        <ShareModal
          dark={dark}
          post={post}
          onClose={() => setShowShare(false)}
          onShared={(postId) => onShare(postId)}
        />
      )}
    </div>
  )
}


// ATHLETE PROFILE MODAL
function AthleteProfileModal({ athlete, dark, onClose, onMessage }) {
  const tk = dark ? THEME.dark : THEME.light
  const [playing, setPlaying] = useState(false)

  const name = athlete.name || "Athlete"
  const sport = athlete.sport || "—"
  const position = athlete.position || "—"
  const school = athlete.school || "—"
  const region = athlete.region || "—"
  const classOf = athlete.classOf || "—"
  const gpa = athlete.gpa || "—"
  const height = athlete.height || "—"
  const videoId = athlete.highlights?.[0]?.videoId || null
  const achievements = athlete.achievements || []

  useEffect(() => {
    const fn = e => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", fn)
    return () => document.removeEventListener("keydown", fn)
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden"
        style={{
          background: tk.surface, border: `1px solid ${tk.border}`,
          boxShadow: "0 24px 64px rgba(0,0,0,0.4)", maxHeight: "90vh", overflowY: "auto"
        }}>

        <div className="flex items-center justify-between px-4 py-3 sticky top-0 z-10"
          style={{ background: tk.surface, borderBottom: `1px solid ${tk.border}` }}>
          <p className="font-black text-sm" style={{ color: tk.text }}>Athlete Profile</p>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ color: tk.textMuted, background: tk.hover }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {videoId ? (
          <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
            {!playing ? (
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center cursor-pointer relative group"
                onClick={() => setPlaying(true)}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center z-10 group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                </div>
                <div className="absolute bottom-3 left-3 z-10 text-white text-xs font-semibold">
                  {athlete.highlights?.[0]?.title || "Highlight Reel"}
                </div>
              </div>
            ) : (
              <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen />
            )}
          </div>
        ) : (
          <div className="w-full flex items-center justify-center py-10"
            style={{ background: dark ? "#1a1e2a" : "#F3F4F6" }}>
            <p className="text-xs" style={{ color: tk.textMuted }}>No highlights posted yet</p>
          </div>
        )}

        <div className="p-4">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <RAvatar name={name} size={52} />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-black text-base" style={{ color: tk.text }}>{name}</p>
                  {athlete.verified && <span style={{ color: ACCENT, fontSize: 11 }}>✦</span>}
                </div>
                <p className="text-xs" style={{ color: tk.textMuted }}>{position} · {sport}</p>
              </div>
            </div>
            <button onClick={() => { onMessage(athlete); onClose() }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white flex-shrink-0 hover:opacity-90 transition-opacity"
              style={{ background: `linear-gradient(135deg,${ACCENT},${ACCENT2})` }}>
              <MessageCircle className="w-3.5 h-3.5" /> Message
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4 p-3 rounded-2xl"
            style={{ background: dark ? "#1a1e2a" : "#F8FAFC" }}>
            {[[height, "Height"], [gpa, "GPA"], [classOf, "Class"]].map(([val, label]) => (
              <div key={label} className="text-center">
                <p className="font-black text-sm" style={{ color: tk.text }}>{val}</p>
                <p className="text-xs" style={{ color: tk.textMuted }}>{label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2 mb-4">
            {[[GraduationCap, school, "School"], [MapPin, region, "Region"]].map(([Icon, val, label]) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${ACCENT}10` }}>
                  <Icon className="w-3.5 h-3.5" style={{ color: ACCENT }} />
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: tk.text }}>{val}</p>
                  <p className="text-xs" style={{ color: tk.textMuted }}>{label}</p>
                </div>
              </div>
            ))}
          </div>

          {athlete.highlights?.length > 0 && (
            <div>
              <p className="text-xs font-bold mb-2" style={{ color: tk.textMuted }}>ALL HIGHLIGHTS</p>
              <div className="space-y-2">
                {athlete.highlights.map((h, i) => (
                  <div key={i}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer"
                    style={{ background: dark ? "#1a1e2a" : "#F8FAFC" }}>
                    <Play className="w-3.5 h-3.5 flex-shrink-0" style={{ color: ACCENT }} />
                    <p className="text-xs flex-1 truncate" style={{ color: tk.text }}>
                      {h.title || `Highlight ${i + 1}`}
                    </p>
                    <span className="text-xs" style={{ color: tk.textMuted }}>{h.views || 0} views</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {achievements.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-bold mb-2" style={{ color: tk.textMuted }}>ACHIEVEMENTS</p>
              <div className="flex flex-wrap gap-1.5">
                {achievements.map((a, i) => (
                  <span key={i}
                    className="text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1"
                    style={{ background: "rgba(245,158,11,0.1)", color: "#F59E0B" }}>
                    <Trophy className="w-2.5 h-2.5" />{a.title || a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


// PENDING OFFERS WIDGET
function PendingOffers({ offers, dark }) {
  const tk = dark ? THEME.dark : THEME.light
  const STATUS = {
    pending: { color: "#F97316", label: "Awaiting" },
    viewed: { color: ACCENT, label: "Viewed" },
  }
  const pending = offers.filter(o => ["pending", "viewed"].includes(o.status)).slice(0, 3)
  if (pending.length === 0) return null

  return (
    <SectionCard icon={Award} title="Pending Offers"
      action="View All" actionTo="/recruiter/offers" dark={dark}>
      {pending.map((o, i) => (
        <div key={o._id} className="flex items-center justify-between gap-3 px-4 py-3"
          style={{ borderBottom: i < pending.length - 1 ? `1px solid ${tk.border}` : "none" }}>
          <div className="flex items-center gap-3 min-w-0">
            <RAvatar name={`${o.athlete?.firstName} ${o.athlete?.lastName}`} size={32} />
            <div className="min-w-0">
              <p className="text-sm font-bold truncate" style={{ color: tk.text }}>
                {o.athlete?.firstName} {o.athlete?.lastName}
              </p>
              <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: tk.textMuted }}>
                <Clock className="w-3 h-3" />
                {o.deadline
                  ? `Deadline: ${new Date(o.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`
                  : o.type}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
            style={{ background: `${STATUS[o.status]?.color || ACCENT}15`, color: STATUS[o.status]?.color || ACCENT }}>
            {STATUS[o.status]?.label || o.status}
          </span>
        </div>
      ))}
    </SectionCard>
  )
}


// MAIN PAGE
export default function RecruiterDashboard() {
  const navigate = useNavigate()
  const [dark, setDark] = useState(false)
  const [sport, setSport] = useState("All Sports")
  const [feedFilter, setFeedFilter] = useState("All")
  const tk = dark ? THEME.dark : THEME.light

  const [currentUser, setCurrentUser] = useState(null)
  const [recruiterProfile, setRecruiterProfile] = useState(null)
  const [recentAthletes, setRecentAthletes] = useState([])
  const [shortlist, setShortlist] = useState([])
  const [offers, setOffers] = useState([])
  const [feedPosts, setFeedPosts] = useState([])
  const [feedLoading, setFeedLoading] = useState(true)
  const [loading, setLoading] = useState(true)
  const [profileModal, setProfileModal] = useState(null)
  const [messagingId, setMessagingId] = useState(null)

  // ── Fetch feed
  const fetchFeed = async (filter = "All") => {
    setFeedLoading(true)
    try {
      const params = {}
      if (filter === "Athletes") params.role = "athlete"
      if (filter === "Recruiters") params.role = "recruiter"
      const { data } = await getFeedPosts(params)
      setFeedPosts(data.posts || [])
    } catch {
      toast.error("Failed to load feed")
    } finally {
      setFeedLoading(false)
    }
  }

  useEffect(() => {
    if (!isLoggedIn()) { navigate("/signin"); return }
    const user = getCurrentUser()
    if (user?.role === "athlete") { navigate("/athletedashboard"); return }
    setCurrentUser(user)

    const fetchAll = async () => {
      try {
        const [profileRes, athletesRes, shortlistRes, offersRes] = await Promise.allSettled([
          getRecruiterById(user._id || user.id),
          getAthletes({ limit: 6 }),
          getShortlist(),
          getOffers(),
        ])
        if (profileRes.status === "fulfilled") setRecruiterProfile(profileRes.value.data.profile)
        if (athletesRes.status === "fulfilled") setRecentAthletes(athletesRes.value.data.athletes?.slice(0, 6) || [])
        if (shortlistRes.status === "fulfilled") setShortlist(shortlistRes.value.data.shortlist || [])
        if (offersRes.status === "fulfilled") setOffers(offersRes.value.data.offers || [])
      } catch {
        toast.error("Failed to load dashboard")
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
    fetchFeed("All")
  }, [navigate])

  useEffect(() => {
    fetchFeed(feedFilter)
  }, [feedFilter])


  const handleDelete = async (postId) => {
    // Optimistic remove
    setFeedPosts(prev => prev.filter(p => p._id !== postId))
    try {
      await deletePost(postId)
      toast.success("Post deleted")
    } catch {
      // Restore on failure
      fetchFeed(feedFilter)
      toast.error("Failed to delete post")
    }
  }

  // ── Feed handlers
  const handleLike = async (postId) => {
    setFeedPosts(prev => prev.map(p =>
      p._id === postId
        ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
        : p
    ))
    try {
      const { data } = await likePost(postId)
      setFeedPosts(prev => prev.map(p =>
        p._id === postId ? { ...p, liked: data.liked, likes: data.likes } : p
      ))
    } catch {
      setFeedPosts(prev => prev.map(p =>
        p._id === postId
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      ))
      toast.error("Failed to like post")
    }
  }

  const handleComment = (postId, newComment, newCount) => {
    setFeedPosts(prev => prev.map(p =>
      p._id === postId
        ? { ...p, commentsCount: newCount, comments: [...(p.comments || []), newComment] }
        : p
    ))
  }

  const handleShare = (postId) => {
    setFeedPosts(prev => prev.map(p =>
      p._id === postId ? { ...p, shares: (p.shares || 0) + 1 } : p
    ))
  }

  const handleNewPost = (post) => {
    setFeedPosts(prev => [post, ...prev])
  }

  const handleViewAthlete = (athleteObj, fullData) => {
    setProfileModal({ ...athleteObj, ...fullData })
  }

  const handleMessage = async (athlete) => {
    const uid = athlete.id || athlete._id
    if (!uid) return toast.error("Could not find athlete ID")
    setMessagingId(uid)
    try {
      const { data } = await startConversation(uid)
      navigate(`/recruitermessages?convo=${data.conversation._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start conversation")
    } finally {
      setMessagingId(null)
    }
  }

  const greetingName = currentUser ? `Coach ${currentUser.lastName?.toUpperCase()}` : "COACH"
  const hour = new Date().getHours()
  const timeGreeting = hour < 12 ? "GOOD MORNING" : hour < 17 ? "GOOD AFTERNOON" : "GOOD EVENING"
  const filteredAthletes = recentAthletes.filter(a => sport === "All Sports" || a.sport === sport)
  const shortlistCount = shortlist.length
  const offersCount = offers.length
  const pendingOffers = offers.filter(o => ["pending", "viewed"].includes(o.status))
  const profileViews = recruiterProfile?.profileViews || 0

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: tk.page, fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
          @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
          @keyframes fade-up { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
          .sc-shimmer { background:linear-gradient(90deg,${ACCENT} 0%,#fff 40%,${ACCENT} 80%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 2.5s linear infinite; }
          .sc-fadeup { animation:fade-up 0.6s ease forwards; }
          .dot { display:inline-block; animation:dot-b 1.4s ease-in-out infinite; }
          .dot:nth-child(2){animation-delay:0.2s} .dot:nth-child(3){animation-delay:0.4s}
          @keyframes dot-b { 0%,80%,100%{transform:translateY(0);opacity:0.4} 40%{transform:translateY(-6px);opacity:1} }
        `}</style>
        <div className="sc-fadeup text-center">
          <h1 className="sc-shimmer font-black text-2xl mb-1"
            style={{ fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "0.08em" }}>
            SPORTSCONNECT
          </h1>
          <p className="text-xs font-medium uppercase mb-6" style={{ color: tk.textMuted, letterSpacing: "0.2em" }}>
            Scout Platform
          </p>
        </div>
        <div className="sc-fadeup flex items-center gap-1">
          <span className="dot w-2 h-2 rounded-full" style={{ background: ACCENT }} />
          <span className="dot w-2 h-2 rounded-full" style={{ background: ACCENT }} />
          <span className="dot w-2 h-2 rounded-full" style={{ background: ACCENT }} />
        </div>
        <p className="sc-fadeup text-xs mt-3" style={{ color: tk.textMuted }}>Loading your dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen transition-colors duration-300"
      style={{ background: tk.page, fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800;900&family=Bebas+Neue&display=swap');
        @keyframes scIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        .sc-in { animation:scIn .3s cubic-bezier(.4,0,.2,1) both; }
      `}</style>

      <RecruiterNavbar dark={dark} toggleDark={() => setDark(!dark)} />

      <div className="max-w-6xl mx-auto flex lg:gap-6 lg:px-4">
        <RecruiterSideNav dark={dark} />

        <main className="flex-1 min-w-0 pb-20 lg:pb-12"
          style={{ borderLeft: `1px solid ${tk.border}`, borderRight: `1px solid ${tk.border}` }}>

          {/* Sticky filter header */}
          <div className="sticky top-14 sm:top-16 z-30 px-4 pt-3 pb-2 backdrop-blur-xl"
            style={{ background: dark ? "rgba(12,14,20,0.95)" : "rgba(250,250,247,0.95)", borderBottom: `1px solid ${tk.border}` }}>
            <h1 className="font-black text-lg mb-2" style={{ fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "0.05em", color: tk.text }}>
              {timeGreeting}, {greetingName}
            </h1>
            <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {FEED_FILTERS.map(f => (
                <button key={f} onClick={() => setFeedFilter(f)}
                  className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold transition-all border"
                  style={{
                    background: feedFilter === f ? ACCENT : "transparent",
                    color: feedFilter === f ? "#fff" : tk.textMuted,
                    borderColor: feedFilter === f ? ACCENT : tk.border,
                  }}>
                  {f === "All" ? "All Posts" : f === "Athletes" ? "Athletes" : "Scouts"}
                </button>
              ))}
            </div>
          </div>

          <div className="px-4 pt-4">

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <StatCard icon={Eye} label="Profile Views" value={String(profileViews)} sub="total views" dark={dark} />
              <StatCard icon={Bookmark} label="Shortlisted" value={String(shortlistCount)} sub="saved athletes" dark={dark} accent="#1DA8FF" />
              <StatCard icon={MessageCircle} label="Offers Sent" value={String(offersCount)} sub="total offers" dark={dark} accent="#A855F7" />
              <StatCard icon={Award} label="Pending" value={String(pendingOffers.length)} sub="awaiting reply" dark={dark} accent="#F97316" />
            </div>

            {/* Quick search */}
            <Link to="/recruiterathletes"
              className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl mb-4 transition-all"
              style={{ background: tk.surface, border: `1px solid ${tk.border}` }}
              onMouseEnter={e => e.currentTarget.style.borderColor = ACCENT}
              onMouseLeave={e => e.currentTarget.style.borderColor = tk.border}>
              <Search className="w-4 h-4 flex-shrink-0" style={{ color: tk.textMuted }} />
              <span className="text-sm flex-1" style={{ color: tk.textMuted }}>Search athletes by name, sport, region...</span>
              <span className="text-xs font-bold px-2.5 py-1.5 rounded-xl" style={{ background: `${ACCENT}15`, color: ACCENT }}>
                Find Athletes →
              </span>
            </Link>

            {/* Two column layout */}
            <div className="flex gap-4">

              {/* LEFT — Feed */}
              <div className="flex-1 min-w-0">

                {/* Post composer */}
                <PostComposer
                  dark={dark}
                  currentUser={currentUser}
                  recruiterProfile={recruiterProfile}
                  onPost={handleNewPost}
                />

                {/* Feed */}
                {feedLoading ? (
                  <div className="space-y-3">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="rounded-2xl p-4 animate-pulse"
                        style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full" style={{ background: tk.border }} />
                          <div className="flex-1 space-y-1.5">
                            <div className="h-3 rounded-full w-28" style={{ background: tk.border }} />
                            <div className="h-2.5 rounded-full w-20" style={{ background: tk.border }} />
                          </div>
                        </div>
                        <div className="h-32 rounded-xl" style={{ background: tk.border }} />
                      </div>
                    ))}
                  </div>
                ) : feedPosts.length === 0 ? (
                  <div className="rounded-2xl py-16 text-center"
                    style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
                    <Users className="w-10 h-10 mx-auto mb-3" style={{ color: tk.textMuted }} />
                    <p className="font-bold text-sm mb-1" style={{ color: tk.text }}>No posts yet</p>
                    <p className="text-xs" style={{ color: tk.textMuted }}>Be the first to post a scouting update</p>
                  </div>
                ) : (
                  feedPosts.map(post => (
                    <FeedPostCard
                      key={post._id}
                      post={post}
                      dark={dark}
                      currentUser={currentUser}
                      onLike={handleLike}
                      onComment={handleComment}
                      onShare={handleShare}
                      onDelete={handleDelete}
                    />
                  ))
                )}

                <PendingOffers offers={offers} dark={dark} />
              </div>

              {/* RIGHT sidebar */}
              <div className="hidden xl:flex flex-col gap-4 w-72 flex-shrink-0">

                {/* Athletes */}
                <SectionCard icon={TrendingUp} title="Athletes"
                  action="Browse All" actionTo="/recruiterathletes" dark={dark}>
                  <div className="flex gap-1.5 px-4 py-2 overflow-x-auto"
                    style={{ borderBottom: `1px solid ${tk.border}`, scrollbarWidth: "none" }}>
                    {SPORT_FILTERS.slice(0, 4).map(s => (
                      <FilterPill key={s} label={s === "All Sports" ? "All" : s} active={sport === s}
                        onClick={() => setSport(s)} dark={dark} />
                    ))}
                  </div>
                  {filteredAthletes.slice(0, 4).map((a, i) => {
                    const obj = {
                      id: a.user?._id || a._id,
                      name: `${a.user?.firstName} ${a.user?.lastName}`,
                      sport: a.sport || "—", region: a.region || "—",
                      classOf: a.classOf || "—", gpa: a.gpa || "—",
                      verified: a.verified || false,
                    }
                    return (
                      <AthleteRow key={a._id} athlete={obj} dark={dark}
                        saved={shortlist.some(s => s.athlete?.id === obj.id)}
                        border={i < Math.min(filteredAthletes.length, 4) - 1}
                        onView={() => handleViewAthlete(obj, a)} />
                    )
                  })}
                  {filteredAthletes.length === 0 && (
                    <div className="px-4 py-6 text-center">
                      <p className="text-xs" style={{ color: tk.textMuted }}>No athletes match this filter</p>
                    </div>
                  )}
                </SectionCard>

                {/* Shortlist */}
                <SectionCard icon={Bookmark} title="My Shortlist"
                  action="View All" actionTo="/recruitershortlist" dark={dark}>
                  {shortlist.slice(0, 3).map((item, i) => {
                    const obj = {
                      id: item.athlete?.id,
                      name: `${item.athlete?.firstName} ${item.athlete?.lastName}`,
                      sport: item.athlete?.sport || "—", region: item.athlete?.region || "—",
                      classOf: item.athlete?.classOf || "—", gpa: item.athlete?.gpa || "—",
                      verified: item.athlete?.verified || false,
                    }
                    return (
                      <AthleteRow key={item._id} athlete={obj} dark={dark}
                        saved border={i < Math.min(shortlist.length, 3) - 1} />
                    )
                  })}
                  {shortlist.length === 0 && (
                    <div className="px-4 py-6 text-center">
                      <p className="text-sm" style={{ color: tk.textMuted }}>No athletes shortlisted yet</p>
                      <Link to="/recruiterathletes" className="text-xs font-bold mt-2 inline-block" style={{ color: ACCENT }}>
                        Browse Athletes →
                      </Link>
                    </div>
                  )}
                </SectionCard>

                {/* Activity */}
                <SectionCard icon={Bell} title="Recent Activity" dark={dark}>
                  {[
                    { icon: Eye, iconColor: "#1DA8FF", iconBg: "rgba(29,168,255,0.12)", text: "Dashboard loaded", time: "just now" },
                    { icon: Bookmark, iconColor: ACCENT, iconBg: `${ACCENT}20`, text: `${shortlistCount} athletes shortlisted`, time: "now" },
                    { icon: Award, iconColor: "#F97316", iconBg: "rgba(249,115,22,0.12)", text: `${offersCount} offers sent`, time: "now" },
                  ].map((item, i) => <ActivityItem key={i} {...item} dark={dark} />)}
                </SectionCard>
              </div>
            </div>

            {/* Mobile shortlist */}
            <div className="xl:hidden mt-4">
              <SectionCard icon={Bookmark} title="My Shortlist"
                action="View All" actionTo="/recruitershortlist" dark={dark}>
                {shortlist.slice(0, 3).map((item, i) => {
                  const obj = {
                    id: item.athlete?.id,
                    name: `${item.athlete?.firstName} ${item.athlete?.lastName}`,
                    sport: item.athlete?.sport || "—", region: item.athlete?.region || "—",
                    classOf: item.athlete?.classOf || "—", gpa: item.athlete?.gpa || "—",
                    verified: item.athlete?.verified || false,
                  }
                  return (
                    <AthleteRow key={item._id} athlete={obj} dark={dark}
                      saved border={i < Math.min(shortlist.length, 3) - 1} />
                  )
                })}
                {shortlist.length === 0 && (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm" style={{ color: tk.textMuted }}>No athletes shortlisted yet</p>
                  </div>
                )}
              </SectionCard>
            </div>

          </div>
        </main>
      </div>

      {profileModal && (
        <AthleteProfileModal
          athlete={profileModal}
          dark={dark}
          onClose={() => setProfileModal(null)}
          onMessage={handleMessage}
        />
      )}

      <RecruiterBottomNav dark={dark} />
    </div>
  )
}