import { ArrowRight } from "lucide-react"
import { Link } from "react-router"

export default function Ready() {
  return (
    <section
      className="relative bg-[#050A14] py-24 px-6 sm:px-10 text-center overflow-hidden"
      style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;900&family=Bebas+Neue&display=swap');
        .hiw-label { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.1em; }
        .btn-blue {
          background: #1DA8FF;
          box-shadow: 0 0 28px rgba(29,168,255,0.35);
          transition: box-shadow 0.3s, transform 0.2s;
        }
        .btn-blue:hover {
          box-shadow: 0 0 44px rgba(29,168,255,0.55);
          transform: translateY(-2px);
        }
        .btn-ghost {
          border: 1px solid rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(8px);
          transition: background 0.2s, transform 0.2s;
        }
        .btn-ghost:hover {
          background: rgba(255,255,255,0.1);
          transform: translateY(-2px);
        }
      `}</style>

      {/* Glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(29,168,255,0.08) 0%, transparent 70%)" }} />

      <div className="relative max-w-2xl mx-auto">
        <p className="text-[#1DA8FF] text-xs font-semibold tracking-[0.2em] uppercase mb-4">
          Join Today
        </p>
        <h2 className="hiw-label text-[clamp(2.5rem,6vw,5rem)] text-white leading-none mb-6">
          Ready to Get Started?
        </h2>
        <p className="text-[#8fa3be] text-base sm:text-lg leading-relaxed mb-10">
          Join Ghana's premier student-athlete recruiting platform and take your athletic career to the next level
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/athletesignup" className="w-full sm:w-auto">
            <button className="btn-blue w-full sm:w-auto flex items-center justify-center gap-2 text-white font-semibold px-8 py-3.5 rounded-full text-sm cursor-pointer">
              Create Athlete Profile
              <ArrowRight size={17} />
            </button>
          </Link>
          <Link to="/recruitersignup" className="w-full sm:w-auto">
            <button className="btn-ghost w-full sm:w-auto text-white font-semibold px-8 py-3.5 rounded-full text-sm cursor-pointer">
              Join as Recruiter
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}