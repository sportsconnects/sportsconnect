
import { useState, useEffect, useRef } from "react"
import { Bell, X, Check, Award, Heart, MessageSquare, Users, Share2, MessageCircle } from "lucide-react"
import {
  getNotifications, markAllNotificationsRead,
  markNotificationRead, isLoggedIn
} from "../api/client"
import { getSocket } from "../socket"

// ── Icon per notification type
function NotifIcon({ type }) {
  const map = {
    offer_received:  { icon: Award,          color: "#F59E0B" },
    offer_accepted:  { icon: Check,          color: "#10B981" },
    offer_declined:  { icon: X,              color: "#EF4444" },
    post_liked:      { icon: Heart,          color: "#EC4899" },
    post_commented:  { icon: MessageSquare,  color: "#1DA8FF" },
    post_shared:     { icon: Share2,         color: "#A855F7" },
    new_follower:    { icon: Users,          color: "#10B981" },
    new_message:     { icon: MessageCircle,  color: "#1DA8FF" },
  }
  const cfg  = map[type] || { icon: Bell, color: "#9CA3AF" }
  const Icon = cfg.icon

  return (
    <div
      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: `${cfg.color}18` }}
    >
      <Icon className="w-4 h-4" style={{ color: cfg.color }} />
    </div>
  )
}

function formatTime(dateStr) {
  if (!dateStr) return ""
  const diff = (Date.now() - new Date(dateStr)) / 1000
  if (diff < 60)      return "just now"
  if (diff < 3600)    return `${Math.floor(diff / 60)}m`
  if (diff < 86400)   return `${Math.floor(diff / 3600)}h`
  if (diff < 86400*7) return `${Math.floor(diff / 86400)}d`
  return new Date(dateStr).toLocaleDateString("en-GB", { day:"numeric", month:"short" })
}

export default function NotificationBell({ dark, accentColor = "#1DA8FF" }) {
  const [open,         setOpen]     = useState(false)
  const [notifs,       setNotifs]   = useState([])
  const [unread,       setUnread]   = useState(0)
  const [loading,      setLoading]  = useState(false)
  const panelRef = useRef(null)

  const ACCENT = accentColor

  const THEME = {
    dark: {
      surface:   "#161B22",
      border:    "rgba(255,255,255,0.06)",
      text:      "#F0F6FF",
      textSub:   "#9CA3AF",
      textMuted: "#4B5563",
      hover:     "rgba(255,255,255,0.035)",
      page:      "#0D1117",
    },
    light: {
      surface:   "#FFFFFF",
      border:    "#E5E7EB",
      text:      "#111827",
      textSub:   "#6B7280",
      textMuted: "#9CA3AF",
      hover:     "rgba(0,0,0,0.025)",
      page:      "#F0F4FA",
    },
  }
  const tk = dark ? THEME.dark : THEME.light

  // ── Fetch unread count on mount and every 60s
  useEffect(() => {
    if (!isLoggedIn()) return
    fetchCount()
    const interval = setInterval(fetchCount, 60000)
    return () => clearInterval(interval)
  }, [])

  // ── Listen for real-time notification count updates
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    const handleCount = ({ count }) => setUnread(count)
    const handleNew   = (notif)    => {
      setUnread(u => u + 1)
      // If panel is open, prepend it immediately
      if (open) setNotifs(prev => [notif, ...prev])
    }

    socket.on("notification_count",  handleCount)
    socket.on("new_notification",    handleNew)

    return () => {
      socket.off("notification_count", handleCount)
      socket.off("new_notification",   handleNew)
    }
  }, [open])

  // ── Close panel on outside click
  useEffect(() => {
    const fn = e => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener("mousedown", fn)
    return () => document.removeEventListener("mousedown", fn)
  }, [])

  const fetchCount = async () => {
    try {
      const { data } = await getNotifications({ limit: 1 })
      setUnread(data.unreadCount || 0)
    } catch {}
  }

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const { data } = await getNotifications({ limit: 20 })
      setNotifs(data.notifications || [])
      setUnread(data.unreadCount   || 0)
    } catch {}
    finally { setLoading(false) }
  }

  const handleOpen = async () => {
    setOpen(s => !s)
    if (!open) {
      await fetchNotifications()
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead()
      setNotifs(prev => prev.map(n => ({ ...n, read: true })))
      setUnread(0)
    } catch {}
  }

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id)
      setNotifs(prev => prev.map(n => n._id === id ? { ...n, read: true } : n))
      setUnread(u => Math.max(0, u - 1))
    } catch {}
  }

  return (
    <div className="relative" ref={panelRef}>

      {/* Bell button */}
      <button
        onClick={handleOpen}
        className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-all"
        style={{
          color:      open ? ACCENT : tk.textMuted || "#9CA3AF",
          background: open ? `${ACCENT}15` : "transparent",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = `${ACCENT}12` }}
        onMouseLeave={e => { e.currentTarget.style.background = open ? `${ACCENT}15` : "transparent" }}
      >
        <Bell className="w-4.5 h-4.5" />
        {unread > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full text-white font-black flex items-center justify-center"
            style={{ background: "#EF4444", fontSize: 9 }}
          >
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute top-11 right-0 z-50 rounded-2xl overflow-hidden"
          style={{
            width:     "340px",
            maxHeight: "480px",
            background: tk.surface,
            border:    `1px solid ${tk.border}`,
            boxShadow: dark
              ? "0 16px 48px rgba(0,0,0,0.6)"
              : "0 8px 32px rgba(0,0,0,0.12)",
            display:    "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{ borderBottom: `1px solid ${tk.border}` }}
          >
            <div className="flex items-center gap-2">
              <p className="font-black text-sm" style={{ color: tk.text }}>Notifications</p>
              {unread > 0 && (
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-black text-white"
                  style={{ background: ACCENT }}
                >
                  {unread}
                </span>
              )}
            </div>
            {unread > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-bold"
                style={{ color: ACCENT }}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
            {loading ? (
              <div className="space-y-1 p-2">
                {[0,1,2,3].map(i => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl animate-pulse">
                    <div className="w-8 h-8 rounded-xl flex-shrink-0" style={{ background: tk.border }} />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-2.5 rounded-full w-3/4" style={{ background: tk.border }} />
                      <div className="h-2 rounded-full w-1/2"   style={{ background: tk.border }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <Bell className="w-8 h-8 mb-3" style={{ color: tk.textMuted }} />
                <p className="text-sm font-semibold mb-1" style={{ color: tk.text }}>All caught up</p>
                <p className="text-xs" style={{ color: tk.textMuted }}>You have no notifications yet</p>
              </div>
            ) : (
              <div className="p-2">
                {notifs.map(n => (
                  <button
                    key={n._id}
                    onClick={() => !n.read && handleMarkRead(n._id)}
                    className="w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all mb-0.5"
                    style={{
                      background: n.read ? "transparent" : `${ACCENT}08`,
                      cursor:     n.read ? "default" : "pointer",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = tk.hover}
                    onMouseLeave={e => e.currentTarget.style.background = n.read ? "transparent" : `${ACCENT}08`}
                  >
                    <NotifIcon type={n.type} />
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs leading-relaxed"
                        style={{
                          color:      tk.text,
                          fontWeight: n.read ? 400 : 600,
                        }}
                      >
                        {n.message}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: tk.textMuted }}>
                        {formatTime(n.createdAt)}
                      </p>
                    </div>
                    {!n.read && (
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                        style={{ background: ACCENT }}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}