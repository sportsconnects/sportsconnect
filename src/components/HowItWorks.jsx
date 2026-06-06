import sc14 from "../assets/images/sc14.jpg"
import sc15 from "../assets/images/sc15.png"

const athleteSteps = [
  {
    number: "01",
    title: "Create Your Profile",
    desc: "Build a comprehensive profile with your stats, achievements, and highlight videos",
  },
  {
    number: "02",
    title: "Get Discovered",
    desc: "College recruiters search and find your profile based on your sport and skills",
  },
  {
    number: "03",
    title: "Connect & Recruit",
    desc: "Receive direct contact from interested recruiters and explore opportunities",
  },
  {
    number: "04",
    title: "Secure Your Future",
    desc: "Join teams and take the next step in your athletic and academic journey",
  },
]

const recruiterSteps = [
  {
    title: "Search & Filter",
    desc: "Use advanced filters to find athletes by sport, position, region, and more",
  },
  {
    title: "Review Profiles",
    desc: "Access detailed athlete profiles with stats, videos, and academic information",
  },
  {
    title: "Make Contact",
    desc: "Reach out directly via email or WhatsApp to start the recruitment process",
  },
  {
    title: "Track & Manage",
    desc: "Save favorite athletes, track conversations, and organize prospects all in one place",
  },
]

export default function HowItWorks() {
  return (
    <section
      className="bg-[#050A14] text-white py-20 px-6 sm:px-10 overflow-hidden"
      style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;900&family=Bebas+Neue&display=swap');
        .hiw-label { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.12em; }
        .step-card {
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03);
          transition: border-color 0.25s, background 0.25s;
        }
        .step-card:hover {
          border-color: rgba(29,168,255,0.35);
          background: rgba(29,168,255,0.05);
        }
        .accent-line {
          width: 40px; height: 2px;
          background: #1DA8FF;
          border-radius: 2px;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="mb-16 text-center">
          <p className="text-[#1DA8FF] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            The Process
          </p>
          <h2 className="hiw-label text-[clamp(2.5rem,6vw,4.5rem)] text-white leading-none">
            How It Works
          </h2>
        </div>

        {/* ── FOR ATHLETES ── */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-10">
            <span className="hiw-label text-[#1DA8FF] text-2xl">For Student Athletes</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

            {/* Steps left */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {athleteSteps.map((s) => (
                <div key={s.number} className="step-card rounded-xl p-5">
                  <span className="hiw-label text-[#1DA8FF] text-3xl leading-none">{s.number}</span>
                  <h3 className="font-bold text-white text-base mt-2 mb-1">{s.title}</h3>
                  <p className="text-[#8fa3be] text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            {/* Center image */}
            <div className="lg:col-span-2 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-3 rounded-2xl bg-[#1DA8FF]/10 blur-xl" />
                <img
                  src={sc14}
                  alt="student athlete in action"
                  className="relative w-full max-w-[180px] lg:max-w-full h-72 object-cover rounded-2xl"
                  style={{ border: "1px solid rgba(29,168,255,0.2)" }}
                />
              </div>
            </div>

            {/* Decorative right — accent block */}
            <div className="lg:col-span-5 flex flex-col justify-center gap-6 pl-0 lg:pl-6">
              <div className="accent-line" />
              <p className="text-[#8fa3be] text-base leading-relaxed max-w-sm">
                Ghana's most talented student-athletes are getting discovered every day.
                Your profile is your passport to opportunities worldwide.
              </p>
            </div>

          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/8 mb-20" />

        {/* ── FOR RECRUITERS ── */}
        <div>
          <div className="flex items-center gap-4 mb-10">
            <span className="hiw-label text-[#F59E0B] text-2xl">For Recruiters</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

            {/* Image */}
            <div className="relative">
              <div className="absolute -inset-3 rounded-2xl bg-[#F59E0B]/8 blur-xl" />
              <img
                src={sc15}
                alt="recruiter scouting"
                className="relative w-full h-72 sm:h-96 object-cover rounded-2xl"
                style={{ border: "1px solid rgba(245,158,11,0.2)" }}
              />
            </div>

            {/* Steps grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recruiterSteps.map((s, i) => (
                <div key={i} className="step-card rounded-xl p-5"
                  style={{ "--hover-accent": "#F59E0B" }}
                >
                  <div className="w-8 h-0.5 bg-[#F59E0B] rounded mb-3" />
                  <h3 className="font-bold text-white text-base mb-1">{s.title}</h3>
                  <p className="text-[#8fa3be] text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}