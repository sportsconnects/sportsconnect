// src/pages/AthleteAI.jsx

import { useState, useEffect, useRef } from "react"
import AthleteNavbar from "./../../components/AthleteNavbar"
import DesktopSideNav from "./../../components/athlete-dashboard/TempDesktopSideNav"
import MobileBottomNav from "./../../components/athlete-dashboard/TempMobileBottomNav"
import Avatar from "./../../components/athlete-dashboard/TempAvatar"
import {
    Sparkles, Send, ChevronRight, Dumbbell, Trophy,
    TrendingUp, Eye, Zap, RotateCcw, Copy, Check,
    Brain, Target, Flame, Star, BookOpen, Activity,
    MessageSquare, ChevronDown, X
} from "lucide-react"
import { getAthleteById, getCurrentUser, chatWithAI } from "../../api/client"

const ACCENT = "#1DA8FF"

const THEME = {
    dark: {
        page: "#0A0E17",
        surface: "#111827",
        surfaceHigh: "#1a2235",
        border: "rgba(255,255,255,0.07)",
        text: "#F0F6FF",
        textSub: "#94A3B8",
        textMuted: "#3D4F6B",
        hover: "rgba(255,255,255,0.04)",
        inputBg: "#0D1321",
        inputBorder: "rgba(255,255,255,0.09)",
        glow: "rgba(29,168,255,0.15)",
    },
    light: {
        page: "#F0F4FA",
        surface: "#FFFFFF",
        surfaceHigh: "#F8FAFC",
        border: "#E2E8F0",
        text: "#0F172A",
        textSub: "#475569",
        textMuted: "#94A3B8",
        hover: "rgba(0,0,0,0.025)",
        inputBg: "#F8FAFC",
        inputBorder: "#CBD5E1",
        glow: "rgba(29,168,255,0.08)",
    }
}

// ─── Mock athlete profile (replace with real API call)
const MOCK_PROFILE = {
    firstName: "James",
    lastName: "Junior",
    sport: "Soccer",
    position: "Center Back",
    school: "St Peter's Boys",
    region: "Eastern Region",
    classOf: "2026",
    height: "6'1\"",
    gpa: "3.4",
    achievements: ["Regional Champion 2024", "School MVP"],
    highlights: [{ title: "InterSchools Finals" }],
}

// ─── Quick prompt suggestions per sport/position
const QUICK_PROMPTS = {
    Soccer: [
        "Give me a weekly drill plan for a Center Back",
        "How do I improve my positioning and reading of the game?",
        "What should I include in my highlight reel to attract scouts?",
        "Create a 30-day fitness program for a defender",
        "How do I increase my profile visibility to college scouts?",
    ],
    Basketball: [
        "Give me point guard drills to improve my handles",
        "How do I create a highlight reel scouts will notice?",
        "Build me a 30-day athletic training program",
        "What stats matter most to college basketball coaches?",
    ],
    "Track & Field": [
        "Design a sprint training block for 100m improvement",
        "How do I capture my best race moments for recruitment?",
        "What do college coaches look for in sprinters?",
        "Build a strength and conditioning plan for sprinters",
    ],
    Swimming: [
        "Give me drills to improve my freestyle technique",
        "How do I showcase my times to college coaches?",
        "Build a dry-land training program for swimmers",
    ],
    Volleyball: [
        "Give me vertical jump training drills",
        "How do I build a standout volleyball recruiting profile?",
        "Design a weekly skill training plan for a setter",
    ],
}

const DEFAULT_PROMPTS = [
    "Give me a personalized training plan",
    "How do I get noticed by recruiters?",
    "What should my highlight reel include?",
    "Build me a fitness program for my sport",
]

// ─── Category chips
const CATEGORIES = [
    { id: "drills", icon: Dumbbell, label: "Drills", color: "#1DA8FF" },
    { id: "fitness", icon: Activity, label: "Fitness", color: "#10B981" },
    { id: "exposure", icon: Eye, label: "Exposure", color: "#F59E0B" },
    { id: "mindset", icon: Brain, label: "Mindset", color: "#A855F7" },
    { id: "nutrition", icon: Flame, label: "Nutrition", color: "#EF4444" },
    { id: "recruiting", icon: Trophy, label: "Recruiting", color: "#06B6D4" },
]

// ─── Build system prompt from athlete profile
function buildSystemPrompt(profile) {
    return `You are SC Coach — an elite sports development AI on SportsConnect, Ghana's premier student-athlete recruitment platform.

You are coaching this specific athlete:
- Name: ${profile.firstName} ${profile.lastName}
- Sport: ${profile.sport}
- Position: ${profile.position}
- School: ${profile.school}
- Region: ${profile.region}, Ghana
- Class of: ${profile.classOf}
- Height: ${profile.height || "Not specified"}
- GPA: ${profile.gpa || "Not specified"}
- Achievements: ${profile.achievements?.join(", ") || "None listed"}
- Highlights posted: ${profile.highlights?.length || 0}

Your role:
1. Provide POSITION-SPECIFIC drills and training plans (a Center Back gets defensive drills, not striker drills)
2. Build fitness programs tailored to their sport's physical demands
3. Give concrete advice on building their SportsConnect profile for maximum recruiter visibility
4. Offer recruitment readiness tips based on their current profile completeness
5. Keep advice actionable, specific, and encouraging

Formatting rules:
- Use **bold** for exercise names and key terms
- Use numbered lists for drill sequences or steps
- Use bullet points for tips and advice
- Keep responses focused and practical
- Reference their specific sport, position, school, and region when relevant
- Speak directly to them using their first name occasionally
- Be energetic and motivating but professional`
}

// ─── Parse markdown-like formatting
function parseMessage(text) {
    const lines = text.split("\n")
    return lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-2" />

        // Bold
        const parts = line.split(/\*\*(.*?)\*\*/g)
        const formatted = parts.map((p, j) =>
            j % 2 === 1 ? <strong key={j} style={{ color: "#F0F6FF", fontWeight: 700 }}>{p}</strong> : p
        )

        if (line.match(/^\d+\./)) {
            return (
                <div key={i} className="flex gap-2 mb-1.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-black mt-0.5"
                        style={{ background: "rgba(29,168,255,0.2)", color: ACCENT }}>
                        {line.match(/^(\d+)/)[1]}
                    </span>
                    <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>
                        {formatted.map((p, j) => typeof p === "string" ? p.replace(/^\d+\.\s*/, "") : p)}
                    </p>
                </div>
            )
        }

        if (line.startsWith("- ") || line.startsWith("• ")) {
            return (
                <div key={i} className="flex gap-2 mb-1.5">
                    <span className="flex-shrink-0 mt-2 w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} />
                    <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>
                        {formatted.map((p, j) => typeof p === "string" ? p.replace(/^[-•]\s*/, "") : p)}
                    </p>
                </div>
            )
        }

        if (line.startsWith("###") || line.startsWith("##") || line.startsWith("#")) {
            return (
                <p key={i} className="font-black text-sm mb-2 mt-3" style={{ color: "#F0F6FF" }}>
                    {line.replace(/^#+\s*/, "")}
                </p>
            )
        }

        return (
            <p key={i} className="text-sm leading-relaxed mb-1.5" style={{ color: "#94A3B8" }}>
                {formatted}
            </p>
        )
    })
}

// ─── Message bubble
function MessageBubble({ msg, profile }) {
    const [copied, setCopied] = useState(false)
    const isAI = msg.role === "assistant"

    const handleCopy = () => {
        navigator.clipboard.writeText(msg.content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (!isAI) {
        return (
            <div className="flex justify-end mb-4">
                <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-tr-sm text-sm font-medium"
                    style={{ background: `linear-gradient(135deg, ${ACCENT}, #6366F1)`, color: "#fff" }}>
                    {msg.content}
                </div>
            </div>
        )
    }

    return (
        <div className="flex gap-3 mb-5 group">
            {/* AI Avatar */}
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "linear-gradient(135deg, rgba(29,168,255,0.3), rgba(99,102,241,0.3))", border: "1px solid rgba(29,168,255,0.3)" }}>
                <Sparkles className="w-4 h-4" style={{ color: ACCENT }} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-black" style={{ color: ACCENT }}>SC COACH</span>
                    <span className="text-xs" style={{ color: "#3D4F6B" }}>·</span>
                    <span className="text-xs" style={{ color: "#3D4F6B" }}>
                        {profile.sport} · {profile.position}
                    </span>
                </div>

                <div className="rounded-2xl rounded-tl-sm px-4 py-3"
                    style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)" }}>
                    {msg.streaming ? (
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                                {[0, 1, 2].map(i => (
                                    <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT, animation: `dotBounce 1.4s ease-in-out ${i * 0.2}s infinite` }} />
                                ))}
                            </div>
                            <span className="text-xs" style={{ color: "#3D4F6B" }}>SC Coach is thinking...</span>
                        </div>
                    ) : (
                        <div>{parseMessage(msg.content)}</div>
                    )}
                </div>

                {/* Copy button */}
                {!msg.streaming && (
                    <button onClick={handleCopy}
                        className="opacity-0 group-hover:opacity-100 transition-opacity mt-1.5 flex items-center gap-1 text-xs px-2 py-1 rounded-lg"
                        style={{ color: "#3D4F6B" }}>
                        {copied ? <Check className="w-3 h-3" style={{ color: "#10B981" }} /> : <Copy className="w-3 h-3" />}
                        {copied ? "Copied" : "Copy"}
                    </button>
                )}
            </div>
        </div>
    )
}

// ─── Profile context card
function ProfileContextCard({ profile, dark }) {
    const tk = dark ? THEME.dark : THEME.light
    const name = `${profile.firstName} ${profile.lastName}`

    const completeness = [
        !!profile.sport, !!profile.position, !!profile.school,
        !!profile.height, !!profile.gpa, (profile.highlights?.length > 0),
        (profile.achievements?.length > 0),
    ].filter(Boolean).length

    const pct = Math.round((completeness / 7) * 100)

    return (
        <div className="rounded-2xl p-4 mb-4"
            style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
            <div className="flex items-center gap-3 mb-3">
                <Avatar name={name} size={40} />
                <div>
                    <p className="font-black text-sm" style={{ color: tk.text }}>{name}</p>
                    <p className="text-xs" style={{ color: tk.textMuted }}>
                        {profile.position} · {profile.sport}
                    </p>
                </div>
                <div className="ml-auto text-right">
                    <p className="font-black text-lg leading-none" style={{ color: ACCENT }}>{pct}%</p>
                    <p className="text-xs" style={{ color: tk.textMuted }}>Profile</p>
                </div>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 rounded-full overflow-hidden mb-3" style={{ background: tk.border }}>
                <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${ACCENT}, #6366F1)` }} />
            </div>

            <div className="grid grid-cols-2 gap-2">
                {[
                    [profile.sport, "Sport"],
                    [profile.position, "Position"],
                    [profile.school, "School"],
                    [`Class of ${profile.classOf}`, "Year"],
                ].map(([val, label]) => (
                    <div key={label} className="px-2 py-1.5 rounded-xl"
                        style={{ background: tk.surfaceHigh }}>
                        <p className="text-xs font-bold truncate" style={{ color: tk.text }}>{val || "—"}</p>
                        <p className="text-xs" style={{ color: tk.textMuted }}>{label}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

// ─── Suggested prompts sidebar
function SuggestedPrompts({ profile, onSelect, dark }) {
    const tk = dark ? THEME.dark : THEME.light
    const prompts = QUICK_PROMPTS[profile.sport] || DEFAULT_PROMPTS

    return (
        <div className="rounded-2xl overflow-hidden"
            style={{ background: tk.surface, border: `1px solid ${tk.border}` }}>
            <div className="px-4 py-3 flex items-center gap-2"
                style={{ borderBottom: `1px solid ${tk.border}` }}>
                <Zap className="w-3.5 h-3.5" style={{ color: "#F59E0B" }} />
                <p className="text-xs font-black" style={{ color: tk.text }}>QUICK PROMPTS</p>
            </div>
            <div>
                {prompts.map((p, i) => (
                    <button key={i} onClick={() => onSelect(p)}
                        className="w-full text-left px-4 py-2.5 text-xs flex items-center gap-2 transition-all group"
                        style={{ borderBottom: i < prompts.length - 1 ? `1px solid ${tk.border}` : "none", color: tk.textSub }}
                        onMouseEnter={e => e.currentTarget.style.background = tk.hover}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <ChevronRight className="w-3 h-3 flex-shrink-0 transition-transform group-hover:translate-x-0.5" style={{ color: ACCENT }} />
                        <span className="leading-snug">{p}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

// ─── Category selector
function CategorySelector({ selected, onSelect, dark }) {
    const tk = dark ? THEME.dark : THEME.light
    return (
        <div className="flex gap-2 overflow-x-auto pb-1 mb-4" style={{ scrollbarWidth: "none" }}>
            {CATEGORIES.map(cat => {
                const active = selected === cat.id
                const Icon = cat.icon
                return (
                    <button key={cat.id} onClick={() => onSelect(active ? null : cat.id)}
                        className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border"
                        style={{
                            background: active ? `${cat.color}18` : "transparent",
                            borderColor: active ? cat.color : tk.border,
                            color: active ? cat.color : tk.textMuted,
                        }}>
                        <Icon className="w-3 h-3" />
                        {cat.label}
                    </button>
                )
            })}
        </div>
    )
}

// ─── Welcome screen (no messages yet)
function WelcomeScreen({ profile, onPrompt, dark }) {
    const tk = dark ? THEME.dark : THEME.light
    const prompts = (QUICK_PROMPTS[profile.sport] || DEFAULT_PROMPTS).slice(0, 4)

    return (
        <div className="flex flex-col items-center justify-center h-full px-4 py-12 text-center">

            {/* Animated logo */}
            <div className="relative mb-6">
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, rgba(29,168,255,0.2), rgba(99,102,241,0.2))", border: "1px solid rgba(29,168,255,0.3)" }}>
                    <Sparkles className="w-9 h-9" style={{ color: ACCENT }} />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: "#10B981" }}>
                    <span className="text-white font-black" style={{ fontSize: 9 }}>AI</span>
                </div>
            </div>

            <h2 className="font-black text-2xl mb-1"
                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em", color: tk.text }}>
                SC COACH
            </h2>
            <p className="text-sm mb-2" style={{ color: tk.textSub }}>
                Your personal <span style={{ color: ACCENT }}>{profile.sport}</span> development coach
            </p>
            <p className="text-xs mb-8 max-w-xs leading-relaxed" style={{ color: tk.textMuted }}>
                Personalized drills, fitness programs, and recruitment tips — all built around your profile as a <strong style={{ color: tk.textSub }}>{profile.position}</strong> from {profile.school}.
            </p>

            {/* Suggested prompts grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {prompts.map((p, i) => {
                    const cat = CATEGORIES[i % CATEGORIES.length]
                    const Icon = cat.icon
                    return (
                        <button key={i} onClick={() => onPrompt(p)}
                            className="text-left px-4 py-3 rounded-2xl text-xs font-semibold transition-all border group"
                            style={{ background: tk.surface, borderColor: tk.border, color: tk.textSub }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.color = tk.text }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = tk.border; e.currentTarget.style.color = tk.textSub }}>
                            <div className="flex items-center gap-2 mb-1.5">
                                <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                                    style={{ background: `${cat.color}18` }}>
                                    <Icon className="w-3.5 h-3.5" style={{ color: cat.color }} />
                                </div>
                                <span className="text-xs font-black uppercase tracking-wide" style={{ color: cat.color, fontSize: 9 }}>
                                    {cat.label}
                                </span>
                            </div>
                            <p className="leading-snug">{p}</p>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

// ─── MAIN PAGE
export default function AthleteAI() {
    const [dark, setDark] = useState(false)
    const [activeNav, setNav] = useState("ai")
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [category, setCategory] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loadingProfile, setLoadingProfile] = useState(true)
    const [showSidebar, setShowSidebar] = useState(false)

    const bottomRef = useRef(null)
    const inputRef = useRef(null)
    const tk = dark ? THEME.dark : THEME.light


    useEffect(() => {
        const user = getCurrentUser()
        if (!user?._id && !user?.id) return
        const id = user._id || user.id
        getAthleteById(id)
            .then(({ data }) => {
                const p = data.profile
                const u = data.user ?? user
                setProfile({
                    firstName: u.firstName,
                    lastName: u.lastName,
                    sport: p?.sport || "—",
                    position: p?.position || "—",
                    school: p?.school || "—",
                    region: p?.region || "—",
                    classOf: p?.classOf || "—",
                    height: p?.height || null,
                    gpa: p?.gpa || null,
                    achievements: p?.achievements?.map(a => a.title || a) || [],
                    highlights: p?.highlights || [],
                })
            })
            .catch(() => {
                const user = getCurrentUser()
                setProfile({
                    firstName: user?.firstName || "Athlete",
                    lastName: user?.lastName || "",
                    sport: "—", position: "—", school: "—",
                    region: "—", classOf: "—",
                    achievements: [], highlights: [],
                })
            })
            .finally(() => setLoadingProfile(false))
    }, [])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    // ── Send message
    const sendMessage = async (text) => {
        const userText = (text || input).trim()
        if (!userText || loading || !profile) return

        const cat = CATEGORIES.find(c => c.id === category)
        const fullText = cat ? `[${cat.label}] ${userText}` : userText

        setInput("")
        setLoading(true)

       
        const timeout = setTimeout(() => {
            setMessages(prev => prev.map(m =>
                m.id === aiMsg.id && m.streaming
                    ? { ...m, content: "Taking a little longer than usual..." }
                    : m
            ))
        }, 8000)

        clearTimeout(timeout)

        const userMsg = { role: "user", content: userText, id: Date.now() }
        const aiMsg = { role: "assistant", content: "", streaming: true, id: Date.now() + 1 }

        setMessages(prev => [...prev, userMsg, aiMsg])

        try {
            const history = messages.map(m => ({ role: m.role, content: m.content }))

            const { data } = await chatWithAI(
                [...history, { role: "user", content: fullText }],
                profile
            )

            const reply = data.reply || "Sorry, I couldn't generate a response."

            setMessages(prev => prev.map(m =>
                m.id === aiMsg.id ? { ...m, content: reply, streaming: false } : m
            ))
        } catch (err) {
            setMessages(prev => prev.map(m =>
                m.id === aiMsg.id
                    ? { ...m, content: "Connection error. Please check your internet and try again.", streaming: false }
                    : m
            ))
        } finally {
            setLoading(false)
            inputRef.current?.focus()
        }
    }

    const handleKeyDown = e => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    const clearChat = () => setMessages([])

    if (loadingProfile || !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center"
                style={{ background: tk.page }}>
                <div className="text-center">
                    <Sparkles className="w-8 h-8 mx-auto mb-3" style={{ color: ACCENT }} />
                    <p className="text-sm" style={{ color: tk.textMuted }}>Loading your coaching profile...</p>
                </div>
            </div>
        )
    }


    return (
        <div className="min-h-screen transition-colors duration-300"
            style={{ background: tk.page, fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Bebas+Neue&display=swap');
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%            { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:none; }
        }
        .fade-up { animation: fadeUp 0.3s ease both; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
      `}</style>

            <AthleteNavbar dark={dark} toggleDark={() => setDark(!dark)} />

            <div className="max-w-6xl mx-auto flex lg:gap-6 lg:px-4">

                {/* Left nav */}
                <div className="lg:w-52 xl:w-60 flex-shrink-0">
                    <DesktopSideNav active={activeNav} setActive={setNav} dark={dark} />
                </div>

                {/* Main layout */}
                <div className="flex-1 min-w-0 flex"
                    style={{ borderLeft: `1px solid ${tk.border}`, borderRight: `1px solid ${tk.border}` }}>

                    {/* ── Chat area ── */}
                    <div className="flex-1 min-w-0 flex flex-col" style={{ height: "calc(100vh - 60px)" }}>

                        {/* Chat header */}
                        <div className="px-4 py-3 flex items-center justify-between flex-shrink-0"
                            style={{ borderBottom: `1px solid ${tk.border}`, background: dark ? "rgba(10,14,23,0.95)" : "rgba(248,250,252,0.95)", backdropFilter: "blur(12px)" }}>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                                    style={{ background: "linear-gradient(135deg, rgba(29,168,255,0.25), rgba(99,102,241,0.25))", border: "1px solid rgba(29,168,255,0.3)" }}>
                                    <Sparkles className="w-4 h-4" style={{ color: ACCENT }} />
                                </div>
                                <div>
                                    <p className="font-black text-sm" style={{ color: tk.text }}>SC Coach</p>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: "dotBounce 2s ease infinite" }} />
                                        <p className="text-xs" style={{ color: tk.textMuted }}>
                                            Personalized for {profile.firstName} · {profile.sport}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {messages.length > 0 && (
                                    <button onClick={clearChat}
                                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition-all"
                                        style={{ borderColor: tk.border, color: tk.textMuted }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = "#EF4444"; e.currentTarget.style.color = "#EF4444" }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = tk.border; e.currentTarget.style.color = tk.textMuted }}>
                                        <RotateCcw className="w-3 h-3" /> New Chat
                                    </button>
                                )}
                                {/* Mobile sidebar toggle */}
                                <button onClick={() => setShowSidebar(!showSidebar)}
                                    className="xl:hidden flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl border transition-all"
                                    style={{ borderColor: tk.border, color: tk.textMuted }}>
                                    <Target className="w-3 h-3" />
                                </button>
                            </div>
                        </div>

                        {/* Category filter */}
                        <div className="px-4 pt-3 flex-shrink-0">
                            <CategorySelector selected={category} onSelect={setCategory} dark={dark} />
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-4 py-2">
                            {messages.length === 0 ? (
                                <WelcomeScreen profile={profile} onPrompt={sendMessage} dark={dark} />
                            ) : (
                                <div className="max-w-2xl mx-auto py-4">
                                    {messages.map(msg => (
                                        <div key={msg.id} className="fade-up">
                                            <MessageBubble msg={msg} profile={profile} />
                                        </div>
                                    ))}
                                    <div ref={bottomRef} />
                                </div>
                            )}
                        </div>

                        {/* Input area */}
                        <div className="flex-shrink-0 px-4 pb-24 lg:pb-4 pt-3"
                            style={{ borderTop: `1px solid ${tk.border}` }}>
                            <div className="max-w-2xl mx-auto">
                                {/* Category badge if selected */}
                                {category && (
                                    <div className="flex items-center gap-2 mb-2">
                                        {(() => {
                                            const cat = CATEGORIES.find(c => c.id === category)
                                            const Icon = cat.icon
                                            return (
                                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                                                    style={{ background: `${cat.color}18`, color: cat.color, border: `1px solid ${cat.color}30` }}>
                                                    <Icon className="w-3 h-3" />
                                                    {cat.label} mode
                                                    <button onClick={() => setCategory(null)} className="ml-1 hover:opacity-70">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            )
                                        })()}
                                    </div>
                                )}

                                <div className="flex gap-2 items-end">
                                    <div className="flex-1 rounded-2xl px-4 py-3 flex items-end gap-2"
                                        style={{ background: tk.inputBg, border: `1px solid ${loading ? ACCENT + "60" : tk.inputBorder}`, transition: "border-color 0.2s" }}>
                                        <textarea
                                            ref={inputRef}
                                            value={input}
                                            onChange={e => setInput(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder={`Ask SC Coach about ${profile.sport} drills, fitness, recruiting...`}
                                            rows={1}
                                            disabled={loading}
                                            className="flex-1 bg-transparent text-sm outline-none resize-none leading-relaxed"
                                            style={{
                                                color: tk.text,
                                                maxHeight: "120px",
                                                caretColor: ACCENT,
                                            }}
                                            onInput={e => {
                                                e.target.style.height = "auto"
                                                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"
                                            }}
                                        />
                                    </div>

                                    <button
                                        onClick={() => sendMessage()}
                                        disabled={!input.trim() || loading}
                                        className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all"
                                        style={{
                                            background: input.trim() && !loading
                                                ? `linear-gradient(135deg, ${ACCENT}, #6366F1)`
                                                : tk.border,
                                            color: input.trim() && !loading ? "#fff" : tk.textMuted,
                                            cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                                        }}>
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>

                                <p className="text-xs mt-2 text-center" style={{ color: tk.textMuted }}>
                                    SC Coach knows your profile · {profile.position} · {profile.sport} · {profile.school}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── Right sidebar ── */}
                    <div className={`
            xl:flex flex-col gap-4 w-72 flex-shrink-0 p-4 overflow-y-auto
            ${showSidebar ? "flex fixed inset-0 z-50 pt-20 bg-black/80 backdrop-blur-sm xl:relative xl:bg-transparent xl:backdrop-blur-none" : "hidden xl:flex"}
          `}
                        style={{ borderLeft: `1px solid ${tk.border}`, maxHeight: "calc(100vh - 60px)" }}
                        onClick={e => { if (e.target === e.currentTarget) setShowSidebar(false) }}>
                        <div className="w-full xl:w-auto" onClick={e => e.stopPropagation()}>
                            <ProfileContextCard profile={profile} dark={dark} />
                            <SuggestedPrompts profile={profile} onSelect={(p) => { sendMessage(p); setShowSidebar(false) }} dark={dark} />
                        </div>
                    </div>
                </div>
            </div>

            <MobileBottomNav dark={dark} />
        </div>
    )
}