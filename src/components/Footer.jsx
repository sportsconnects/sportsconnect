import sc8 from "../assets/images/sc8.png"
import sc22 from "../assets/images/sc22.png"
import sc23 from "../assets/images/sc23.png"
import sc24 from "../assets/images/sc24.png"

export default function Footer() {
  return (
    <footer
      className="bg-[#02060F] text-white px-6 sm:px-10 pt-16 pb-8"
      style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;900&family=Bebas+Neue&display=swap');
        .hiw-label { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.1em; }
        .footer-link {
          color: #8fa3be;
          font-size: 0.875rem;
          transition: color 0.2s;
        }
        .footer-link:hover { color: #ffffff; }
        .social-btn {
          width: 36px; height: 36px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          display: flex; align-items: center; justify-content: center;
          transition: border-color 0.2s, background 0.2s;
        }
        .social-btn:hover {
          border-color: rgba(29,168,255,0.5);
          background: rgba(29,168,255,0.1);
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img src={sc8} alt="SportsConnect logo" className="w-10 h-10 object-contain" />
              <span className="hiw-label text-white text-xl leading-none">Sports Connect</span>
            </div>
            <p className="text-[#8fa3be] text-sm leading-relaxed mb-6 max-w-[200px]">
              Ghana's premier student-athlete recruiting platform.
            </p>
            <div className="flex gap-3">
              {[
                { src: sc22, alt: "instagram" },
                { src: sc23, alt: "x / twitter" },
                { src: sc24, alt: "tiktok" },
              ].map((s) => (
                <a key={s.alt} href="#" className="social-btn cursor-pointer">
                 <img src={s.src} alt={s.alt} className="w-4 h-4 object-contain invert brightness-200" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-widest uppercase mb-5">Contact</h3>
            <ul className="space-y-3">
              <li><a href="tel:+233202093760" className="footer-link">+233 20 209 3760</a></li>
              <li><a href="mailto:sportssconnectzz@gmail.com" className="footer-link">sportssconnectzz@gmail.com</a></li>
              <li><a href="#" className="footer-link">Support</a></li>
            </ul>
          </div>

          {/* For Athletes */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-widest uppercase mb-5">For Athletes</h3>
            <ul className="space-y-3">
              <li><a href="#" className="footer-link">Create Profile</a></li>
              <li><a href="#" className="footer-link">Resources</a></li>
              <li><a href="#" className="footer-link">Success Stories</a></li>
            </ul>
          </div>

          {/* For Recruiters */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-widest uppercase mb-5">For Recruiters</h3>
            <ul className="space-y-3">
              <li><a href="#" className="footer-link">Join Platform</a></li>
              <li><a href="#" className="footer-link">Search Athletes</a></li>
              <li><a href="#" className="footer-link">Filter Search</a></li>
            </ul>
          </div>
        </div>

        {/* Divider + bottom */}
        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#8fa3be] text-xs">&copy; 2025 Sports Connect. All Rights Reserved.</p>
          <div className="flex items-center gap-1.5">
            {/* <span className="w-1.5 h-1.5 rounded-full bg-[#1DA8FF]" />
            <span className="text-[#8fa3be] text-xs">Made in Ghana 🇬🇭</span> */}
          </div>
        </div>
      </div>
    </footer>
  )
}