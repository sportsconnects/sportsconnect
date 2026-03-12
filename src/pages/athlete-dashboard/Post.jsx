// src/pages/AthletePost.jsx

import { useState, useRef, useEffect } from "react"
import AthleteNavbar from "./../../components/AthleteNavbar"
import DesktopSideNav from "./../../components/athlete-dashboard/TempDesktopSideNav"
import MobileBottomNav from "./../../components/athlete-dashboard/TempMobileBottomNav"
import SportBadge from "./../../components/athlete-dashboard/TempSportsBadge"
import Avatar from "./../../components/athlete-dashboard/TempAvatar"
import {
  Upload, Video, Link2, Youtube, X, Play, Eye,
  EyeOff, Globe, Lock, Users, ChevronDown, Check,
  Tag, Trophy, MapPin, Clock, AlertCircle, Sparkles,
  Film, Image, Plus, Trash2, GripVertical, Star
} from "lucide-react"

// API imports
import {
  createPost, getAthletePostsById, deletePost, getAthleteById, getCurrentUser, isLoggedIn
} from "../../api/client"





// THEME
const ACCENT = "#1DA8FF"

const THEME = {
  dark: {
    page: "#0D1117",
    surface: "#161B22",
    surfaceHigh: "#1C2128",
    border: "rgba(255,255,255,0.06)",
    text: "#F0F6FF",
    textSub: "#9CA3AF",
    textMuted: "#4B5563",
    hover: "rgba(255,255,255,0.04)",
    inputBg: "#0D1117",
    inputBorder: "rgba(255,255,255,0.1)",
  },
  light: {
    page: "#F0F4FA",
    surface: "#FFFFFF",
    surfaceHigh: "#F8FAFC",
    border: "#E5E7EB",
    text: "#111827",
    textSub: "#6B7280",
    textMuted: "#9CA3AF",
    hover: "rgba(0,0,0,0.025)",
    inputBg: "#F8FAFC",
    inputBorder: "#D1D5DB",
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const POST_TYPES = [
  { id: "highlight", icon: Star, label: "Highlight Reel", desc: "Your best plays for recruiters", color: "#F59E0B" },
  { id: "video", icon: Film, label: "Full Game", desc: "Complete match or training footage", color: ACCENT },
  { id: "update", icon: Users, label: "Team Update", desc: "Share news with your followers", color: "#10B981" },
]

const SPORTS = ["Soccer", "Basketball", "Track & Field", "Swimming", "Volleyball"]

const VISIBILITY_OPTIONS = [
  { id: "public", icon: Globe, label: "Public", desc: "Everyone can see this" },
  { id: "recruiters", icon: Users, label: "Recruiters Only", desc: "Only verified scouts" },
  { id: "private", icon: Lock, label: "Private", desc: "Only you" },
]

const SUGGESTED_TAGS = [
  "#Highlights", "#InterSchools", "#RecruitSeason2026", "#GhanaFootball",
  "#CenterBack", "#Defender", "#EasternRegion", "#StPetersBoys",
]

// ─────────────────────────────────────────────────────────────────────────────
// SMALL COMPONENTS  (unchanged from your original)
// ─────────────────────────────────────────────────────────────────────────────
function InputField({ label, placeholder, value, onChange, multiline, rows = 3, dark, hint, maxLength }) {
  const tk = dark ? THEME.dark : THEME.light
  const Tag = multiline ? "textarea" : "input"
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-bold" style={{ color: tk.textSub }}>{label}</label>
        {maxLength && (
          <span className="text-xs" style={{ color: value?.length > maxLength * 0.8 ? "#F59E0B" : tk.textMuted }}>
            {value?.length || 0}/{maxLength}
          </span>
        )}
      </div>
      <Tag
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={multiline ? rows : undefined}
        maxLength={maxLength}
        className="w-full rounded-xl px-3 py-2.5 text-sm outline-none transition-all resize-none"
        style={{
          background: tk.inputBg,
          border: `1px solid ${tk.inputBorder}`,
          color: tk.text,
          lineHeight: "1.6",
        }}
        onFocus={e => e.target.style.borderColor = ACCENT}
        onBlur={e => e.target.style.borderColor = tk.inputBorder}
      />
      {hint && <p className="text-xs mt-1.5" style={{ color: tk.textMuted }}>{hint}</p>}
    </div>
  )
}

function SelectDropdown({ label, options, value, onChange, dark }) {
  const [open, setOpen] = useState(false)
  const tk = dark ? THEME.dark : THEME.light
  const selected = options.find(o => o.id === value) || options[0]

  return (
    <div className="mb-4">
      <label className="text-xs font-bold mb-1.5 block" style={{ color: tk.textSub }}>{label}</label>
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-left transition-all"
          style={{ background: tk.inputBg, border: `1px solid ${open ? ACCENT : tk.inputBorder}`, color: tk.text }}
        >
          <div className="flex items-center gap-2">
            {selected.icon && <selected.icon className="w-4 h-4" style={{ color: ACCENT }} />}
            <span className="font-semibold">{selected.label}</span>
          </div>
          <ChevronDown className="w-4 h-4 transition-transform" style={{ transform: open ? "rotate(180deg)" : "none", color: tk.textMuted }} />
        </button>

        {open && (
          <div
            className="absolute top-12 left-0 right-0 z-30 rounded-2xl overflow-hidden"
            style={{ background: tk.surface, border: `1px solid ${tk.border}`, boxShadow: dark ? "0 16px 48px rgba(0,0,0,0.5)" : "0 8px 32px rgba(0,0,0,0.12)" }}
          >
            {options.map(opt => (
              <button
                key={opt.id}
                onClick={() => { onChange(opt.id); setOpen(false) }}
                className="w-full flex items-start gap-3 px-4 py-3 text-left transition-colors"
                style={{ borderBottom: `1px solid ${tk.border}` }}
                onMouseEnter={e => e.currentTarget.style.background = tk.hover}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                {opt.icon && (
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: `${ACCENT}15` }}>
                    <opt.icon className="w-4 h-4" style={{ color: ACCENT }} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold" style={{ color: tk.text }}>{opt.label}</p>
                  {opt.desc && <p className="text-xs" style={{ color: tk.textMuted }}>{opt.desc}</p>}
                </div>
                {opt.id === value && <Check className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: ACCENT }} />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function UploadZone({ dark, file, onFile, onRemove }) {
  const inputRef = useRef(null)
  const [drag, setDrag] = useState(false)
  const tk = dark ? THEME.dark : THEME.light

  const handleDrop = e => {
    e.preventDefault()
    setDrag(false)
    const f = e.dataTransfer.files[0]
    if (f && f.type.startsWith("video/")) onFile(f)
  }

  if (file) {
    return (
      <div className="relative rounded-2xl overflow-hidden mb-4"
        style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
        <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <Play className="w-7 h-7 text-white fill-white ml-1" />
          </div>
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: "rgba(0,0,0,0.7)", color: "#fff" }}>
              <Film className="w-3 h-3" />
              {file.name.length > 30 ? file.name.slice(0, 30) + "..." : file.name}
            </div>
          </div>
          <div className="absolute bottom-3 right-3 text-xs px-2 py-1 rounded-full"
            style={{ background: "rgba(0,0,0,0.7)", color: "#9CA3AF" }}>
            {(file.size / 1024 / 1024).toFixed(1)} MB
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-semibold" style={{ color: "#10B981" }}>Video ready to upload</span>
          </div>
          <button onClick={onRemove}
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl transition-all"
            style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}>
            <Trash2 className="w-3.5 h-3.5" /> Remove
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="rounded-2xl mb-4 transition-all cursor-pointer"
      style={{
        border: `2px dashed ${drag ? ACCENT : tk.inputBorder}`,
        background: drag ? `${ACCENT}08` : tk.inputBg,
      }}
      onDragOver={e => { e.preventDefault(); setDrag(true) }}
      onDragLeave={() => setDrag(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input ref={inputRef} type="file" accept="video/*" className="hidden"
        onChange={e => e.target.files[0] && onFile(e.target.files[0])} />

      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all"
          style={{ background: drag ? `${ACCENT}20` : `${ACCENT}10` }}
        >
          <Upload className="w-7 h-7" style={{ color: ACCENT }} />
        </div>
        <p className="font-black text-base mb-1" style={{ color: tk.text }}>
          {drag ? "Drop it here!" : "Upload your video"}
        </p>
        <p className="text-sm mb-4" style={{ color: tk.textMuted }}>
          Drag & drop or click to browse
        </p>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {["MP4", "MOV", "AVI", "MKV"].map(f => (
            <span key={f} className="text-xs px-2.5 py-1 rounded-full font-semibold"
              style={{ background: tk.hover, color: tk.textSub, border: `1px solid ${tk.border}` }}>
              {f}
            </span>
          ))}
        </div>
        <p className="text-xs mt-3" style={{ color: tk.textMuted }}>Max file size: 500MB</p>
      </div>
    </div>
  )
}

function YouTubeInput({ value, onChange, dark }) {
  const tk = dark ? THEME.dark : THEME.light
  const isValid = value.includes("youtube.com") || value.includes("youtu.be")
  const isEmpty = value.trim() === ""

  const getVideoId = url => {
    const match = url.match(/(?:v=|youtu\.be\/)([^&\n?#]+)/)
    return match ? match[1] : null
  }
  const videoId = getVideoId(value)

  return (
    <div className="mb-4">
      <label className="text-xs font-bold mb-1.5 block" style={{ color: tk.textSub }}>
        YouTube / Video Link
      </label>
      <div className="relative flex items-center">
        <Youtube className="absolute left-3 w-4 h-4" style={{ color: "#FF0000" }} />
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
          className="w-full rounded-xl pl-9 pr-10 py-2.5 text-sm outline-none transition-all"
          style={{
            background: tk.inputBg,
            border: `1px solid ${!isEmpty && isValid ? "#10B981" : !isEmpty && !isValid ? "#EF4444" : tk.inputBorder}`,
            color: tk.text,
          }}
          onFocus={e => e.target.style.borderColor = ACCENT}
          onBlur={e => {
            if (!isEmpty && isValid) e.target.style.borderColor = "#10B981"
            else if (!isEmpty) e.target.style.borderColor = "#EF4444"
            else e.target.style.borderColor = tk.inputBorder
          }}
        />
        {!isEmpty && (
          <div className="absolute right-3">
            {isValid
              ? <Check className="w-4 h-4" style={{ color: "#10B981" }} />
              : <AlertCircle className="w-4 h-4" style={{ color: "#EF4444" }} />
            }
          </div>
        )}
      </div>
      {!isEmpty && !isValid && (
        <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "#EF4444" }}>
          <AlertCircle className="w-3 h-3" /> Please enter a valid YouTube URL
        </p>
      )}

      {videoId && isValid && (
        <div className="mt-3 rounded-xl overflow-hidden" style={{ border: `1px solid ${tk.border}` }}>
          <div className="aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
          <div className="px-3 py-2 flex items-center gap-2"
            style={{ background: tk.surfaceHigh || tk.surface, borderTop: `1px solid ${tk.border}` }}>
            <Check className="w-3.5 h-3.5" style={{ color: "#10B981" }} />
            <span className="text-xs font-semibold" style={{ color: "#10B981" }}>Video preview looks good!</span>
          </div>
        </div>
      )}
    </div>
  )
}

function TagPicker({ tags, setTags, dark }) {
  const [input, setInput] = useState("")
  const tk = dark ? THEME.dark : THEME.light

  const addTag = tag => {
    const t = tag.startsWith("#") ? tag : `#${tag}`
    if (!tags.includes(t) && tags.length < 8) setTags([...tags, t])
    setInput("")
  }

  const removeTag = tag => setTags(tags.filter(t => t !== tag))

  const handleKey = e => {
    if ((e.key === "Enter" || e.key === " ") && input.trim()) {
      e.preventDefault()
      addTag(input.trim())
    }
  }

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-bold" style={{ color: tk.textSub }}>Tags</label>
        <span className="text-xs" style={{ color: tk.textMuted }}>{tags.length}/8</span>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {tags.map(tag => (
            <span key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ background: "rgba(29,168,255,0.1)", color: ACCENT, border: `1px solid rgba(29,168,255,0.25)` }}>
              {tag}
              <button onClick={() => removeTag(tag)} className="ml-0.5 hover:opacity-70">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative flex items-center">
        <Tag className="absolute left-3 w-4 h-4" style={{ color: tk.textMuted }} />
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type a tag and press Enter..."
          className="w-full rounded-xl pl-9 py-2.5 text-sm outline-none"
          style={{ background: tk.inputBg, border: `1px solid ${tk.inputBorder}`, color: tk.text }}
          onFocus={e => e.target.style.borderColor = ACCENT}
          onBlur={e => e.target.style.borderColor = tk.inputBorder}
        />
      </div>

      <div className="flex flex-wrap gap-1.5 mt-2">
        {SUGGESTED_TAGS.filter(t => !tags.includes(t)).slice(0, 6).map(t => (
          <button key={t} onClick={() => addTag(t)}
            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold transition-all border"
            style={{ background: tk.hover, borderColor: tk.border, color: tk.textSub }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.color = ACCENT }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = tk.border; e.currentTarget.style.color = tk.textSub }}>
            <Plus className="w-2.5 h-2.5" />{t}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// RECENT POSTS SIDEBAR  — now wired to real API
// ─────────────────────────────────────────────────────────────────────────────
function RecentPosts({ dark, posts, onDelete }) {
  const tk = dark ? THEME.dark : THEME.light
  const TYPE_COLOR = { highlight: "#F59E0B", video: ACCENT, update: "#10B981" }

  if (!posts.length) {
    return (
      <div className="rounded-2xl overflow-hidden"
        style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
        <div className="px-4 py-3 flex items-center gap-2"
          style={{ borderBottom: `1px solid ${tk.border}` }}>
          <Film className="w-4 h-4" style={{ color: ACCENT }} />
          <h3 className="font-bold text-sm" style={{ color: tk.text }}>Recent Posts</h3>
        </div>
        <p className="px-4 py-6 text-xs text-center" style={{ color: tk.textMuted }}>
          No posts yet. Publish your first highlight!
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
      <div className="px-4 py-3 flex items-center gap-2"
        style={{ borderBottom: `1px solid ${tk.border}` }}>
        <Film className="w-4 h-4" style={{ color: ACCENT }} />
        <h3 className="font-bold text-sm" style={{ color: tk.text }}>Recent Posts</h3>
      </div>
      <div>
        {posts.map((p, i) => (
          <div key={p._id} className="flex items-center gap-3 px-4 py-3 transition-all cursor-pointer group"
            style={{ borderBottom: i < posts.length - 1 ? `1px solid ${tk.border}` : "none" }}
            onMouseEnter={e => e.currentTarget.style.background = tk.hover}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${ACCENT}15` }}>
              <Film className="w-4 h-4" style={{ color: ACCENT }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate" style={{ color: tk.text }}>
                {p.videoTitle || p.caption || "Untitled Post"}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs flex items-center gap-1" style={{ color: tk.textMuted }}>
                  <Eye className="w-3 h-3" />{p.views ?? 0}
                </span>
                <span className="text-xs" style={{ color: tk.textMuted }}>
                  {new Date(p.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </span>
              </div>
            </div>
            {/* Delete button — shows on hover */}
            <button
              onClick={e => { e.stopPropagation(); onDelete(p._id) }}
              className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg"
              style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TIPS CARD  (unchanged)
// ─────────────────────────────────────────────────────────────────────────────
function TipsCard({ dark }) {
  const tk = dark ? THEME.dark : THEME.light
  const tips = [
    "Keep highlight reels under 5 minutes",
    "Add your position and sport as tags",
    "Post consistently — weekly is ideal",
    "Tag regional tournaments for more reach",
  ]
  return (
    <div className="rounded-2xl p-4"
      style={{ background: "linear-gradient(135deg,rgba(29,168,255,0.08),rgba(99,102,241,0.08))", border: "1px solid rgba(29,168,255,0.2)" }}>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4" style={{ color: ACCENT }} />
        <p className="font-bold text-sm" style={{ color: tk.text }}>Tips for Recruiters</p>
      </div>
      <div className="space-y-2">
        {tips.map((tip, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: "rgba(29,168,255,0.15)" }}>
              <span className="text-xs font-black" style={{ color: ACCENT, fontSize: 9 }}>{i + 1}</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: tk.textSub }}>{tip}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SUCCESS / ERROR TOAST
// ─────────────────────────────────────────────────────────────────────────────
function Toast({ type = "success", message, subMessage, onDismiss }) {
  const isSuccess = type === "success"
  return (
    <div className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl"
      style={{ background: "linear-gradient(135deg,#0D1117,#1a2744)", border: `1px solid ${isSuccess ? "rgba(29,168,255,0.3)" : "rgba(239,68,68,0.3)"}`, animation: "scIn .4s cubic-bezier(.4,0,.2,1)" }}>
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0`}
        style={{ background: isSuccess ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)" }}>
        {isSuccess
          ? <Check className="w-4 h-4" style={{ color: "#10B981" }} />
          : <AlertCircle className="w-4 h-4" style={{ color: "#EF4444" }} />
        }
      </div>
      <div>
        <p className="text-sm font-bold text-white">{message}</p>
        {subMessage && <p className="text-xs" style={{ color: "#9CA3AF" }}>{subMessage}</p>}
      </div>
      <button onClick={onDismiss} className="ml-2" style={{ color: "#4B5563" }}>
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function AthletePost() {
  const [dark, setDark] = useState(false)
  const [activeNav, setNav] = useState("post")





  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user?._id && !user?.id) return

    const id = user._id || user.id

    getAthleteById(id)
      .then(({ data }) => {
        const p = data.profile
        setProfile({
          sport: p?.sport || null,
          position: p?.position || null,
          school: p?.school || null,
          region: p?.region || null,
          verified: p?.verified || false,
          avatar: p?.avatar || null,
        })
      })
      .catch(() => { })
  }, [])

  // ── Recent posts (real) ────────────────────────────────────────────────────
  const [recentPosts, setRecentPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(false)

  const fetchRecentPosts = async () => {
    const user = getCurrentUser()
    if (!user?._id) return
    const id = user._id || user.id
    setLoadingPosts(true)
    try {
      const res = await getAthletePostsById(id)
      setRecentPosts((res.data.posts || []).slice(0, 3))
    } catch (err) {
      console.error("Failed to load recent posts:", err)
    } finally {
      setLoadingPosts(false)
    }
  }

  useEffect(() => {
    fetchRecentPosts()
  }, [])

  // ── Form state ─────────────────────────────────────────────────────────────
  const [postType, setPostType] = useState("highlight")
  const [sourceTab, setSourceTab] = useState("upload")
  const [videoFile, setVideoFile] = useState(null)
  const [ytLink, setYtLink] = useState("")
  const [title, setTitle] = useState("")
  const [caption, setCaption] = useState("")
  const [sport, setSport] = useState(profile?.sport || "Soccer")
  const [visibility, setVisibility] = useState("public")
  const [tags, setTags] = useState(["#Highlights", "#GhanaFootball"])
  const [featuredReel, setFeatured] = useState(false)

  // ── UI state ───────────────────────────────────────────────────────────────
  const [toast, setToast] = useState(null)   // { type, message, subMessage } | null
  const [posting, setPosting] = useState(false)

  const tk = dark ? THEME.dark : THEME.light

  // ── Helpers ────────────────────────────────────────────────────────────────
  const getYouTubeVideoId = url => {
    const match = url.match(/(?:v=|youtu\.be\/)([^&\n?#]+)/)
    return match ? match[1] : null
  }

  const isYtValid = ytLink.includes("youtube.com") || ytLink.includes("youtu.be")
  const hasVideo = videoFile || (ytLink.trim() && isYtValid)
  const canPost = hasVideo && title.trim().length > 0

  const resetForm = () => {
    setVideoFile(null)
    setYtLink("")
    setTitle("")
    setCaption("")
    setTags(["#Highlights", "#GhanaFootball"])
    setFeatured(false)
    setSport(profile?.sport || "Soccer")
  }

  const showToast = (type, message, subMessage, duration = 4000) => {
    setToast({ type, message, subMessage })
    setTimeout(() => setToast(null), duration)
  }


  const handlePost = async () => {
    if (!canPost || posting) return
    setPosting(true)

    try {
      const videoId = sourceTab === "youtube" ? getYouTubeVideoId(ytLink) : null
      const videoTitle = sourceTab === "youtube" ? title : null

      await createPost({
        caption: caption || title,  // caption field; use title as fallback
        videoId: videoId,
        videoTitle: videoTitle || title,
        sport: sport,
      })

      resetForm()
      await fetchRecentPosts()        // refresh sidebar
      showToast("success", "Post published!", "Your highlight is live and visible to recruiters")
    } catch (err) {
      console.error("Failed to publish post:", err)
      const msg = err?.response?.data?.message || "Something went wrong. Please try again."
      showToast("error", "Failed to publish", msg)
    } finally {
      setPosting(false)
    }
  }

  // ── Delete post ────────────────────────────────────────────────────────────
  const handleDelete = async (postId) => {
    try {
      await deletePost(postId)
      setRecentPosts(prev => prev.filter(p => p._id !== postId))
      showToast("success", "Post deleted", "The post has been removed")
    } catch (err) {
      console.error("Failed to delete post:", err)
      showToast("error", "Failed to delete", "Could not remove this post. Try again.")
    }
  }

  // ── Author display 

  const authUser = getCurrentUser()
  const displayName = authUser
    ? `${authUser.firstName || ""} ${authUser.lastName || ""}`.trim() || "Athlete"
    : "Athlete"
  const displayHandle = authUser
    ? `@${(authUser.firstName || "").toLowerCase()}${(authUser.lastName || "").toLowerCase()}`
    : "@athlete"

  const displaySubtitle = [
    profile?.position,
    profile?.school,
  ].filter(Boolean).join(" · ")

  return (
    <div className="min-h-screen transition-colors duration-300"
      style={{ background: tk.page, fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Bebas+Neue&display=swap');
        @keyframes scIn  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        @keyframes spin  { to { transform:rotate(360deg) } }
        .sc-spin { animation:spin 1s linear infinite; }
      `}</style>

      <AthleteNavbar dark={dark} toggleDark={() => setDark(!dark)} />

      <div className="max-w-6xl mx-auto flex lg:gap-6 lg:px-4">

        {/* Left nav */}
        <div className="lg:w-52 xl:w-60 flex-shrink-0">
          <DesktopSideNav active={activeNav} setActive={setNav} dark={dark} />
        </div>

        {/* Main */}
        <main className="flex-1 min-w-0 pb-28 lg:pb-12"
          style={{ borderLeft: `1px solid ${tk.border}`, borderRight: `1px solid ${tk.border}` }}>
          <div className="px-4 pt-6 pb-4">

            {/* Page title */}
            <div className="mb-6">
              <h1 className="font-black text-2xl sm:text-3xl mb-1"
                style={{ fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "0.05em", color: tk.text }}>
                SHARE A HIGHLIGHT
              </h1>
              <p className="text-sm" style={{ color: tk.textMuted }}>
                Post your best moments and get noticed by recruiters
              </p>
            </div>

            <div className="flex gap-6">

              {/* ── Left: Form ── */}
              <div className="flex-1 min-w-0">

                {/* ── Author preview (REAL USER) ── */}
                <div className="flex items-center gap-3 mb-5 p-3 rounded-2xl"
                  style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
                  <Avatar name={displayName} size={40} />
                  <div>
                    <p className="font-bold text-sm" style={{ color: tk.text }}>{displayName}</p>
                    <p className="text-xs" style={{ color: tk.textMuted }}>
                      {displayHandle}{displaySubtitle ? ` · ${displaySubtitle}` : ""}
                    </p>
                  </div>
                  {profile?.sport && <SportBadge sport={profile.sport} />}
                </div>

                {/* ── Step 1: Post type ── */}
                <div className="mb-5">
                  <p className="text-xs font-bold mb-2" style={{ color: tk.textSub }}>Post Type</p>
                  <div className="grid grid-cols-3 gap-2">
                    {POST_TYPES.map(pt => {
                      const active = postType === pt.id
                      return (
                        <button key={pt.id} onClick={() => setPostType(pt.id)}
                          className="flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all text-center"
                          style={{
                            background: active ? `${pt.color}12` : tk.surface,
                            borderColor: active ? pt.color : tk.border,
                          }}>
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                            style={{ background: `${pt.color}18` }}>
                            <pt.icon className="w-4 h-4" style={{ color: pt.color }} />
                          </div>
                          <div>
                            <p className="text-xs font-bold leading-tight" style={{ color: active ? pt.color : tk.text }}>{pt.label}</p>
                            <p className="text-xs mt-0.5 leading-tight hidden sm:block" style={{ color: tk.textMuted }}>{pt.desc}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* ── Step 2: Video source ── */}
                <div className="mb-5 rounded-2xl overflow-hidden"
                  style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
                  <div className="flex" style={{ borderBottom: `1px solid ${tk.border}` }}>
                    {[
                      { id: "upload", icon: Upload, label: "Upload File" },
                      { id: "youtube", icon: Youtube, label: "YouTube Link" },
                    ].map(tab => {
                      const active = sourceTab === tab.id
                      return (
                        <button key={tab.id} onClick={() => setSourceTab(tab.id)}
                          className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-all relative"
                          style={{ color: active ? ACCENT : tk.textMuted }}>
                          <tab.icon className="w-4 h-4" />
                          {tab.label}
                          {active && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5"
                              style={{ background: ACCENT }} />
                          )}
                        </button>
                      )
                    })}
                  </div>

                  <div className="p-4">
                    {sourceTab === "upload"
                      ? <UploadZone dark={dark} file={videoFile} onFile={setVideoFile} onRemove={() => setVideoFile(null)} />
                      : <YouTubeInput value={ytLink} onChange={setYtLink} dark={dark} />
                    }
                  </div>
                </div>

                {/* ── Step 3: Details ── */}
                <div className="rounded-2xl p-4 mb-4"
                  style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
                  <p className="text-xs font-bold mb-4 flex items-center gap-1.5"
                    style={{ color: tk.textSub }}>
                    <Film className="w-3.5 h-3.5" style={{ color: ACCENT }} />
                    Post Details
                  </p>

                  <InputField
                    label="Title *"
                    placeholder="e.g. InterSchools Finals — Best Defensive Plays"
                    value={title}
                    onChange={setTitle}
                    dark={dark}
                    maxLength={80}
                    hint="A strong title gets more recruiter views"
                  />

                  <InputField
                    label="Caption"
                    placeholder="Describe this highlight — what makes it special? What game was this?"
                    value={caption}
                    onChange={setCaption}
                    multiline
                    rows={3}
                    dark={dark}
                    maxLength={300}
                  />

                  <div className="mb-4">
                    <label className="text-xs font-bold mb-2 block" style={{ color: tk.textSub }}>Sport</label>
                    <div className="flex flex-wrap gap-2">
                      {SPORTS.map(s => (
                        <button key={s} onClick={() => setSport(s)}
                          className="px-3 py-1.5 rounded-full text-xs font-bold border transition-all"
                          style={{
                            background: sport === s ? `${ACCENT}12` : "transparent",
                            borderColor: sport === s ? ACCENT : tk.border,
                            color: sport === s ? ACCENT : tk.textMuted,
                          }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <TagPicker tags={tags} setTags={setTags} dark={dark} />
                </div>

                {/* ── Step 4: Settings ── */}
                <div className="rounded-2xl p-4 mb-6"
                  style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
                  <p className="text-xs font-bold mb-4 flex items-center gap-1.5"
                    style={{ color: tk.textSub }}>
                    <Eye className="w-3.5 h-3.5" style={{ color: ACCENT }} />
                    Visibility & Settings
                  </p>

                  <SelectDropdown
                    label="Who can see this?"
                    options={VISIBILITY_OPTIONS}
                    value={visibility}
                    onChange={setVisibility}
                    dark={dark}
                  />

                  <div className="flex items-center justify-between p-3 rounded-xl"
                    style={{ background: tk.inputBg, border: `1px solid ${tk.inputBorder}` }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                        style={{ background: "rgba(245,158,11,0.15)" }}>
                        <Star className="w-4 h-4" style={{ color: "#F59E0B" }} />
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: tk.text }}>Pin as Featured Highlight</p>
                        <p className="text-xs" style={{ color: tk.textMuted }}>Show at the top of your profile</p>
                      </div>
                    </div>
                    <button onClick={() => setFeatured(!featuredReel)}
                      className="w-11 h-6 rounded-full transition-all relative flex-shrink-0"
                      style={{ background: featuredReel ? ACCENT : dark ? "rgba(255,255,255,0.1)" : "#E5E7EB" }}>
                      <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all"
                        style={{ left: featuredReel ? "calc(100% - 22px)" : "2px" }} />
                    </button>
                  </div>
                </div>

                {/* ── Publish button ── */}
                <div className="flex gap-3">
                  <button
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-black transition-all relative overflow-hidden"
                    style={{
                      background: canPost
                        ? `linear-gradient(135deg, ${ACCENT}, #6366F1)`
                        : dark ? "rgba(255,255,255,0.06)" : "#F3F4F6",
                      color: canPost ? "#fff" : tk.textMuted,
                      cursor: canPost && !posting ? "pointer" : "not-allowed",
                      opacity: posting ? 0.8 : 1,
                    }}
                    onClick={handlePost}
                    disabled={!canPost || posting}
                  >
                    {posting ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white sc-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        {canPost ? "Publish Highlight" : "Add a video + title to post"}
                      </>
                    )}
                  </button>

                  <button
                    className="px-5 py-3.5 rounded-2xl text-sm font-bold border transition-all"
                    style={{ borderColor: tk.border, color: tk.textSub }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = ACCENT}
                    onMouseLeave={e => e.currentTarget.style.borderColor = tk.border}
                  >
                    Save Draft
                  </button>
                </div>

                {!canPost && (
                  <p className="text-xs mt-3 text-center flex items-center justify-center gap-1.5"
                    style={{ color: tk.textMuted }}>
                    <AlertCircle className="w-3.5 h-3.5" />
                    {!hasVideo && !title ? "Add a video and title to publish" :
                      !hasVideo ? "Add a video (upload or YouTube link)" :
                        "Add a title to publish"}
                  </p>
                )}
              </div>

              {/* ── Right sidebar (desktop) ── */}
              <div className="hidden xl:flex flex-col gap-4 w-64 flex-shrink-0">
                <TipsCard dark={dark} />
                <RecentPosts dark={dark} posts={recentPosts} onDelete={handleDelete} />
              </div>
            </div>

            {/* Mobile sidebar below form */}
            <div className="xl:hidden mt-6 space-y-4">
              <TipsCard dark={dark} />
              <RecentPosts dark={dark} posts={recentPosts} onDelete={handleDelete} />
            </div>

          </div>
        </main>
      </div>

      <MobileBottomNav dark={dark} />

      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          subMessage={toast.subMessage}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  )
}