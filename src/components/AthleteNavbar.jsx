import logo from "../assets/images/sc12.png";
import { Link, useLocation, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { Bell, Search, User, ChevronDown, Flame, LogOut, Settings, Trophy, Sun, Moon } from "lucide-react";
import { getCurrentUser, isLoggedIn, logoutUser } from "../api/client";
import NotificationBell from "./NotificationBell";

export default function AthleteNavbar({ dark = false, toggleDark }) {
  const [scrolled, setScrolled]         = useState(false);
  const [profileOpen, setProfileOpen]   = useState(false);
  const [searchOpen, setSearchOpen]     = useState(false);
  const [currentUser, setCurrentUser]   = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Load real user
  useEffect(() => {
    if (isLoggedIn()) {
      const user = getCurrentUser();
      setCurrentUser(user);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest("#profile-menu")) setProfileOpen(false);
      if (!e.target.closest("#search-bar"))   setSearchOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSignOut = () => {
    setProfileOpen(false);
    logoutUser();
  };

  // Build initials from real name
  const initials = currentUser
    ? `${currentUser.firstName?.[0] || ""}${currentUser.lastName?.[0] || ""}`.toUpperCase()
    : "SC";

  const fullName = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : "Athlete";

  const handle = currentUser?.handle || `@${currentUser?.firstName?.toLowerCase() || "athlete"}`;

  const navLinks = [
    { label: "Home",      to: "/athletedashboard"  },
    { label: "Explore",   to: "/athleteexplore"    },
    { label: "Recruiters",to: "/athleterecruiters" },
    { label: "My Profile",to: "/athleteprofile"    },
    { label: "Messages",  to: "/athletemessages"   },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800;900&family=Bebas+Neue&display=swap');
        .sc-nav { font-family: 'DM Sans', sans-serif; }
        .sc-logo-text { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.08em; }
        .sc-nav-link::after {
          content: ''; position: absolute; bottom: -2px; left: 0;
          width: 0; height: 2px; background: #1DA8FF; border-radius: 999px;
          transition: width 0.25s cubic-bezier(0.4,0,0.2,1);
        }
        .sc-nav-link:hover::after, .sc-nav-link.active::after { width: 100%; }
        .sc-logo-glow:hover { filter: drop-shadow(0 0 12px rgba(29,168,255,0.4)); transition: filter 0.3s ease; }
        .sc-search-input::placeholder { color: rgba(255,255,255,0.25); }
        .sc-dropdown { animation: dropIn 0.18s cubic-bezier(0.4,0,0.2,1); }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .sc-notif-dot { animation: pulse-dot 2s infinite; }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.7; transform: scale(1.3); }
        }
      `}</style>

      <nav className={`sc-nav fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${dark
        ? scrolled
          ? "bg-[#0D1117]/95 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.06)]"
          : "bg-[#0D1117]"
        : scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-md border-b border-gray-200"
          : "bg-white border-b border-gray-200"
        }`}>

        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#1DA8FF] to-transparent opacity-60" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">

            {/* Logo */}
            <Link to="/athletedashboard" className="flex items-center gap-2.5 group sc-logo-glow flex-shrink-0">
              <div className="relative">
                <img src={logo} alt="SportConnect logo" className="w-9 h-9 sm:w-10 sm:h-10 object-contain relative z-10" />
                <div className="absolute inset-0 rounded-full bg-[#1DA8FF]/20 scale-125 blur-sm group-hover:bg-[#1DA8FF]/35 transition-colors" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="sc-logo-text text-white text-xl sm:text-2xl tracking-widest leading-none">SPORTS</span>
                <span className="sc-logo-text text-[#1DA8FF] text-xl sm:text-2xl tracking-widest leading-none -mt-0.5">CONNECT</span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ label, to }) => {
                const isActive = location.pathname === to;
                return (
                  <Link key={to} to={to}
                    className={`sc-nav-link relative px-3 py-1.5 text-sm font-semibold transition-colors ${
                      isActive
                        ? dark ? "text-white active" : "text-gray-900 active"
                        : dark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"
                    }`}>
                    {label}
                  </Link>
                );
              })}
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-1 sm:gap-2">

              {/* Search */}
              <div id="search-bar" className="relative">
                {/* <button onClick={() => setSearchOpen(!searchOpen)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-all">
                  <Search className="w-4 h-4" />
                </button> */}
                {searchOpen && (
                  <div className="sc-dropdown absolute right-0 top-11 w-64 bg-[#161B22] border border-white/8 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="flex items-center gap-2 px-3 py-2.5">
                      <Search className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                      <input autoFocus placeholder="Search athletes, sports..."
                        className="sc-search-input bg-transparent text-white text-sm outline-none flex-1 placeholder-gray-600" />
                    </div>
                    <div className="border-t border-white/5 px-3 py-2">
                      <p className="text-gray-600 text-xs font-medium mb-1.5">Trending</p>
                      {["#InterSchoolsFinals","#RecruitSeason2026","#GhanaAthletics"].map(t => (
                        <button key={t} className="w-full text-left text-[#1DA8FF] text-xs py-1 hover:text-white transition-colors font-medium">{t}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Notifications */}
             <NotificationBell dark={dark} accentColor="#1DA8FF" />

              {/* Recruiter Interest Badge */}
              {/* <div className="hidden sm:flex items-center gap-1.5 bg-[#1DA8FF]/10 border border-[#1DA8FF]/20 rounded-full px-2.5 py-1">
                <Flame className="w-3 h-3 text-[#1DA8FF]" />
                <span className="text-[#1DA8FF] text-xs font-bold">High Interest</span>
              </div> */}

              {/* Dark mode toggle */}
              <button onClick={toggleDark}
                title={dark ? "Switch to light mode" : "Switch to dark mode"}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all"
                style={{ color:dark?"#FBBF24":"#6366F1", background:dark?"rgba(251,191,36,.08)":"rgba(99,102,241,.08)" }}>
                {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Profile Dropdown */}
              <div id="profile-menu" className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/8 rounded-xl px-2 py-1.5 transition-all">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    {initials}
                  </div>
                  <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform hidden sm:block ${profileOpen?"rotate-180":""}`} />
                </button>

                {profileOpen && (
                  <div className="sc-dropdown absolute right-0 top-11 w-52 bg-[#161B22] border border-white/8 rounded-2xl shadow-2xl overflow-hidden">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-white/5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                          {initials}
                        </div>
                        <div>
                          <p className="text-white text-xs font-bold">{fullName}</p>
                          <p className="text-gray-600 text-xs">{handle}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    {[
                      { icon:User,     label:"View Profile", to:"/athleteprofile"  },
                      { icon:Settings, label:"Settings",     to:"/athletesettings" },
                    ].map(({ icon:Icon, label, to }) => (
                      <Link key={to} to={to} onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm">
                        <Icon className="w-3.5 h-3.5" />
                        {label}
                      </Link>
                    ))}

                    <div className="border-t border-white/5">
                      <button onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors text-sm">
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
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
  );
}