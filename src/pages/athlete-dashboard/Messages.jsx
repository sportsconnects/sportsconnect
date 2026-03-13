// src/pages/AthleteMessages.jsx

import { useState, useRef, useEffect } from "react"
import { Link } from "react-router"
import { toast } from "sonner"
import AthleteNavbar from "./../../components/AthleteNavbar"
import MobileBottomNav from "./../../components/athlete-dashboard/TempMobileBottomNav"
import DesktopSideNav from "./../../components/athlete-dashboard/TempDesktopSideNav"
import {
  Search, Send, X, Check, CheckCheck,
  ChevronLeft, Paperclip, MoreVertical,
  GraduationCap, Award, ExternalLink
} from "lucide-react"
import {
  getConversations,
  getMessages,
  sendMessage as sendMessageAPI,
  getCurrentUser,
} from "../../api/client"

// ─────────────────────────────────────────────────────────────────────────────
// THEME
// ─────────────────────────────────────────────────────────────────────────────
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
    hover: "rgba(255,255,255,0.035)",
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
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function formatTime(dateStr) {
  if (!dateStr) return ""
  const date = new Date(dateStr)
  const now = new Date()
  const diff = (now - date) / 1000 // seconds

  if (diff < 60) return "just now"
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  if (diff < 86400 * 2) return "Yesterday"
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
}

function getInitials(name = "") {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
}

// ─────────────────────────────────────────────────────────────────────────────
// AVATAR
// ─────────────────────────────────────────────────────────────────────────────
const GRADS = [
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-violet-500 to-purple-600",
]
function RecAvatar({ name = "", size = 40, index = 0 }) {
  return (
    <div
      className={`rounded-full bg-gradient-to-br ${GRADS[index % 3]} flex items-center justify-center text-white font-bold flex-shrink-0`}
      style={{ width: size, height: size, fontSize: size * 0.32 }}
    >
      {getInitials(name)}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CONVERSATION LIST ITEM
// ─────────────────────────────────────────────────────────────────────────────
function ConvoItem({ convo, index, active, onClick, dark }) {
  const tk = dark ? THEME.dark : THEME.light
  const name = convo.other
    ? `${convo.other.firstName} ${convo.other.lastName}`
    : "Unknown"

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all"
      style={{
        background: active ? `${ACCENT}10` : "transparent",
        borderLeft: active ? `2px solid ${ACCENT}` : "2px solid transparent",
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = tk.hover }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent" }}
    >
      <div className="relative flex-shrink-0">
        <RecAvatar name={name} size={42} index={index} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-bold truncate" style={{ color: tk.text }}>{name}</p>
          <span className="text-xs flex-shrink-0" style={{ color: tk.textMuted }}>
            {formatTime(convo.lastMessageAt)}
          </span>
        </div>
        <p className="text-xs truncate mt-0.5" style={{ color: tk.textMuted }}>
          {convo.other?.role || "Recruiter"}
        </p>
        <p
          className="text-xs truncate"
          style={{
            color: convo.unread > 0 ? tk.text : tk.textMuted,
            fontWeight: convo.unread > 0 ? 600 : 400,
          }}
        >
          {convo.lastMessage?.text || "No messages yet"}
        </p>
      </div>

      {convo.unread > 0 && (
        <span
          className="w-4 h-4 rounded-full flex items-center justify-center text-white font-black flex-shrink-0"
          style={{ background: ACCENT, fontSize: 9 }}
        >
          {convo.unread}
        </span>
      )}
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MESSAGE BUBBLE
// ─────────────────────────────────────────────────────────────────────────────
function Bubble({ msg, dark, currentUserId }) {
  const tk = dark ? THEME.dark : THEME.light

  // sender can be an object { _id, firstName } or just a string ID
  const senderId = msg.sender?._id || msg.sender
  const isMe = senderId?.toString() === currentUserId?.toString()
  const isRead = Array.isArray(msg.readBy) && msg.readBy.length > 1

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-2`}>
      <div className="max-w-[75%] sm:max-w-[60%]">
        <div
          className="px-3.5 py-2.5 text-sm leading-relaxed"
          style={{
            background: isMe ? `linear-gradient(135deg,${ACCENT},#1a8fd1)` : tk.surfaceHigh,
            color: isMe ? "#fff" : tk.text,
            borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          }}
        >
          {msg.text}
        </div>
        <div className={`flex items-center gap-1 mt-1 ${isMe ? "justify-end" : "justify-start"}`}>
          <span className="text-xs" style={{ color: tk.textMuted }}>
            {formatTime(msg.createdAt)}
          </span>
          {isMe && (
            isRead
              ? <CheckCheck className="w-3 h-3" style={{ color: ACCENT }} />
              : <Check className="w-3 h-3" style={{ color: tk.textMuted }} />
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LOADING SKELETON
// ─────────────────────────────────────────────────────────────────────────────
function ConvoSkeleton({ dark }) {
  const tk = dark ? THEME.dark : THEME.light
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 animate-pulse">
      <div className="w-10 h-10 rounded-full flex-shrink-0" style={{ background: tk.border }} />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 rounded-full w-32" style={{ background: tk.border }} />
        <div className="h-2.5 rounded-full w-48" style={{ background: tk.border }} />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function AthleteMessages() {
  const [dark, setDark] = useState(false)
  const [activeNav, setNav] = useState("messages")
  const [input, setInput] = useState("")
  const [query, setQuery] = useState("")
  const [showList, setShowList] = useState(true)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const tk = dark ? THEME.dark : THEME.light

  const [convos, setConvos] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [messages, setMessages] = useState([])
  const [loadingConvos, setLoadingConvos] = useState(true)
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const [sending, setSending] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef(null)


  const currentUser = getCurrentUser()
  const currentUserId = currentUser?._id || currentUser?.id

  // ── Derived
  const active = convos.find(c => c._id === activeId)
  const activeIdx = convos.findIndex(c => c._id === activeId)
  const totalUnread = convos.reduce((sum, c) => sum + (c.unread || 0), 0)

  const filtered = convos.filter(c => {
    if (!query) return true
    const name = `${c.other?.firstName} ${c.other?.lastName}`.toLowerCase()
    const role = (c.other?.role || "").toLowerCase()
    return name.includes(query.toLowerCase()) || role.includes(query.toLowerCase())
  })

  // ── Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length, activeId])

  // ── Load conversations on mount
  useEffect(() => {
    getConversations()
      .then(({ data }) => {
        const list = data.conversations || []
        setConvos(list)
        if (list.length > 0) {
          openConvo(list[0]._id)
        }
      })
      .catch(() => toast.error("Failed to load conversations"))
      .finally(() => setLoadingConvos(false))
  }, [])

  useEffect(() => {
    const fn = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false)
    }
    document.addEventListener("mousedown", fn)
    return () => document.removeEventListener("mousedown", fn)
  }, [])

  // ── Open a conversation and load its messages
  const openConvo = (id) => {
    setActiveId(id)
    setShowList(false)
    setLoadingMsgs(true)
    setMessages([])

    getMessages(id)
      .then(({ data }) => {
        setMessages(data.messages || [])
        // Reset unread in local state
        setConvos(prev => prev.map(c =>
          c._id === id ? { ...c, unread: 0 } : c
        ))
      })
      .catch(() => toast.error("Failed to load messages"))
      .finally(() => setLoadingMsgs(false))
  }

  // ── Send a message
  const handleSend = async () => {
    if (!input.trim() || !activeId || sending) return
    const text = input.trim()
    setInput("")
    setSending(true)

    // Optimistic message
    const tempId = "temp_" + Date.now()
    const tempMsg = {
      _id: tempId,
      sender: { _id: currentUserId, firstName: currentUser?.firstName },
      text,
      createdAt: new Date().toISOString(),
      readBy: [currentUserId],
      temp: true,
    }
    setMessages(prev => [...prev, tempMsg])

    try {
      const { data } = await sendMessageAPI(activeId, text)
      // Replace temp with real message
      setMessages(prev => prev.map(m => m._id === tempId ? data.message : m))
      // Update last message in convo list
      setConvos(prev => prev.map(c =>
        c._id === activeId
          ? { ...c, lastMessage: { text }, lastMessageAt: new Date().toISOString() }
          : c
      ))
    } catch {
      // Revert optimistic update
      setMessages(prev => prev.filter(m => m._id !== tempId))
      toast.error("Failed to send message")
      setInput(text)
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ background: tk.page, fontFamily: "'DM Sans','Segoe UI',sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800;900&family=Bebas+Neue&display=swap');`}</style>

      <AthleteNavbar dark={dark} toggleDark={() => setDark(!dark)} />

      <div className="max-w-6xl mx-auto flex lg:gap-6 lg:px-4">
        <div className="lg:w-52 xl:w-60 flex-shrink-0">
          <DesktopSideNav active={activeNav} setActive={setNav} dark={dark} />
        </div>

        <main
          className="flex-1 min-w-0 pb-20 lg:pb-0"
          style={{ borderLeft: `1px solid ${tk.border}`, borderRight: `1px solid ${tk.border}` }}
        >
          <div className="flex" style={{ height: "calc(100vh - 64px)" }}>

            {/* ── Conversation list ── */}
            <div
              className={`flex-col flex-shrink-0 ${showList ? "flex" : "hidden"} lg:flex`}
              style={{ width: "100%", maxWidth: "320px", borderRight: `1px solid ${tk.border}` }}
            >
              {/* Header */}
              <div
                className="px-4 pt-5 pb-3 flex-shrink-0"
                style={{ borderBottom: `1px solid ${tk.border}` }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <h1
                    className="font-black text-xl"
                    style={{ fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "0.05em", color: tk.text }}
                  >
                    MESSAGES
                  </h1>
                  {totalUnread > 0 && (
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-black text-white"
                      style={{ background: ACCENT }}
                    >
                      {totalUnread}
                    </span>
                  )}
                </div>
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{ background: tk.surface, border: `1px solid ${tk.border}` }}
                >
                  <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: tk.textMuted }} />
                  <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search conversations..."
                    className="flex-1 bg-transparent text-xs outline-none"
                    style={{ color: tk.text }}
                  />
                  {query && (
                    <button onClick={() => setQuery("")}>
                      <X className="w-3 h-3" style={{ color: tk.textMuted }} />
                    </button>
                  )}
                </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                {loadingConvos ? (
                  [0, 1, 2].map(i => <ConvoSkeleton key={i} dark={dark} />)
                ) : filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                    <p className="text-sm font-semibold mb-1" style={{ color: tk.text }}>
                      {query ? "No results" : "No conversations yet"}
                    </p>
                    <p className="text-xs" style={{ color: tk.textMuted }}>
                      {query ? "Try a different search" : "Recruiters who message you will appear here"}
                    </p>
                  </div>
                ) : filtered.map((c, i) => (
                  <div key={c._id} style={{ borderBottom: `1px solid ${tk.border}` }}>
                    <ConvoItem
                      convo={c}
                      index={i}
                      active={activeId === c._id}
                      onClick={() => openConvo(c._id)}
                      dark={dark}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* ── Chat panel ── */}
            <div className={`flex-1 flex-col min-w-0 ${!showList ? "flex" : "hidden"} lg:flex`}>
              {active ? (
                <>
                  {/* Chat header */}
                  <div
                    className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
                    style={{ borderBottom: `1px solid ${tk.border}` }}
                  >
                    <button
                      onClick={() => setShowList(true)}
                      className="lg:hidden w-8 h-8 flex items-center justify-center flex-shrink-0"
                      style={{ color: tk.textMuted }}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <RecAvatar
                      name={`${active.other?.firstName} ${active.other?.lastName}`}
                      size={38}
                      index={activeIdx}
                    />

                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm" style={{ color: tk.text }}>
                        {active.other?.firstName} {active.other?.lastName}
                      </p>
                      <p className="text-xs" style={{ color: tk.textMuted }}>
                        {active.other?.role || "Recruiter"}
                      </p>
                    </div>
{/* 
                    <div className="flex items-center gap-1 flex-shrink-0 relative" ref={menuRef}>
                      <button
                        onClick={() => setShowMenu(s => !s)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                        style={{ color: showMenu ? ACCENT : tk.textMuted, background: showMenu ? `${ACCENT}15` : "transparent" }}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {showMenu && (
                        <div
                          className="absolute top-10 right-0 z-50 rounded-2xl overflow-hidden min-w-[180px]"
                          style={{
                            background: tk.surface,
                            border: `1px solid ${tk.border}`,
                            boxShadow: dark ? "0 16px 48px rgba(0,0,0,0.5)" : "0 8px 32px rgba(0,0,0,0.12)",
                          }}
                        >
                          {[
                            {
                              label: "View Profile",
                              icon: ExternalLink,
                              action: () => {
                                const otherId = active?.other?._id || active?.other?.id
                                if (otherId) window.location.href = `/recruiter/${otherId}`
                                setShowMenu(false)
                              },
                              color: tk.textSub,
                            },
                            {
                              label: "Mark as Unread",
                              icon: Check,
                              action: () => {
                                setConvos(prev => prev.map(c =>
                                  c._id === activeId ? { ...c, unread: 1 } : c
                                ))
                                setShowMenu(false)
                                toast.success("Marked as unread")
                              },
                              color: tk.textSub,
                            },
                            {
                              label: "Delete Conversation",
                              icon: X,
                              action: () => {
                                setConvos(prev => prev.filter(c => c._id !== activeId))
                                setActiveId(null)
                                setMessages([])
                                setShowList(true)
                                setShowMenu(false)
                                toast.success("Conversation removed")
                              },
                              color: "#EF4444",
                            },
                          ].map(({ label, icon: Icon, action, color }) => (
                            <button
                              key={label}
                              onClick={action}
                              className="w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center gap-2.5 transition-colors"
                              style={{ color }}
                              onMouseEnter={e => e.currentTarget.style.background = tk.hover}
                              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                            >
                              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                              {label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div> */}
                  </div>

                  {/* Context banner */}
                  <div
                    className="flex items-center gap-2 px-4 py-2 flex-shrink-0 flex-wrap"
                    style={{
                      background: dark ? "rgba(29,168,255,0.05)" : "#EFF8FF",
                      borderBottom: `1px solid ${ACCENT}20`,
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5" style={{ color: ACCENT }} />
                      <span className="text-xs font-semibold" style={{ color: tk.textSub }}>
                        {active.other?.role || "Recruiter"}
                      </span>
                    </div>
                    <span className="text-xs" style={{ color: tk.textMuted }}>·</span>
                    <div className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" style={{ color: "#F59E0B" }} />
                      <span className="text-xs" style={{ color: tk.textMuted }}>SportsConnect Scout</span>
                    </div>
                    <Link
                      to="/athleterecruiters"
                      className="ml-auto text-xs font-bold"
                      style={{ color: ACCENT }}
                    >
                      View Offers →
                    </Link>
                  </div>

                  {/* Messages area */}
                  <div
                    className="flex-1 overflow-y-auto px-4 py-4"
                    style={{ scrollbarWidth: "none" }}
                  >
                    {loadingMsgs ? (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-xs" style={{ color: tk.textMuted }}>Loading messages...</p>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center px-4">
                        <p className="text-sm font-semibold mb-1" style={{ color: tk.text }}>
                          No messages yet
                        </p>
                        <p className="text-xs" style={{ color: tk.textMuted }}>
                          Send a message to start the conversation
                        </p>
                      </div>
                    ) : (
                      messages.map(msg => (
                        <Bubble
                          key={msg._id}
                          msg={msg}
                          dark={dark}
                          currentUserId={currentUserId}
                        />
                      ))
                    )}
                    <div ref={bottomRef} />
                  </div>

                  {/* Input */}
                  <div
                    className="px-4 py-3 flex-shrink-0"
                    style={{ borderTop: `1px solid ${tk.border}` }}
                  >
                    <div
                      className="flex items-end gap-2 rounded-2xl px-3 py-2"
                      style={{ background: tk.surface, border: `1px solid ${tk.border}` }}
                    >
                      <textarea
                        ref={inputRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Reply to recruiter..."
                        rows={1}
                        className="flex-1 bg-transparent text-sm outline-none resize-none leading-relaxed py-1"
                        style={{ color: tk.text, maxHeight: "120px", caretColor: ACCENT }}
                        onInput={e => {
                          e.target.style.height = "auto"
                          e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"
                        }}
                      />
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={handleSend}
                          disabled={!input.trim() || sending}
                          className="w-8 h-8 flex items-center justify-center rounded-xl text-white transition-all disabled:opacity-40"
                          style={{ background: `linear-gradient(135deg,${ACCENT},#1a8fd1)` }}
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs mt-1.5 text-center" style={{ color: tk.textMuted }}>
                      Enter to send · Shift+Enter for new line
                    </p>
                  </div>
                </>
              ) : (
                /* Empty state — no conversation selected */
                <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: `${ACCENT}12` }}
                  >
                    <Send className="w-7 h-7" style={{ color: ACCENT }} />
                  </div>
                  <p className="font-bold text-sm mb-1" style={{ color: tk.text }}>
                    {loadingConvos ? "Loading..." : "Select a conversation"}
                  </p>
                  <p className="text-xs" style={{ color: tk.textMuted }}>
                    {loadingConvos ? "Fetching your messages..." : "Choose a recruiter from the list to read their message"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <MobileBottomNav dark={dark} />
    </div>
  )
}