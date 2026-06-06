import { ArrowRight } from "lucide-react"
import { Link } from "react-router"
import { useState, useEffect } from "react"
import track from "../assets/images/track.jpg"
import swimming from "../assets/images/swimming.jpg"

const SPORTS_IMAGES = [
  "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=900&q=80", // basketball
  track, // track
  "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=900&q=80", // soccer
  swimming, // swimming
]

const SPORT_LABELS = ["Basketball", "Athletics", "Football", "Swimming"]

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % SPORTS_IMAGES.length)
        setFading(false)
      }, 600)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section
      className="relative min-h-screen flex items-stretch overflow-hidden bg-[#050A14]"
      style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;0,900;1,400&family=Bebas+Neue&display=swap');

        .hero-word { font-family: 'Bebas Neue', sans-serif; }

        .img-panel {
          transition: opacity 0.6s ease;
        }
        .img-panel.fading { opacity: 0; }

        .dot-active { background: #1DA8FF; transform: scaleX(2.5); }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .slide-up { animation: slideUp 0.8s ease forwards; }
        .delay-1  { animation-delay: 0.15s; opacity: 0; }
        .delay-2  { animation-delay: 0.3s;  opacity: 0; }
        .delay-3  { animation-delay: 0.45s; opacity: 0; }
        .delay-4  { animation-delay: 0.6s;  opacity: 0; }

        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        .live-dot::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: #1DA8FF;
          animation: pulse-ring 1.6s ease-out infinite;
        }

        .btn-primary {
          background: linear-gradient(135deg, #1DA8FF 0%, #0077cc 100%);
          box-shadow: 0 0 32px rgba(29,168,255,0.35);
          transition: box-shadow 0.3s, transform 0.2s;
        }
        .btn-primary:hover {
          box-shadow: 0 0 48px rgba(29,168,255,0.55);
          transform: translateY(-2px);
        }
        .btn-secondary {
          border: 1px solid rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(8px);
          transition: background 0.2s, transform 0.2s;
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,0.1);
          transform: translateY(-2px);
        }

        .tag-pill {
          border: 1px solid rgba(29,168,255,0.3);
          background: rgba(29,168,255,0.08);
          color: #1DA8FF;
        }

        .stat-block { border-left: 2px solid rgba(29,168,255,0.3); }

        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
        }
      `}</style>

      {/* Noise overlay */}
      <div className="noise-overlay absolute inset-0 z-10" />

      {/* Left — Content */}
      <div className="relative z-20 flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-20 w-full lg:w-[52%] py-24">

        {/* Live badge */}
        <div className="slide-up delay-1 flex items-center gap-2 mb-8 w-fit">
          <span className="relative live-dot w-2 h-2 rounded-full bg-[#1DA8FF] inline-block" />
          <span className="text-xs font-semibold tracking-[0.18em] text-[#1DA8FF] uppercase">
            Ghana's Premier Recruitment Platform
          </span>
        </div>

        {/* Headline */}
        <div className="slide-up delay-2 mb-6">
          <h1 className="hero-word text-[clamp(3.5rem,8vw,7rem)] leading-none tracking-wide text-white">
            Sports
          </h1>
          <h1 className="hero-word text-[clamp(3.5rem,8vw,7rem)] leading-none tracking-wide">
            <span className="text-[#1DA8FF]">Connect</span>
            <span className="text-white"> Recruiting</span>
          </h1>
          <h1 className="hero-word text-[clamp(3.5rem,8vw,7rem)] leading-none tracking-wide text-white">
            Platform
          </h1>
        </div>

        {/* Subtext */}
        <p className="slide-up delay-3 max-w-md text-[#8fa3be] text-base sm:text-lg leading-relaxed mb-10">
          Connecting Ghana's most talented student-athletes with college
          recruiters worldwide. Showcase your skills, build your profile, and
          take the next step in your athletic journey.
        </p>

        {/* CTAs */}
        <div className="slide-up delay-4 flex flex-col sm:flex-row gap-3 mb-14">
          <Link to="/athletesignup">
            <button className="btn-primary flex items-center gap-2 text-white font-semibold px-7 py-3.5 rounded-full text-sm cursor-pointer">
              Create Athlete Profile
              <ArrowRight size={17} />
            </button>
          </Link>
          <Link to="/recruitersignup">
            <button className="btn-secondary flex items-center gap-2 text-white font-semibold px-7 py-3.5 rounded-full text-sm cursor-pointer">
              Join as Recruiter
            </button>
          </Link>
        </div>
      </div>

      {/* Right — Image panel */}
      <div className="hidden lg:flex relative z-20 w-[48%] flex-col">

        {/* Image */}
        <div className="flex-1 relative overflow-hidden">
          <div
            className={`img-panel absolute inset-0 bg-cover bg-center ${fading ? "fading" : ""}`}
            style={{ backgroundImage: `url(${SPORTS_IMAGES[current]})` }}
          />
          {/* gradient blends image into dark left side */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050A14] via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050A14] via-transparent to-transparent" />

          {/* Sport label chip */}
          <div className="absolute bottom-10 left-8 tag-pill px-3 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase">
            {SPORT_LABELS[current]}
          </div>

          {/* Dot indicators */}
          <div className="absolute bottom-10 right-8 flex gap-1.5 items-center">
            {SPORTS_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                  i === current ? "dot-active w-5 bg-[#1DA8FF]" : "w-2 bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile background image (faint, behind content) */}
      <div className="lg:hidden absolute inset-0 z-0">
        <div
          className={`img-panel absolute inset-0 bg-cover bg-center opacity-20 ${fading ? "fading" : ""}`}
          style={{ backgroundImage: `url(${SPORTS_IMAGES[current]})` }}
        />
        <div className="absolute inset-0 bg-[#050A14]/70" />
      </div>
    </section>
  )
}