// src/components/PostComposer.jsx

import { useState, useRef } from "react"
import { Video, Upload, Youtube, X, Check, AlertCircle } from "lucide-react"
import { createPost, getCurrentUser } from "../../api/client"

const THEME = {
  dark: {
    border: "rgba(255,255,255,0.06)",
    text: "#F0F6FF",
    textMuted: "#4B5563",
  },
  light: {
    border: "#E5E7EB",
    text: "#111827",
    textMuted: "#9CA3AF",
  }
}

const ACCENT = "#1DA8FF"

export default function PostComposer({ dark }) {
  const [text, setText] = useState("")
  const [focused, setFocused] = useState(false)
  const [mode, setMode] = useState(null)   // null | "youtube" | "upload"
  const [ytLink, setYtLink] = useState("")
  const [videoFile, setFile] = useState(null)
  const [sport, setSport] = useState("")
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState("")
  const fileRef = useRef(null)

  const authUser = getCurrentUser()
  const initials = authUser ? `${authUser.firstName?.[0] ?? ""}${authUser.lastName?.[0] ?? ""}`.toUpperCase() : "?"

  const isYtValid = ytLink.includes("youtube.com") || ytLink.includes("youtu.be")
  const getYtId = url => url.match(/(?:v=|youtu\.be\/)([^&\n?#]+)/)?.[1] ?? null
  const canPost = text.trim() && (mode === null || (mode === "youtube" && isYtValid) || (mode === "upload" && videoFile))

  const tk = dark ? THEME.dark : THEME.light



  const handlePost = async () => {
    if (!canPost || posting) return
    setPosting(true)
    setError("")
    try {
      await createPost({
        caption: text.trim(),
        videoId: mode === "youtube" ? getYtId(ytLink) : null,
        videoTitle: mode === "youtube" ? text.trim() : null,
        sport: sport || null,
      })
      // reset
      setText(""); setYtLink(""); setFile(null); setMode(null); setSport(""); setFocused(false)
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to post. Try again.")
    } finally {
      setPosting(false)
    }
  }

  return (
    <div
      className="px-4 py-4"
      style={{ borderBottom: `1px solid ${tk.border}` }}
    >
      <div className="flex gap-3">

        {/* ── Current user avatar ── */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {initials}
        </div>

        <div className="flex-1">

          {/* ── Text input ── */}
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(!!text)}
            placeholder="Share your highlights, wins, or moments..."
            rows={2}
            className="w-full bg-transparent text-sm resize-none outline-none min-h-[52px] leading-relaxed"
            style={{ color: tk.text, caretColor: ACCENT }}
          />

          {/* YouTube link input */}
          {mode === "youtube" && (
            <div className="mt-2 flex items-center gap-2">
              <Youtube className="w-4 h-4 flex-shrink-0" style={{ color: "#FF0000" }} />
              <input
                value={ytLink}
                onChange={e => setYtLink(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="flex-1 bg-transparent text-xs outline-none"
                style={{ color: tk.text, borderBottom: `1px solid ${isYtValid ? "#10B981" : tk.border}` }}
              />
              {isYtValid
                ? <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#10B981" }} />
                : ytLink && <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#EF4444" }} />
              }
              <button onClick={() => { setMode(null); setYtLink("") }}>
                <X className="w-3.5 h-3.5" style={{ color: tk.textMuted }} />
              </button>
            </div>
          )}

          {/* File upload indicator */}
          {mode === "upload" && (
            <div className="mt-2 flex items-center gap-2">
              <input ref={fileRef} type="file" accept="video/*" className="hidden"
                onChange={e => setFile(e.target.files[0] || null)} />
              {videoFile
                ? (
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs truncate" style={{ color: tk.text }}>{videoFile.name}</span>
                    <button onClick={() => setFile(null)} className="ml-auto">
                      <X className="w-3.5 h-3.5" style={{ color: tk.textMuted }} />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => fileRef.current?.click()}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                    style={{ background: `${ACCENT}15`, color: ACCENT }}>
                    Choose video file
                  </button>
                )
              }
              <button onClick={() => { setMode(null); setFile(null) }}>
                <X className="w-3.5 h-3.5" style={{ color: tk.textMuted }} />
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "#EF4444" }}>
              <AlertCircle className="w-3 h-3" />{error}
            </p>
          )}

          {/* ── Action bar ── */}
          <div
            className="pt-3 flex items-center justify-between transition-opacity"
            style={{
              borderTop: `1px solid ${tk.border}`,
              opacity: focused || text ? 1 : 0.5,
            }}
          >
            {/* Upload buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMode(mode === "youtube" ? null : "youtube")}
                className="flex items-center gap-1.5 text-xs font-semibold transition-opacity hover:opacity-70"
                style={{ color: mode === "youtube" ? "#10B981" : ACCENT }}
              >
                <Youtube className="w-4 h-4" />
                {mode === "youtube" ? "YouTube ✓" : "YouTube"}
              </button>

              <button
                onClick={() => { setMode(mode === "upload" ? null : "upload"); setTimeout(() => fileRef.current?.click(), 50) }}
                className="flex items-center gap-1.5 text-xs font-semibold transition-opacity hover:opacity-70"
                style={{ color: mode === "upload" ? "#10B981" : ACCENT }}
              >
                <Upload className="w-4 h-4" />
                {mode === "upload" && videoFile ? "File ✓" : "Upload"}
              </button>
            </div>

            {/* Post button */}
            <button
              onClick={handlePost}
              disabled={!canPost || posting}
              className="text-white rounded-full px-4 py-1.5 text-xs font-bold transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: ACCENT }}
            >
              {posting ? "Posting..." : "Post"}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}