// src/components/recruiter/RecruiterNavbar.jsx

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router"
import logo from "../../src/assets/images/sc12.png"
import { Bell, Search, ChevronDown, LogOut, Settings, User, Sun, Moon } from "lucide-react"
import { ACCENT, ACCENT2, THEME } from "../../src/components/RecruiterUi"
import { logoutUser } from "../api/client"

const NAV_LINKS = [
  { label:"Dashboard",  to:"/recruiterdashboard"  },
  { label:"Athletes",   to:"/recruiterathletes"   },
  { label:"Shortlists", to:"/recruitershortlist" },
  { label:"Messages",   to:"/recruitermessages"   },
]

export default function RecruiterNavbar({ dark, toggleDark }) {
  const [scrolled,    setScrolled]    = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchOpen,  setSearchOpen]  = useState(false)
  const { pathname } = useLocation()
  const tk = dark ? THEME.dark : THEME.light

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])

  useEffect(() => {
    const fn = e => {
      if (!e.target.closest("#rec-profile")) setProfileOpen(false)
      if (!e.target.closest("#rec-search"))  setSearchOpen(false)
    }
    document.addEventListener("mousedown", fn)
    return () => document.removeEventListener("mousedown", fn)
  }, [])

  const handleSignOut = () => {
      setProfileOpen(false);
      logoutUser();
    };
  

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;600;700;800&display=swap');
        .rec-link::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:2px; background:${ACCENT}; border-radius:999px; transition:width .25s ease; }
        .rec-link:hover::after, .rec-link.active::after { width:100%; }
        .rec-drop { animation:recDrop .18s cubic-bezier(.4,0,.2,1); }
        @keyframes recDrop { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:none} }
      `}</style>

      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          fontFamily:    "'DM Sans',sans-serif",
          background:    scrolled
            ? dark ? "rgba(12,14,20,0.96)" : "rgba(250,250,247,0.96)"
            : dark ? THEME.dark.page       : THEME.light.page,
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom:   `1px solid ${tk.border}`,
        }}>

        {/* Amber top stripe */}
        <div className="h-[2px]"
          style={{ background:`linear-gradient(90deg,transparent,${ACCENT},${ACCENT2},transparent)`, opacity:.8 }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">

            {/* Logo */}
            <Link to="/recruiterdashboard" className="flex items-center gap-2.5 flex-shrink-0 group">
              <div className="relative">
                <img src={logo} alt="SportConnect" className="w-9 h-9 object-contain relative z-10" />
                <div className="absolute inset-0 rounded-full scale-125 blur-sm group-hover:opacity-80 transition-opacity"
                  style={{ background:`${ACCENT}20` }} />
              </div>
              <div className="flex flex-col leading-none">
                <span style={{ fontFamily:"'Bebas Neue',sans-serif", letterSpacing:"0.08em", color:tk.text, fontSize:20, lineHeight:1 }}>
                  SPORTS
                </span>
                <span style={{ fontFamily:"'Bebas Neue',sans-serif", letterSpacing:"0.08em", color:ACCENT, fontSize:20, lineHeight:1, marginTop:-1 }}>
                  CONNECT
                </span>
              </div>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-black ml-1 tracking-wide"
                style={{ background:`${ACCENT}15`, color:ACCENT, border:`1px solid ${ACCENT}30` }}>
                SCOUT
              </span>
            </Link>

            {/* Nav links */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ label, to }) => {
                const active = pathname === to
                return (
                  <Link key={to} to={to}
                    className={`rec-link relative px-3 py-1.5 text-sm font-semibold transition-colors ${active?"active":""}`}
                    style={{ color: active ? tk.text : tk.textMuted }}>
                    {label}
                  </Link>
                )
              })}
            </div>

            {/* Right */}
            <div className="flex items-center gap-1.5">

              {/* Search */}
              <div id="rec-search" className="relative">
                <button onClick={() => setSearchOpen(!searchOpen)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                  style={{ color:tk.textMuted, background:searchOpen?`${ACCENT}10`:"transparent" }}>
                  <Search className="w-4 h-4" />
                </button>
                {searchOpen && (
                  <div className="rec-drop absolute right-0 top-11 w-64 rounded-2xl overflow-hidden shadow-2xl z-50"
                    style={{ background:tk.surface, border:`1px solid ${tk.border}` }}>
                    <div className="flex items-center gap-2 px-3 py-2.5">
                      <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color:tk.textMuted }} />
                      <input autoFocus placeholder="Search athletes, schools..."
                        className="bg-transparent text-sm outline-none flex-1"
                        style={{ color:tk.text }} />
                    </div>
                    <div className="px-3 py-2" style={{ borderTop:`1px solid ${tk.border}` }}>
                      <p className="text-xs font-semibold mb-2" style={{ color:tk.textMuted }}>Quick searches</p>
                      {["Soccer · Class 2026","Basketball · Accra","Track & Field"].map(t => (
                        <button key={t} className="w-full text-left text-xs py-1.5 font-semibold transition-colors rounded-lg px-2"
                          style={{ color:ACCENT }}
                          onMouseEnter={e => e.currentTarget.style.background = `${ACCENT}08`}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Notifications */}
              <button className="relative w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ color:tk.textMuted }}>
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full" style={{ background:ACCENT }} />
              </button>

              {/* Theme toggle */}
              <button onClick={toggleDark}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                style={{
                  color:       dark ? "#FBBF24" : "#6366F1",
                  background:  dark ? "rgba(251,191,36,0.08)" : "rgba(99,102,241,0.08)",
                }}>
                {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Profile */}
              <div id="rec-profile" className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl border transition-all"
                  style={{ background:dark?"rgba(245,158,11,0.06)":THEME.light.surfaceHigh, borderColor:tk.border }}>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white font-black text-xs flex-shrink-0"
                    style={{ background:`linear-gradient(135deg,${ACCENT},${ACCENT2})` }}>DM</div>
                  <ChevronDown className="w-3 h-3 hidden sm:block transition-transform"
                    style={{ color:tk.textMuted, transform:profileOpen?"rotate(180deg)":"none" }} />
                </button>

                {profileOpen && (
                  <div className="rec-drop absolute right-0 top-11 w-52 rounded-2xl overflow-hidden shadow-2xl z-50"
                    style={{ background:tk.surface, border:`1px solid ${tk.border}` }}>
                    <div className="px-4 py-3" style={{ borderBottom:`1px solid ${tk.border}` }}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm"
                          style={{ background:`linear-gradient(135deg,${ACCENT},${ACCENT2})` }}>DM</div>
                        <div>
                          <p className="text-xs font-bold" style={{ color:tk.text }}>Coach David Mensah</p>
                          <p className="text-xs" style={{ color:tk.textMuted }}>University of Ghana</p>
                        </div>
                      </div>
                    </div>
                    {[
                      { icon:User,     label:"My Profile", to:"/recruiterprofile"  },
                      { icon:Settings, label:"Settings",   to:"/recruitersettings" },
                    ].map(({ icon:Icon, label, to }) => (
                      <Link key={to} to={to} onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
                        style={{ color:tk.textSub }}
                        onMouseEnter={e => e.currentTarget.style.background = tk.hover}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <Icon className="w-3.5 h-3.5" />{label}
                      </Link>
                    ))}
                    <div style={{ borderTop:`1px solid ${tk.border}` }}>
                      <button onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm"
                        style={{ color:"#EF4444" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.06)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <LogOut className="w-3.5 h-3.5" />Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="h-14 sm:h-16" />
    </>
  )
}