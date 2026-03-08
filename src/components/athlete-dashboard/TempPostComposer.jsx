// src/components/PostComposer.jsx

import { useState } from "react"
import { Video, Upload } from "lucide-react"

const THEME = {
  dark: {
    border:      "rgba(255,255,255,0.06)",
    text:        "#F0F6FF",
    textMuted:   "#4B5563",
  },
  light: {
    border:      "#E5E7EB",
    text:        "#111827",
    textMuted:   "#9CA3AF",
  }
}

const ACCENT = "#1DA8FF"

export default function PostComposer({ dark }) {
  const [text, setText]       = useState("")
  const [focused, setFocused] = useState(false)
  const tk = dark ? THEME.dark : THEME.light

  return (
    <div
      className="px-4 py-4"
      style={{ borderBottom: `1px solid ${tk.border}` }}
    >
      <div className="flex gap-3">

        {/* ── Current user avatar ── */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          JJ
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
                className="flex items-center gap-1.5 text-xs font-semibold transition-opacity hover:opacity-70"
                style={{ color: ACCENT }}
              >
                <Video className="w-4 h-4" />
                Video
              </button>

              <button
                className="flex items-center gap-1.5 text-xs font-semibold transition-opacity hover:opacity-70"
                style={{ color: ACCENT }}
              >
                <Upload className="w-4 h-4" />
                Upload
              </button>
            </div>

            {/* Post button */}
            <button
              disabled={!text.trim()}
              className="text-white rounded-full px-4 py-1.5 text-xs font-bold transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: ACCENT }}
            >
              Post
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}