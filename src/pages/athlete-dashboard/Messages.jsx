// src/pages/AthleteMessages.jsx

import { useState, useRef, useEffect } from "react"
import { Link } from "react-router"
import AthleteNavbar    from "./../../components/AthleteNavbar"
import MobileBottomNav  from "./../../components/athlete-dashboard/TempMobileBottomNav"
import DesktopSideNav   from "./../../components/athlete-dashboard/TempDesktopSideNav"
import {
  Search, Send, X, Check, CheckCheck,
  ChevronLeft, Paperclip, MoreVertical,
  GraduationCap, MapPin, Award, ExternalLink
} from "lucide-react"

// ─────────────────────────────────────────────────────────────────────────────
// THEME  (athlete blue)
// ─────────────────────────────────────────────────────────────────────────────
const ACCENT = "#1DA8FF"

const THEME = {
  dark: {
    page:        "#0D1117",
    surface:     "#161B22",
    surfaceHigh: "#1C2128",
    border:      "rgba(255,255,255,0.06)",
    text:        "#F0F6FF",
    textSub:     "#9CA3AF",
    textMuted:   "#4B5563",
    hover:       "rgba(255,255,255,0.035)",
  },
  light: {
    page:        "#F0F4FA",
    surface:     "#FFFFFF",
    surfaceHigh: "#F8FAFC",
    border:      "#E5E7EB",
    text:        "#111827",
    textSub:     "#6B7280",
    textMuted:   "#9CA3AF",
    hover:       "rgba(0,0,0,0.025)",
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA  (recruiters messaging the athlete)
// ─────────────────────────────────────────────────────────────────────────────
const CONVERSATIONS = [
  {
    id: 1,
    name:        "Coach David Mensah",
    institution: "University of Ghana",
    role:        "Head Scout",
    initials:    "DM",
    sport:       "Soccer",
    verified:    true,
    online:      true,
    unread:      1,
    lastMsg:     "We'd love to invite you for a campus visit and trial session.",
    lastTime:    "5m",
    messages: [
      { id:1, from:"them", text:"Hello James! We've been following your highlights this season — your defensive work is exceptional.", time:"Mon 9:10am", read:true  },
      { id:2, from:"me",   text:"Thank you Coach Mensah! That means a lot coming from UG.",                                          time:"Mon 9:45am", read:true  },
      { id:3, from:"them", text:"We're very interested in offering you a place in our program for the 2026 intake.",                 time:"Mon 10:00am", read:true  },
      { id:4, from:"me",   text:"I'd love to hear more about what the program looks like.",                                          time:"Mon 10:20am", read:true  },
      { id:5, from:"them", text:"We'd love to invite you for a campus visit and trial session.",                                      time:"5m",          read:false },
    ]
  },
  {
    id: 2,
    name:        "Coach Esi Quaye",
    institution: "KNUST",
    role:        "Athletics Director",
    initials:    "EQ",
    sport:       "Soccer",
    verified:    true,
    online:      false,
    unread:      0,
    lastMsg:     "Let us know when you're available for a call.",
    lastTime:    "2h",
    messages: [
      { id:1, from:"them", text:"Hi James, KNUST Athletics has been watching your InterSchools performance closely.", time:"Sun 3:00pm", read:true },
      { id:2, from:"me",   text:"Hi Coach Quaye, thank you so much! I've heard great things about KNUST's program.", time:"Sun 4:30pm", read:true },
      { id:3, from:"them", text:"Let us know when you're available for a call.",                                       time:"2h",        read:true },
    ]
  },
  {
    id: 3,
    name:        "Coach Abena Frimpong",
    institution: "Cape Coast University",
    role:        "Soccer Coach",
    initials:    "AF",
    sport:       "Soccer",
    verified:    false,
    online:      true,
    unread:      0,
    lastMsg:     "We have a partial scholarship to discuss with you.",
    lastTime:    "Yesterday",
    messages: [
      { id:1, from:"them", text:"James, your regional tournament highlights were impressive. Cape Coast would love to have you.",   time:"Sat 11am",   read:true },
      { id:2, from:"me",   text:"Thank you Coach! I'm currently exploring my options.",                                            time:"Sat 12pm",   read:true },
      { id:3, from:"them", text:"We have a partial scholarship to discuss with you.",                                              time:"Yesterday",  read:true },
    ]
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// RECRUITER AVATAR  (initials + gradient)
// ─────────────────────────────────────────────────────────────────────────────
const GRADS = [
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-violet-500 to-purple-600",
]
function RecAvatar({ initials, size = 40, index = 0 }) {
  return (
    <div className={`rounded-full bg-gradient-to-br ${GRADS[index % 3]} flex items-center justify-center text-white font-bold flex-shrink-0`}
      style={{ width:size, height:size, fontSize:size*0.32 }}>
      {initials}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CONVERSATION LIST ITEM
// ─────────────────────────────────────────────────────────────────────────────
function ConvoItem({ convo, index, active, onClick, dark }) {
  const tk = dark ? THEME.dark : THEME.light
  return (
    <button onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all"
      style={{
        background:   active ? `${ACCENT}10`              : "transparent",
        borderLeft:   active ? `2px solid ${ACCENT}`       : "2px solid transparent",
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = tk.hover }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent" }}>
      <div className="relative flex-shrink-0">
        <RecAvatar initials={convo.initials} size={42} index={index} />
        {convo.online && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2"
            style={{ background:"#10B981", borderColor:tk.surface }} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 min-w-0">
            <p className="text-sm font-bold truncate" style={{ color:tk.text }}>{convo.name}</p>
            {convo.verified && <span style={{ color:"#F59E0B", fontSize:10 }}>✦</span>}
          </div>
          <span className="text-xs flex-shrink-0" style={{ color:tk.textMuted }}>{convo.lastTime}</span>
        </div>
        <p className="text-xs truncate mt-0.5" style={{ color:tk.textMuted }}>{convo.institution}</p>
        <p className="text-xs truncate"
          style={{ color: convo.unread>0 ? tk.text : tk.textMuted, fontWeight: convo.unread>0 ? 600 : 400 }}>
          {convo.lastMsg}
        </p>
      </div>
      {convo.unread > 0 && (
        <span className="w-4 h-4 rounded-full flex items-center justify-center text-white font-black flex-shrink-0"
          style={{ background:ACCENT, fontSize:9 }}>{convo.unread}</span>
      )}
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MESSAGE BUBBLE
// ─────────────────────────────────────────────────────────────────────────────
function Bubble({ msg, dark }) {
  const tk   = dark ? THEME.dark : THEME.light
  const isMe = msg.from === "me"
  return (
    <div className={`flex ${isMe?"justify-end":"justify-start"} mb-2`}>
      <div className="max-w-[75%] sm:max-w-[60%]">
        <div className="px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
          style={{
            background:   isMe
              ? `linear-gradient(135deg,${ACCENT},#1a8fd1)`
              : tk.surfaceHigh,
            color:        isMe ? "#fff" : tk.text,
            borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          }}>
          {msg.text}
        </div>
        <div className={`flex items-center gap-1 mt-1 ${isMe?"justify-end":"justify-start"}`}>
          <span className="text-xs" style={{ color:tk.textMuted }}>{msg.time}</span>
          {isMe && (
            msg.read
              ? <CheckCheck className="w-3 h-3" style={{ color:ACCENT }} />
              : <Check      className="w-3 h-3" style={{ color:tk.textMuted }} />
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function AthleteMessages() {
  const [dark, setDark]         = useState(false)
  const [activeNav, setNav]     = useState("messages")
  const [convos, setConvos]     = useState(CONVERSATIONS)
  const [activeId, setActiveId] = useState(1)
  const [input, setInput]       = useState("")
  const [query, setQuery]       = useState("")
  const [showList, setShowList] = useState(true)
  const bottomRef               = useRef(null)
  const tk = dark ? THEME.dark : THEME.light

  const active    = convos.find(c => c.id === activeId)
  const activeIdx = convos.findIndex(c => c.id === activeId)
  const totalUnread = convos.reduce((sum, c) => sum + c.unread, 0)

  const openConvo = id => {
    setActiveId(id)
    setShowList(false)
    setConvos(prev => prev.map(c =>
      c.id === id
        ? { ...c, unread:0, messages:c.messages.map(m => ({ ...m, read:true })) }
        : c
    ))
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth" })
  }, [active?.messages.length, activeId])

  const sendMessage = () => {
    if (!input.trim()) return
    const msg = { id:Date.now(), from:"me", text:input.trim(), time:"now", read:false }
    setConvos(prev => prev.map(c =>
      c.id === activeId
        ? { ...c, messages:[...c.messages, msg], lastMsg:input.trim(), lastTime:"now" }
        : c
    ))
    setInput("")
  }

  const filtered = convos.filter(c =>
    !query ||
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.institution.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="min-h-screen transition-colors duration-300"
      style={{ background:tk.page, fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800;900&family=Bebas+Neue&display=swap');`}</style>

      <AthleteNavbar dark={dark} toggleDark={() => setDark(!dark)} />

      <div className="max-w-6xl mx-auto flex lg:gap-6 lg:px-4">
        <div className="lg:w-52 xl:w-60 flex-shrink-0">
          <DesktopSideNav active={activeNav} setActive={setNav} dark={dark} />
        </div>

        <main className="flex-1 min-w-0 pb-20 lg:pb-0"
          style={{ borderLeft:`1px solid ${tk.border}`, borderRight:`1px solid ${tk.border}` }}>

          <div className="flex" style={{ height:"calc(100vh - 64px)" }}>

            {/* ── Conversation list ── */}
            <div
              className={`flex-col flex-shrink-0 ${showList ? "flex" : "hidden"} lg:flex`}
              style={{ width:"100%", maxWidth:"320px", borderRight:`1px solid ${tk.border}` }}>

              {/* Header */}
              <div className="px-4 pt-5 pb-3 flex-shrink-0"
                style={{ borderBottom:`1px solid ${tk.border}` }}>
                <div className="flex items-center gap-2 mb-3">
                  <h1 className="font-black text-xl"
                    style={{ fontFamily:"'Bebas Neue',sans-serif", letterSpacing:"0.05em", color:tk.text }}>
                    MESSAGES
                  </h1>
                  {totalUnread > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-black text-white"
                      style={{ background:ACCENT }}>{totalUnread}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{ background:tk.surface, border:`1px solid ${tk.border}` }}>
                  <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color:tk.textMuted }} />
                  <input value={query} onChange={e => setQuery(e.target.value)}
                    placeholder="Search recruiters..."
                    className="flex-1 bg-transparent text-xs outline-none"
                    style={{ color:tk.text }} />
                  {query && (
                    <button onClick={() => setQuery("")}>
                      <X className="w-3 h-3" style={{ color:tk.textMuted }} />
                    </button>
                  )}
                </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth:"none" }}>
                {filtered.length === 0 ? (
                  <p className="text-sm text-center py-12" style={{ color:tk.textMuted }}>No conversations found</p>
                ) : filtered.map((c, i) => (
                  <div key={c.id} style={{ borderBottom:`1px solid ${tk.border}` }}>
                    <ConvoItem convo={c} index={i} active={activeId===c.id}
                      onClick={() => openConvo(c.id)} dark={dark} />
                  </div>
                ))}
              </div>
            </div>

            {/* ── Chat panel ── */}
            <div className={`flex-1 flex-col min-w-0 ${!showList ? "flex" : "hidden"} lg:flex`}>
              {active ? (
                <>
                  {/* Chat header */}
                  <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
                    style={{ borderBottom:`1px solid ${tk.border}` }}>
                    <button onClick={() => setShowList(true)}
                      className="lg:hidden w-8 h-8 flex items-center justify-center flex-shrink-0"
                      style={{ color:tk.textMuted }}>
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <RecAvatar initials={active.initials} size={38} index={activeIdx} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-sm" style={{ color:tk.text }}>{active.name}</p>
                        {active.verified && <span style={{ color:"#F59E0B", fontSize:10 }}>✦</span>}
                      </div>
                      <p className="text-xs" style={{ color:tk.textMuted }}>
                        {active.role} · {active.institution} ·{" "}
                        <span style={{ color: active.online ? "#10B981" : tk.textMuted }}>
                          {active.online ? "● Online" : "● Offline"}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Link to="/recruiter/profile"
                        className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                        style={{ color:tk.textMuted }}
                        onMouseEnter={e => e.currentTarget.style.color=ACCENT}
                        onMouseLeave={e => e.currentTarget.style.color=tk.textMuted}>
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                        style={{ color:tk.textMuted }}
                        onMouseEnter={e => e.currentTarget.style.color=ACCENT}
                        onMouseLeave={e => e.currentTarget.style.color=tk.textMuted}>
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Recruiter context banner */}
                  <div className="flex items-center gap-2 px-4 py-2 flex-shrink-0 flex-wrap"
                    style={{ background:dark?"rgba(29,168,255,0.05)":"#EFF8FF", borderBottom:`1px solid ${ACCENT}20` }}>
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5" style={{ color:ACCENT }} />
                      <span className="text-xs font-semibold" style={{ color:tk.textSub }}>{active.institution}</span>
                    </div>
                    <span className="text-xs" style={{ color:tk.textMuted }}>·</span>
                    <div className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" style={{ color:"#F59E0B" }} />
                      <span className="text-xs" style={{ color:tk.textMuted }}>Verified Scout</span>
                    </div>
                    <Link to="/athlete/recruiters"
                      className="ml-auto text-xs font-bold" style={{ color:ACCENT }}>
                      View Offer →
                    </Link>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto px-4 py-4" style={{ scrollbarWidth:"none" }}>
                    {active.messages.map(msg => (
                      <Bubble key={msg.id} msg={msg} dark={dark} />
                    ))}
                    <div ref={bottomRef} />
                  </div>

                  {/* Input */}
                  <div className="px-4 py-3 flex-shrink-0"
                    style={{ borderTop:`1px solid ${tk.border}` }}>
                    <div className="flex items-end gap-2 rounded-2xl px-3 py-2"
                      style={{ background:tk.surface, border:`1px solid ${tk.border}` }}>
                      <textarea
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                        placeholder="Reply to recruiter..."
                        rows={1}
                        className="flex-1 bg-transparent text-sm outline-none resize-none leading-relaxed py-1"
                        style={{ color:tk.text, maxHeight:"120px" }}
                      />
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button className="w-8 h-8 flex items-center justify-center rounded-xl transition-all"
                          style={{ color:tk.textMuted }}
                          onMouseEnter={e => e.currentTarget.style.color=ACCENT}
                          onMouseLeave={e => e.currentTarget.style.color=tk.textMuted}>
                          <Paperclip className="w-4 h-4" />
                        </button>
                        <button onClick={sendMessage} disabled={!input.trim()}
                          className="w-8 h-8 flex items-center justify-center rounded-xl text-white transition-all disabled:opacity-40"
                          style={{ background:`linear-gradient(135deg,${ACCENT},#1a8fd1)` }}>
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs mt-1.5 text-center" style={{ color:tk.textMuted }}>
                      Enter to send · Shift+Enter for new line
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background:`${ACCENT}12` }}>
                    <Send className="w-7 h-7" style={{ color:ACCENT }} />
                  </div>
                  <p className="font-bold text-sm mb-1" style={{ color:tk.text }}>Select a conversation</p>
                  <p className="text-xs" style={{ color:tk.textMuted }}>Choose a recruiter to read their message</p>
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