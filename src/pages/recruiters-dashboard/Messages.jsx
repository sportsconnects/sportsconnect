// src/pages/RecruiterMessages.jsx

import { useState, useRef, useEffect } from "react"
import RecruiterNavbar    from "../../components/RecruiterNavbar"
import RecruiterBottomNav from "../../components/RecruiterBottomNav"
import { RAvatar, RecruiterSideNav, SportBadge, ACCENT, ACCENT2, THEME } from "../../components/RecruiterUi"
import {
  Search, Send, X, Check, CheckCheck,
  MoreVertical, Phone, Video, ChevronLeft,
  Paperclip, Smile, Award, Clock
} from "lucide-react"

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const CONVERSATIONS = [
  {
    id: 1, name:"James Junior", sport:"Soccer", position:"Center Back",
    verified: true, unread: 2, online: true,
    lastMsg: "Thank you Coach! I'd love to learn more about the program.",
    lastTime: "2m",
    messages: [
      { id:1, from:"them", text:"Hello Coach Mensah, I saw your interest in my profile. Thank you so much!", time:"Mon 9:10am",  read:true  },
      { id:2, from:"me",   text:"Hi James! Yes, we've been following your highlights. Your defensive work is exceptional.", time:"Mon 9:45am", read:true },
      { id:3, from:"them", text:"That means a lot coming from UG. I've always admired the program.", time:"Mon 10:01am", read:true  },
      { id:4, from:"me",   text:"We'd like to invite you for a campus visit and trial session. Are you available next month?", time:"Mon 10:15am", read:true },
      { id:5, from:"them", text:"Thank you Coach! I'd love to learn more about the program.", time:"2m",          read:false },
    ]
  },
  {
    id: 2, name:"Kofi Mensah", sport:"Soccer", position:"Striker",
    verified: true, unread: 0, online: false,
    lastMsg: "I will send my latest highlight reel by Friday.",
    lastTime: "1h",
    messages: [
      { id:1, from:"me",   text:"Hi Kofi, your goal-scoring record this season has been outstanding.", time:"Sun 2:00pm", read:true },
      { id:2, from:"them", text:"Thank you Coach! It's been a great season for the team.", time:"Sun 2:30pm", read:true },
      { id:3, from:"me",   text:"We'd love to see your latest highlight reel if you have one available.", time:"Sun 3:00pm", read:true },
      { id:4, from:"them", text:"I will send my latest highlight reel by Friday.", time:"1h", read:true },
    ]
  },
  {
    id: 3, name:"Ama Asante", sport:"Track & Field", position:"Sprinter",
    verified: false, unread: 0, online: true,
    lastMsg: "My 100m PB is 11.4s set at the regionals.",
    lastTime: "3h",
    messages: [
      { id:1, from:"me",   text:"Ama, your regional championship run was incredible. Have you been timed officially?", time:"Sat 11am", read:true },
      { id:2, from:"them", text:"Yes Coach! My 100m PB is 11.4s set at the regionals.", time:"3h", read:true },
    ]
  },
  {
    id: 4, name:"Kwame Boateng", sport:"Basketball", position:"Point Guard",
    verified: true, unread: 1, online: false,
    lastMsg: "Would Tuesday work for a call?",
    lastTime: "Yesterday",
    messages: [
      { id:1, from:"me",   text:"Kwame, your court vision in the InterSchools final was elite. We're very interested.", time:"Fri 4pm",      read:true  },
      { id:2, from:"them", text:"Coach Mensah! I've heard great things about the UG program.", time:"Fri 5pm",      read:true  },
      { id:3, from:"me",   text:"I'd like to schedule a call to discuss opportunities. What's your availability?", time:"Fri 6pm",      read:true  },
      { id:4, from:"them", text:"Would Tuesday work for a call?", time:"Yesterday", read:false },
    ]
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// CONVERSATION LIST ITEM
// ─────────────────────────────────────────────────────────────────────────────
function ConvoItem({ convo, active, onClick, dark }) {
  const tk = dark ? THEME.dark : THEME.light
  return (
    <button onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all"
      style={{ background: active ? `${ACCENT}10` : "transparent", borderLeft: active ? `2px solid ${ACCENT}` : "2px solid transparent" }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = tk.hover }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent" }}>
      {/* Avatar with online dot */}
      <div className="relative flex-shrink-0">
        <RAvatar name={convo.name} size={42} />
        {convo.online && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2"
            style={{ background:"#10B981", borderColor:tk.surface }} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 min-w-0">
            <p className="text-sm font-bold truncate" style={{ color:tk.text }}>{convo.name}</p>
            {convo.verified && <span style={{ color:"#1DA8FF", fontSize:10 }}>✦</span>}
          </div>
          <span className="text-xs flex-shrink-0" style={{ color:tk.textMuted }}>{convo.lastTime}</span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className="text-xs truncate flex-1" style={{ color: convo.unread>0 ? tk.text : tk.textMuted,
            fontWeight: convo.unread>0 ? 600 : 400 }}>
            {convo.lastMsg}
          </p>
          {convo.unread > 0 && (
            <span className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
              style={{ background:ACCENT, fontSize:9 }}>{convo.unread}</span>
          )}
        </div>
      </div>
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
            background:   isMe ? `linear-gradient(135deg,${ACCENT},${ACCENT2})` : tk.surfaceHigh || (dark?"#1C2128":"#F3F4F6"),
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
export default function RecruiterMessages() {
  const [dark, setDark]         = useState(false)
  const [convos, setConvos]     = useState(CONVERSATIONS)
  const [activeId, setActiveId] = useState(1)
  const [input, setInput]       = useState("")
  const [query, setQuery]       = useState("")
  const [showList, setShowList] = useState(true) // mobile: toggle between list/chat
  const bottomRef               = useRef(null)
  const tk = dark ? THEME.dark : THEME.light

  const active = convos.find(c => c.id === activeId)

  // Mark as read when opened
  const openConvo = (id) => {
    setActiveId(id)
    setShowList(false)
    setConvos(prev => prev.map(c =>
      c.id === id ? { ...c, unread:0, messages:c.messages.map(m => ({ ...m, read:true })) } : c
    ))
  }

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth" })
  }, [active?.messages.length, activeId])

  const sendMessage = () => {
    if (!input.trim()) return
    const newMsg = { id:Date.now(), from:"me", text:input.trim(), time:"now", read:false }
    setConvos(prev => prev.map(c =>
      c.id === activeId
        ? { ...c, messages:[...c.messages, newMsg], lastMsg:input.trim(), lastTime:"now" }
        : c
    ))
    setInput("")
  }

  const filteredConvos = convos.filter(c =>
    !query || c.name.toLowerCase().includes(query.toLowerCase())
  )

  const totalUnread = convos.reduce((sum, c) => sum + c.unread, 0)

  return (
    <div className="min-h-screen transition-colors duration-300"
      style={{ background:tk.page, fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800;900&family=Bebas+Neue&display=swap');`}</style>

      <RecruiterNavbar dark={dark} toggleDark={() => setDark(!dark)} />

      <div className="max-w-6xl mx-auto flex lg:gap-6 lg:px-4">
        <RecruiterSideNav dark={dark} />

        <main className="flex-1 min-w-0 pb-20 lg:pb-0"
          style={{ borderLeft:`1px solid ${tk.border}`, borderRight:`1px solid ${tk.border}` }}>

          {/* Messages layout: split panel */}
          <div className="flex h-[calc(100vh-64px)]">

            {/* ── Conversation list ── */}
            <div
              className={`flex-shrink-0 flex flex-col ${showList?"flex":"hidden"} lg:flex`}
              style={{
                width: "100%",
                maxWidth: "100%",
                ...(typeof window !== "undefined" && window.innerWidth >= 1024
                  ? { width:"300px", maxWidth:"300px" }
                  : {}),
                borderRight:`1px solid ${tk.border}`,
              }}>
              {/* List header */}
              <div className="px-4 pt-5 pb-3" style={{ borderBottom:`1px solid ${tk.border}` }}>
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
                    placeholder="Search conversations..."
                    className="flex-1 bg-transparent text-xs outline-none"
                    style={{ color:tk.text }} />
                  {query && <button onClick={() => setQuery("")}><X className="w-3 h-3" style={{ color:tk.textMuted }} /></button>}
                </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth:"none" }}>
                {filteredConvos.length === 0 ? (
                  <div className="py-12 text-center px-4">
                    <p className="text-sm" style={{ color:tk.textMuted }}>No conversations found</p>
                  </div>
                ) : filteredConvos.map(c => (
                  <div key={c.id} style={{ borderBottom:`1px solid ${tk.border}` }}>
                    <ConvoItem convo={c} active={activeId===c.id} onClick={() => openConvo(c.id)} dark={dark} />
                  </div>
                ))}
              </div>
            </div>

            {/* ── Chat panel ── */}
            <div className={`flex-1 flex flex-col min-w-0 ${!showList?"flex":"hidden"} lg:flex`}>
              {active ? (
                <>
                  {/* Chat header */}
                  <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
                    style={{ borderBottom:`1px solid ${tk.border}` }}>
                    {/* Back button — mobile only */}
                    <button onClick={() => setShowList(true)}
                      className="lg:hidden w-8 h-8 flex items-center justify-center rounded-xl flex-shrink-0"
                      style={{ color:tk.textMuted }}>
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="relative flex-shrink-0">
                      <RAvatar name={active.name} size={38} />
                      {active.online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2"
                          style={{ background:"#10B981", borderColor:tk.page }} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-sm" style={{ color:tk.text }}>{active.name}</p>
                        {active.verified && <span style={{ color:"#1DA8FF", fontSize:10 }}>✦</span>}
                      </div>
                      <p className="text-xs flex items-center gap-1.5" style={{ color:tk.textMuted }}>
                        <span style={{ color: active.online?"#10B981":tk.textMuted }}>
                          {active.online ? "● Online" : "● Offline"}
                        </span>
                        · {active.position}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                        style={{ color:tk.textMuted }}
                        onMouseEnter={e => e.currentTarget.style.color=ACCENT}
                        onMouseLeave={e => e.currentTarget.style.color=tk.textMuted}>
                        <Award className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                        style={{ color:tk.textMuted }}
                        onMouseEnter={e => e.currentTarget.style.color=ACCENT}
                        onMouseLeave={e => e.currentTarget.style.color=tk.textMuted}>
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Athlete context banner */}
                  <div className="flex items-center gap-2 px-4 py-2 flex-shrink-0"
                    style={{ background:dark?"rgba(245,158,11,0.05)":"#FFFBEB", borderBottom:`1px solid ${ACCENT}20` }}>
                    <SportBadge sport={active.sport} />
                    <p className="text-xs" style={{ color:tk.textMuted }}>
                      Viewing profile of <span className="font-bold" style={{ color:tk.text }}>{active.name}</span>
                    </p>
                    <button className="ml-auto text-xs font-bold" style={{ color:ACCENT }}>View Profile →</button>
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
                        placeholder="Type a message..."
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
                        <button
                          onClick={sendMessage}
                          disabled={!input.trim()}
                          className="w-8 h-8 flex items-center justify-center rounded-xl text-white transition-all disabled:opacity-40"
                          style={{ background:`linear-gradient(135deg,${ACCENT},${ACCENT2})` }}>
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
                  <p className="text-xs" style={{ color:tk.textMuted }}>Choose an athlete to start messaging</p>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>

      <RecruiterBottomNav dark={dark} />
    </div>
  )
}