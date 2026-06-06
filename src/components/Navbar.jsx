import logo from "../assets/images/sc12.png"
import { Link } from "react-router"
import { useState, useEffect } from "react"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#050A14] backdrop-blur-md border-b border-white/8 py-2"
          : "bg-[#050A14]/80 backdrop-blur-sm border-b border-white/5 py-4"
      }`}
      style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Bebas+Neue&display=swap');`}</style>

      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="flex justify-between items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src={logo}
              alt="SportsConnect logo"
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span
              className="text-white font-bold text-base sm:text-lg tracking-wide leading-none"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", letterSpacing: "0.08em" }}
            >
              SPORTS CONNECT
            </span>
          </Link>

          {/* Sign In */}
          <Link to="/signin">
            <button className="relative group flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold text-white cursor-pointer transition-all duration-300"
              style={{ background: "#1DA8FF", boxShadow: "0 0 20px rgba(29,168,255,0.3)" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#0090e0"; e.currentTarget.style.boxShadow = "0 0 28px rgba(29,168,255,0.5)" }}
              onMouseLeave={e => { e.currentTarget.style.background = "#1DA8FF"; e.currentTarget.style.boxShadow = "0 0 20px rgba(29,168,255,0.3)" }}
            >
              Sign In
            </button>
          </Link>

        </div>
      </div>
    </nav>
  )
}