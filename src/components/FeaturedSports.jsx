import sc16 from "../assets/images/sc16.jpg"
import sc17 from "../assets/images/sc17.jpg"
import sc18 from "../assets/images/sc18.jpg"
import sc19 from "../assets/images/sc19.jpg"
import sc20 from "../assets/images/sc20.jpg"
import sc21 from "../assets/images/sc21.jpg"

const sportsData = [
  { image: sc16, alt: "soccer",        name: "Soccer"       },
  { image: sc17, alt: "basketball",    name: "Basketball"   },
  { image: sc18, alt: "track & field", name: "Track & Field"},
  { image: sc19, alt: "volleyball",    name: "Volleyball"   },
  { image: sc20, alt: "tennis",        name: "Tennis"       },
  { image: sc21, alt: "hockey",        name: "Hockey"       },
]

export default function FeaturedSports() {
  return (
    <section
      className="bg-[#050A14] py-20 overflow-hidden"
      style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;900&family=Bebas+Neue&display=swap');

        .hiw-label { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.12em; }

        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 24s linear infinite;
        }
        .marquee-track:hover { animation-play-state: paused; }

        .sport-ring {
          position: relative;
          border-radius: 50%;
          padding: 3px;
          background: linear-gradient(135deg, rgba(29,168,255,0.5), rgba(29,168,255,0.05));
          transition: transform 0.3s;
        }
        .sport-ring:hover { transform: scale(1.08); }
        .sport-ring:hover .sport-glow {
          opacity: 1;
        }
        .sport-glow {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(29,168,255,0.25) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
        }
        .sport-inner {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          background: #0d1929;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 mb-12 flex items-end justify-between">
        <div>
          <p className="text-[#1DA8FF] text-xs font-semibold tracking-[0.2em] uppercase mb-2">
            Disciplines
          </p>
          <h2 className="hiw-label text-[clamp(2.2rem,5vw,4rem)] text-white leading-none">
            Featured Sports
          </h2>
        </div>
        <p className="hidden sm:block text-[#8fa3be] text-sm max-w-xs text-right">
          Ghana's athletes are ready to be discovered.
        </p>
      </div>

      {/* Marquee */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #050A14, transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #050A14, transparent)" }} />

        <div className="marquee-track gap-8 px-8">
          {[...sportsData, ...sportsData].map((sport, i) => (
            <div key={i} className="flex flex-col items-center flex-shrink-0 mx-5">
              <div className="sport-ring w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36">
                <div className="sport-glow" />
                <div className="sport-inner">
                  <img
                    src={sport.image}
                    alt={sport.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <span className="mt-3 text-sm font-semibold text-white tracking-wide">
                {sport.name}
              </span>
              <span className="w-4 h-0.5 bg-[#1DA8FF] rounded mt-1.5 opacity-60" />
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}